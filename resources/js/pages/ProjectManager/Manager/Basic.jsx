import React from 'react'
import axios from '../../../configs/axios'
import {Button, Form} from "react-bootstrap";
import {Active} from "../store";

class Basic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {name: '', description: ''},
        };
    }
    
    submit() {
        axios.patch('/project/' + this.props.match.params.id, this.state.project).then((project) => {
            this.setState({project})
        }).catch(()=>{})
    }
    
    
    render() {
        return (
            <div>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Form.Group>
                        <Form.Label>项目名</Form.Label>
                        <Form.Control value={this.state.project.name} onChange={(event)=> {
                            let project = Object.assign({}, this.state.project, {name: event.target.value});
                            this.setState({project});
                        }} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>项目描述</Form.Label>
                        <Form.Control as={'textarea'} value={this.state.project.description} onChange={(event)=> {
                            let project = Object.assign({}, this.state.project, {description: event.target.value});
                            this.setState({project});
                        }} />
                    </Form.Group>
                    <Form.Group>
                        <Button type={'submit'} onClick={() => this.submit()}>修改</Button>
                    </Form.Group>
                </Form>
            </div>
        )
    }
    
    componentDidMount() {
        axios.get('/project/'+this.props.match.params.id+'/edit').then((project) => {
            this.setState({project});
        }).catch(()=>{})
        Active.dispatch({type: 'set', page: 'basic'});
    }
}

export default Basic
