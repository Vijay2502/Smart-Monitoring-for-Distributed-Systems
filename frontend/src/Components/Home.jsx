import React, { Component, Fragment } from 'react';
import Sidebar from './Sidebar';
import {
    Route, Switch, withRouter
} from "react-router-dom";
import Projects from './Projects';
import Files from './Files';
import ProjectView from './ProjectView';
import ProjectStatus from './ProjectStatus';

class Home extends Component {
    state = {}
    render() {
        const { match } = this.props;
        return (
            <Fragment>
                <Sidebar></Sidebar>

                <article>

                    <Switch>
                        <Route path={`${match.path}projects`}>
                            <Projects />
                        </Route>
                        <Route path={`${match.path}files`}>
                            <Files />
                        </Route>
                        <Route path={`${match.path}projectView/:name`}>
                            <ProjectView />
                        </Route>
                        <Route path={`${match.path}projectStatus`}>
                            <ProjectStatus />
                        </Route>

                        <Route path={`${match.path}`}>
                            <Projects />
                        </Route>
                    </Switch>
                </article>
            </Fragment>
        );
    }
}

export default withRouter(Home);