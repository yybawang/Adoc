import React, {useEffect, useState} from 'react'
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Editor from "react-editor-md";
import axios from '../../configs/axios'
import {Tips} from "../../configs/function";
import {useObject} from "react-hooks-easy";
import PostCascader from "./PostCascader";

let postId, setPostId, name, setName, parentId, setParentId, editor = {};
export default function PostEdit(props){
    const project = useObject('project');
    [postId, setPostId] = useState(-1);
    [name, setName] = useState('');
    [parentId, setParentId] = useState(0);
    const [parents, setParents] = useState([]);
    const project_id = props.match.params.project_id;
    
    useEffect(() => {
        init();
        return () => {
            editor = {};
            postId = undefined;
            setPostId = undefined;
            name = undefined;
            setName = undefined;
            parentId = undefined;
            setParentId = undefined;
        }
    }, []);
    
    async function init(){
        if(props.match.params.id > 0){
            let res = await axios.get('/post/'+props.match.params.id+'/edit');
            setParents(res.parents);
            setPostId(res.id);
            setName(res.name);
            setParentId(res.pid);
            let interval = setInterval(() => {
                if(editor.id){
                    clearInterval(interval);
                    editor.setMarkdown(res.content);
                }
            }, 100);
        }else{
            setPostId(0);
        }
    }
    
    async function submit(){
        let pid = parentId;
        let content = editor.getMarkdown();
        let res = await axios.post('/post/'+postId, {name,content, pid, project_id});
        setPostId(res.id);
        Tips('已保存');
    }
    
    function back(){
        let url = '/project/'+project_id;
        if(postId){
            url += '/post/'+postId;
        }
        props.history.push(url);
    }
    
    return (
        <div className={'px-5 pt-3 b-5'}>
            <Form onSubmit={(event) => {event.preventDefault()}} onKeyDown={async (e) => {
                let ctrlKey = e.ctrlKey || e.metaKey;
                if( ctrlKey && e.keyCode === 83 ){
                    e.preventDefault();
                    let goBack = false;
                    if(e.shiftKey){
                        goBack = true;
                    }
                    await submit();
                    if(goBack){
                        back();
                    }
                }
            }}>
                <Container fluid className={'p-0'}>
                    <Row noGutters>
                        <Col>
                            <Form.Group>
                                文档名：
                                <Form.Control className={'d-inline'} value={name} onChange={(event) => setName(event.target.value)} style={{width: '180px'}} />
                                <span className={'ml-3'}>上级目录：</span>
                                <PostCascader project_id={project_id} post_id={postId} parents={parents} onChange={(val) => setParentId(val)} />
                                {/*{this.state.parents.map((parent, index) => (
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
                                ))}*/}
                            </Form.Group>
                        </Col>
                        <Col xs={2} className={'text-right'}>
                            <Button type={'submit'} onClick={() => submit()}>保存</Button>
                            <Button variant={'outline-dark'} onClick={() => back()} className={'ml-4'}>返回</Button>
                        </Col>
                    </Row>
                    <Row noGutters>
                        <Col>
                            <Form.Group>
                                {/*<Button variant={'outline-dark'} onClick={() => this.template('api')}>插入API接口模版</Button>*/}
                                {/*<Button variant={'outline-dark'} className={'ml-3'} onClick={() => this.template('table')}>插入数据字典模版</Button>*/}
                                {/*<Button variant={'outline-dark'} className={'ml-3'} onClick={() => TemplateModalShow.dispatch({type: 'show'})}>已保存模版</Button>*/}
                        
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
                            onload: (edit, func) => {
                                // this.setState({editor});
                                edit.removeKeyMap({'Shift-Ctrl-S'(){}});
                                edit.addKeyMap({
                                    'Cmd-S'(){
                                        submit();
                                    },
                                    'Ctrl-S'(){
                                        submit();
                                    },
                                    async 'Shift-Cmd-S'(){
                                        await submit();
                                        back();
                                    },
                                    async 'Shift-Ctrl-S'(){
                                        await submit();
                                        back();
                                    },
                                });
                                editor = edit;
                            },
                            markdown: '\n'
                        }} />
                    </div>
                </Container>
            </Form>
            <p className={'text-muted'}> Ctrl/Cmd + S 保存</p>
            <p className={'text-muted'}> Ctrl/Cmd + Shift + S 保存并返回列表</p>
        </div>
    );
}
