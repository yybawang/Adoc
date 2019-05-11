import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import {Navbar, Nav, NavDropdown, Form, FormControl, Button, Spinner} from 'react-bootstrap';

// 异步加载其他组件
// const Index = React.lazy(() => import('./index/index'));
import Index from '../Index/Index.jsx';
import Login from '../Layout/Login.jsx';
import Tip from '../Layout/Tip.jsx';
import Project from '../Project/Project.jsx';
import {Loading, LoginModal, ProjectName} from './store';

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
        };
        Loading.subscribe(() => {
            this.setState({loading: Loading.getState()});
        });
        ProjectName.subscribe(() => {
            this.setState({projectName: ProjectName.getState()});
        });
    }
    render () {
        return (
            <Router>
                <Navbar bg="light" expand="md">
                    <Navbar.Brand href="#/">{this.state.projectName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#/">Home</Nav.Link>
                            <Nav.Link onClick={() => LoginModal.dispatch({type: 'show'})}>Login</Nav.Link>
                            <Nav.Link href="#/users">Users</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#/logout">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#/register">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#/login">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
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
                            <Route path="/about" component={About} />
                            <Route path="/users" component={Users} />
                        </React.Suspense>
                    {/*</React.StrictMode>*/}
                </div>
                <Login />
                <Tip />
            </Router>
        );
    }
}
export default AppRouter;
