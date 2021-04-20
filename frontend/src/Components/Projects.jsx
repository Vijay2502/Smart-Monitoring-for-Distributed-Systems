import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";
import Table from 'react-bootstrap/Table';
import { NavLink } from 'react-router-dom';

class Projects extends Component {
    state = {
        projectList: []
    }

    componentDidMount = async () => {
        try {
            const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getNamespaces`);

            this.setState((oldState) => {
                return { projectList: result.data?.table };
            })

        } catch (error) {
            alert(error);
        }
    }

    render() {
        let { projectList } = this.state;
        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="">
                        <Col>
                            <h2>Projects</h2>
                        </Col>
                    </Row>

                    <div className="border-header"></div>
                    <Table striped bordered hover responsive className="mt-4">
                        {projectList.length > 0 && <thead>
                            <tr>
                                <th>#</th>
                                <th>Project Name</th>
                                <th>Status</th>
                                <th>Age</th>
                                <th>Details</th>
                            </tr>
                        </thead>}
                        <tbody>
                            {
                                projectList.length > 0 && projectList.map((project, i) => {
                                    return <tr key={project.name}>
                                        <td>{i + 1}</td>
                                        <td>{project[0]}</td>
                                        <td>{project[1]}</td>
                                        <td>{project[2]}</td>
                                        <td><NavLink to={`/projectView/${project[0]}`}>View Details</NavLink></td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </Fragment>
        );
    }
}

export default Projects;