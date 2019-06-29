import React, {useEffect, useState} from 'react'
import {useBoolean} from "react-hooks-easy";
import axios from "../../configs/axios";
import {Button, Form, Modal} from "react-bootstrap";
import CodeDiff from "../../configs/code_diff";
import {Tips} from "../../configs/function";

export default function PostHistory(props){
    const postHistoryShow = useBoolean('postHistoryShow');
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('');
    
    useEffect(() => {
        if(postHistoryShow.value){
            init();
        }
    }, [postHistoryShow.value]);
    
    async function init(){
        
        let res = await axios.get('/post/'+props.post_id+'/history');
        setList(res);
    }
    
    function view(item){
        setContent(item.content);
        setShow(true);
    }
    
    async function del(id){
        await axios.delete('/post/'+id+'/history');
        Tips('删除完成', 'success');
    }
    
    return (
        <div>
            <Modal show={postHistoryShow.value} size={'md'} scrollable={true} onHide={() => postHistoryShow.set(false)} className={'modal-dialog-scrollable'}>
                <Modal.Header closeButton>
                    <Modal.Title>「{props.name}」的保存历史</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {list.length > 0
                        ?
                        <ul style={{listStyle:'decimal'}}>
                            {list.map((history, index) => (
                                <li key={history.id} className={'pl-3 pr-5 py-1 my-2 position-relative border-bottom'}>
                                    {history.user.name+' 修改于 '+history.created_at}
                                    <div className={'position-absolute'} style={{right:0, top:0}}>
                                        <Button className={'p-0 mr-2'} size={'sm'} variant={'link'} onClick={() => view(history)}>对比</Button>
                                        <Button className={'p-0 text-danger'} size={'sm'} variant={'link'} onClick={() => del(history.id)}>删除</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        :
                        <p className={'text-muted'}>未发现历史记录</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => postHistoryShow.set(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        
        
            <Modal show={show} scrollable={true} onHide={() => setShow(false)} className={'modal-dialog-scrollable'} size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>历史记录(左)与当前(右)对比</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CodeDiff oldStr={content} newStr={props.content}/>
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
