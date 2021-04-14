import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";
import Table from 'react-bootstrap/Table';
import { NavLink } from 'react-router-dom';

class Files extends Component {
    state = {
        files: []
    }

    componentDidMount = async () => {
        try {
            const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getFiles/1`);
            this.setState({
                files: result.data.files
            });
        } catch (error) {
            alert(error);
        }
    }

    render() {
        let { files } = this.state;
        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="">
                        <Col>
                            <h2>Files</h2>
                        </Col>
                    </Row>

                    <div className="border-header"></div>
                    <Row>
                        <Col>
                            <Table striped bordered hover responsive variant="" className="mt-4" style={{ textAlign: "center" }}>
                                {files.length > 0 && <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>Date Created</th>
                                        <th>Size</th>
                                        <th>View File</th>
                                    </tr>
                                </thead>}
                                <tbody>
                                    {
                                        files.length > 0 && files.map((file, i) => {
                                            let date = new Date(file.modified);

                                            return <tr key={i}>
                                                <td>{file.key}</td>
                                                <td>{`${date.toLocaleDateString()}  ${date.toLocaleTimeString()}`}</td>
                                                <td>{file.size}</td>
                                                <td><NavLink to={{ pathname: `/fileView`, state: { key: file.actualKey } }}>View Details</NavLink></td>

                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                            {/* {
                                files.length > 0 && files.map(file => {
                                    return <div className="file" key={file.key}>
                                        {file.key}
                                        {new Date(file.modified).toLocaleDateString()}
                                        {file.size}
                                    </div>
                                })
                            } */}
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default Files;