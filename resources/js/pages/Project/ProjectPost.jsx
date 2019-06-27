import React, {useEffect, useState} from 'react'
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from '../../configs/axios'
import Editor from 'react-editor-md'
import {useNumber, useObject} from "react-hooks-easy";

export default function ProjectPost(props){
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState({});
    const [config, setConfig] = useState({
        width: '100%',
        path: '/editor.md/lib/',
        imageUploadURL: '/api/upload_md',
        markdown: '',
    });
    const user = useObject('user');
    const postMenuActive = useNumber('postMenuActive');
    
    useEffect(() => {
        postMenuActive.set(props.match.params.post_id);
        init();
    }, [props.match.params.post_id]);
    
    async function init(){
        setOpen(false);
        let res = await axios.get('/post/'+props.match.params.post_id);
        setPost(res);
        setConfig(Object.assign({}, config, {markdown: res.content}));
        setOpen(true);
    }
    
    return (
        <Container fluid className={'p-0'}>
            <Row className={'border-bottom py-3 px-5'} noGutters>
                <Col xs={10}>
                    <h4>{post.name}</h4>
                </Col>
                <Col xs={2} className={'text-right'}>
                    {user.value.id > 0 && (
                        <ButtonGroup>
                            <Link className={'btn btn-outline-dark'} to={'/post/'+props.match.params.id+'/edit/'+props.match.params.post_id}>编辑</Link>
                        </ButtonGroup>
                    )}
                </Col>
            </Row>
            <div className={'py-3 px-5 post-center markdown-body'}>
                {open &&
                <Editor.EditorShow config={config}/>
                }
            </div>
        </Container>
    );
}
