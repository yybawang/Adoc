import React from 'react'
import {Button, ButtonGroup, Card, Form} from "react-bootstrap";
import history from '../../configs/history'
import axios from '../../configs/axios'
import {HeaderRight} from "../../configs/function";

class ProjectAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            type: 0,
            tags: [],
        };
        
        HeaderRight.dispatch({type: 'none'});
    }
    
    submit(){
        axios.post('/project', this.state).then((project) => {
           history.push('/project/'+project.id);
        }).catch(() => {});
    }
    
    render() {
        return (
            <div className="m-3">
                <Card className={'project-add'}>
                    <Card.Header>新建项目</Card.Header>
                    <Card.Body>
                        <Form onSubmit={(event) => {event.preventDefault()}}>
                            <Form.Group>
                                <Form.Label>项目名</Form.Label>
                                <Form.Control ref={'name'} value={this.state.name} onChange={(event) => this.setState({name: event.target.value})} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>简短描述</Form.Label>
                                <Form.Control value={this.state.description} onChange={(event) => this.setState({description: event.target.value})} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>可见性</Form.Label>
                                <div>
                                <Form.Check type={'radio'} checked={this.state.type === 0} inline custom id={'type0'} name={'type'} value={0} onChange={(event) => this.setState({type: parseInt(event.target.value)})} label={'公共'} />
                                <Form.Check type={'radio'} checked={this.state.type === 1} inline custom id={'type1'} name={'type'} value={1} onChange={(event) => this.setState({type: parseInt(event.target.value)})} label={'私有'} />
                                </div>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <ButtonGroup>
                            <Button onClick={() => this.submit()}>新建</Button>
                            <Button variant={'secondary'} className={'ml-3'} onClick={() => history.goBack()}>返回</Button>
                        </ButtonGroup>
                    </Card.Footer>
                </Card>
            </div>
        )
    }
    
    componentDidMount() {
        this.refs.name.focus();
    }
}

export default ProjectAdd
