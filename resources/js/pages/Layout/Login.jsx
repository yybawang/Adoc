import React from 'react'
import {LoginModal, User} from './store';
import {Modal, Button, Form} from 'react-bootstrap'
import axios from '../../configs/axios'

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show : false,
            form: {
                email: '',
                password: '',
            }
        };
        LoginModal.subscribe(() => {
            this.setState({show: LoginModal.getState()});
        });
    }
    
    login(){
        let t = this;
        if(!t.state.form.email || !t.state.form.password){
            return;
        }
        axios.post('/login', t.state.form).then((data) => {
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
            <Modal
                show={this.state.show}
                onHide={() => LoginModal.dispatch({type: 'hide'})}
                onEntered={() => {this.refs.email_input.focus()}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                {/*Form 放外面，可以使用回车提交*/}
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>邮箱</Form.Label>
                            <Form.Control ref={'email_input'} type={'email'} required value={this.state.form.email} onChange={(event) => {
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'secondary'} onClick={() => LoginModal.dispatch({type: 'hide'})}>Close</Button>
                        <Button type={'submit'} variant={'primary'} onClick={() => this.login()}>Login</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

export default Login;
