import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Alert, Button, Card, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import axios from '../../configs/axios'
import {Tips} from "../../configs/function";
import {useObject} from "react-hooks-easy";

export default function ProjectPostComment(props){
    const user = useObject('user');
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        props.post_id && init();
    }, [props.post_id, page]);

    async function init(){
        let res = await axios.get('/post/'+props.post_id+'/comments', {params: {page}});
        setList(list.concat(res.data));
        setHasMore(res.data.length === res.per_page);
        if(page > 1 && res.data.length <= 0){
            Tips('没有更多数据');
        }
    }

    async function del(id, index){
        await axios.delete('/comment/'+id);
        let list2 = Array.from(list);
        list2.splice(index, 1);
        setList(list2);
        return false;
    }

    async function submit(){
        setLoading(true);
        try {
            let res = await axios.post('/comment/'+props.post_id, {pid:0, content});
            setContent('');
            Tips('评论成功', 'success');
            let list2 = Array.from(list);
            list2.unshift(res);
            setList(list2);
        }catch (e) {

        }

        setLoading(false);
    }

    return (
        <div className={'post-comment pt-3 pb-5'}>
            <Card className={'border-bottom-0'}>
                <Card.Body>
                    <h4 className={'pb-3 pt-1 title'}>最新评论（{list.length}）</h4>
                    {list.map((val, index) =>
                        <div key={val.id} className={'comment-list py-2'}>
                            <div className={'list-head'}>
                                <OverlayTrigger
                                    delay={500}
                                    placement={'right'}
                                    overlay={
                                        <Tooltip id={'comment-user-email'}>
                                            {val.user.email}
                                        </Tooltip>
                                    }
                                >
                                    <strong>{val.user.name}</strong>
                                </OverlayTrigger>
                                <small className={'ml-2 text-muted'}>{val.created_at}</small>
                                {user.value.id === val.user_id && new Date().getTime() - new Date(val.created_at).getTime() < 86400000 * 3 &&
                                <small className={'ml-2 text-muted'}>
                                    <Link to={'#'} onClick={() => del(val.id, index)}>删除</Link>
                                </small>
                                }
                            </div>
                            <div className={'list-body py-2'}>
                                <div className={'pl-3'} dangerouslySetInnerHTML={{__html: val.content.replace(/\n/g, '<br />')}} />
                            </div>
                            <div className={'list-foot' + (index < list.length-1 ? ' border-top' : '')} />
                        </div>
                    )}
                    {hasMore && <div className={'py-2'}>
                        <Button className={'w-100'} variant={'secondary'} onClick={()=> setPage(page+1)}>加载更多</Button>
                    </div>}
                </Card.Body>
            </Card>
            <div className={'comment-textarea'}>
                <Card>
                    <Card.Body className={'p-0'}>
                        <Form.Control
                            className={'border-0'}
                            as={'textarea'}
                            rows={5}
                            disabled={!user.value.id}
                            placeholder={!user.value.id ? '请先登录，登录后才可进行评论' : '请勿发布不友善或者负能量的内容。与人为善，比聪明更重要！'}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={() => submit()} disabled={!user.value.id || loading}>提交评论</Button>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    )
}
