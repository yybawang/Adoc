import React from 'react'
import {Form} from "react-bootstrap";


class PostSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            post_id: 0,
        };
    }
    
    toggle(post){
        post.toggle = !post.toggle;
        this.props.onChange(this.props.posts);
    }
    
    select(posts, padding = 1){
        return (
            <span>
                <Form.Control
                    key={index}
                    as={'select'}
                    className={'d-inline mr-2'}
                    style={{width: '180px'}}
                    value={parent.id}
                    onChange={(event) => {
                        this.children(event.target.value, index)
                    }}>
                    {parent.children.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </Form.Control>
            </span>
        );
    }
    
    render(){
        return this.select(this.props.posts);
    }
}


export default PostSelect;
