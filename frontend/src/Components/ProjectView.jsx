import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";
import { withRouter } from 'react-router';

class ProjectView extends Component {
    state = {
        projectList: []
    }

    componentDidMount = async () => {
        const { name } = this.props.match?.params;
        try {
            const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getProjects`);

            this.setState((oldState) => {
                return { projectList: result.data?.projects.find(a => a.name === name) };
            })

        } catch (error) {
            alert(error);
        }
    }

    render() {
        const { name } = this.props.match?.params;

        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="border-bottom pb-3">
                        <Col sm={12}>
                            <h2>Project - {name}</h2>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(ProjectView);