import React, { Component } from 'react';
import store from './store';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Example extends Component {
    // constructor(props){
    //     super(props);
    //
    //     store.dispatch({type: 'inc', num: 1});
    // }
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Example Component</div>

                            <div className="card-body">
                                I'm an example component! {this.props.name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// 指定类型检查默认值
Example.defaultProps = {
    name : 88,
};
// 类型文档  https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html
Example.propTypes = {
    name : PropTypes.number.isRequired,
};


if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
