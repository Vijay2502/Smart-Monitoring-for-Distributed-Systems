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
        projectList: [],
        chartDep: [],
        chartPods: [],
        chartServ: []
    }

    componentDidMount = async () => {
        const { name } = this.props.match?.params;
        try {
            const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getProjects`);

            this.setState((oldState) => {
                return { projectList: result.data?.projects.find(a => a.name === name) };
            }, () => this.generateChartData());

        } catch (error) {
            alert(error);
        }
    }

    generateChartData = () => {
        const { deployments, pods, services } = this.state.projectList;

        this.setState((oldState) => {
            return {
                ...oldState,
                chartDep: deployments.reduce((a, dep) => { a.push({ name: dep.name, y: 1 }); return a; }, []),
                chartPods: pods.reduce((a, dep) => { a.push({ name: dep.name, y: 1 }); return a; }, []),
                chartServ: services.reduce((a, dep) => { a.push({ name: dep.name, y: 1 }); return a; }, [])
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
        const { projectList, chartDep, chartPods, chartServ } = this.state;

        if (!Array.isArray(projectList))
            var { deployments, pods, services } = projectList;

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
                                <Table bordered striped responsive variant="dark">
                                    <thead>
                                        <tr>
                                            {
                                                ["Name", "Available", "Ready", "Age"].map((curr, i) => <th key={i}>{curr}</th>)
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            deployments?.length > 0 && deployments.map((curr, i) => {
                                                return <tr key={i}>
                                                    <td>{curr.name}</td>
                                                    <td>{curr.available}</td>
                                                    <td>{curr.ready}</td>
                                                    <td>{curr.age}</td>
                                                </tr>;
                                            })
                                        }

                                    </tbody>
                                </Table>
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
                                <Table bordered striped responsive variant="dark">
                                    <thead>
                                        <tr>
                                            {
                                                ["Name", "Restarts", "Status", "Ready", "Age"].map((curr, i) => <th key={i}>{curr}</th>)
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            pods?.length > 0 && pods.map((curr, i) => {
                                                return <tr key={i}>
                                                    <td>{curr.name}</td>
                                                    <td>{curr.restarts}</td>
                                                    <td>{curr.status}</td>
                                                    <td>{curr.ready}</td>
                                                    <td>{curr.age}</td>
                                                </tr>;
                                            })
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                    </div>

                    <div className="services-container my-5">

                        <h4 className="mb-3">Services</h4>
                        <Row>
                            <Col sm={7}>
                                <Table bordered striped responsive variant="dark">
                                    <thead>
                                        <tr>
                                            {
                                                ["Name", "Type", "Cluster IP", "External IP", "Ports", "Age"].map((curr, i) => <th key={i}>{curr}</th>)
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            services?.length > 0 && services.map((curr, i) => {
                                                return <tr key={i}>
                                                    <td>{curr.name}</td>
                                                    <td>{curr.type}</td>
                                                    <td>{curr["cluster-ip"]}</td>
                                                    <td>{curr["external-ip"]}</td>
                                                    <td>{curr.ports}</td>
                                                    <td>{curr.age}</td>
                                                </tr>;
                                            })
                                        }
                                    </tbody>
                                </Table>
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