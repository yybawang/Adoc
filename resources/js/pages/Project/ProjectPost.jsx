import React from 'react'
import {Button, Col, Container, Row} from "react-bootstrap";
import ReactMarkdown from "react-markdown/with-html";
import axios from '../../configs/axios'
import {postId} from './store'

class ProjectPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            post: {},
        };
    }
    
    render(){
        return (
            <Container fluid className={'p-0'}>
                <Row className={'border-bottom py-3 px-5'} noGutters>
                    <Col xs={10}>
                        <h4>{this.state.post.name}</h4>
                    </Col>
                    <Col xs={2} className={'text-right'}>
                        <Button href={'#/post/'+this.props.match.params.id+'/'+this.props.match.params.post_id} variant={'outline-dark'}>编辑</Button>
                    </Col>
                </Row>
                <div className={'py-3 px-5 post-center'}>
                    <ReactMarkdown source={this.state.post.content} escapeHtml={false} />
                </div>
            </Container>
        );
    }
    
    getPost(id){
        postId.dispatch({type: 'set', id: id});
        
        axios.get('/post/'+id).then((post)=>{
            this.setState({post});
        }).catch(()=>{});
    }
    
    componentDidMount () {
        this.getPost(this.props.match.params.post_id);
    }
    
    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.match.params.post_id !== nextProps.match.params.post_id){
            this.getPost(nextProps.match.params.post_id);
        }
    }
}

export default ProjectPost;
