import React, {useEffect, useState} from 'react'
import {Button, Col, Container, Dropdown, Modal, DropdownButton, Row, OverlayTrigger, Popover} from "react-bootstrap";
import axios from '../../configs/axios'
import Editor from 'react-editor-md'
import {useBoolean, useNumber, useObject} from "react-hooks-easy";
import AddSvg from '../../../images/addEmoji.svg';
import EmojiSvg from '../../../images/emoji.svg';
import history from "../../configs/history";
import {Tips} from "../../configs/function";
import ProjectPostComment from "./ProjectPostComment";

export default function ProjectPost(props){
    const user = useObject('user');
    const postMenuActive = useNumber('postMenuActive');
    const refreshProjectMenu = useBoolean('refreshProjectMenu');
    const project = useObject('project');
    const [confirm, setConfirm] = useState(false);
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState({attachments:[]});
    const postLikeTipsDefault = '选择你的反应';
    const [postLikeTips, setPostLikeTips] = useState(postLikeTipsDefault);
    const [emoji, setEmoji] = useState('');
    const [apiMs, setApiMs] = useState(0.00);
    const [config, setConfig] = useState({
        width: '100%',
        path: '/editor.md/lib/',
        imageUploadURL: '/api/upload_md',
        markdown: '',
    });
    const postLikeEmojis = [
        [
            {code: 1, emoji:'👍', tips: '赞一个'},
            {code: 2, emoji:'🙏', tips: '感谢'},
            {code: 3, emoji:'😄', tips: '开心'},
            {code: 4, emoji:'🎉', tips: '值得庆祝'},
        ],
        [
            {code: 5, emoji:'😕', tips: '不太明白'},
            {code: 6, emoji:'❤️', tips: '你是个好人'},
            {code: 7, emoji:'🚀', tips: '动作神速'},
            {code: 8, emoji: '👀', tips: '观察等待中'},
        ],
    ];
    
    useEffect(() => {
        postMenuActive.set(props.match.params.post_id);
        init();
    }, [props.match.params.post_id]);
    
    async function init(){
        setOpen(false);
        let time = new Date().getTime();
        let res = await axios.get('/post/'+props.match.params.post_id);
        let time2 = new Date().getTime();
        setApiMs(((time2 - time) / 1000).toFixed(2));
        setPost(res);
        setConfig(Object.assign({}, config, {markdown: res.content}));
        setOpen(true);
    }
    
    async function exports(){
        let res = await axios.post('/post/'+props.match.params.post_id+'/export');
        location.href = res.fileurl;
    }
    
    async function del(){
        await axios.delete('/post/'+props.match.params.post_id);
        refreshProjectMenu.set(true);
        Tips('删除完成', 'success');
        props.history.replace('/project/'+props.match.params.id);
    }
    
    async function like(code, emoji){
        let res = await axios.post('/like/'+post.id, {code, emoji});
        let post2 = Object.assign({}, post, {likes_group: res.likes_group});
        setPost(post2);
    }
    
    return (
        <Container fluid className={'p-0'}>
            <Row className={'border-bottom pl-5 pr-3'} style={{paddingTop: '0.77rem', paddingBottom: '0.77rem'}} noGutters>
                <Col xs={10}>
                    <h4>{post.name} {post.attachments.length > 0 && <small title={'此文档包含可下载附件'}>📎</small>}</h4>
                </Col>
                <Col xs={2} className={'text-right'}>
                    {user.value.id > 0 && (
                        <div>
                            <DropdownButton variant={'link'} id={'manager-post'} title={'操作'}>
                                {project.value.write && <Dropdown.Item onClick={() => history.push('/post/'+props.match.params.id+'/edit/'+props.match.params.post_id)}>编辑</Dropdown.Item>}
                                {project.value.write && <Dropdown.Item onClick={() => history.push('/post/'+props.match.params.id+'/edit/0?from='+props.match.params.post_id)}>复制</Dropdown.Item>}
                                <Dropdown.Item onClick={() => history.push('/project/'+props.match.params.id+'/history/'+props.match.params.post_id)}>历史</Dropdown.Item>
                                <Dropdown.Item onClick={() => exports()}>导出</Dropdown.Item>
                                {project.value.write && <Dropdown.Divider />}
                                {project.value.write && <Dropdown.Item onClick={() => setConfirm(true)}>删除</Dropdown.Item>}
                                    
                                    {/*<Dropdown.Item onClick={() => {}}>分享</Dropdown.Item>*/}
                            </DropdownButton>
                            
                        </div>
                    )}
                </Col>
            </Row>
            <div>
                {open &&
                <div className={'pt-2'}>
                    <div className={'px-5 post-center'}>
                        <Editor.EditorShow config={config}/>
                    </div>
                    {post.attachments.length > 0 &&
                    <div>
                        <div className={'py-3 px-5 post-center'}>
                            <h5>📎 文档包含附件，点击预览/下载</h5>
                            <ul>
                                {post.attachments.map((attachment) => (
                                    <li key={attachment.id}><a href={attachment.path} target={"_black"} title={'点击预览/下载'}>{attachment.path.split('/').pop()}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    }
                    <div className={'px-5 py-3 text-muted'}>
                        👣<span className={'ml-1'}>最新修改于 {post.updated_at}</span>
                    </div>
                    <div className={'pr-3 border-top d-flex align-items-center justify-content-between'}>
                        <div className={'flex-grow-1 overflow-hidden'}>
                            <div className={'d-flex align-items-center'}>
                                {post.likes_group && post.likes_group.map(val =>
                                    <div key={val.id} className={'py-2 px-3 border-right'}>
                                        <h4 className={'pr-1 mb-0 d-inline-block'}>{val.emoji}</h4>
                                        <sup style={{fontSize: '13px'}}>{val.count}</sup>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <OverlayTrigger
                                trigger="focus"
                                placement="left"
                                overlay={
                                    <Popover id={'post-like'} title={postLikeTips}>
                                        {postLikeEmojis.map((emojis, index) =>
                                            <div key={index} className={'d-flex'}>
                                                {emojis.map(val =>
                                                    <h4 key={val.emoji} className={'px-2 like-emoji'}
                                                        onMouseOver={() => setPostLikeTips(val.tips)}
                                                        onMouseLeave={() => setPostLikeTips(postLikeTipsDefault)}
                                                        onMouseDown={() => {
                                                            setEmoji(val.emoji);
                                                            setTimeout(() => setEmoji(''), 800);
                                                            like(val.code, val.emoji)}}
                                                    >
                                                        {val.emoji}
                                                    </h4>
                                                )}
                                            </div>
                                        )}
                                    </Popover>
                                }
                            >
                                <div className={'position-relative'} style={{margin: '3px 0'}}>
                                    <Button variant={"light"} className={'bg-white'}><img src={AddSvg} width={'12px'} /><img src={EmojiSvg} width={'18px'} /></Button>
                                    <h4 className={'position-absolute' + (emoji ? ' like-animate' : '')}>{emoji}</h4>
                                </div>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
                }
                <div className={'hr-gray'} />
                <div className={'post-recommend px-5'}>
                    <ProjectPostComment post_id={post.id} />
                </div>
                <div className={'post-footer px-5 py-3 bg-dark text-light'}>
                    <div className={'d-flex justify-content-around py-3'}>
                        <div>
                            <h4 className={'mb-3'}>统计报告</h4>
                            <p className={'text-muted'}>字符数：{post.content && post.content.length}</p>
                            <p className={'text-muted'}>浏览量：{post.views}</p>
                            <p className={'text-muted'}>附件数：{post.attachments && post.attachments.length}</p>
                            <p className={'text-muted'}>历史记录：{post.histories_count}</p>
                        </div>
                        <div>
                            <h4 className={'mb-3'}>　</h4>
                            <p className={'text-muted'}>接口耗时: {apiMs}ms</p>
                            <p><a className={'text-muted'} target={'_blank'} href={'https://github.com/yybawang/Adoc'}>github 开源项目</a></p>
                            <p>🍻🍻</p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={confirm} onHide={() => setConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>删除文档「{post.name}」</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>确认删除？此操作不可恢复</h5>
                    <div className={'text-muted'}>被删除数据包括：基本信息、历史记录、事件记录、附件等</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirm(false)}>
                        取消
                    </Button>
                    <Button variant="danger" onClick={() => del()}>
                        确认删除
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
