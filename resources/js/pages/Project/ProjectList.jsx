/**
 * 主页
 * 项目列表，区分公共、有权限两种列表
 */
import React from 'react';
import {Link} from "react-router-dom";
import axios from '../../configs/axios'
import {Container, Row, Col, Card} from 'react-bootstrap';

export default class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            projects: []
        };
    }
    
    componentDidMount() {
        axios.get('/').then((data) => {
            this.setState({
                projects: data
            });
        }).catch(() => {});
    }
    
    render() {
        let t = this;
        return (
            <Container>
                <Row className={'align-items-center'}>
                    {t.state.projects.map((project) =>
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
}
