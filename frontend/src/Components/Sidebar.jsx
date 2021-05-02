import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faChartLine, faFolderOpen, faProjectDiagram } from '@fortawesome/free-solid-svg-icons'

class Sidebar extends Component {
    state = {}
    render() {
        let { pathname } = this.props.location;

        return (
            <nav>
                <ProSidebar className="app-sidebar" style={{ width: "100%" }}>
                    <Menu iconShape="square">
                        <MenuItem className={pathname === "/projects" && "selected"} icon={<FontAwesomeIcon icon={faProjectDiagram} />}><NavLink to="/projects">Projects</NavLink></MenuItem>
                        <MenuItem className={pathname === "/files" && "selected"} icon={<FontAwesomeIcon icon={faFolderOpen} />}><NavLink to="/files">Files</NavLink></MenuItem>
                        <MenuItem className={pathname === "/projectStatus" && "selected"} icon={<FontAwesomeIcon icon={faChartBar} />}><NavLink to="/projectStatus">Project Stats</NavLink></MenuItem>
                        <MenuItem className={pathname === "/clusterData" && "selected"} icon={<FontAwesomeIcon icon={faChartLine} />}><NavLink to="/clusterData">Cluster Data</NavLink></MenuItem>
                        <MenuItem className={pathname === "/applicationData" && "selected"} icon={<FontAwesomeIcon icon={faChartLine} />}><NavLink to="/applicationData">Application Data</NavLink></MenuItem>
                    </Menu>
                </ProSidebar>
            </nav>);
    }
}

export default withRouter(Sidebar);