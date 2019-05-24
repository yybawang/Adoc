import React from 'react'
import {Button, ButtonGroup, Card, Form, FormControl, FormGroup, FormLabel, Media} from "react-bootstrap";
import axios from '../../../configs/axios'
import history from '../../../configs/history'
import {Active} from "../store";

class Advanced extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
        };
    }
    
    transfer(){
        axios.post('/password_check', {password: this.state.password}).then(() => {
            axios.patch('/project/'+this.props.match.params.id, {email: this.state.email}).then(()=> {
                history.push('/');
            }).catch(()=>{})
        });
        
    }
    
    delete(){
        axios.post('/password_check', {password: this.state.password2}).then(() => {
            axios.delete('/project/'+this.props.match.params.id).then(()=>{
                history.push('/');
            }).catch(()=>{})
        }).catch(()=>{});
        
    }
    
    render() {
        return (
            <div>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Card>
                        <Card.Header>转移项目归属人</Card.Header>
                        <Card.Body>
                            <FormGroup>
                                <FormLabel>输入接收者邮箱</FormLabel>
                                <FormControl value={this.state.email} required onChange={(event) => this.setState({email: event.target.value})} />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>输入[登陆密码]确认操作</FormLabel>
                                <FormControl value={this.state.password} required onChange={(event) => this.setState({password: event.target.value})} />
                            </FormGroup>
                        </Card.Body>
                    <Card.Footer>
                        <ButtonGroup className={'mt-3'}>
                            <Button type={'submit'} onClick={() => this.transfer()}>开始转移</Button>
                        </ButtonGroup>
                    </Card.Footer>
                    </Card>
                </Form>
                <div className={'my-4'} />
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Card>
                        <Card.Header className={'bg-danger text-light'}>删除项目（不可恢复）</Card.Header>
                        <Card.Body>
                            <FormGroup>
                                <FormLabel>输入[登陆密码]确认操作</FormLabel>
                                <FormControl value={this.state.password2} required onChange={(event) => this.setState({password2: event.target.value})} />
                            </FormGroup>
                        </Card.Body>
                        <Card.Footer>
                            <ButtonGroup className={'mt-3'}>
                                <Button type={'submit'} variant={'outline-danger'} onClick={() => {this.delete()}}>删除此项目</Button>
                            </ButtonGroup>
                        </Card.Footer>
                    </Card>
                </Form>
            </div>
        )
    }
    
    componentDidMount() {
        Active.dispatch({type: 'set', page: 'advanced'});
    }
}

export default Advanced
