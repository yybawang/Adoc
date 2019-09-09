import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useNumber} from "react-hooks-easy";
import axios from "../../configs/axios";
import {Button, ButtonGroup, Card, Form, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import CodeDiff from "./CodeDiff";
import {Tips} from "../../configs/function";

export default function PostHistory(props){
    const postMenuActive = useNumber('postMenuActive');
    const [post, setPost] = useState({});
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('');
    
    useEffect(() => {
        postMenuActive.set(props.match.params.post_id);
        getPost();
        init();
    }, []);
    
    async function getPost(){
        let res = await axios.get('/post/'+props.match.params.post_id);
        setPost(res);
    }
    
    async function init(){
        let res2 = await axios.get('/post/'+props.match.params.post_id+'/history');
        setList(res2);
    }
    
    function view(item){
        setContent(item.content);
        setShow(true);
    }
    
    async function del(id){
        await axios.delete('/post/'+id+'/history');
        Tips('删除完成', 'success');
        init();
    }
    
    return (
        <div style={{width: 800}} className={'mt-5 mx-auto'}>
            <Card>
                <Card.Header>
                    <Link to={'/project/'+props.match.params.id+'/post/'+props.match.params.post_id}>&lt;{post.name}</Link> 的修改历史
                </Card.Header>
                <Card.Body>
                    {list.length > 0
                        ?
                        <ul style={{listStyle:'decimal'}}>
                            {list.map((his, index) => (
                                <li key={his.id} className={'pl-3 pr-5 py-1 my-2 position-relative border-bottom'}>
                                    {his.user.name+' 修改于 '+his.created_at}
                                    <div className={'position-absolute'} style={{right:0, top:0}}>
                                        <Button className={'p-0 mr-2'} size={'sm'} variant={'link'} onClick={() => view(his)}>对比</Button>
                                        <OverlayTrigger trigger="focus" placement="left" overlay={
                                            <Popover id="popover-basic">
                                                <Popover.Title className={'py-2'}>确认删除？</Popover.Title>
                                                <Popover.Content className={'mt-2'}>
                                                    <p>删除文档<strong>「{post.name}」</strong>的历史</p>
                                                    <Button variant={'danger'} size={'sm'} onMouseDown={() => del(his.id)}>删除</Button>
                                                </Popover.Content>
                                            </Popover>
                                        }>
                                            <Button className={'p-0 text-danger'} size={'sm'} variant={'link'}>删除</Button>
                                        </OverlayTrigger>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        :
                        <p className={'text-muted'}>未发现历史记录</p>
                    }
                </Card.Body>
            </Card>
        
        
            <Modal show={show} scrollable={true} onHide={() => setShow(false)} dialogClassName="history-diff-modal" className={'modal-dialog-scrollable'} size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>历史记录(左)与当前(右)对比</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CodeDiff oldStr={content} newStr={post.content}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        关闭
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
