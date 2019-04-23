/**
 * 主页
 * 项目列表，区分公共、有权限两种列表
 */
import React, {Component} from 'react';
import store from './store';

import {Container, Row, Col, Card} from 'react-bootstrap';

export default class Index extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col md={3} sm={4}>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} sm={4}>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} sm={4}>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} sm={4}>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
