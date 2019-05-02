/**
 * 主页
 * 项目列表，区分公共、有权限两种列表
 */
import React from 'react';
import store from './store';

import {Container, Row, Col, Card} from 'react-bootstrap';

export default class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            projects: []
        };
    }
    render() {
        let t = this;
        return (
            <Container>
                <Row>
                    {t.state.projects.map(({project}) =>
                        <Col md={3} sm={4} key={project.id} className={'mt-4'}>
                            <Card>
                                <Card.Body>
                                    <a href={'#/project/'+project.id}>{project.name}</a>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        )
    }
    
    componentDidMount() {
        let t = this;
        axios.get('/project', {name: '测试哦', type: 0, description: '描述的说法是'}).then((data) => {
            // t.setState({
            //     projects: data
            // });
            console.log(data);
        }).catch((response) => {});
    }
}
