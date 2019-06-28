import React, {useEffect, useState} from 'react'
import {Button, ButtonGroup, Col, Container, Dropdown, Form, OverlayTrigger, Popover, Row} from "react-bootstrap";
import Editor from "react-editor-md";
import axios from '../../configs/axios'
import {Tips} from "../../configs/function";
import {useBoolean, useObject} from "react-hooks-easy";
import PostCascader from "./PostCascader";
import PostTemplate from "./PostTemplate";
import PostSavedTemplate from "./PostSavedTemplate";
import PostAddTemplate from "./PostAddTemplate";

window.editormd.defaults.toolbarIconsClass['template'] = 'fa-circle';
window.editormd.defaults.toolbarHandlers['template'] = () => {alert(1)};
let postId, setPostId, name, setName, parentId, setParentId, sort, setSort, editor = {};
export default function PostEdit(props){
    const project = useObject('project');
    const templateShow = useBoolean('postSavedTemplate', false);
    const postAddTemplate = useBoolean('postAddTemplate', false);
    [postId, setPostId] = useState(-1);
    [name, setName] = useState('');
    [parentId, setParentId] = useState(0);
    [sort, setSort] = useState(100);
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
            setSort(res.sort);
            let interval = setInterval(() => {
                if(editor.id){
                    clearInterval(interval);
                    editor.setMarkdown(res.content);
                }
            }, 100);
        }else{
            setPostId(0);
            if(props.location.search){
                let from = props.location.search.split('=')[1];
                let res = await axios.get('/post/'+from);
                let interval = setInterval(() => {
                    if(editor.id){
                        clearInterval(interval);
                        editor.setMarkdown(res.content);
                    }
                }, 100);
            }
        }
    }
    
    async function submit(){
        let pid = parentId;
        let content = editor.getMarkdown();
        let html = editor.getHTML();
        let res = await axios.post('/post/'+postId, {name,content, html, pid, project_id, sort});
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
    
    async function del(){
        await axios.delete('/post/'+postId);
        Tips('删除完成');
        props.history.replace('/project/'+project_id);
    }
    
    function insertTemplate(type){
        let temp = '';
        switch (type) {
            case 'api':
                temp = PostTemplate.Api();
                break;
            case 'table':
                temp = PostTemplate.Table();
                break;
        }
        editor.focus().replaceSelection(temp);
    }
    
    return (
        <div className={'px-5 pt-3 b-5'}>
            <Form onSubmit={(event) => {event.preventDefault()}}>
                <Container fluid className={'p-0'}>
                    <Row noGutters onKeyDown={async (e) => {
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
                        <Col>
                            <Form.Group>
                                文档名：
                                <Form.Control className={'d-inline'} value={name} onChange={(event) => setName(event.target.value)} style={{width: '180px'}} />
                                <span className={'ml-3'}>上级目录：</span>
                                <PostCascader project_id={project_id} post_id={postId} parents={parents} onChange={(val) => setParentId(val)} />
                                <span className={'ml-3'}>排序：</span>
                                <Form.Control className={'d-inline'} value={sort} onChange={(event) => setSort(event.target.value)} style={{width: '80px'}} />
                            </Form.Group>
                        </Col>
                        <Col xs={3} className={'text-right'}>
                            <OverlayTrigger trigger="focus" placement="left" overlay={
                                <Popover id="popover-basic" title="确认删除？此操作不可恢复">
                                    <div className={'py-2'}>删除文档<strong>「{name}」</strong></div>
                                    <ButtonGroup>
                                        <Button variant={'danger'} size={'sm'} onClick={() => del()}>删除</Button>
                                    </ButtonGroup>
                                </Popover>
                            }>
                                <Button variant={'link'} className={'mr-3'}>删除</Button>
                            </OverlayTrigger>
                            <Dropdown as={ButtonGroup}>
                                <Button type={'submit'} onClick={() => submit()}>保存</Button>
        
                                <Dropdown.Toggle split variant="primary" />
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => postAddTemplate.set(true)}>另存为模版</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button variant={'outline-dark'} onClick={() => back()} className={'ml-4'}>返回</Button>
                        </Col>
                    </Row>
                    <Row noGutters>
                        <Col>
                            <Form.Group>
                                <Button variant={'outline-dark'} onClick={() => insertTemplate('api')}>插入API接口模版</Button>
                                <Button variant={'outline-dark'} className={'ml-3'} onClick={() => insertTemplate('table')}>插入数据字典模版</Button>
                                <Button variant={'outline-dark'} className={'ml-3'} onClick={() => templateShow.set(true)}>已保存模版</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className={'py-2'}>
                        <Editor config={{
                            width: '100%',
                            height: 1000,
                            path: '/editor.md/lib/',
                            // emoji: false,
                            imageUploadURL: '/api/upload_md',
                            editorTheme: 'default',
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
            <PostSavedTemplate project_id={project_id} onSubmit={(template) => {
                editor.focus().replaceSelection(template);
            }} />
            <PostAddTemplate project_id={project_id} getContent={() => editor.getMarkdown()} />
            <p className={'text-muted'}>焦点定于任意输入框中可使用快捷键操作</p>
            <p className={'text-muted'}>Ctrl/Cmd + S 保存</p>
            <p className={'text-muted'}>Ctrl/Cmd + Shift + S 保存并返回列表</p>
        </div>
    );
}
