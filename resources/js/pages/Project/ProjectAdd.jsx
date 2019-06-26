import React, {useEffect, useRef, useState} from 'react'
import {Button, ButtonGroup, Card, Form} from "react-bootstrap";
import axios from '../../configs/axios'

export default function ProjectAdd(props){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(0);
    const focus = useRef(null);
    
    useEffect(() => {
        focus.current.focus();
    }, []);
    
    async function submit(){
        let res = await axios.post('/project', {name, description, type});
        props.history.push('/project/'+res.id);
    }
    
    return (
        <div className="m-3">
            <Card className={'project-add'}>
                <Card.Header>新建项目</Card.Header>
                <Card.Body>
                    <Form onSubmit={(event) => {event.preventDefault()}}>
                        <Form.Group>
                            <Form.Label column={true}>项目名</Form.Label>
                            <Form.Control ref={focus} value={name} onChange={(event) => setName(event.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label column={true}>简短描述</Form.Label>
                            <Form.Control value={description} onChange={(event) => setDescription(event.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label column={true}>可见性</Form.Label>
                            <div>
                                <Form.Check type={'radio'} checked={type === 0} inline custom id={'type0'} name={'type'} value={0} onChange={(event) => setType(Number(event.target.value))} label={'公共'} />
                                <Form.Check type={'radio'} checked={type === 1} inline custom id={'type1'} name={'type'} value={1} onChange={(event) => setType(Number(event.target.value))} label={'私有'} />
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <ButtonGroup>
                        <Button onClick={() => submit()}>新建</Button>
                        <Button variant={'secondary'} className={'ml-3'} onClick={() => props.history.goBack()}>返回</Button>
                    </ButtonGroup>
                </Card.Footer>
            </Card>
        </div>
    );
}
