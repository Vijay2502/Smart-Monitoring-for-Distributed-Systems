import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {
    state = {}
    render() {
        return (
            <nav>
                <ul>
                    <li><NavLink to="/projects">About</NavLink></li>
                </ul>
            </nav>);
    }
}

export default Sidebar;