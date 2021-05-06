import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { NavLink } from 'react-router-dom';
import DatePicker from 'react-date-picker';

class Files extends Component {
    state = {
        files: [],
        startDate: null,
        endDate: null
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

    onChange = (e) => {
        this.setState({ startDate: e });
    }
    onChange2 = (e) => {
        this.setState({ endDate: e });
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
                        <Col sm={3}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label className="mr-3">Start Date: </Form.Label>
                                <DatePicker
                                    onChange={this.onChange}
                                    value={this.state.startDate}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label className="mr-3">End Date: </Form.Label>
                                <DatePicker
                                    onChange={this.onChange2}
                                    value={this.state.endDate}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table striped bordered hover responsive variant="" className="mt-4" style={{ textAlign: "center" }}>
                                {files.length > 0 && <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>Date Created</th>
                                        <th>Size</th>
                                        <th>View File</th>
                                        <th>Download</th>
                                    </tr>
                                </thead>}
                                <tbody>
                                    {
                                        files.length > 0 && files.filter((curr) => {
                                            let startDate = this.state.startDate === null ? true : new Date(curr.modified) >= new Date(this.state.startDate);
                                            let endDate = this.state.endDate === null ? true : new Date(curr.modified) <= new Date(this.state.endDate);

                                            return startDate && endDate;
                                        })
                                            .map((file, i) => {
                                                let date = new Date(file.modified);

                                                return <tr key={i}>
                                                    <td>{file.key}</td>
                                                    <td>{`${date.toLocaleDateString()}  ${date.toLocaleTimeString()}`}</td>
                                                    <td>{file.size}</td>
                                                    <td><NavLink to={{ pathname: `/fileView`, state: { key: file.actualKey } }}>View Details</NavLink></td>
                                                    <td><a href={file.file_url.replaceAll("+", "%2B")} target="_blank" rel="noreferrer">Download</a></td>
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