import React from 'react'
import {Router, Route, Redirect, Link} from "react-router-dom"
import {Navbar, Nav, Button, Form, FormControl, NavDropdown} from "react-bootstrap";
import history from '../../configs/history'
import Index from '../Index/Index'
import Project from '../Project/Project'
import Register from "../User/Register";
import Login from "../User/Login";
import ProjectList from "../Project/ProjectList";
import {User} from "./store";
import axios from '../../configs/axios'
import Password from "../User/Password";
import ProjectManager from "../ProjectManager/ProjectManager";
import ProjectAdd from "../Project/ProjectAdd";
import PostEdit from "../Post/PostEdit";
import PostAdd from "../Post/PostAdd";

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user: {},
        };
        
        User.subscribe(() => {
            if(User.getState()){
                this.getUser();
            }else{
                this.setState({user: {}});
            }
        });
    }
    
    getUser(){
        axios.get('/user').then((user) => {
            this.setState({user});
        }).catch(() => {});
    }
    
    render() {
        return (
            <div>
                <Router history={history}>
                    <Navbar bg={'light'} expand="md">
                        <Navbar.Brand>
                            <Link to={'/'} className={'navbar-brand'}>Adoc</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Link to={'/project'} className={'nav-link'}>项目列表</Link>
                                {this.state.user.id > 0 ? (
                                    <NavDropdown title={this.state.user.name}>
                                        <NavDropdown.Header>用户ID：{this.state.user.id}</NavDropdown.Header>
                                        <NavDropdown.Header>{this.state.user.email}</NavDropdown.Header>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={() => history.push('password')}>修改密码</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => {localStorage.clear();history.replace('login');}}>注销</NavDropdown.Item>
                                    </NavDropdown>
                                   
                                ): (
                                    <>
                                        <Link to={'/register'} className={'nav-link'}>注册</Link>
                                        <Link to={'/login'} className={'nav-link'}>登录</Link>
                                    </>
                                )}
                                
                            </Nav>
                            <Form inline>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                                <Button variant="outline-primary">Search</Button>
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                    <React.Suspense fallback={<div>Loading</div>}>
                        <Route path={'/'} exact component={Index} />
                        <Route path={'/project'} exact component={ProjectList} />
                        <Route path={'/project/:id'} component={Project} />
                        <Route path={'/project_add'} component={ProjectAdd} />
                        <Route path={'/project_manager/:id'} component={ProjectManager} />
                        <Route path={'/register'} component={Register} />
                        <Route path={'/login'} component={Login} />
                        <Route path={'/password'} component={Password} />
                        <Route path={'/post/:project_id/add'} component={PostAdd} />
                        <Route path={'/post/:id/edit'} component={PostEdit} />
                    </React.Suspense>
                </Router>
            </div>
        );
    }
    
    componentDidMount() {
        this.getUser();
    }
}

export default Header
