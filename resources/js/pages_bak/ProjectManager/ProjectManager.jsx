import React from 'react'
import {Button, Card, Nav} from "react-bootstrap";
import {Route} from 'react-router-dom'
import Basic from './Sub/Basic'
import Permission from './Sub/Permission'
import Advanced from './Sub/Advanced'
import axios from '../../configs/axios'
import {Active} from "./store";

class ProjectManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            permissions: [],
        };
        
        this.active = Active.subscribe(() => {
            this.setState({page: Active.getState()});
        });
    }
    
    render() {
        return (
            <div className="m-3">
                <Card className={'project-manager'}>
                    <Card.Header>
                        <Button href={'#/project/'+this.props.match.params.id} variant={'link'}>&lt; {this.state.project.name}</Button>
                    </Card.Header>
                    <Card.Body>
                    <div className={'float-left manager-left'}>
                        <Nav className="flex-column">
                            <Nav.Link href={''+this.props.match.url+'/basic'} className={{active: this.state.page === 'basic'}}>基本信息</Nav.Link>
                            <Nav.Link href={''+this.props.match.url+'/permission'} className={{active: this.state.page === 'permission'}}>权限配置</Nav.Link>
                            <Nav.Link href={''+this.props.match.url+'/advanced'} className={{active: this.state.page === 'advanced'}}>高级</Nav.Link>
                        </Nav>
                    </div>
                    <div className={'float-left manager-right'}>
                        <Route path={this.props.match.path+'/basic'} component={Basic} />
                        <Route path={this.props.match.path+'/permission'} component={Permission} />
                        <Route path={this.props.match.path+'/advanced'} component={Advanced} />
                    </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
    
    componentDidMount() {
        axios.get('/project/'+this.props.match.params.id+'/edit').then((project) => {
            this.setState({project});
        }).catch(()=>{})
    }
    componentWillUnmount() {
        this.active();
    }
}

export default ProjectManager
