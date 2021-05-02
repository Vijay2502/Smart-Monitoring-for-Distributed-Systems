import React, { Component, Fragment } from 'react';
import Sidebar from './Sidebar';
import {
    Route, Switch, withRouter
} from "react-router-dom";
import Projects from './Projects';
import Files from './Files';
import ProjectView from './ProjectView';
import ProjectStatus from './ProjectStatus';
import FileView from './FileView';
import ClusterData from './ClusterData';
import ApplicationData from './ApplicationData';

class Home extends Component {
    state = {}
    render() {
        const { match } = this.props;
        return (
            <Fragment>
                <Sidebar></Sidebar>

                <article className="content">

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
                        <Route path={`${match.path}fileView`}>
                            <FileView />
                        </Route>
                        <Route path={`${match.path}clusterData`}>
                            <ClusterData />
                        </Route>
                        <Route path={`${match.path}applicationData`}>
                            <ApplicationData />
                        </Route>

                        <Route path={`${match.path}`}>
                            <Projects />
                        </Route>
                    </Switch>


                    <footer className="footer">
                        <p>A Project by Akshit Ahuja, Ayushman Mittal, Chaitanya Naik & Vijay Ghanshani</p>
                        <p>San Jose State University - MS Software Engineering</p>
                        <p>Under the guidance of Prof. Younghee Park</p>

                    </footer>
                </article>
            </Fragment>
        );
    }
}

export default withRouter(Home);