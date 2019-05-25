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
import {HeaderRight} from "../../configs/function";

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            project_id: 0,
            user: {},
            header_right: '',
            search_timer: false,
            keyword: '',
            keyword_results: [],
        };
        
        User.subscribe(() => {
            if(User.getState()){
                this.getUser();
            }else{
                this.setState({user: {}});
            }
        });
    
    
        HeaderRight.subscribe(() => {
            let state = HeaderRight.getState();
            if(state.header_right){
                this.setState({project_id: state.project_id, header_right: state.header_right});
            }
        });
    }
    
    getUser(){
        axios.get('/user').then((user) => {
            this.setState({user});
        }).catch(() => {});
    }
    
    search(keyword){
        if(this.state.search_timer){
            return;
        }
        if(keyword.length < 2){
            return;
        }
        this.setState({keyword_results: [], search_timer: true});
        axios.post('/project/'+this.state.project_id+'/search', {keyword: keyword}).then((keyword_results) => {
            this.setState({keyword_results: keyword_results, search_timer: false});
        }).catch(()=>{
            this.setState({keyword_results: [], search_timer: false});
        })
    }
    
    render() {
        return (
            <div>
                <Router history={history}>
                    <Navbar bg={'light'} expand="md">
                        <Navbar.Brand>
                            <a className={'text-dark'} href={'/'}>Adoc</a>
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
                                        <NavDropdown.Item onClick={() => {localStorage.clear();history.replace('/login');}}>注销</NavDropdown.Item>
                                    </NavDropdown>
                                   
                                ): (
                                    <>
                                        <Link to={'/register'} className={'nav-link'}>注册</Link>
                                        <Link to={'/login'} className={'nav-link'}>登录</Link>
                                    </>
                                )}
                                
                            </Nav>
                            {this.state.header_right === 'search' ? (
                                    <div className={'position-relative'}>
                                        <Form inline onSubmit={(event) => {event.preventDefault()}}>
                                            <FormControl type="text" placeholder="搜索文档" className="mr-sm-2" value={this.state.keyword} onChange={(event) => {
                                                this.setState({keyword: event.target.value});
                                                this.search(event.target.value);
                                            }} />
                
                                        </Form>
                                        <div className={'position-absolute shadow search-results'}>
                                            {this.state.keyword_results.map((result) => (
                                                <div key={result.id} className={'border-bottom p-2 items'} onClick={() => {
                                                    history.push('/project/'+this.state.project_id+'/post/'+result.id);
                                                    this.setState({keyword: '', keyword_results: []})
                                                }}>
                                                    <span className={'text-muted'}>文档：</span>
                                                    <Link to={'/project/'+this.state.project_id+'/post/'+result.id} onClick={() => {
                                                        this.setState({keyword: '', keyword_results: []})
                                                    }}>{result.name}</Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>)
                                : (this.state.header_right === 'add' ? (
                                    <Link className={'btn btn-outline-dark'} to={'/project_add'}>新建项目</Link>
                                ) : '')
                            }
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
