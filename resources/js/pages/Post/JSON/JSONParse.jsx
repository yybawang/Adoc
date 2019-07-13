import React, {useEffect, useRef, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import {useBoolean} from "react-hooks-easy";
import {FormatMDTable, Tips} from "../../../configs/function";

export default function JSONParse(props){
    const JsonParse = useBoolean('JsonParse');
    const [json, setJson] = useState('');
    const focus = useRef(null);
    
    async function submit(){
        let jsonObj = '';
        try {
            jsonObj = (new Function("return " + json))();
            if(!jsonObj){
                throw new Error('');
            }
            setJson(JSON.stringify(jsonObj, null, 2));
        }catch (e) {
            Tips('JSON 未正常解析', 'error');
        }
    }
    
    return (
        <Form>
            <Modal show={JsonParse.value} autoFocus={false} size={"lg"} enforceFocus={false} animation={true} scrollable={true} onHide={() => JsonParse.set(false)} className={'modal-dialog-scrollable'} onEntered={() => {focus.current.focus()}}>
                <Modal.Header closeButton>
                    <Modal.Title>JSON 美化工具</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control ref={focus} as={'textarea'} style={{height:500}} value={json} onChange={(e) => setJson(e.target.value)} placeholder={'粘贴一段json字符串美化为缩进形式'} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => JsonParse.set(false)}>
                        Close
                    </Button>
                    <Button type={'submit'} onClick={() => {
                        submit();
                    }}>
                        JSON 美化
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
}
