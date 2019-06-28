import React, {useEffect, useState} from 'react'
import {Form} from "react-bootstrap";
import axios from '../../configs/axios'
import Cascader from 'rc-cascader';

export default function PostCascader(props){
    const [value, setValue] = useState('');
    const [list, setList] = useState([]);
    const [parents, setParents] = useState([]);
    
    useEffect(() => {
        init();
    }, [props.post_id]);
    
    useEffect(() => {
        setParents(props.parents);
    }, [props.parents]);
    
    async function init(){
        if(props.post_id >= 0){
            let res = await axios.post('/post/'+props.project_id+'/parents/'+props.post_id);
            setList(res);
        }
        
    }
    
    return (
        props.post_id >= 0 &&
        <Cascader options={list}
            value={parents.map(parent => parent.value)}
            changeOnSelect
            onChange={(val, selected) => {
                setParents([...selected]);
                props.onChange([...val].pop());
            }}
            onKeyDown={(e) => {
                if(e.keyCode === 8){
                    let parents2 = [...parents];
                    parents2.splice(parents2.length - 1, 1);
                    setParents(parents2);
                    props.onChange(parents2.length > 0 ? [...parents2].pop().value : 0);
                }
            }}
        >
            <Form.Control readOnly value={parents.map(parent => parent.label).join('/')} className={'d-inline'} style={{width: 300}} />
        </Cascader>
    )
}
