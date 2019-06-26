import React, {useEffect, useState} from 'react'
import axios from '../../../configs/axios'
import {Button, Form} from "react-bootstrap";
import {useObject, useString} from "react-hooks-easy";
import {Tips} from "../../../configs/function";

export default function Basic(props){
    const projectManager = useObject('projectManager');
    const managerPage = useString('projectManager');
    const [project, setProject] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(0);
    
    useEffect(() => {
        managerPage.set('basic');
        init();
    }, []);
    
    async function init(){
        let res = await axios.get('/project/'+props.match.params.id+'/edit');
        setProject(res);
        setName(res.name);
        setDescription(res.description);
        setType(Number(res.type));
    }
    
    async function submit(){
        let res = await axios.patch('/project/' + project.id, {name, description, type});
        projectManager.reInitial(res);
        Tips('修改完成', 'success');
    }
    
    return (
        <div>
            <Form onSubmit={(event) => {
                event.preventDefault()
            }}>
                <Form.Group>
                    <Form.Label column={true}>项目名</Form.Label>
                    <Form.Control value={name} onChange={(event)=> setName(event.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label column={true}>项目描述</Form.Label>
                    <Form.Control value={description} as={'textarea'} onChange={(event)=> setDescription(event.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label column={true}>可见性</Form.Label>
                    <div>
                        <Form.Check type={'radio'} checked={type === 0} inline custom id={'type0'} name={'type'} onChange={(event) => setType(0)} label={'公共'} />
                        <Form.Check type={'radio'} checked={type === 1} inline custom id={'type1'} name={'type'} onChange={(event) => setType(1)} label={'私有'} />
                    </div>
                </Form.Group>
                <Form.Group>
                    <Button type={'submit'} onClick={() => submit()}>修改</Button>
                </Form.Group>
            </Form>
        </div>
    );
}
