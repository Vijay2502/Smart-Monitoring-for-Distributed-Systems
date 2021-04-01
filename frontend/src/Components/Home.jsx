import React, { Component, Fragment } from 'react';
import Sidebar from './Sidebar';
import {
    Route, Switch, withRouter
} from "react-router-dom";
import Projects from './Projects';

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
                        {/* <Route path={match.path}>
                            <h3>Please select a topic.</h3>
                        </Route> */}
                    </Switch>
                </article>
            </Fragment>
        );
    }
}

export default withRouter(Home);