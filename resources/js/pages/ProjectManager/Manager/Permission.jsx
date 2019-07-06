import React, {useEffect, useState} from 'react'
import axios from '../../../configs/axios'
import {Button, ButtonGroup, Col, Form, OverlayTrigger, ListGroup, ListGroupItem, Popover, Row, Table, Card} from "react-bootstrap";
import {Tips} from "../../../configs/function";
import {useObject, useString} from "react-hooks-easy";

export default function Permission(props) {
    const managerPage = useString('projectManager');
    const project = useObject('projectManager');
    const user = useObject('user');
    const [keyword, setKeyword] = useState('');
    const [keywordUsers, setKeywordUsers] = useState([]);
    const [userId, setUserId] = useState(0);
    const [list, setList] = useState([]);
    const [write, setWrite] = useState(false);
    const [admin, setAdmin] = useState(false);
    
    useEffect(() => {
        managerPage.set('permission');
        init();
    }, []);
    
    async function init() {
        let res = await axios.get('/project/' + props.match.params.id + '/permission');
        setList(res);
    }
    
    async function search(keyword) {
        let res = await axios.get('/project/' + props.match.params.id + '/permission/' + keyword);
        setKeywordUsers(res);
    }
    
    async function add() {
        if (!userId) {
            Tips('未選擇用戶', 'warn');
            return false;
        }
        await axios.post('/project/' + props.match.params.id + '/permission', {user_id: userId, write, admin});
        init();
    }
    
    async function edit(permission) {
        await axios.post('/project/' + props.match.params.id + '/permission', {
            user_id: permission.user_id,
            write: permission.write,
            admin: permission.admin
        });
    }
    
    async function del(id) {
        await axios.delete('/project/' + id + '/permission');
        init();
    }
    
    return (
        <div>
            <Card>
                <Card.Header>成员权限配置</Card.Header>
                <Card.Body>
                    <Form onSubmit={(event) => {
                        event.preventDefault()
                    }}>
                        <Form.Group>
                            <Form.Label column={false}>用户名/Email 检索</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control value={keyword} onChange={(event) => {
                                        setKeyword(event.target.value);
                                        setUserId(0);
                                        if (event.target.value.length >= 3) {
                                            search(event.target.value);
                                        } else {
                                            setKeywordUsers([]);
                                        }
                                    }}/>
                                    {keywordUsers.length > 0 && (
                                        <ListGroup className={'position-absolute permission-search border shadow'}>
                                            {keywordUsers.map((user, index) => (
                                                <div key={user.id} className={index + 1 < keywordUsers.length ? 'border-bottom' : ''}>
                                                    <ListGroupItem variant={'light'} className={'text-dark'} onClick={() => {
                                                        setKeyword(user.name);
                                                        setKeywordUsers([]);
                                                        setUserId(user.id);
                                                    }}>
                                                        {user.name}
                                                    </ListGroupItem>
                                                </div>
                                            ))}
                                        </ListGroup>
                                    )
                                    }
                                </Col>
                                <Col>
                                    <Button type={'submit'} onClick={() => add()}>添加</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                    <Table responsive bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>用户名</th>
                            <th>Email</th>
                            <th>写入权限</th>
                            <th>协助管理者</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((permission, index) => (
                            <tr key={permission.id}>
                                <td>{index + 1}</td>
                                <td>{permission.user.name}</td>
                                <td>{permission.user.email}</td>
                                <td>
                                    <Form.Check
                                        custom
                                        type={'checkbox'}
                                        disabled={Number(user.value.id) === Number(permission.user.id)}
                                        checked={permission.write}
                                        onChange={(event) => {
                                            let permissions = [...list];
                                            permission.write = event.target.checked;
                                            // 取消写入，则管理权限也要取消
                                            if(event.target.checked === false){
                                                permission.admin = false;
                                            }
                                            setList(permissions);
                                            edit(permissions[index]);
                                        }}
                                        id={'permission_write_' + permission.id}
                                        label={'可写'}
                                    />
                                </td>
                                <td>
                                    <Form.Check
                                        custom
                                        type={'checkbox'}
                                        disabled={Number(user.value.id) === Number(permission.user.id)}
                                        checked={permission.admin}
                                        onChange={(event) => {
                                            let permissions = [...list];
                                            permission.admin = event.target.checked;
                                            // 添加管理，则写入权限也要勾选
                                            if(event.target.checked === true){
                                                permission.write = true;
                                            }
                                            setList(permissions);
                                            edit(permissions[index]);
                                        }}
                                        id={'permission_admin_' + permission.id}
                                        label={'管理者'}
                                    />
                                </td>
                                <td>
                                    <OverlayTrigger trigger="focus" placement="left" overlay={
                                        <Popover id="popover-basic" title="删除?">
                                            <div className={'py-2'}>移除用户 <strong>{permission.user.name}</strong> 的权限</div>
                                            <ButtonGroup>
                                                <Button variant={'danger'} size={'sm'} onClick={() => del(permission.id)}>删除</Button>
                                            </ButtonGroup>
                                        </Popover>
                                    }>
                                        <Button size={'sm'} variant={'warning'}>删除</Button>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}
