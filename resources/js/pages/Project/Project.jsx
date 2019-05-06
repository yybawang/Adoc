import React from 'react';
import {Navbar} from 'react-bootstrap'
import ReactMarkdown from 'react-markdown/with-html'
import axios from '../../configs/axios'
import {Container, Row, Col, Nav, Image, Collapse} from "react-bootstrap";

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
                                    <Image src={'/dist/images/list.png'} />
                                    : <Image src={!post.open ? '/dist/images/folder open-fill.png' : '/dist/images/folder-fill.png'} />
                                }
                                <span>{post.name}</span>
                            </Nav.Link>
                            {post.children.length > 0 && (
                                <Collapse in={!post.open}>
                                    <Nav className={'flex-column'}>
                                    {post.children.map((children) => (
                                        <div key={children.id}>
                                        <Nav.Link eventKey={post.id} onSelect={() => {this.post(children.id); children.open = !children.open}} className={'post-link-2'}>
                                            {children.children.length <= 0 ?
                                                <Image src={'/dist/images/list.png'} />
                                                : <Image src={!children.open ? '/dist/images/folder open-fill.png' : '/dist/images/folder-fill.png'} />
                                            }
                                            <span>{children.name}</span>
                                        </Nav.Link>
                                            {children.children.length > 0 && (
                                                <Collapse in={!children.open}>
                                                    <Nav className={'flex-column'}>
                                                        {children.children.map((child) => (
                                                            <Nav.Link key={child.id} eventKey={post.id} onSelect={() => this.post(child.id)} className={'post-link-3'}>
                                                                {child.children.length <= 0 ?
                                                                    <Image src={'/dist/images/list.png'} />
                                                                    : <Image src={!child.open ? '/dist/images/folder open-fill.png' : '/dist/images/folder-fill.png'} />
                                                                }
                                                                <span>{child.name}</span>
                                                            </Nav.Link>
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
