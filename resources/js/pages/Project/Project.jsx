import React, {useEffect, useState} from 'react'
import {Route, Link, Switch} from "react-router-dom";
import {ListGroup, Image, ButtonGroup, Dropdown, Button, DropdownButton} from "react-bootstrap";
import SettingSvg from '../../../images/setting.svg'
import SettingWhiteSvg from '../../../images/settingWhite.svg'
import AddSvg from '../../../images/add.svg'
import AddWhiteSvg from '../../../images/addWhite.svg'
import ExportSvg from '../../../images/export.svg'
import ExportWhiteSvg from '../../../images/exportWhite.svg'
import ProjectMenu from "./ProjectMenu";
import ProjectPost from "./ProjectPost";
import axios from '../../configs/axios'
import {useNumber, useObject} from "react-hooks-easy";
import ProjectEvent from "./ProjectEvent";
import ProjectExport from "./ProjectExport";
import PostHistory from "../Post/PostHistory";

export default function Project(props) {
    const project = useObject('project');
    const user = useObject('user');
    const postMenuActive = useNumber('postMenuActive', 0);
    const [addImage, setAddImage] = useState(AddSvg);
    const [settingImage, setSettingImage] = useState(SettingSvg);
    const [exportImage, setExportImage] = useState(ExportSvg);

    useEffect(() => {
        init();
        return () => {
            project.reInitial({});
        }
    }, [props.match.params.id]);
    
    async function init() {
        let res = await axios.get('/project/' + props.match.params.id);
        project.reInitial(res);
    }
    
    return (
        <div className="project d-flex align-items-start">
            <div className={'position-sticky overflow-auto border-right project-left'}>
                <ListGroup>
                    <ListGroup.Item variant={'light'} className={'d-flex text-dark'}>
                        <ButtonGroup className={'h4 mr-auto text-truncate'}
                                     title={project.value.name}>{project.value.name}</ButtonGroup>
                        {user.value.id > 0 &&
                        <DropdownButton variant={'link'} id={'manager'} title={'管理'}>
                            {project.value.write &&<Dropdown.Item onMouseEnter={() => setAddImage(AddWhiteSvg)} onMouseLeave={() => setAddImage(AddSvg)} onClick={() => props.history.push('/post/' + props.match.params.id + '/edit/0')}>
                                <Image src={addImage} style={{width: 15, paddingBottom: '4px'}} /> 新文档
                            </Dropdown.Item>}
                            {project.value.admin && <Dropdown.Item onMouseEnter={() => setSettingImage(SettingWhiteSvg)} onMouseLeave={() => setSettingImage(SettingSvg)} onClick={() => props.history.push('/project_manager/' + props.match.params.id)}>
                                <Image src={settingImage} style={{width: 15, paddingBottom: '4px'}} /> 设置
                            </Dropdown.Item>}
                            <Dropdown.Item onMouseEnter={() => setExportImage(ExportWhiteSvg)} onMouseLeave={() => setExportImage(ExportSvg)} onClick={() => props.history.push(props.match.url + '/export')}>
                                <Image src={exportImage} style={{width: 15, paddingBottom: '4px'}} /> 导出
                            </Dropdown.Item>
                        </DropdownButton>
                        }
                    </ListGroup.Item>
                </ListGroup>
                <ProjectMenu project_id={props.match.params.id}/>
            </div>
            <div className={'project-right'}>
                <Switch>
                <Route path={props.match.path} exact component={ProjectEvent}/>
                <Route path={props.match.path + '/post/:post_id'} component={ProjectPost}/>
                <Route path={props.match.path + '/history/:post_id'} component={PostHistory}/>
                <Route path={props.match.path + '/export'} component={ProjectExport}/>
                </Switch>
            </div>
        </div>
    );
}
