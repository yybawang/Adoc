import React from 'react'
import {LoginModal, User} from './store';
import {Card, Button, Form} from 'react-bootstrap'
import {Link} from "react-router-dom";
import axios from '../../configs/axios'
import history from '../../configs/history'

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show : false,
            form: {
                name: '',
                email: '',
                password: '',
            }
        };
        LoginModal.subscribe(() => {
            this.setState({show: LoginModal.getState()});
        });
    }
    
    register(){
        let t = this;
        if(!t.state.form.name || !t.state.form.email || !t.state.form.password){
            return;
        }
        axios.post('/register', t.state.form).then((data) => {
            localStorage.setItem('api_token', data.api_token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('name', data.name);
            localStorage.setItem('user_id', data.id);
            LoginModal.dispatch({type: 'hide'});
            User.dispatch({type: 'show'});
        }).catch(()=>{});
    }
    
    render() {
        return (
            <Card style={{maxWidth: '750px', margin: '0 auto'}} className={'mt-5'}>
                <Card.Header>
                    <Card.Title>用户注册</Card.Title>
                </Card.Header>
                {/*Form 放外面，可以使用回车提交*/}
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label>用户名（仅作展示）</Form.Label>
                            <Form.Control ref={'name_input'} required value={this.state.form.name} onChange={(event) => {
                                let form = Object.assign({}, this.state.form, {name: event.target.value});
                                this.setState({form});
                            }} placeholder={'Name'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>邮箱（登陆账号）</Form.Label>
                            <Form.Control type={'email'} required value={this.state.form.email} onChange={(event) => {
                                let form = Object.assign({}, this.state.form, {email: event.target.value});
                                this.setState({form});
                            }} placeholder={'Email'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>密码</Form.Label>
                            <Form.Control type={'password'} required value={this.state.form.password} onChange={(event) => {
                                let form = Object.assign({}, this.state.form, {password: event.target.value});
                                this.setState({form});
                            }} placeholder={'Password'} />
                        </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                        <Button type={'submit'} variant={'primary'} onClick={() => this.register()}>注册</Button>
                        <Button variant={'link'} onClick={() => history.goBack()}>返回</Button>
                    </Card.Footer>
                </Form>
            </Card>
        );
    }
    
    componentDidMount() {
        this.refs.name_input.focus();
    }
}

export default Register;
