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
            // const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getProjects`);
            // const result1 = await Axios.get(`${process.env.REACT_APP_BACKEND}/sample`);
            const result2 = await Axios.get(`${process.env.REACT_APP_BACKEND}/getNamespaces`);
            console.log('result2', result2)
            // console.log('result1', result1)

            this.generateStats(result2.data?.projects);
            this.setState((oldState) => {
                return { projectList: result2.data?.projects };
            })

        } catch (error) {
            alert(error);
        }
    }

    generateStats = (projects) => {

        let stats = projects.map(a => [a["name"], a["deployments"]?.length || 0, a["pods"]?.length || 0, a["services"]?.length || 0])

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