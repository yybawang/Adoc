import React, {useEffect, useState} from 'react'
import axios from '../../configs/axios'
import {Button, ButtonGroup, Card, Form} from "react-bootstrap";

export default function ProjectExport(props){
    const [pid, setPid] = useState(0);
    const [list, setList] = useState([]);
    
    useEffect(() => {
        init();
    }, []);
    
    async function init(){
        let res = await axios.get('/project/'+props.match.params.id+'/posts');
        setList(res);
    }
    
    async function submit(){
        let res = await axios.post('/project/'+props.match.params.id+'/export/'+pid);
        location.href = res.fileurl;
    }
    
    return (
        <div style={{width: 600}} className={'mt-5 mx-auto'}>
        <Form onSubmit={(e) => e.preventDefault()}>
            <Card>
                <Card.Header>批量导出</Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label column={true}>选择一个目录</Form.Label>
                        <Form.Control as="select" onChange={(e) => setPid(e.target.value)}>
                            <option value={0}>全部</option>
                            {list.filter((val) => val.children.length > 0).map(val => (
                                <option key={val.id} value={val.id}>{val.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Card.Body>
                <Card.Footer>
                    <ButtonGroup>
                        <Button type={'submit'} onClick={() => submit()}>导出</Button>
                    </ButtonGroup>
                </Card.Footer>
            </Card>
        </Form>
        </div>
    );
}
