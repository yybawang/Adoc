import React from 'react'
import Editor from 'react-editor-md'
import PostTemplate from './PostTemplate'
import {Container, Row, Col, Form, Button, Alert, Modal} from "react-bootstrap"
import {BrowserRouter, Route, Link} from "react-router-dom";
import history from '../../configs/history'
import axios from '../../configs/axios'
import TemplateModal from "./TemplateModal";
import {TemplateModalShow} from "./store";
import {HeaderRight} from "../../configs/function";

/**
 * 添加文档
 * 1、ctrl + s 保存， ctrl + shift + s 保存并返回
 * 2、预定义模版、自定义模版
 * 3、历史对比
 */
class PostEdit extends React.Component {
    constructor(props) {
        super(props);
        this.editor = '';
        this.state = {
            template: '',
            templateModal: false,
            histories: [],
            parents: [],
            post: {
                id: 0,
                name: '',
                content: '',
                parents: [],
                pid: 0,
                status: 1,
            },
        };
        HeaderRight.dispatch({type: 'none'});
    }
    
    template(temp){
        let template = '';
        switch (temp) {
            case 'api':
                template = PostTemplate.Api();
                break;
            case 'table':
                template = PostTemplate.Table();
                break;
            case 'project':
                template = this.state.template;
                TemplateModalShow.dispatch({type: 'hide'});
                break;
        }
        this.editor.focus().replaceSelection(template);
    }
    
    content(){
        let post = Object.assign({}, this.state.post, {content: this.editor.getMarkdown()});
        this.setState({post});
    }
    
    post(id){
        axios.get('/post/'+id+'/edit').then((post) => {
            this.setState({post});
            let interval = setInterval(() => {
                if(this.editor){
                    clearInterval(interval);
                    this.editor.setMarkdown(post.content);
                }
            }, 100);
            // 继续请求父级
            let promise = [];
            if(post.parents.length === 0){
                post.parents.push(0);
            }
            for(let i in post.parents){
                promise.push(this.parent(post.parents[i], i));
            }
            let parents = [];
            for(let i in promise){
                promise[i].then((res) => parents[i] = res);
            }
            
            // hack 一下，异步延迟问题
            let interval2 = setInterval(() => {
                if(parents.length >= promise.length){
                    clearInterval(interval2);
                    this.setState({parents: parents});
                    
                }
            }, 100);
            
        }).catch(()=>{})
    }
    
    async parent(id){
        return await axios.get('/post/'+this.state.post.project_id+'/'+id+'/parent');
    }
    
    children(id, index = 0){
        let parents = Array.from(this.state.parents).slice(0, index+1);
        if(id === ''){
            this.setState({parents});
            return;
        }
        axios.get('/post/'+this.state.post.project_id+'/'+id+'/children').then((res) => {
            if(res.length <= 0){
                return;
            }
            parents = parents.concat([res]);
            this.setState({parents});
        }).catch(()=>{})
    }
    
    submit(){
        let parents = [...this.state.post.parents];
        logger(parents);
        let post = {
            pid: parents.pop() || parents.pop() || 0,
            project_id: this.state.post.project_id,
            name: this.state.post.name,
            content: this.editor.getMarkdown(),
            status: this.state.post.status,
        };
    
        axios.patch('/post/'+this.state.post.id, post).then((res) => {
            let post = {
                id: res.id,
                project_id: res.project_id,
            };
            this.setState({post});
        }).catch(()=>{});
    }
    
    back(){
        history.push('/project/' + this.state.post.project_id+ '/post/'+this.state.post.id);
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
                                    {this.state.parents.map((parent, index) => (
                                        <Form.Control
                                            key={index}
                                            as={'select'}
                                            className={'d-inline mr-2'}
                                            style={{width: '180px'}}
                                            value={this.state.post.parents[index]}
                                            onChange={(event) => {
                                                let parents = [...this.state.post.parents];
                                                parents.splice(index, 1, event.target.value);
                                                let post = Object.assign({}, this.state.post, {parents});
                                                this.setState({post});
                                                this.children(event.target.value, index)
                                            }}>
                                            {parent.map((option) => (
                                                <option key={option.id} value={option.id}>{option.name}</option>
                                            ))}
                                        </Form.Control>
                                    ))}
                                </Form.Group>
                            </Col>
                            <Col xs={2} className={'text-right'}>
                                <Button type={'submit'} onClick={() => this.submit()}>保存</Button>
                                <Button variant={'outline-dark'} onClick={() => this.back()} className={'ml-4'}>返回</Button>
                            </Col>
                        </Row>
                        <Row noGutters>
                            <Col>
                                <Form.Group>
                                    <Button variant={'outline-dark'} onClick={() => this.template('api')}>插入API接口模版</Button>
                                    <Button variant={'outline-dark'} className={'ml-3'} onClick={() => this.template('table')}>插入数据字典模版</Button>
                                    <Button variant={'outline-dark'} className={'ml-3'} onClick={() => TemplateModalShow.dispatch({type: 'show'})}>已保存模版</Button>
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
                                    // this.setState({editor});
                                    this.editor = editor;
                                },
                                markdown: '\n'
                            }} />
                        </div>
                    </Container>
                </Form>
                {this.state.post.project_id &&
                    <TemplateModal project_id={this.state.post.project_id} name={this.state.post.name} content={this.state.post.content} onContent={() => this.content()} onSubmit={(template) => {
                        this.setState({template});
                        setTimeout(()=>{
                            this.template('project');
                        }, 100);
                        
                    }} />
                }
                <p className={'text-muted'}> Ctrl/Cmd + S 保存</p>
                <p className={'text-muted'}> Ctrl/Cmd + Shift + S 保存并返回列表</p>
            </div>
        )
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
                    t.back();
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

export default PostEdit
