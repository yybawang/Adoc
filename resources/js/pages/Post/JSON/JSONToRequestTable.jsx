import React, {useEffect, useRef, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import {useBoolean} from "react-hooks-easy";
import {FormatMDTable, Tips} from "../../../configs/function";

export default function JSONToRequestTable(props){
    const JsonToRequestTable = useBoolean('JsonToRequestTable');
    const [json, setJson] = useState('');
    const focus = useRef(null);
    
    async function submit(){
        let table = parseJson();
        if(table){
            props.insertContent(table);
            JsonToRequestTable.set(false);
        }
    }
    
    function parseJson(){
        let table =
`| 参数名 | 必选 | 类型 | 说明 | 默认 |
| ------ | ---- | ---- | ---- | ---- |`;
        let jsonObj = '';
        try {
            jsonObj = (new Function("return " + json))();
            if(!jsonObj){
                throw new Error('');
            }
        }catch (e) {
            Tips('JSON 未正常解析', 'error');
            return false
        }
        
        let fields = each(jsonObj);
        for(let i in fields){
            table += fields[i];
        }
        table = FormatMDTable(table);
        table = `
- **传递参数说明**

${table}
`;
        return table;
    }
    
    /**
     * 递归得到json结构
     * 1. 数组只取第一个的结构
     * 2. 动态判断字段类型
     * 3. 如果字段值非空，默认必填
     * @param children
     * @param p
     * @param fields
     * @returns {Array}
     */
    function each(children, p = '', fields = []){
        if(typeof children === 'object'){
            if(typeof children.length === 'number'){
                let p2 = p ?  p + '[]' : '';
                each(children[0], p2, fields);
            }else{
                for(let i in children){
                    let child = children[i], p2 = p ?  p+ '.' + i : i;
                    let type = typeof child === 'object' && typeof child.length === "number" ? 'array' : typeof child;
                    fields.push(`
| ${p2} | ${child || child.length > 0 ? '是' : '否'} | ${type} |    |  　|`);
                    each(child, p2, fields);
                }
            }
        }
        return fields;
    }
    
    return (
        <Form>
            <Modal show={JsonToRequestTable.value} autoFocus={false} size={"lg"} enforceFocus={false} animation={true} scrollable={true} onHide={() => JsonToRequestTable.set(false)} className={'modal-dialog-scrollable'} onEntered={() => {focus.current.focus()}}>
                <Modal.Header closeButton>
                    <Modal.Title>JSON 转参数表格工具</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control ref={focus} as={'textarea'} style={{height:300}} value={json} onChange={(e) => setJson(e.target.value)} placeholder={'粘贴一段json字符串 (无需格式化)'} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => JsonToRequestTable.set(false)}>
                        Close
                    </Button>
                    <Button type={'submit'} onClick={() => {
                        submit();
                        // setJson('');
                    }}>
                        转为表格并添加编辑器
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
}
