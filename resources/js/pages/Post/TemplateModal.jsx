import React from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import {TemplateModalShow} from "./store";
import axios from "../../configs/axios";
import {Tips} from "../../configs/function";

class TemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templates: [],
            templateModal: false,
            templateChecked: 0,
        };
        
        this.templateModal = TemplateModalShow.subscribe(() => {
            this.setState({templateModal: TemplateModalShow.getState()});
        });
    }
    
    templateProject(){
        axios.get('/project/'+this.props.project_id+'/template').then((data) => {
            this.setState({templates: data});
        }).catch(()=>{})
    }
    
    delete(id){
        axios.delete('/project/'+id+'/template').then(() => {
            Tips.dispatch({type: 'success', messages: ['已删除模版']});
            this.templateProject();
        }).catch(()=>{})
    }
    
    add(){
        let content = this.props.onContent();
        axios.post('/project/'+this.props.project_id+'/template', {name: this.props.name, content: content}).then(() => {
            this.templateProject();
        }).catch(()=>{})
    }
    
    render() {
        return (
            <Modal show={this.state.templateModal} autoFocus={false} enforceFocus={false} animation={true} scrollable={true} onHide={() => this.setState({templateModal: false})} className={'modal-dialog-scrollable'}>
                <Modal.Header closeButton>
                    <Modal.Title>选择一个模版</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.templates.length > 0
                        ?
                        <ul style={{listStyle:'decimal'}}>
                            {this.state.templates.map((template, index) => (
                                <li key={template.id} className={'pl-3 pr-5 my-2 position-relative'}>
                                    <Form.Check type={'radio'} id={'template_project'+template.id} label={template.name+' ['+template.created_at+'] '} name={'template_project'} value={index} checked={this.state.templateChecked === index} onChange={(event) => {
                                        this.setState({templateChecked: parseInt(event.target.value)});
                                    }} />
                                    <Button className={'p-0 position-absolute'} style={{right:0, top:0}} size={'sm'} variant={'link'} onClick={() => this.delete(template.id)}>删除</Button>
                                </li>
                            ))}
                        </ul>
                        :
                        <p className={'text-muted'}>还未保存任何模版</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'outline-primary'} onClick={() => {
                        this.add();
                    }}>将当前内容添加为模版</Button>
                    <Button variant="secondary" onClick={() => this.setState({templateModal: false})}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        if(!this.state.templates[this.state.templateChecked]){
                            return;
                        }
                        let template = this.state.templates[this.state.templateChecked].content;
                        this.props.onSubmit(template);
                    }}>
                        插入此模版
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    
    componentDidMount() {
        this.templateProject();
    }
    
    componentWillUnmount() {
        this.setState = () => {};
        this.historyModal();
    }
}

export default TemplateModal
