import React from 'react'
import {BrowserRouter, Route, Link} from "react-router-dom";
import {Button, Form, Modal} from "react-bootstrap";
import axios from '../../configs/axios'
import {HistoryModalShow} from "./store";
import {Tips} from "../../configs/function";
import CodeDiff from '../../configs/code_diff';

class HistoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            checked: '',
            histories: [],
            
            history_show: false,
            history_content: '',
            now_content: '',
        };
        
        this.historyModal = HistoryModalShow.subscribe(() => {
            this.setState({show: HistoryModalShow.getState()});
        })
    }
    
    history(){
        axios.get('/post/'+this.props.post_id+'/history').then((histories) => {
            this.setState({histories});
        }).catch(()=>{})
    }
    
    view(index) {
        if (!index || !this.state.histories[index]) {
            return;
        }
        
        let content = this.props.onContent();
        logger(content);
        logger(this.state.histories[index].content);
        this.setState({now_content: content, history_content: this.state.histories[index].content, show_history: true});
    }
    
    delete(id){
        axios.delete('/post/'+id+'/history').then(() => {
            Tips.dispatch({type: 'success', messages: ['已删除历史']});
            this.history();
        }).catch(()=>{})
    }
    
    render() {
        return (
            <div>
                <Modal show={this.state.show} scrollable={true} onHide={() => this.setState({show: false})} className={'modal-dialog-scrollable'}>
                    <Modal.Header closeButton>
                        <Modal.Title>选择一个历史</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.histories.length > 0
                            ?
                            <ul style={{listStyle:'decimal'}}>
                                {this.state.histories.map((history, index) => (
                                    <li key={history.id} className={'pl-3 pr-5 my-2 position-relative'}>
                                        <Form.Check type={'radio'} id={'template_project'+history.id} label={history.user.name+'修改于 '+history.created_at} name={'template_project'} value={index} checked={this.state.checked === index} onChange={(event) => {
                                            this.setState({checked: parseInt(event.target.value)});
                                            this.view(event.target.value)
                                        }} />
                                        <Button className={'p-0 position-absolute'} style={{right:0, top:0}} size={'sm'} variant={'link'} onClick={() => this.delete(history.id)}>删除</Button>
                                    </li>
                                ))}
                            </ul>
                            :
                            <p className={'text-muted'}>未发现历史记录</p>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({show: false})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.view(this.state.checked)}>
                            查看
                        </Button>
                    </Modal.Footer>
                </Modal>
                
                
                <Modal show={this.state.show_history} scrollable={true} onHide={() => this.setState({show_history: false})} className={'modal-dialog-scrollable'} size={'lg'}>
                    <Modal.Header closeButton>
                        <Modal.Title>历史记录与当前对比</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CodeDiff oldStr={this.state.history_content} newStr={this.state.now_content }/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({show_history: false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
    
    componentDidMount() {
        this.history();
    }
    
    componentWillUnmount() {
        this.setState = () => {};
        this.historyModal();
    }
}

export default HistoryModal
