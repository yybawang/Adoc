import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';

// 异步加载其他组件
// const Index = React.lazy(() => import('./index/index'));
import Index from './Index/Index.jsx';

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}

function AppRouter() {
    return (
        <Router>
            <Navbar bg="light" expand="md">
                <Navbar.Brand href="#/">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#/">Home</Nav.Link>
                        <Nav.Link href="#/about">About</Nav.Link>
                        <Nav.Link href="#/users">Users</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <div>
                <React.StrictMode>
                    <React.Suspense fallback={<div>Loading</div>}>
                        <Route path="/" exact component={Index}/>
                        <Route path="/about" component={About} />
                        <Route path="/users" component={Users} />
                    </React.Suspense>
                </React.StrictMode>
            </div>
        </Router>
    );
}

export default AppRouter;
