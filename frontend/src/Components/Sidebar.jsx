import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {
    state = {}
    render() {
        return (
            <nav>
                <ul>
                    <li><NavLink to="/projects">Projects</NavLink></li>
                    <li><NavLink to="/files">Files</NavLink></li>
                    <li><NavLink to="/projectStatus">Project Stats</NavLink></li>
                </ul>
            </nav>);
    }
}

export default Sidebar;