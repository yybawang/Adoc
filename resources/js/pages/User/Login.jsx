import React, {useEffect, useRef, useState} from 'react'
import {Button, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'
import {useObject} from "react-hooks-easy";

export default function Login(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const focus = useRef(null);
    const user = useObject('user');
    
    useEffect(() => {
        localStorage.removeItem('api_token');
        user.reset();
        focus.current.focus();
    }, []);
    
    async function submit(){
        let res = await axios.post('/login', {email, password});
        user.reInitial(res);
        localStorage.setItem('api_token', res.api_token);
        let jump = localStorage.getItem('auth_jump');
        if(!jump || jump === '/login' || jump === '/register'){
            jump = '/projects';
        }
        props.history.replace(jump);
    }
    
    return (
        <div className={'mt-3 login'}>
            <Form onSubmit={(event) => {event.preventDefault()}}>
                <Card>
                    <Card.Header><h5>登录</h5></Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label column={true}>邮箱</Form.Label>
                            <Form.Control ref={focus} value={email} type={'email'} required onChange={(event) => setEmail(event.target.value)} placeholder={'Email'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label column={true}>密码</Form.Label>
                            <Form.Control value={password} type={'password'} required onChange={(event) => setPassword(event.target.value)} placeholder={'Password'} />
                        </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant={'primary'} type={'submit'} onClick={() => submit()}>登录</Button>
                        <Button variant={'link'} onClick={() => props.history.push('/register')}>没有账号？注册一个</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </div>
    )
}
