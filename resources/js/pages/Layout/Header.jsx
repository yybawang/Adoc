import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
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
            project: {id: 0, name: 'Adoc'},     // 设置默认左上角显示名称，内页为项目名
            loading: true,
            user: {},
            search_timer: false,
            keyword: '',
            keyword_results: [],
        };
        Loading.subscribe(() => {
            this.setState({loading: Loading.getState()});
        });
        ProjectStore.subscribe(() => {
            this.setState({project: ProjectStore.getState()});
        });
    }
    
    password_update(){
        PasswordModal.dispatch({type: 'show'});
    }
    
    search(keyword){
        if(this.state.search_timer){
            return;
        }
        if(keyword.length < 2){
            return;
        }
        this.setState({keyword_results: [], search_timer: true});
        axios.post('/project/'+this.state.project.id+'/search', {keyword: keyword}).then((keyword_results) => {
            this.setState({keyword_results: keyword_results, search_timer: false});
        }).catch(()=>{
            this.setState({keyword_results: [], search_timer: false});
        })
    }
    
    render () {
        return (
            <div>
            <Router>
                <Navbar bg="light" expand="md">
                    <Navbar.Brand href="#/">Adoc</Navbar.Brand>
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
                        {this.state.project.id > 0 &&
                            <div className={'position-relative'}>
                            <Form inline onSubmit={(event) => {event.preventDefault()}}>
                                <FormControl type="text" placeholder="搜索文档" className="mr-sm-2" value={this.state.keyword} onChange={(event) => {
                                    this.setState({keyword: event.target.value})
                                    this.search(event.target.value);
                                }} />
                                
                            </Form>
                                <div className={'position-absolute shadow search-results'}>
                                    {this.state.keyword_results.map((result) => (
                                        <div key={result.id} className={'border-bottom p-2 items'}>
                                            <span className={'text-muted'}>文档：</span>
                                            <Link to={'/project/'+this.state.project.id+'/post/'+result.id} onClick={() => {
                                                this.setState({keyword: '', keyword_results: []})
                                            }}>{result.name}</Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                        <div className={'loading'}>
                            <Spinner animation="border" size={'sm'} className={{'ml-2' : true, 'd-none': this.state.loading}} />
                        </div>
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
                {/*<Tip />*/}
                <PasswordUpdate />
            </Router>
            </div>
        );
    }
    
    componentDidMount() {
        axios.get('/user').then((user) => {
            this.setState({user});
        }).catch(()=>{});
    }
}
export default AppRouter;
