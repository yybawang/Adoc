import React, {useEffect, useState} from 'react'
import {Button, ButtonGroup, Col, Container, Dropdown, Modal, DropdownButton, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from '../../configs/axios'
import Editor from 'react-editor-md'
import {useBoolean, useNumber, useObject} from "react-hooks-easy";
import history from "../../configs/history";
import PostHistory from "../Post/PostHistory";
import {Tips} from "../../configs/function";

export default function ProjectPost(props){
    const user = useObject('user');
    const postMenuActive = useNumber('postMenuActive');
    const refreshProjectMenu = useBoolean('refreshProjectMenu');
    const project = useObject('project');
    const [confirm, setConfirm] = useState(false);
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState({attachments:[]});
    const [config, setConfig] = useState({
        width: '100%',
        path: '/editor.md/lib/',
        imageUploadURL: '/api/upload_md',
        markdown: '',
    });
    
    useEffect(() => {
        postMenuActive.set(props.match.params.post_id);
        init();
    }, [props.match.params.post_id]);
    
    async function init(){
        setOpen(false);
        let res = await axios.get('/post/'+props.match.params.post_id);
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
    
    return (
        <Container fluid className={'p-0'}>
            <Row className={'border-bottom px-5'} style={{paddingTop: '0.77rem', paddingBottom: '0.77rem'}} noGutters>
                <Col xs={10}>
                    <h4>{post.name} {post.attachments.length > 0 && '📎'}</h4>
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
            <div className={'py-3 px-5 post-center'}>
                {open &&
                <Editor.EditorShow config={config}/>
                }
                
                {post.attachments.length > 0 && <div className={'mt-3 py-3 border-top'}>
                    <h5>📎 文档包含附件，点击预览/下载</h5>
                    <ul>
                        {post.attachments.map((attachment) => (
                            <li key={attachment.id}><a href={attachment.path} target={"_black"}>{attachment.path.split('/').pop()}</a></li>
                        ))}
                    </ul>
                </div>}
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
