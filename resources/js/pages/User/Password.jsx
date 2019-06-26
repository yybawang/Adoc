import React, {useEffect, useRef, useState} from 'react'
import {Button, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'
import {Tips} from "../../configs/function";

export default function Password(props){
    const [passwordOld, setPasswordOld] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const focus = useRef(null);
    
    useEffect(() => {
        focus.current.focus();
    }, []);
    
    async function submit(){
        await axios.patch('/password', {password_old: passwordOld, password: password, password_confirmation: passwordConfirmation})
        Tips('密码修改完成，请重新登录');
        props.history.replace('/login');
    }
    
    return (
        <div className={'mt-3 register'}>
            <Form onSubmit={(event) => {event.preventDefault()}}>
                <Card>
                    <Card.Header><h5>修改登录密码</h5></Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label>原密码</Form.Label>
                            <Form.Control ref={focus} value={passwordOld} type={'password'} required onChange={(event) => setPasswordOld(event.target.value)} placeholder={'原密码'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>新密码</Form.Label>
                            <Form.Control value={password} type={'password'} required onChange={(event) => setPassword(event.target.value)} placeholder={'新密码'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>确认新密码</Form.Label>
                            <Form.Control value={passwordConfirmation} type={'password'} required onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder={'确认新密码'} />
                        </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant={'primary'} type={'submit'} onClick={() => submit()}>修改</Button>
                        <Button variant={'link'} onClick={() => props.history.goBack()}>返回</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </div>
    );
}
