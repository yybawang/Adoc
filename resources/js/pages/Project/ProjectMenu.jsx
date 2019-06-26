import React, {useEffect, useState} from 'react'
import {Link, Router} from "react-router-dom";
import {Image ,Nav, Collapse} from "react-bootstrap";
import ListPng from '../../../images/list.png'
import FolderOpenFill from '../../../images/folder open-fill.png'
import FolderFill from '../../../images/folder-fill.png'
import axios from "../../configs/axios";
import {useNumber, useObject} from "react-hooks-easy";

export default function ProjectMenu(props){
    const [list, setList] = useState([]);
    const postMenuActive = useNumber('postMenuActive');
    
    useEffect(() => {
        init();
    }, [props.project_id]);
    
    async function init(){
        let res = await axios.get('/project/'+props.project_id+'/posts');
        setList(res);
    }
    
    function toggle(post){
        post.toggle = !post.toggle;
        postMenuActive.set(post.id);
        setList(list);
    }
    
    function subMenu(posts, padding = 1) {
        return (
            <div className={'project-left-posts'}>
                {posts && posts.length > 0 && (
                    <Nav className={'flex-column'}>
                        {posts.map((post) => (
                            <div key={post.id}>
                                <Link to={'/project/' + props.project_id + '/post/' + post.id}
                                      className={'nav-link' + (Number(post.id) === postMenuActive.value ? ' actived' : '')} onClick={() => {
                                    toggle(post);
                                }} style={{paddingLeft: padding + 'rem'}}>
                                    {post.children.length <= 0 ?
                                        <Image src={ListPng}/>
                                        : <Image src={post.toggle ? FolderOpenFill : FolderFill}/>
                                    }
                                    <span>{post.name}</span>
                                </Link>
                                {post.children.length > 0 &&
                                <Collapse in={post.toggle}>
                                    {subMenu(Array.from(post.children), padding + 1.7)}
                                </Collapse>
                                }
                            </div>
                        ))}
                    </Nav>
                )}
            </div>
        );
    }
    
    return subMenu(list);
}
