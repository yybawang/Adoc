import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import {Navbar, Nav, NavDropdown, Form, FormControl, Button, Spinner} from 'react-bootstrap';
import axios from '../../configs/axios'

// 异步加载其他组件
// const Index = React.lazy(() => import('./index/index'));
import Index from '../Index/Index.jsx';
import Login from '../Layout/Login.jsx';
import Tip from '../Layout/Tip.jsx';
import PasswordUpdate from '../Layout/PasswordUpdate.jsx';
import Project from '../Project/Project.jsx';
import ProjectManager from '../ProjectManager/ProjectManager';
import Post from '../Post/Post.jsx';
import {Loading, LoginModal, PasswordModal, Project as ProjectStore} from './store';

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}

class AppRouter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            projectName: 'Adoc',     // 设置默认左上角显示名称，内页为项目名
            loading: true,
            user: {},
        };
        Loading.subscribe(() => {
            this.setState({loading: Loading.getState()});
        });
        // ProjectStore.subscribe(() => {
        //     this.setState({projectName: ProjectStore.getState().name});
        // });
    }
    
    password_update(){
        PasswordModal.dispatch({type: 'show'});
    }
    
    render () {
        return (
            <Router>
                <Navbar bg="light" expand="md">
                    <Navbar.Brand href="#/">{this.state.projectName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#/">项目列表</Nav.Link>
                            {this.state.user.id > 0 ? (
                                <NavDropdown title={this.state.user.name}>
                                    <NavDropdown.Header>用户ID：{this.state.user.id}</NavDropdown.Header>
                                    <NavDropdown.Header>{this.state.user.email}</NavDropdown.Header>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => {this.password_update()}}>修改密码</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link onClick={() => LoginModal.dispatch({type: 'show'})}>登录</Nav.Link>
                            )}
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-primary">Search</Button>
                            <Spinner animation="border" size={'sm'} className={{'ml-2' : true, 'd-none': this.state.loading}} />
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
                <div>
                    {/*<React.StrictMode>*/}
                        <React.Suspense fallback={<div>Loading</div>}>
                            <Route path="/" exact component={Index}/>
                            <Route path="/project/:id" component={Project}/>
                            <Route path="/project_manager/:id" component={ProjectManager}/>
                            <Route path="/post/:id/edit" component={Post}/>
                            <Route path="/about" component={About} />
                            <Route path="/users" component={Users} />
                        </React.Suspense>
                    {/*</React.StrictMode>*/}
                </div>
                <Login />
                <Tip />
                <PasswordUpdate />
            </Router>
        );
    }
    
    componentDidMount() {
        axios.get('/user').then((user) => {
            this.setState({user});
        }).catch(()=>{});
    }
}
export default AppRouter;
