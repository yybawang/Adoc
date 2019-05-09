import React from 'react'
import {Image ,Nav, Collapse} from "react-bootstrap";
import ListPng from '../../../images/list.png'
import FolderOpenFill from '../../../images/folder open-fill.png'
import FolderFill from '../../../images/folder-fill.png'


class ProjectMenuSub extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <Nav defaultActiveKey={this.props.posts.length && this.props.posts.slice(0,1).shift().id}  className="flex-column">
                {this.props.posts.map((post) => (
                    <div key={post.id}>
                        <Nav.Link href={'#/project/'+this.props.project_id+'/post/'+post.id} onSelect={() => post.open = !post.open}>
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
                                            <Nav.Link href={'#/project/'+this.props.project_id+'/post/'+children.id} className={'post-link-2'}>
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
                                                                <Nav.Link href={'#/project/'+this.props.project_id+'/post/'+child.id} className={'post-link-3'}>
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
                                                                                    <Nav.Link href={'#/project/'+this.props.project_id+'/post/'+child_sub.id} className={'post-link-4'}>
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
        );
    }
}


export default ProjectMenuSub;
