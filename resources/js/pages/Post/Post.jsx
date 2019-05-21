import React from 'react'
import Editor from 'react-editor-md'
import axios from '../../configs/axios'
import history from '../../configs/history'
import Template from './Template'
import {Container, Row, Col, Form, Button, Alert, Modal} from "react-bootstrap"
import {Link} from "react-router-dom";
import Select from 'react-select';

class Post extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editor: '',
            post: {
                id: 0,
                name: '',
                parents: [],
            },
            parents: [],
            templateModal: false,
            templates: [],
            templateChecked: 0,
        }
    }
    
    post(id){
        axios.get('/post/'+id+'/edit?project_id='+this.props.match.params.project_id).then((post) => {
            this.setState({post});
        }).catch(()=>{});
    }
    
    selectParents(value, index){
        let post = Object.assign({}, this.state.post);
        post.parents[index].id = value;
        this.setState({post});
        
        // 每次都要重新请求服务器，得到新的父级数据并渲染
        axios.get('/post/'+post.parents[index].id+'/children').then((data) => {
            let parents = post.parents.slice(0, index+1);
            parents = parents.concat(data);
            let post2 = Object.assign({}, this.state.post, {parents});
            this.setState({post: post2});
        }).catch(()=>{})
    }
    
    submit(){
        let last = [...this.state.post.parents].pop();
        let pid = last.id || 0;
        let post = Object.assign({}, this.state.post, {
            content: this.state.editor.getMarkdown(),
            html: this.state.editor.getHTML(),
            pid: pid,
            project_id: this.props.match.params.project_id
        });
        axios.post('/post/'+this.state.post.id, post).then((data) => {
            // 更新一遍内部post数据，新增的时候避免一直认为是添加
            let post = Object.assign({}, this.state.post, {id: data.id});
            this.setState({post});
        }).catch(()=>{})
    }
    
    template(temp){
        let template = '';
        switch (temp) {
            case 'api':
                template = Template.Api();
                break;
            case 'table':
                template = Template.Table();
                break;
            case 'project':
                let index = parseInt(this.state.templateChecked);
                template = this.state.templates[index].content;
                this.setState({templateModal: false});
                break;
        }
        this.state.editor.replaceSelection(template).focus();
    }
    
    templateProject(){
        this.setState({templateModal: true});
        axios.get('/project/'+this.props.match.params.project_id+'/template').then((data) => {
            this.setState({templates: data});
        }).catch(()=>{})
    }
    
    back(){
        return '/project/'+this.props.match.params.project_id + (this.state.post.id > 0 ? '/post/'+this.state.post.id : '');
    }
    
    unbind(){
        $(window).unbind('keydown');
    }
    
    render() {
        return (
            <div className={'px-5 pt-3 b-5'}>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Container fluid className={'p-0'}>
                        <Row noGutters>
                            <Col>
                                <Form.Group>
                                    文档名：
                                    <Form.Control className={'d-inline'} value={this.state.post.name} onChange={(event) => {
                                        let post = Object.assign({}, this.state.post, {name: event.target.value});
                                        this.setState({post});
                                    }} style={{width: '180px'}} />
                                    <span className={'ml-3'}>上级目录：</span>
                                    {this.state.post.parents.length > 0 && this.state.post.parents.map((parent, index) => (
                                        <Form.Control
                                            key={index}
                                            as={'select'}
                                            className={'d-inline mr-2'}
                                            style={{width: '180px'}}
                                            value={parent.id}
                                            onChange={(event) => this.selectParents(event.target.value, index)}>
                                            {parent.siblings.map((option) => (
                                                <option key={option.id} value={option.id}>{option.name}</option>
                                            ))}
                                        </Form.Control>
                                    ))}
                                </Form.Group>
                            </Col>
                            <Col xs={2} className={'text-right'}>
                                <Button type={'submit'} onClick={() => this.submit()}>保存</Button>
                                <Link to={this.back()} className={'ml-4 btn btn-outline-dark'}>返回</Link>
                            </Col>
                        </Row>
                        <Row noGutters>
                            <Col>
                                <Form.Group>
                                    <Button variant={'outline-dark'} onClick={() => this.template('api')}>插入API接口模版</Button>
                                    <Button variant={'outline-dark'} className={'ml-3'} onClick={() => this.template('table')}>插入数据字典模版</Button>
                                    <Button variant={'outline-dark'} className={'ml-3'} onClick={() => this.templateProject()}>已保存模版</Button>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className={'py-2'}>
                            <Editor config={{
                                width: '100%',
                                height: 1000,
                                path: '/editor.md/lib/',
                                emoji: false,
                                imageUploadURL: '/api/upload_md',
                                onload: (editor, func) => {
                                    this.setState({editor});
                                    this.state.post.content && editor.setMarkdown(this.state.post.content);
                                },
                                markdown: '\n'
                            }} />
                        </div>
                    </Container>
                </Form>
                <Modal show={this.state.templateModal} onHide={() => this.setState({templateModal: false})} className={'modal-dialog-scrollable'}>
                    <Modal.Header closeButton>
                        <Modal.Title>选择一个模版</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul style={{listStyle:'decimal'}}>
                            {this.state.templates.map((template, index) => (
                                <li key={template.id} className={'pl-3 my-1'}>
                                    <Form.Check type={'radio'} id={'template_project'+template.id} label={template.name} name={'template_project'} value={index} checked={this.state.templateChecked === index} onChange={(event) => {
                                        this.setState({templateChecked: parseInt(event.target.value)});
                                    }} />
                                </li>
                            ))}
                            
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({templateModal: false})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.template('project')}>
                            插入此模版
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
    
    componentDidMount() {
        let t = this;
        this.post(this.props.match.params.id);
        
        $(window).keydown(function(e){
            // ctrl + s
            let ctrlKey = e.ctrlKey || e.metaKey;
            if( ctrlKey && e.keyCode === 83 ){
                t.submit();
                if(e.shiftKey){
                    history.goBack();
                }
                e.preventDefault();
            }
        });
    }
    
    componentWillUnmount() {
        this.setState = () => {};
        this.unbind();
    }
}

export default Post;
