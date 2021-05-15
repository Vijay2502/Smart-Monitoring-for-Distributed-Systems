import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/esm/Table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { RandomColor } from '../RandomColor';

class ProjectView extends Component {
    state = {
        deployments: {
            header: [],
            table: []
        },
        pods: {
            header: [],
            table: []
        },
        services: {
            header: [],
            table: []
        },
        chartDep: [],
        chartPods: [],
        chartServ: []
    }

    componentDidMount = async () => {
        const { name } = this.props.match?.params;
        try {
            const deployments = await Axios.get(`${process.env.REACT_APP_BACKEND}/getDeployments/${name}`);
            const pods = await Axios.get(`${process.env.REACT_APP_BACKEND}/getPods/${name}`);
            const services = await Axios.get(`${process.env.REACT_APP_BACKEND}/getServices/${name}`);

            this.setState((oldState) => {
                return {
                    deployments: deployments.data,
                    pods: pods.data,
                    services: services.data,
                };
            }, () => this.generateChartData());

        } catch (error) {
            alert(error);
        }
    }

    generateChartData = () => {
        const { deployments, pods, services } = this.state;

        this.setState((oldState) => {
            return {
                ...oldState,
                chartDep: deployments["table"].reduce((a, dep) => { a.push({ name: dep[0], y: 1 }); return a; }, []),
                chartPods: pods["table"].reduce((a, dep) => { a.push({ name: dep[0], y: 1 }); return a; }, []),
                chartServ: services["table"].reduce((a, dep) => { a.push({ name: dep[0], y: 1 }); return a; }, [])
            }
        })

    }

    getChartOptions = (name, title) => {
        let data = this.state[name];

        return {
            chart: {
                type: 'pie',
                colorCount: 1
            },
            title: {
                text: title
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Count',
                data: data.map(curr => { return { ...curr, color: RandomColor() } })
            }]
        };
    }

    render() {
        const { name } = this.props.match?.params;
        const { deployments, pods, services, chartDep, chartPods, chartServ } = this.state;

        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="border-bottom pb-3">
                        <Col sm={12}>
                            <h2>Project - {name}</h2>
                        </Col>
                    </Row>

                    <div className="deployments-container my-5">
                        <h4 className="mb-3">Deployments</h4>
                        <Row>
                            <Col sm={7}>
                                {
                                    deployments["header"].length ? <Table bordered striped responsive variant="dark">
                                        <thead>
                                            <tr>
                                                {
                                                    deployments["header"].map((curr, i) => <th key={i}>{curr}</th>)
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                deployments["table"].length > 0 && deployments["table"].map((curr, i) => {
                                                    return <tr key={i}>
                                                        {
                                                            curr.map((d, i) => <td key={i}>{d}</td>)
                                                        }
                                                    </tr>;
                                                })
                                            }

                                        </tbody>
                                    </Table>
                                        : "No Deployments"
                                }
                            </Col>
                            <Col sm={5}>
                                {
                                    chartDep.length > 0 &&
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={this.getChartOptions("chartDep", 'Deployments')}
                                    />
                                }
                            </Col>
                        </Row>
                    </div>

                    <div className="pods-container my-5">

                        <h4 className="mb-3">Pods</h4>
                        <Row>
                            <Col sm={5}>
                                {
                                    chartPods.length > 0 &&
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={this.getChartOptions("chartPods", 'Pods')}
                                    />
                                }
                            </Col>
                            <Col sm={7}>
                                {
                                    pods["header"].length ? <Table bordered striped responsive variant="dark">
                                        <thead>
                                            <tr>
                                                {
                                                    pods["header"].map((curr, i) => <th key={i}>{curr}</th>)
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pods["table"].length > 0 && pods["table"].map((curr, i) => {
                                                    return <tr key={i}>
                                                        {
                                                            curr.map((d, i) => <td key={i}>{d}</td>)
                                                        }
                                                    </tr>;
                                                })
                                            }

                                        </tbody>
                                    </Table>
                                        : "No Pods Deployed"
                                }
                            </Col>
                        </Row>

                    </div>

                    <div className="services-container my-5">

                        <h4 className="mb-3">Services</h4>
                        <Row>
                            <Col sm={7}>
                                {
                                    services["header"].length ? <Table bordered striped responsive variant="dark">
                                        <thead>
                                            <tr>
                                                {
                                                    services["header"].map((curr, i) => <th key={i}>{curr}</th>)
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                services["table"].length > 0 && services["table"].map((curr, i) => {
                                                    return <tr key={i}>
                                                        {
                                                            curr.map((d, i) => <td key={i}>{d}</td>)
                                                        }
                                                    </tr>;
                                                })
                                            }

                                        </tbody>
                                    </Table>
                                        : "No Services Deployed"
                                }
                            </Col>
                            <Col sm={5}>
                                {
                                    chartServ.length > 0 &&
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={this.getChartOptions("chartServ", 'Services')}
                                    />
                                }
                            </Col>
                        </Row>

                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(ProjectView);