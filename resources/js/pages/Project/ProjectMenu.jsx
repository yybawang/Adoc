import React from 'react'
import {Image ,Nav, Collapse} from "react-bootstrap";
import ListPng from '../../../images/list.png'
import FolderOpenFill from '../../../images/folder open-fill.png'
import FolderFill from '../../../images/folder-fill.png'
import axios from "../../configs/axios";


class ProjectMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts: []
        }
    }
    
    post(id){
        // const as = async function(){
        //     return Promise.resolve("hello async").then(()=>{}).catch(()=>{});
        // };
        // const run = await as();
        axios.get('/menu')
    }
    
    subMenu(posts, padding = 1){
        // logger(posts);
        return (
            <div>
                {posts && posts.length > 0 && (
                    <Nav className={'flex-column'}>
                        {posts.map((post) => (
                            <div key={post.id}>
                                <Nav.Link href={'#/project/'+this.props.project_id+'/post/'+post.id} onSelect={() => {this.post(post.id);post.open = !post.open;}} style={{paddingLeft: padding+'em'}} aria-controls={'collapse_post_'+post.id}>
                                    {post.children.length <= 0 ?
                                        <Image src={ListPng} />
                                        : <Image src={!post.open ? FolderOpenFill : FolderFill} />
                                    }
                                    <span>{post.name}</span>
                                </Nav.Link>
                                {post.children.length > 0 &&
                                    <Collapse in={!post.open}>
                                        <div id={'collapse_post_'+post.id}>
                                        {this.subMenu(Array.from(post.children), padding + 1.7)}
                                        </div>
                                    </Collapse>
                                }
                            </div>
                        ))}
                    </Nav>
                )}
            </div>
        );
    }
    
    render(){
        return this.subMenu(this.props.posts);
    }
    
    componentDidMount() {
        this.setState({
            posts: Array.from(this.props.posts),
        })
    }
}


export default ProjectMenu;
