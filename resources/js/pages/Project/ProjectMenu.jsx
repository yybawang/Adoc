import React, {useEffect, useState} from 'react'
import {Link, Router} from "react-router-dom";
import {Image, Nav, Collapse} from "react-bootstrap";
import ListPng from '../../../images/list.svg'
import FolderOpenFill from '../../../images/folder open-fill.svg'
import FolderFill from '../../../images/folder-fill.svg'
import axios from "../../configs/axios";
import {useBoolean, useNumber, useObject} from "react-hooks-easy";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

export default function ProjectMenu(props) {
    const refreshProjectMenu = useBoolean('refreshProjectMenu', false);
    const [list, setList] = useState([]);
    const postMenuActive = useNumber('postMenuActive');
    
    useEffect(() => {
        init();
        return () => {
            postMenuActive.set(0);
        }
    }, [props.project_id]);
    
    useEffect(() => {
        refreshProjectMenu.value && init();
    }, [refreshProjectMenu.value]);
    
    async function init() {
        let res = await axios.get('/project/' + props.project_id + '/posts');
        setList(res);
    }
    
    function toggle(post) {
        post.toggle = !post.toggle;
        postMenuActive.set(post.id);
        setList(list);
    }
    
    async function drag(e, posts){
        if(!e.destination || e.destination.index === e.source.index){
            return;
        }
        let arr = posts;
        const [remove] = arr.splice(e.source.index, 1);
        arr.splice(e.destination.index, 0, remove);
        setList(list);
        // 得到两个index，互换
        let pid = posts.slice(0, 1).shift().pid;
        let res = await axios.post('/post/' + props.project_id + '/sort', {pid, index_from: e.source.index, index_to: e.destination.index});
        // it's hack 必须重新设置一次，不然拖动二级排序，之前的会还原
        setList(res);
    }
    
    function subMenu(posts, padding = 1) {
        return (
            <div className={'project-left-posts'}>
                {posts && posts.length > 0 && (
                    <Nav className={'flex-column'}>
                        <DragDropContext
                            onDragEnd={(e) => drag(e, posts)}
                        >
                            <Droppable droppableId={'list_parent_'+padding}>
                                {(provided, snapshot) =>
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {posts.map((post, index) => (
                                            <Draggable key={post.id} draggableId={'list_'+post.id} index={index}>
                                                {(p, snapshot) =>
                                                    <div
                                                        ref={p.innerRef}
                                                        {...p.draggableProps}
                                                        {...p.dragHandleProps}
                                                        key={post.id}>
                                                        <Link to={'/project/' + props.project_id + '/post/' + post.id}
                                                              className={'nav-link' + (Number(post.id) === postMenuActive.value || snapshot.isDragging ? ' actived' : '')}
                                                              onClick={() => {
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
                                                            {subMenu(Array.from(post.children), padding + 1.5)}
                                                        </Collapse>
                                                        }
                                                        {p.placeholder}
                                                    </div>
                                                }
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                }
                            </Droppable>
                        </DragDropContext>
                    </Nav>
                )}
            </div>
        );
    }
    
    return (
                        subMenu(list)
    );
}
