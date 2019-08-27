/**
 * 主页
 * 项目列表，区分公共、有权限两种列表
 */
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from '../../configs/axios'
import {Container, Row, Col, Card, Alert} from 'react-bootstrap';
import AddSvg from '../../../images/add.svg'
import {useObject} from "react-hooks-easy";

export default function ProjectList(props){
    const user = useObject('user');
    const [list, setList] = useState([]);
    
    useEffect(() => {
        init();
    }, []);
    
    async function init(){
        let res = await axios.get('/');
        setList(res);
    }
    
    async function top(id){
        await axios.post('/top', {id});
        await init();
    }
    
    return (
        <Container>
            {user.value.id ? '':  <Row className={'align-items-center mt-3' + (user.value.id ? ' d-none' : '')}>
                <Col>
                    <Alert variant={"primary"} className={'text-center'}>
                        该页面为公共页面，可查看共享的文档，<Link to={'/login'}>登录</Link>后可查看用户所属文档
                    </Alert>
                </Col>
            </Row>}
            <Row className={'align-items-center'}>
                {list.map((project) =>
                    <Col md={3} sm={4} key={project.id} className={{'mt-4': true, 'project-card': true, 'project-share' : project.share}}>
                        <Card className={'shadow-sm position-relative'}>
                            {user.value.id > 0 && <span className={'position-absolute project-top'} onClick={() => top(project.id)}>顶</span>}
                            <Link to={'/project/'+project.id} title={project.description}>
                            <Card.Body>
                                <div className={'my-3 text-center'}>{project.name}</div>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                )}
                {user.value.id > 0 &&<Col md={3} sm={4} className={{'mt-4': true, 'project-card': true}}>
                    <Card className={'shadow-sm'}>
                        <Link to={'/project_add'} title={'新建项目'}>
                            <Card.Body style={{background: `url(${AddSvg}) no-repeat center center transparent`, backgroundSize: '20px 20px'}}>
                                <div className={'my-3 text-center'}>　</div>
                            </Card.Body>
                        </Link>
                    </Card>
                </Col>}
            </Row>
        </Container>
    )
}
