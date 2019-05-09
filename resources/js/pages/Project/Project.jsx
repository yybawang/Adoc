import React from 'react';
import axios from '../../configs/axios'
import {Route, Switch} from "react-router-dom";
import ProjectPost from './ProjectPost';
import ProjectMenu from './ProjectMenu';
import {ProjectName} from "../Layout/store";


function events({match}){
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


class Project extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            id: parseInt(this.props.match.params.id),
            post_id: parseInt(this.props.match.params.post_id),
            project: {},
            posts: [],
            events: [],
            post: {},
        }
    }
    
    render() {
        return (
            <div>
                <div className={'float-left position-sticky overflow-auto border-right project-left'}>
                    <ProjectMenu project_id={this.state.id} posts={this.state.posts} />
                </div>
                <div className={'float-left project-right'}>
                    <Switch>
                        <Route path={this.props.match.path + '/post/:post_id'} component={ProjectPost} />
                        <Route path={this.props.match.path} extra render={() => (
                                <div className={'mt-3'}>
                                    <ul>
                                        {this.state.events.map((event) => (
                                            <li className={'pr-4 my-1'} key={event.id} dangerouslySetInnerHTML={{__html: event.description}} />
                                        ))}
                                    </ul>
                                </div>
                            )} />
                    </Switch>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        axios.get('/project/'+this.state.id).then((data) => {
            let state = Object.assign({}, this.state, data);
            this.setState(state);
            // 设置左上角显示名
            ProjectName.dispatch({type: 'set', name: state.project.name});
        }).catch(()=>{});
        
        if(this.state.post_id){
            axios.get('/post/'+this.state.post_id).then(post => {
                this.setState({post});
            }).catch(()=>{});
        }
    }
}

export default Project;
