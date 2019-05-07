import React from 'react';
import {Navbar} from 'react-bootstrap'
import ReactMarkdown from 'react-markdown/with-html'
import axios from '../../configs/axios'
import {Container, Row, Col, Nav, Image, Collapse} from "react-bootstrap";
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
        logger(id);
        axios.get('/post/'+id).then((post)=>{
            t.setState({post})
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div>
                <div className={'float-left position-sticky overflow-auto project-left'}>
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
                                                            <Nav.Link eventKey={child.id} onSelect={() => this.post(child.id)} className={'post-link-3'}>
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
                    <h4 className={'py-3 border-bottom'}>{this.state.post.name}</h4>
                    <ReactMarkdown className={'mt-3'} source={this.state.post.content} escapeHtml={false} />
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        axios.get('/'+this.props.match.params.id).then((data) => {
            let state = Object.assign({}, this.state, data);
            this.setState(state);
        }).catch(()=>{})
    }
}

export default Project;
