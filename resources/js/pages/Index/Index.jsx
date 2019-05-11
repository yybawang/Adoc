/**
 * 主页
 * 项目列表，区分公共、有权限两种列表
 */
import React from 'react';
import store from './store';
import axios from '../../configs/axios'
import {Container, Row, Col, Card} from 'react-bootstrap';
import {Project} from "../Layout/store";

export default class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            projects: []
        };
        Project.dispatch({type: 'default'});
    }
    render() {
        let t = this;
        return (
            <Container>
                <Row>
                    {t.state.projects.map((project) =>
                        <Col md={3} sm={4} key={project.id} className={{'mt-4': true, 'project-card': true, 'project-share' : (parseInt(project.type) === 1)}}>
                            <Card>
                                <a href={'#/project/'+project.id} title={project.description}>
                                <Card.Body>
                                    <div className={'my-3'}>{project.name}</div>
                                </Card.Body>
                                </a>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        )
    }
    
    componentDidMount() {
        let t = this;
        axios.get('/').then((data) => {
            t.setState({
                projects: data
            });
        }).catch(() => {});
    }
}
