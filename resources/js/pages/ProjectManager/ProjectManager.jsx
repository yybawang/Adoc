import React from 'react'
import {Button, Card, Nav} from "react-bootstrap";
import {Route, Link} from 'react-router-dom'
import Basic from './Manager/Basic'
import Permission from './Manager/Permission'
import Advanced from './Manager/Advanced'
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
                        <Link className={'btn btn-link'} to={'/project/'+this.props.match.params.id}>&lt; {this.state.project.name}</Link>
                    </Card.Header>
                    <Card.Body>
                    <div className={'float-left manager-left'}>
                        <Nav className="flex-column">
                            <Link to={''+this.props.match.url} className={'nav-link ' + (this.state.page === 'basic' && 'active')}>基本信息</Link>
                            <Link to={''+this.props.match.url+'/permission'} className={'nav-link ' + (this.state.page === 'permission' && 'active')}>权限配置</Link>
                            <Link to={''+this.props.match.url+'/advanced'} className={'nav-link ' + (this.state.page === 'advanced' && 'active')}>高级</Link>
                        </Nav>
                    </div>
                    <div className={'float-left manager-right'}>
                        <Route path={this.props.match.path} exact component={Basic} />
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
