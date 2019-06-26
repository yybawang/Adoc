import React, {useEffect, useRef, useState} from 'react'
import {Button, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'
import {useObject} from "react-hooks-easy";

export default function Register(props){
    const focus = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const user = useObject('user');
    
    useEffect(() => {
        focus.current.focus();
    }, []);
    
    async function submit(){
        let res = await axios.post('/register', {name, email, password, password_confirmation: passwordConfirmation});
        user.reInitial(res);
        localStorage.setItem('api_token', res.api_token);
        let jump = localStorage.getItem('auth_jump');
        if(!jump || jump === '/login' || jump === '/register'){
            jump = '/projects';
        }
        props.history.replace(jump);
    }
    
    return (
        <div className={'mt-3 register'}>
            <Form onSubmit={(event) => {event.preventDefault()}}>
                <Card>
                    <Card.Header><h5>注册</h5></Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label column={true}>用户名</Form.Label>
                            <Form.Control ref={focus} value={name} type={'text'} required onChange={(event) =>setName(event.target.value)} placeholder={'姓名'} />
                            <Form.Text className="text-muted">
                                仅作标识展示用
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label column={true}>邮箱</Form.Label>
                            <Form.Control value={email} type={'email'} required onChange={(event) => setEmail(event.target.value)} placeholder={'邮箱'} />
                            <Form.Text className="text-muted">
                                此邮箱为登录唯一标识
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label column={true}>登录密码</Form.Label>
                            <Form.Control value={password} type={'password'} required onChange={(event) => setPassword(event.target.value)} placeholder={'登录密码'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label column={true}>确认密码</Form.Label>
                            <Form.Control value={passwordConfirmation} type={'password'} required onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder={'确认密码'} />
                        </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant={'primary'} type={'submit'} onClick={() => submit()}>注册</Button>
                        <Button variant={'link'} onClick={() => props.history.push('/login')}>已有账号，去登录</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </div>
    );
}
