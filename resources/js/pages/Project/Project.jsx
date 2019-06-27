import React, {useEffect} from 'react'
import {Route, Link, Switch} from "react-router-dom";
import {ListGroup, Image, ButtonGroup} from "react-bootstrap";
import manager from '../../../images/manager.png'
import add from '../../../images/add.png'
import ProjectMenu from "./ProjectMenu";
import ProjectPost from "./ProjectPost";
import axios from '../../configs/axios'
import {useNumber, useObject} from "react-hooks-easy";
import ProjectEvent from "./ProjectEvent";

export default function Project(props) {
    const project = useObject('project');
    const user = useObject('user');
    const postMenuActive = useNumber('postMenuActive', 0);

    useEffect(() => {
        init();
        return () => {
            project.reInitial({});
        }
    }, [props.match.params.id]);
    
    async function init() {
        let res = await axios.get('/project/' + props.match.params.id);
        project.reInitial(res);
    }
    
    return (
        <div className="project d-flex align-items-start">
            <div className={'position-sticky overflow-auto border-right project-left'}>
                <ListGroup>
                    <ListGroup.Item variant={'light'} className={'text-dark'}>
                        <ButtonGroup className={'h4 mb-0 d-inline-block text-truncate'} style={{width: (user.value.id > 0 ? 174 : 254) + 'px'}}
                                     title={project.value.name}>{project.value.name}</ButtonGroup>
                        {user.value.id > 0 &&
                        <ButtonGroup>
                            <Link className={'btn btn-link'} to={'/project_manager/' + props.match.params.id} title={'项目设置'}>
                                <Image src={manager} style={{width: '15px'}}/>
                            </Link>
                            <Link className={'btn btn-link'} to={'/post/' + props.match.params.id + '/edit/0'} title={'添加新文档'}>
                                <Image src={add} style={{width: '17px'}}/>
                            </Link>
                        </ButtonGroup>
                        }
                    </ListGroup.Item>
                </ListGroup>
                <ProjectMenu project_id={props.match.params.id}/>
            </div>
            <div className={'project-right'}>
                <Switch>
                <Route path={props.match.path} exact component={ProjectEvent}/>
                <Route path={props.match.path + '/post/:post_id'} component={ProjectPost}/>
                </Switch>
            </div>
        </div>
    );
}
