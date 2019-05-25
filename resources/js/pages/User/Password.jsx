import React from 'react'
import {Button, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'
import {HeaderRight, Tips} from "../../configs/function";
import {User} from "../Layout/store";

class Password extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password_old: '',
            password: '',
            password_confirmation: '',
        };
        HeaderRight.dispatch({type: 'none'});
    }
    
    submit(){
        if(!this.state.password_old || !this.state.password || !this.state.password_confirmation){
            return;
        }
        axios.patch('/password', {password_old: this.state.password_old, password: this.state.password, password_confirmation: this.state.password_confirmation}).then(() => {
            Tips.dispatch({type: 'success', messages: ['修改完成，请重新登录']});
            User.dispatch({type: 'password'});
            localStorage.clear();
            // 返回登录页面
            this.props.history.replace('/login');
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div className={'mt-3 register'}>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Card>
                        <Card.Header><h5>修改登录密码</h5></Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>原密码</Form.Label>
                                <Form.Control ref={'password_old'} value={this.state.password_old} type={'password'} required onChange={(event) => this.setState({password_old: event.target.value})} placeholder={'Password'} />
                            </Form.Group>
                                <Form.Group>
                                    <Form.Label>新密码</Form.Label>
                                    <Form.Control value={this.state.password} type={'password'} required onChange={(event) => this.setState({password: event.target.value})} placeholder={'Password'} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>确认新密码</Form.Label>
                                    <Form.Control value={this.state.password_confirmation} type={'password'} required onChange={(event) => this.setState({password_confirmation: event.target.value})} placeholder={'Password confirmation'} />
                                </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant={'primary'} type={'submit'} onClick={() => this.submit()}>修改</Button>
                            <Button variant={'link'} onClick={() => this.props.history.goBack()}>返回</Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </div>
        )
    }
    
    componentDidMount() {
        this.refs.password_old.focus();
    }
}

export default Password
