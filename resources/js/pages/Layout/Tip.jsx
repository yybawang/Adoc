import React from 'react'
import {Tips} from "./store";

class Tip extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: Math.random(),
            show: false,
            messages: [],
        };
        Tips.subscribe(() => {
            this.setState(Tips.getState());
            $('.toast').toast(this.state.show ? 'show' : 'hide');
        });
    }
    
    static close(){
        Tips.dispatch({type: 'hide'});
    }
    
    render() {
        return (
            <div className="toast" role="alert" aria-live="assertive" data-delay={'3000'} aria-atomic="true">
                <div className="toast-header">
                        <strong className="mr-auto">提示</strong>
                        <small> </small>
                        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={() => close()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div className="toast-body">
                    {this.state.messages.map((message, index) => (
                        <div key={index}>{message}</div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Tip;
