import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from "axios";
import { CanvasJSChart } from "../canvasjs.react/canvasjs.react";

class ApplicationData extends Component {
    state = {
        cpu:{},
        mem:{}
    }
    componentDidMount = async () => {

        //Cpu - Application
        const result = await Axios.get(`${process.env.REACT_APP_BACKEND}/getApplicationCPU`);
        //const result = await Axios.get(`http://localhost:3001/getApplicationCPU`);

        //Memory - Application
        const result1 = await Axios.get(`${process.env.REACT_APP_BACKEND}/getApplicationMem`);
        //const result1 = await Axios.get(`http://localhost:3001/getApplicationMem`);
        
        this.setState({
            cpu: result.data.applicationDict,
            mem: result1.data.applicationDict2
        })
 
    }
    render() {
        return (
            <Fragment>
                <div className="screen-wrapper">
                    <Row className="">
                        <Col sm={12}>
                            <h2>Application Data:</h2>
                        </Col>
                    </Row>
                    
                    <div className="border-header"></div>
                    {
                        
                        Object.keys(this.state.cpu).map((key, index) => {
                            var obs=[];
                            var fore=[];
                            var obsMem=[];
                            var foreMem=[];
                            
                            //plot observed cpu
                            var keys1 = Object.keys(JSON.parse(this.state.cpu[key].observed));
                            for (var i = 0; i < keys1.length; i++) {
                                 var keycurr = keys1[i];
                                 if(!obs.length){
                                    obs = [
                                         { x: new Date(parseInt(keycurr)), y: (JSON.parse(this.state.cpu[key].observed))[keycurr]}
                                       ];
                                 }else{
                                    obs.push({ x: new Date(parseInt(keycurr)), y: (JSON.parse(this.state.cpu[key].observed))[keycurr]});
                                 }
                             }
                            console.log(obs);
                            console.log(obs.length);
                            
                            //plot forecasted cpu
                            var keys2 = Object.keys(JSON.parse(this.state.cpu[key].forecast));
                            for (var j = 0; j < keys2.length; j++) {
                                 var keycurr2 = keys2[j];
                                 if(!fore.length){
                                    fore = [
                                         { x: new Date(parseInt(keycurr2)), y: (JSON.parse(this.state.cpu[key].forecast))[keycurr2]}
                                       ];
                                 }else{
                                    fore.push({ x: new Date(parseInt(keycurr2)), y: (JSON.parse(this.state.cpu[key].forecast))[keycurr2]});
                                 }
                             }
                             console.log(fore);
                             console.log(fore.length);

                             //plot observed mem percentage
                            var keys3 = Object.keys(JSON.parse(this.state.mem[key].observed));
                            for (var k = 0; k < keys3.length; k++) {
                                 var keycurr3 = keys3[k];
                                 if(!obsMem.length){
                                    obsMem = [
                                         { x: new Date(parseInt(keycurr3)), y: (JSON.parse(this.state.mem[key].observed))[keycurr3]}
                                       ];
                                 }else{
                                    obsMem.push({ x: new Date(parseInt(keycurr3)), y: (JSON.parse(this.state.mem[key].observed))[keycurr3]});
                                 }
                             }

                            //plot forecasted mem percentage
                            var keys4 = Object.keys(JSON.parse(this.state.mem[key].forecast));
                            for (var l = 0; l < keys4.length; l++) {
                                 var keycurr4 = keys4[l];
                                 if(!foreMem.length){
                                    foreMem = [
                                         { x: new Date(parseInt(keycurr4)), y: (JSON.parse(this.state.mem[key].forecast))[keycurr4]}
                                       ];
                                 }else{
                                    foreMem.push({ x: new Date(parseInt(keycurr4)), y: (JSON.parse(this.state.mem[key].forecast))[keycurr4]});
                                 }
                             }

                            var options2 = {
                                animationEnabled: true,
                                title: {
                                  text: "Application name: "+this.state.mem[key].application_name,
                                  fontFamily:"Segoe UI"
                                },axisX: {
                                    valueFormatString: "DD MMM,YY HH:MM"
                                },
                                axisY: {
                                    title: "Memory Usage",
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
                                    yValueFormatString: "# 'Mi'",
                                    showInLegend: true,
                                    dataPoints: obsMem
                                  },
                                  {
                                    name: "Forecasted",
                                    type: "spline",
                                    yValueFormatString: "# 'Mi'",
                                    showInLegend: true,
                                    dataPoints: foreMem
                                }
                                ]
                              };

                              var options = {
                                animationEnabled: true,
                                title: {
                                  text: "Application name: "+this.state.cpu[key].application_name,
                                  fontFamily:"Segoe UI"
                                },axisX: {
                                    valueFormatString: "DD MMM,YY HH:MM"
                                },
                                axisY: {
                                    title: "CPU Cores"
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
                                    yValueFormatString: "#'m'",
                                    showInLegend: true,
                                    dataPoints: obs
                                  },
                                  {
                                    name: "Forecasted",
                                    type: "spline",
                                    yValueFormatString: "#'m'",
                                    showInLegend: true,
                                    dataPoints: fore
                                }
                                ]
                              };

                            return( 
                            
                                <Fragment>
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

export default ApplicationData;