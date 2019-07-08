import React, {useEffect, useRef, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import axios from "../../configs/axios";
import {Tips} from "../../configs/function";
import {useBoolean} from "react-hooks-easy";

export default function PostAddTemplate(props){
    const postAddTemplate = useBoolean('postAddTemplate');
    const [name, setName] = useState('');
    const [global, setGlobal] = useState(1);
    const focus = useRef(null);
    
    async function submit(){
        let content = props.getContent();
        await axios.post('/project/'+props.project_id+'/template', {name, content, global});
        Tips('已添加模版', 'success');
    }
    
    return (
        <Form>
            <Modal show={postAddTemplate.value} autoFocus={false} enforceFocus={false} animation={true} scrollable={true} onHide={() => postAddTemplate.set(false)} className={'modal-dialog-scrollable'} onEntered={() => {focus.current.focus()}}>
                <Modal.Header closeButton>
                    <Modal.Title>起个模版名</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control ref={focus} value={name} onChange={(e) => setName(e.target.value)} placeholder={'输入模版名'} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check as={'radio'} name={'global'} checked={global === 1} onChange={(e) => setGlobal(1)} custom inline id={'pub0'} label={'全局共享模版'} />
                        <Form.Check as={'radio'} name={'global'} checked={global === 0} onChange={(e) => setGlobal(0)} custom inline id={'pub1'} label={'此项目模版'} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => postAddTemplate.set(false)}>
                        Close
                    </Button>
                    <Button type={'submit'} onClick={() => {
                        submit();
                        setName('');
                        postAddTemplate.set(false);
                    }}>
                        保存模版
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
}
