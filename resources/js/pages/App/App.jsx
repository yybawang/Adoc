import React, {useEffect, useState} from 'react'
import {Router, Route, Link, Switch} from "react-router-dom";
import history from "../../configs/history";
import {Form, FormControl, Nav, Navbar, NavDropdown} from "react-bootstrap";
import ProjectList from "../Project/ProjectList";
import Project from "../Project/Project";
import ProjectAdd from "../Project/ProjectAdd";
import ProjectManager from "../ProjectManager/ProjectManager";
import Register from "../User/Register";
import Login from "../User/Login";
import Password from "../User/Password";
import PostEdit from "../Post/PostEdit";
import {useObject} from "react-hooks-easy";
import axios from '../../configs/axios'

export default function App(props){
    // 全局的用戶信息，否則是空數組
    const user = useObject('user', {});
    const project = useObject('project', {});
    const [keyword, setKeyword] = useState('');
    const [keywordLoading, setKeywordLoading] = useState(false);
    const [keywordResult, setKeywordResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    
    useEffect(() => {
        init();
    }, []);
    
    async function init(){
        let res = await axios.get('/user');
        user.reInitial(res);
    }
    
    async function search(value){
        if(keywordLoading){
            // return true;
        }
        setKeywordLoading(true);
        setKeywordResult([]);
        if(value.length < 3){
            return false;
        }
        let res = await axios.post('/project/'+project.value.id+'/search', {keyword: value});
        setKeywordLoading(false);
        setKeywordResult(res);
    }
    
    return (
        <div>
            <Router history={history}>
                <Navbar bg={'light'} expand="md">
                    <Navbar.Brand>
                        <Link className={'text-dark text-decoration-none'} to={'/projects'}>Adoc</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link to={'/projects'} className={'nav-link'}>项目列表</Link>
                            {user.value.id > 0 ? (
                                <NavDropdown id={'user'} title={user.value.name}>
                                    <NavDropdown.Header>用户ID：{user.value.id}</NavDropdown.Header>
                                    <NavDropdown.Header>{user.value.email}</NavDropdown.Header>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => history.push('/password')}>修改密码</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('/login')}>注销</NavDropdown.Item>
                                </NavDropdown>
                        
                            ): (
                                <>
                                    <Link to={'/register'} className={'nav-link'}>注册</Link>
                                    <Link to={'/login'} onClick={() => localStorage.setItem('auth_jump', location.pathname)} className={'nav-link'}>登录</Link>
                                </>
                            )}
                    
                        </Nav>
                        {project.value.id > 0 ? (
                                <div className={'position-relative'}>
                                    <Form inline onSubmit={(event) => {event.preventDefault()}}>
                                        <FormControl type="text" placeholder="搜索文档" className="mr-sm-2" value={keyword} onChange={(event) => {
                                            setShowResult(true);
                                            setKeyword(event.target.value);
                                            search(event.target.value);
                                        }}
                                                     onFocus={() => setShowResult(true)}
                                                    onBlur={() => setTimeout(() => setShowResult(false), 200)}
                                        />
                                
                                    </Form>
                                    {showResult && <div className={'position-absolute shadow search-results'}>
                                        {keywordResult.map((result) => (
                                            <div key={result.id} className={'border-bottom p-2 items'}>
                                                <div style={{cursor: "default"}} onClick={() => {
                                                    history.push('/project/'+project.value.id+'/post/'+result.id);
                                                    setKeyword('');
                                                    setKeywordResult([]);
                                                }}>
                                                <span className={'text-muted'}>文档：</span>
                                                {result.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                                </div>)
                            : (
                                user.value.id > 0 && <Link className={'btn btn-outline-dark'} to={'/project_add'}>新建项目</Link>
                            )
                        }
                    </Navbar.Collapse>
                </Navbar>
                <React.Suspense fallback={<div>Loading</div>}>
                    <Switch>
                    <Route path={'/projects'} component={ProjectList} />
                    <Route path={'/project/:id'} component={Project} />
                    <Route path={'/project_add'} component={ProjectAdd} />
                    <Route path={'/project_manager/:id'} component={ProjectManager} />
                    <Route path={'/register'} component={Register} />
                    <Route path={'/login'} component={Login} />
                    <Route path={'/password'} component={Password} />
                    <Route path={'/post/:project_id/edit/:id'} component={PostEdit} />
                    </Switch>
                </React.Suspense>
            </Router>
        </div>
    );
}
