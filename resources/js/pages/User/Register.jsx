import React from 'react'
import {Button, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        };
    }
    
    submit(){
        if(!this.state.name || !this.state.email || !this.state.password || !this.state.password_confirmation){
            return;
        }
        axios.post('/register', {name: this.state.name, email: this.state.email, password: this.state.password, password_confirmation: this.state.password_confirmation}).then((user) => {
            localStorage.setItem('user_id', user.id);
            localStorage.setItem('api_token', user.api_token);
            let jump_url = localStorage.getItem('auth_jump') || '/project';
            localStorage.removeItem('auth_jump');
            // 返回之前的页面
            this.props.history.replace(jump_url);
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div className={'mt-3 register'}>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Card>
                        <Card.Header><h5>注册</h5></Card.Header>
                        <Card.Body>
                                <Form.Group>
                                    <Form.Label>用户名</Form.Label>
                                    <Form.Control ref={'name'} value={this.state.name} type={'text'} required onChange={(event) => this.setState({name: event.target.value})} placeholder={'Username'} />
                                    <Form.Text className="text-muted">
                                        仅作标识展示用
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>邮箱</Form.Label>
                                    <Form.Control value={this.state.email} type={'email'} required onChange={(event) => this.setState({email: event.target.value})} placeholder={'Email'} />
                                    <Form.Text className="text-muted">
                                        此邮箱为登录唯一标识
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>登录密码</Form.Label>
                                    <Form.Control value={this.state.password} type={'password'} required onChange={(event) => this.setState({password: event.target.value})} placeholder={'Password'} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>确认密码</Form.Label>
                                    <Form.Control value={this.state.password_confirmation} type={'password'} required onChange={(event) => this.setState({password_confirmation: event.target.value})} placeholder={'Password confirmation'} />
                                </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant={'primary'} type={'submit'} onClick={() => this.submit()}>注册</Button>
                            <Button variant={'link'} onClick={() => this.props.history.push('/login')}>已有账号，去登录</Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </div>
        )
    }
    
    componentDidMount() {
        this.refs.name.focus();
    }
}

export default Register
