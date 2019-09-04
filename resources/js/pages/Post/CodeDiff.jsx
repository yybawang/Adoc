import React from 'react'
import PropTypes from 'prop-types'
import {createPatch} from 'diff'
import {Diff2Html} from 'diff2html'
import 'highlight.js/styles/googlecode.css'
import 'diff2html/dist/diff2html.css'

export default function CodeDiff(props){
    
    function createdHtml (oldString, newString, context, outputFormat){
        function hljs (html) {
            return html.replace(/<span class="d2h-code-line-ctn">(.+?)<\/span>/g, '<span class="d2h-code-line-ctn"><code>$1</code></span>')
        }
        let args = ['', oldString || '', newString || '', '', '', {context: context}]
        let dd = createPatch(...args)
        let outStr = Diff2Html.getJsonFromDiff(dd, {inputFormat: 'diff', outputFormat: outputFormat, showFiles: false, matching: 'lines'})
        let html = Diff2Html.getPrettyHtml(outStr, {inputFormat: 'json', outputFormat: outputFormat, showFiles: false, matching: 'lines'})
        return hljs(html)
    }

    function html() {
        const {oldStr, newStr, context, outputFormat}  = props;
        return createdHtml(oldStr, newStr, context, outputFormat);
    }
    return <div id="code-diff" dangerouslySetInnerHTML={{__html: html()}} />;
}

CodeDiff.propTypes = {
    oldStr: PropTypes.string.isRequired,
    newStr: PropTypes.string.isRequired,
    context: PropTypes.number,
    outputFormat: PropTypes.string
};

CodeDiff.defaultProps = {
    oldStr: '',
    newStr: '',
    context: 99999,
    outputFormat: 'side-by-side'
};

