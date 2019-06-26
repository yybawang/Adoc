/**
 * 主页
 * 项目列表，区分公共、有权限两种列表
 */
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from '../../configs/axios'
import {Container, Row, Col, Card} from 'react-bootstrap';

export default function ProjectList(props){
    const [list, setList] = useState([]);
    
    useEffect(() => {
        init();
    }, []);
    
    async function init(){
        let res = await axios.get('/');
        setList(res);
    }
    
    return (
        <Container>
            <Row className={'align-items-center'}>
                {list.map((project) =>
                    <Col md={3} sm={4} key={project.id} className={{'mt-4': true, 'project-card': true, 'project-share' : project.share}}>
                        <Card className={'shadow-sm'}>
                            <Link to={'/project/'+project.id} title={project.description}>
                            <Card.Body>
                                <div className={'my-3 text-center'}>{project.name}</div>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    )
}
