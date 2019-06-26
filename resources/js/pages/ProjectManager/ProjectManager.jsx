import React, {useEffect, useState} from 'react'
import {Button, Card, Nav} from "react-bootstrap";
import {Route, Link} from 'react-router-dom'
import Basic from './Manager/Basic'
import Permission from './Manager/Permission'
import Advanced from './Manager/Advanced'
import axios from '../../configs/axios'
import {useObject, useString} from "react-hooks-easy";

export default function ProjectManager(props){
    const projectManager = useObject('projectManager', {});
    const page = useString('projectManager', '');
    
    useEffect(() => {
        init();
    }, []);
    
    async function init(){
        let res = await axios.get('/project/'+props.match.params.id+'/edit');
        projectManager.reInitial(res);
    }
    
    return (
        <div className="m-3">
            <Card className={'project-manager'}>
                <Card.Header>
                    <Link className={'btn btn-link'} to={'/project/'+props.match.params.id}>&lt; {projectManager.value.name}</Link>
                </Card.Header>
                <Card.Body>
                    <div className={'float-left manager-left'}>
                        <Nav className="flex-column">
                            <Link to={''+props.match.url} className={'nav-link ' + (page.value === 'basic' && 'active')}>基本信息</Link>
                            <Link to={''+props.match.url+'/permission'} className={'nav-link ' + (page.value === 'permission' && 'active')}>权限配置</Link>
                            <Link to={''+props.match.url+'/advanced'} className={'nav-link ' + (page.value === 'advanced' && 'active')}>高级</Link>
                        </Nav>
                    </div>
                    <div className={'float-left manager-right'}>
                        <Route path={props.match.path} exact component={Basic} />
                        <Route path={props.match.path+'/permission'} component={Permission} />
                        <Route path={props.match.path+'/advanced'} component={Advanced} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

