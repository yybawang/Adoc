import React, {useEffect, useState} from 'react'
import axios from '../../configs/axios'

export default function ProjectEvent(props){
    const [list, setList] = useState([]);
    useEffect(() => {
        init();
    }, [props.match.params.id]);
    
    async function init(){
        let res = await axios.get('/project/'+props.match.params.id+'/events');
        setList(res);
    }
    
    return (
        <div className={'mt-3'}>
            <ul>
                {list.map((event) => (
                    <li className={'pr-4 my-1'} key={event.id} dangerouslySetInnerHTML={{__html: event.description}} />
                ))}
            </ul>
        </div>
    );
}
