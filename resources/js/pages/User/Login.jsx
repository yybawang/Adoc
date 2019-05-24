import React from 'react'
import {Button, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'
import {User} from "../Layout/store";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }
    
    submit(){
        if(!this.state.email || !this.state.password){
            return;
        }
        axios.post('/login', {email: this.state.email, password: this.state.password}).then((user) => {
            localStorage.setItem('user_id', user.id);
            localStorage.setItem('api_token', user.api_token);
            User.dispatch({type: 'login'});
            let jump_url = localStorage.getItem('auth_jump') || '/project';
            localStorage.removeItem('auth_jump');
            // 返回之前的页面
            this.props.history.replace(jump_url);
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div className={'mt-3 login'}>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Card>
                        <Card.Header><h5>登录</h5></Card.Header>
                        <Card.Body>
                                <Form.Group>
                                    <Form.Label>邮箱</Form.Label>
                                    <Form.Control ref={'email'} value={this.state.email} type={'email'} required onChange={(event) => this.setState({email: event.target.value})} placeholder={'Email'} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>登录密码</Form.Label>
                                    <Form.Control value={this.state.password} type={'password'} required onChange={(event) => this.setState({password: event.target.value})} placeholder={'Password'} />
                                </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant={'primary'} type={'submit'} onClick={() => this.submit()}>登录</Button>
                            <Button variant={'link'} onClick={() => this.props.history.push('/register')}>没有账号？注册一个</Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </div>
        )
    }
    
    componentDidMount() {
        this.refs.email.focus();
    }
}

export default Login
