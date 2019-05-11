import React from 'react'
import axios from '../../../configs/axios'
import {Button, ButtonGroup, Col, Form, OverlayTrigger, ListGroup, ListGroupItem, Popover, Row, Table} from "react-bootstrap";
import {Tips} from "../../Layout/store";

class Permission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            keyword_users: [],
            user_id: 0,
            write: 0,
            admin: 0,
            permissions: [],
        };
    }
    
    add(){
        if(!this.state.user_id){
            Tips.dispatch({type: 'show', messages: ['未选择用户']});
        }
        axios.post('/project/'+this.props.match.params.id+'/permission', {user_id: this.state.user_id, write: this.state.write, admin: this.state.admin}).then(()=>{
            this.permissions();
        }).catch(()=>{})
    }
    
    edit(permission){
        axios.post('/project/'+this.props.match.params.id+'/permission', {user_id: permission.user_id, write: permission.write, admin: permission.admin}).then((data)=>{
        
        }).catch(()=>{})
    }
    
    delete(id){
        axios.delete('/project/'+id+'/permission').then(()=>{
            this.permissions();
        }).catch(()=>{});
    }
    
    permissions(){
        axios.get('/project/'+this.props.match.params.id+'/permission').then((permissions)=>{
            this.setState({permissions});
        }).catch(()=>{})
    }
    
    keyword_users(keyword){
        axios.get('/project/permission/user/'+keyword).then((keyword_users) => {
            this.setState({keyword_users});
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Form.Group>
                        <Form.Label>用户名/Email 检索</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control value={this.state.keyword} onChange={(event) => {
                                    this.setState({keyword: event.target.value, user_id: 0});
                                    if(event.target.value.length >= 3){
                                        this.keyword_users(event.target.value);
                                    }
                                }} />
                                <ListGroup className={'position-absolute permission-search border shadow'}>
                                    {this.state.keyword_users.map((user) => (
                                        <ListGroupItem key={user.id} variant={'light'} className={'text-dark border-bottom'} onClick={() => {
                                            this.setState({keyword: user.name, keyword_users: [], user_id: user.id});
                                        }}>
                                            {user.name}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </Col>
                            <Col>
                                <Button type={'submit'} onClick={() => this.add()}>添加</Button>
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
                    {this.state.permissions.map((permission, index) => (
                        <tr key={permission.id}>
                            <td>{index+1}</td>
                            <td>{permission.user.name}</td>
                            <td>{permission.user.email}</td>
                            <td>
                                <Form.Check
                                    custom
                                    type={'checkbox'}
                                    checked={permission.write}
                                    onChange={(event) => {
                                        let permissions = [...this.state.permissions];
                                        permissions[index].write = event.target.checked;
                                        this.setState({permissions});
                                        this.edit(permissions[index]);
                                    }}
                                    id={'permission_write_'+permission.id}
                                    label={'可写'}
                                />
                            </td>
                            <td>
                                <Form.Check
                                    custom
                                    type={'checkbox'}
                                    checked={permission.admin}
                                    onChange={(event) => {
                                        let permissions = [...this.state.permissions];
                                        permissions[index].admin = event.target.checked;
                                        this.setState({permissions});
                                        this.edit(permissions[index]);
                                    }}
                                    id={'permission_admin_'+permission.id}
                                    label={'管理者'}
                                />
                            </td>
                            <td>
                                <OverlayTrigger trigger="focus" placement="left" overlay={
                                    <Popover id="popover-basic" title="删除?">
                                        <div className={'py-2'}>移除用户 <strong>{permission.user.name}</strong> 的权限</div>
                                        <ButtonGroup>
                                            <Button variant={'danger'} size={'sm'} onClick={() => this.delete(permission.id)}>删除</Button>
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
            </div>
        )
    }
    
    componentDidMount() {
        this.permissions();
    }
}

export default Permission
