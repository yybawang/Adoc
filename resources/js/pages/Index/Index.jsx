import React from 'react'
import {BrowserRouter, Route, Link} from "react-router-dom";
import axios from '../../configs/axios'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        
        };
    }
    
    componentDidMount() {
    
    }
    
    render() {
        return (
            <div>
                官网展示，，，，展示项目简介等，宣传，github
            </div>
        )
    }
}

export default Index
