import React from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import axios from '../../configs/axios'
import {LoginModal} from "./store";
import {Tips, PasswordModal} from "./store";

class PasswordUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            form: {
                password_old: '',
                password: '',
                password_confirmation: '',
            },
        };
        PasswordModal.subscribe(() => {
            this.setState({show: PasswordModal.getState()});
        });
    }
    
    submit(){
        axios.post('/user/password', this.state.form).then(()=> {
            Tips.dispatch({type: 'show', messages: ['密码修改完成，下次登陆请使用新密码']});
            PasswordModal.dispatch({type: 'hide'});
        }).catch(()=>{})
    }
    
    render() {
        return (
            <Modal
                show={this.state.show}
                onHide={() => PasswordModal.dispatch({type: 'hide'})}
                onEntered={() => {this.refs.password_input.focus()}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>修改 [登陆密码]</Modal.Title>
                </Modal.Header>
                {/*Form 放外面，可以使用回车提交*/}
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>现密码</Form.Label>
                            <Form.Control type={'password'} ref={'password_input'} required value={this.state.form.password_old} onChange={(event) => {
                                let form = Object.assign({}, this.state.form, {password_old: event.target.value});
                                this.setState({form});
                            }} placeholder={'Password'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>新密码</Form.Label>
                            <Form.Control type={'password'} required value={this.state.form.password} onChange={(event) => {
                                let form = Object.assign({}, this.state.form, {password: event.target.value});
                                this.setState({form});
                            }} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>确认新密码</Form.Label>
                            <Form.Control type={'password'} required value={this.state.form.password_confirmation} onChange={(event) => {
                                let form = Object.assign({}, this.state.form, {password_confirmation: event.target.value});
                                this.setState({form});
                            }} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'secondary'} onClick={() => PasswordModal.dispatch({type: 'hide'})}>Close</Button>
                        <Button type={'submit'} variant={'primary'} onClick={() => this.submit()}>Login</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default PasswordUpdate
