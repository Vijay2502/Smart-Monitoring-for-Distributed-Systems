import axios from 'axios';
import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { withRouter } from 'react-router';

class FileView extends Component {
    state = {
        content: ""
    }

    componentDidMount = async () => {
        let { key } = this.props.location?.state;

        const results = await axios.post(`${process.env.REACT_APP_BACKEND}/readFile`, { key });

        this.setState({
            content: results.data
        })

    }

    render() {
        let { key } = this.props.location?.state;

        console.log('key', key)

        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="">
                        <Col>
                            <h2>File </h2>
                        </Col>
                    </Row>

                    <div className="border-header"></div>

                    <Row className="">
                        <Col>
                            <div>{typeof this.state.content === "string" ? this.state.content.split("\n").map(curr => <p>{curr}</p>) : JSON.stringify(this.state.content)}</div>
                        </Col>
                    </Row>

                </div>
            </Fragment>
        );
    }
}

export default withRouter(FileView);