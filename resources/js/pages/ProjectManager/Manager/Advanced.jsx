import React, {useEffect, useState} from 'react'
import {Button, ButtonGroup, Card, Form, FormControl, FormGroup, FormLabel, Media} from "react-bootstrap";
import axios from '../../../configs/axios'
import history from '../../../configs/history'
import {useObject, useString} from "react-hooks-easy";
import {Tips} from "../../../configs/function";

export default function Advanced(props) {
    const managerPage = useString('projectManager');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    
    useEffect(() => {
        managerPage.set('advanced');
    }, []);
    
    async function transfer() {
        if(!password || !email){
            return false;
        }
        await axios.post('/password_check', {password});
        await axios.patch('/project/' + props.match.params.id + '/transfer', {email});
        Tips('转让完成');
        history.replace('/projects');
    }
    
    async function del() {
        if(!password2){
            return false;
        }
        await axios.post('/password_check', {password: password2});
        await axios.delete('/project/' + props.match.params.id);
        Tips('刪除完成');
        history.replace('/projects');
    }
    
    return (
        <div>
            <Form onSubmit={(event) => {
                event.preventDefault()
            }}>
                <Card>
                    <Card.Header>转移项目归属人</Card.Header>
                    <Card.Body>
                        <FormGroup>
                            <FormLabel column={false}>输入接收者邮箱</FormLabel>
                            <FormControl value={email} required onChange={(event) => setEmail(event.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel column={false}>输入[登陆密码]确认操作</FormLabel>
                            <FormControl type={"password"} value={password} required onChange={(event) => setPassword(event.target.value)}/>
                        </FormGroup>
                    </Card.Body>
                    <Card.Footer>
                        <ButtonGroup>
                            <Button type={'submit'} onClick={() => transfer()}>开始转移</Button>
                        </ButtonGroup>
                    </Card.Footer>
                </Card>
            </Form>
            <div className={'my-4'}/>
            <Form onSubmit={(event) => {
                event.preventDefault()
            }}>
                <Card>
                    <Card.Header className={'bg-danger text-light'}>删除项目（不可恢复）</Card.Header>
                    <Card.Body>
                        <FormGroup>
                            <FormLabel column={false}>输入[登陆密码]确认操作</FormLabel>
                            <FormControl type={"password"} value={password2} required onChange={(event) => setPassword2(event.target.value)}/>
                        </FormGroup>
                    </Card.Body>
                    <Card.Footer>
                        <ButtonGroup>
                            <Button type={'submit'} variant={'outline-danger'} onClick={() => del()}>删除此项目</Button>
                        </ButtonGroup>
                    </Card.Footer>
                </Card>
            </Form>
        </div>
    );
}
