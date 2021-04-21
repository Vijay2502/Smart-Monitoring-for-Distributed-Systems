import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class ClusterData extends Component {
    state = {}
    render() {
        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="">
                        <Col sm={12}>
                            <h2>Cluster Data:</h2>
                        </Col>
                    </Row>

                    <div className="border-header"></div>
                </div>
            </Fragment>
        );
    }
}

export default ClusterData;