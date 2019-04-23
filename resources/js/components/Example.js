import React, { Component } from 'react';
import store from './store';
import ReactDOM from 'react-dom';

export default class Example extends Component {
    constructor(props){
        super(props);
    
        store.dispatch({type: 'inc', num: 1});
    }
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Example Component</div>

                            <div className="card-body">
                                I'm an example component!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
