import React, {useEffect, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import axios from "../../configs/axios";
import {Tips} from "../../configs/function";
import {useBoolean} from "react-hooks-easy";

export default function PostSavedTemplate(props){
    const templateShow = useBoolean('postSavedTemplate');
    const [checked, setChecked] = useState(-1);
    const [list, setList] = useState([]);
    
    useEffect(() => {
        if(templateShow.value){
            init();
        }
    }, [templateShow.value]);
    
    async function init(){
        let res = await axios.get('/project/'+props.project_id+'/template');
        setList(res);
    }
    
    async function del(id){
        await axios.delete('/project/'+id+'/template')
        Tips('已删除模版', 'success');
    }
    
    return (
        <Modal show={templateShow.value} autoFocus={false} enforceFocus={false} animation={true} scrollable={true} onHide={() => templateShow.set(false)} className={'modal-dialog-scrollable'}>
            <Modal.Header closeButton>
                <Modal.Title>选择一个模版</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {list.length > 0
                    ?
                    <ul style={{listStyle:'decimal'}}>
                        {list.map((template, index) => (
                            <li key={template.id} className={'pl-3 pr-5 my-2 position-relative'}>
                                <Form.Check type={'radio'} id={'template_project'+template.id} label={template.name+' ['+template.created_at+'] '} name={'template_project'} value={index} checked={checked === index} onChange={(event) => {
                                    setChecked(Number(event.target.value));
                                }} />
                                <Button className={'p-0 position-absolute'} style={{right:0, top:0}} size={'sm'} variant={'link'} onClick={() => del(template.id)}>删除</Button>
                            </li>
                        ))}
                    </ul>
                    :
                    <p className={'text-muted'}>还未保存任何模版</p>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => templateShow.set(false)}>
                    关闭
                </Button>
                <Button variant="primary" onClick={() => {
                    if(!list[checked]){
                        return;
                    }
                    let template = list[checked].content;
                    props.onSubmit(template);
                    templateShow.set(false);
                }}>
                    插入此模版
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
