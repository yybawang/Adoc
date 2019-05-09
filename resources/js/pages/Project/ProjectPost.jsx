import React from 'react'
import {Button, Col, Container, Row} from "react-bootstrap";
import ReactMarkdown from "react-markdown/with-html";
import axios from '../../configs/axios'

class ProjectPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            post: {},
        };
        this.mounted = false;
    }
    
    render(){
        return (
            <Container fluid className={'p-0'}>
                <Row className={'border-bottom py-3 px-5'} noGutters>
                    <Col>
                        <h4>{this.state.post.name}</h4>
                    </Col>
                    <Col className={'text-right'}>
                        <Button href={'#/post/'+this.state.post.id+'/edit'} variant={'outline-dark'}>编辑</Button>
                    </Col>
                </Row>
                <div className={'py-3 px-5'}>
                    <ReactMarkdown source={this.state.post.content} escapeHtml={false} />
                </div>
            </Container>
        );
    }
    
    getPost(id){
        axios.get('/post/'+id).then((post)=>{
            this.setState({post})
        }).catch(()=>{})
    }
    
    componentDidMount () {
        this.mounted = true;
        this.props.history.listen(() => {
            this.mounted && this.getPost(this.props.match.params.post_id);
        });
        this.getPost(this.props.match.params.post_id);
    }
    
    componentWillUnmount() {
        this.mounted = false;
    }
}

export default ProjectPost;
