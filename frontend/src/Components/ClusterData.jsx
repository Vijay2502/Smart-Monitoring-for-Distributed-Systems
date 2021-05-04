import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from "axios";
import { CanvasJSChart } from "../canvasjs.react/canvasjs.react";

class ClusterData extends Component {
    state = {
        content:{},
        memPercentage:{}
    }
    componentDidMount = async () => {

        //Cpu Usage
        const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getPythonData`);
        //const result = await Axios.get(`http://34.122.135.247:3001/getPythonData`);

        //Memory percentage
        const result1 = await Axios.get(`${process.env.REACT_APP_BACKEND}/getPythonMemPercentage`);
        //const result1 = await Axios.get(`http://34.122.135.247:3001/getPythonMemPercentage`);
        //console.log("mem usage",result1.data.pythonDict2);
        
        this.setState({
            content: result.data.pythonDict,
            memPercentage: result1.data.pythonDict2
        })
 
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
                            var obsMem=[];
                            var foreMem=[];
                            
                            //plot observed cpu
                            var keys1 = Object.keys(JSON.parse(this.state.content[key].observed));
                            var i= (keys1.length>800) ? keys1.length-800 : 0;
                            for (i; i < keys1.length; i++) {
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
                            
                            //plot forecasted cpu
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

                             //plot observed mem percentage
                            var keys3 = Object.keys(JSON.parse(this.state.memPercentage[key].observed));
                            var k= (keys3.length>800) ? keys3.length-800 : 0;
                            for (k; k < keys3.length; k++) {
                                 var keycurr3 = keys3[k];
                                 if(!obsMem.length){
                                    obsMem = [
                                         { x: new Date(parseInt(keycurr3)), y: (JSON.parse(this.state.memPercentage[key].observed))[keycurr3]}
                                       ];
                                 }else{
                                    obsMem.push({ x: new Date(parseInt(keycurr3)), y: (JSON.parse(this.state.memPercentage[key].observed))[keycurr3]});
                                 }
                             }

                            //plot forecasted mem percentage
                            var keys4 = Object.keys(JSON.parse(this.state.memPercentage[key].forecast));
                            for (var l = 0; l < keys4.length; l++) {
                                 var keycurr4 = keys4[l];
                                 if(!foreMem.length){
                                    foreMem = [
                                         { x: new Date(parseInt(keycurr4)), y: (JSON.parse(this.state.memPercentage[key].forecast))[keycurr4]}
                                       ];
                                 }else{
                                    foreMem.push({ x: new Date(parseInt(keycurr4)), y: (JSON.parse(this.state.memPercentage[key].forecast))[keycurr4]});
                                 }
                             }

                            var options2 = {
                                animationEnabled: true,
                                title: {
                                  text: "Cluster name: "+this.state.memPercentage[key].cluster_name,
                                  fontFamily:"Segoe UI"
                                },axisX: {
                                    valueFormatString: "DD MMM,YY HH:MM"
                                },
                                axisY: {
                                    title: "Memory Used %",
                                    fontSize: 30
                                    //suffix: " %"
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
                                    name: "Observed",
                                    type: "spline",
                                    yValueFormatString: "# '%'",
                                    showInLegend: true,
                                    dataPoints: obsMem
                                  },
                                  {
                                    name: "Forecasted",
                                    type: "spline",
                                    yValueFormatString: "# '%'",
                                    showInLegend: true,
                                    dataPoints: foreMem
                                }
                                ]
                              };

                              var options = {
                                animationEnabled: true,
                                title: {
                                  text: "Cluster name: "+this.state.content[key].cluster_name,
                                  fontFamily:"Segoe UI"
                                },axisX: {
                                    valueFormatString: "DD MMM,YY HH:MM"
                                },
                                axisY: {
                                    title: "CPU Used %"
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
                                    name: "Observed",
                                    type: "spline",
                                    yValueFormatString: "# '%'",
                                    showInLegend: true,
                                    dataPoints: obs
                                  },
                                  {
                                    name: "Forecasted",
                                    type: "spline",
                                    yValueFormatString: "# '%'",
                                    showInLegend: true,
                                    dataPoints: fore
                                }
                                ]
                              };

                            return( 
                            
                                <Fragment key={key}>
                                    <CanvasJSChart options = {options}/>
                                    <br/>
                                    <CanvasJSChart options = {options2}/>
                                    <br/>
                                </Fragment>
                            
                            )
                        })
              }
                </div>
            </Fragment>
        );
    }
}

export default ClusterData;