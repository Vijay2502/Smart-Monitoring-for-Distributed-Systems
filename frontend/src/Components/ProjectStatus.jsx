import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from "axios";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { RandomColor } from '../RandomColor';

class ProjectStatus extends Component {
    state = {
        projectList: [],
        stats: []
    }

    componentDidMount = async () => {
        try {
            const deployments = await Axios.get(`${process.env.REACT_APP_BACKEND}/getDeployments/all`);
            const pods = await Axios.get(`${process.env.REACT_APP_BACKEND}/getPods/all`);
            const services = await Axios.get(`${process.env.REACT_APP_BACKEND}/getServices/all`);

            this.generateStats(deployments.data, pods.data, services.data);
        } catch (error) {
            alert(error);
        }
    }

    generateStats = (deployments, pods, services) => {
        const depData = deployments.table;
        const podData = pods.table;
        const servData = services.table;

        let data = {};

        for (let entry of depData) {
            if (!data[entry[0]])
                data[entry[0]] = {
                    deployments: 1,
                    pods: 0,
                    services: 0
                }
            else
                data[entry[0]]["deployments"] += 1;
        }
        for (let entry of podData) {
            if (!data[entry[0]])
                data[entry[0]] = {
                    deployments: 0,
                    pods: 1,
                    services: 0
                }
            else
                data[entry[0]]["pods"] += 1;
        }
        for (let entry of servData) {
            if (!data[entry[0]])
                data[entry[0]] = {
                    deployments: 0,
                    pods: 0,
                    services: 1
                }
            else
                data[entry[0]]["services"] += 1;
        }

        let stats = Object.entries(data).map(a => [a[0], a[1]["deployments"], a[1]["pods"], a[1]["services"]]);

        console.log(stats);
        this.setState((oldState) => {
            return {
                stats
            }
        })
    }

    getChartOptions = (name, data) => {
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: name
            },
            series: [{
                name: "Count",
                data: data.map(curr => { return { y: curr, color: RandomColor() } }),
                colorByPoint: true
            }],
            xAxis: {
                categories: ["Deployments", "Pods", "Services"]
            },
            legend: {
                enabled: false
            }
        };
    }

    render() {
        const { stats } = this.state;

        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="">
                        <Col sm={12}>
                            <h2>Project Stats:</h2>
                        </Col>
                    </Row>

                    <div className="border-header"></div>

                    <Row className="pb-3">
                        {
                            stats.length > 0 && stats.map(([curr, ...a]) => {
                                return <Col sm={6} className="my-4">
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={this.getChartOptions(curr, a)}
                                    />
                                </Col>
                            })
                        }
                    </Row>

                </div>
            </Fragment>
        );
    }
}

export default ProjectStatus;