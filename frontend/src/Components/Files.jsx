import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";

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
                            {
                                files.length > 0 && files.map(file => {
                                    return <div className="file" key={file.key}>
                                        {file.key}
                                        {new Date(file.modified).toLocaleDateString()}
                                        {file.size}
                                    </div>
                                })
                            }
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default Files;