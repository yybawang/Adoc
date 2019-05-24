import React from 'react'
import {BrowserRouter, Route, Link} from "react-router-dom";
import {ListGroup, Image, ButtonGroup} from "react-bootstrap";
import manager from '../../../images/manager.png'
import add from '../../../images/add.png'
import ProjectMenu from "./ProjectMenu";
import ProjectPost from "./ProjectPost";
import axios from '../../configs/axios'

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            events: [],
            posts: [],
        };
    }
    
    render() {
       return (
           <div className="project d-flex align-items-start">
                <div className={'position-sticky overflow-auto border-right project-left'}>
                    <ListGroup>
                        <ListGroup.Item variant={'light'} className={'text-dark'}>
                            <ButtonGroup className={'h4 mb-0 d-inline-block text-truncate'} style={{width: '174px'}} title={this.state.project.name}>{this.state.project.name}</ButtonGroup>
                            <ButtonGroup>
                                <Link className={'btn btn-link'} to={'/project_manager/'+this.props.match.params.id} title={'项目设置'}>
                                    <Image src={manager} style={{width: '15px'}} />
                                </Link>
                                <Link className={'btn btn-link'} to={'/post/'+this.props.match.params.id+'/add'} title={'添加新文档'}>
                                    <Image src={add} style={{width: '17px'}} />
                                </Link>
                            </ButtonGroup>
                        </ListGroup.Item>
                    </ListGroup>
                    <ProjectMenu project_id={this.props.match.params.id} posts={this.state.posts} onChange={(posts) => this.setState({posts})} />
                </div>
                <div className={'project-right'}>
                    <Route path={this.props.match.path} exact render={() => this.events()} />
                    <Route path={this.props.match.path+'/post/:post_id'} component={ProjectPost} />
                </div>
            </div>
       )
    }
    
    events(){
        return (
            <div className={'mt-3'}>
                <ul>
                    {this.state.events.map((event) => (
                        <li className={'pr-4 my-1'} key={event.id} dangerouslySetInnerHTML={{__html: event.description}} />
                    ))}
                </ul>
            </div>
        );
    }
    
    init(){
        let id = this.props.match.params.id;
        axios.get('/project/'+id).then((project) => {
            this.setState({project});
        }).catch(()=>{})
        
        axios.get('/project/'+id+'/events').then((events) => {
            this.setState({events});
        }).catch(()=>{})
        
        axios.get('/project/'+id+'/posts').then((posts) => {
            this.setState({posts});
        }).catch(()=>{})
    }
    
    componentDidMount() {
        this.init();
    }
}

export default Project
