import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from "axios";
import { CanvasJSChart } from "../canvasjs.react/canvasjs.react";

class ClusterData extends Component {
    state = {
        content:{},
        b:[]
    }
    componentDidMount = async () => {

        const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getPythonData`);
        //const result = await Axios.get(`http://localhost:3001/getPythonData`);
        console.log(result.data.pythonDict);
        this.setState({
            content: result.data.pythonDict
        })

        Object.keys(this.state.content).map((key, index) => ( 
            console.log(this.state.content[key])

            ));

    }
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
                    {
                        
                        Object.keys(this.state.content).map((key, index) => {
                            var obs=[];
                            var fore=[];
                            
                            var keys1 = Object.keys(JSON.parse(this.state.content[key].observed));
                            for (var i = 0; i < keys1.length; i++) {
                                 var keycurr = keys1[i];
                                 if(!obs.length){
                                    obs = [
                                         { x: new Date(parseInt(keycurr)), y: (JSON.parse(this.state.content[key].observed))[keycurr]}
                                       ];
                                 }else{
                                    obs.push({ x: new Date(parseInt(keycurr)), y: (JSON.parse(this.state.content[key].observed))[keycurr]});
                                 }
                             }
                            console.log(obs);
                            console.log(obs.length);

                            var keys2 = Object.keys(JSON.parse(this.state.content[key].forecast));
                            for (var j = 0; j < keys2.length; j++) {
                                 var keycurr2 = keys2[j];
                                 if(!fore.length){
                                    fore = [
                                         { x: new Date(parseInt(keycurr2)), y: (JSON.parse(this.state.content[key].forecast))[keycurr2]}
                                       ];
                                 }else{
                                    fore.push({ x: new Date(parseInt(keycurr2)), y: (JSON.parse(this.state.content[key].forecast))[keycurr2]});
                                 }
                             }
                             console.log(fore);
                             console.log(fore.length);

                             var options = {
                                animationEnabled: true,
                                title: {
                                  text: "Cluster name: "+this.state.content[key].cluster_name,
                                  fontFamily:"Segoe UI"
                                },axisX: {
                                    valueFormatString: "DD MMM,YY"
                                },
                                axisY: {
                                    title: "CPU usage"
                                    //suffix: " °C"
                                },
                                legend:{
                                    cursor: "pointer",
                                    fontSize: 16
                                },
                                toolTip:{
                                    shared: true
                                },
                                data: [
                                  {
                                    name: "Observed values",
                                    type: "spline",
                                    //yValueFormatString: "#0.## °C",
                                    showInLegend: true,
                                    dataPoints: obs
                                  },
                                  {
                                    name: "Forecasted values",
                                    type: "spline",
                                    //yValueFormatString: "#0.## °C",
                                    showInLegend: true,
                                    dataPoints: fore
                                }
                                ]
                              };

                            return( 
                            
                            <CanvasJSChart options = {options}/>
                            
                            )
                        })
              }
                </div>
            </Fragment>
        );
    }
}

export default ClusterData;