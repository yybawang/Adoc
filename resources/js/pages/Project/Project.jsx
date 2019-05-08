import React from 'react';
import ReactMarkdown from 'react-markdown/with-html'
import axios from '../../configs/axios'
import {Container, Row, Col, Button, Nav, Image, Collapse} from "react-bootstrap";
import {ProjectName} from "../Layout/store";
import ListPng from '../../../images/list.png'
import FolderOpenFill from '../../../images/folder open-fill.png'
import FolderFill from '../../../images/folder-fill.png'

class Project extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            project: {},
            posts: [],
            events: [],
            post: {},
        }
    }
    
    post(id){
        let t = this;
        axios.get('/post/'+id).then((post)=>{
            t.setState({post})
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div>
                <div className={'float-left position-sticky overflow-auto border-right project-left'}>
                    <Nav defaultActiveKey={this.state.posts.length && this.state.posts.slice(0,1).shift().id} className="flex-column">
                        {this.state.posts.map((post) => (
                            <div key={post.id}>
                            <Nav.Link eventKey={post.id} onSelect={() => {this.post(post.id); post.open = !post.open}}>
                                {post.children.length <= 0 ?
                                    <Image src={ListPng} />
                                    : <Image src={!post.open ? FolderOpenFill : FolderFill} />
                                }
                                <span>{post.name}</span>
                            </Nav.Link>
                            {post.children.length > 0 && (
                                <Collapse in={!post.open}>
                                    <Nav className={'flex-column'}>
                                    {post.children.map((children) => (
                                        <div key={children.id}>
                                        <Nav.Link eventKey={children.id} onSelect={() => {this.post(children.id); children.open = !children.open}} className={'post-link-2'}>
                                            {children.children.length <= 0 ?
                                                <Image src={ListPng} />
                                                : <Image src={!children.open ? FolderOpenFill : FolderFill} />
                                            }
                                            <span>{children.name}</span>
                                        </Nav.Link>
                                            {children.children.length > 0 && (
                                                <Collapse in={!children.open}>
                                                    <Nav className={'flex-column'}>
                                                        {children.children.map((child) => (
                                                            <div key={child.id}>
                                                            <Nav.Link eventKey={child.id} onSelect={() => {this.post(child.id);child.open = !child.open}} className={'post-link-3'}>
                                                                {child.children.length <= 0 ?
                                                                    <Image src={ListPng} />
                                                                    : <Image src={!child.open ? FolderOpenFill : FolderFill} />
                                                                }
                                                                <span>{child.name}</span>
                                                            </Nav.Link>
                                                                {child.children.length > 0 && (
                                                                    <Collapse in={!child.open}>
                                                                        <Nav className={'flex-column'}>
                                                                            {child.children.map((child_sub) => (
                                                                                <div key={child_sub.id}>
                                                                                    <Nav.Link eventKey={child_sub.id} onSelect={() => this.post(child_sub.id)} className={'post-link-4'}>
                                                                                        <Image src={ListPng} />
                                                                                        <span>{child_sub.name}</span>
                                                                                    </Nav.Link>
                                                                                </div>
                                                                            ))}
                                                                        </Nav>
                                                                    </Collapse>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </Nav>
                                                </Collapse>
                                            )}
                                        </div>
                                    ))}
                                    </Nav>
                                </Collapse>
                            )}
                            </div>
                        ))}
                    </Nav>
                </div>
                <div className={'float-left project-right'}>
                    {this.state.post.id ? (
                        <Container fluid className={'p-0'}>
                            <Row className={'border-bottom p-3'} noGutters>
                                <Col>
                                    <h4>{this.state.post.name}</h4>
                                </Col>
                                <Col className={'text-right'}>
                                    <Button href={'#/post/'+this.state.post.id+'/edit'} size={'sm'} variant={'outline-dark'}>编辑</Button>
                                </Col>
                            </Row>
                            <div className={'p-3'}>
                                <ReactMarkdown source={this.state.post.content} escapeHtml={false} />
                            </div>
                        </Container>
                        ): (
                        <div className={'mt-3'}>
                            <ul>
                            {this.state.events.map((event) => (
                                <li className={'pr-4 my-1'} key={event.id} dangerouslySetInnerHTML={{__html: event.description}} />
                            ))}
                            </ul>
                        </div>
                        )}
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        axios.get('/project/'+this.props.match.params.id).then((data) => {
            let state = Object.assign({}, this.state, data);
            this.setState(state);
            // 设置左上角显示名
            ProjectName.dispatch({type: 'set', name: state.project.name});
        }).catch(()=>{})
    }
}

export default Project;
