import React, { Component, useState, useEffect } from "react";
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class MultiAxisChart extends Component {
	
    constructor(props) {
		super(props);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
		this.state = {
			dataPoint1: [],
			dataPoint2: []
		};
	}
	
	toggleDataSeries(e){
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		//this.updateChartAxis(this.props.graphData);
		this.chart.render();
	}
	// Do update chart data here
	// updateChartAxis(data, datapoints) {
	updateChartAxis(data, datapoint) {
		if(data.length > 0) {
			var i;
			var closing_prices = [], high_prices = [];
			for(i = 0; i < data.length; i++) {
				closing_prices.push({x: new Date(data[i].date), y: data[i].close});
				high_prices.push({x: new Date(data[i].date), y: data[i].high});
			}
			this.setState({
				dataPoint1: closing_prices,
				dataPoint2: high_prices
			});
			// console.log(this.dataPoint1);
			// console.log(this.dataPoint2);
		}
	}
	// I guess this is handling when class is finish loading
	componentDidMount() {
		//console.log(this.props.graphData);
		this.updateChartAxis(this.props.graphData);
	}
	// // I guess this is handling to handle update from ???
	// componentDidUpdate() {
	// 	this.updateChartAxis(this.props.graphData);
	// }
	
    render() {
		if(this.props.graphData.length > 0) {
			var i;
			var closing_prices = [], high_prices = [];
			for(i = 0; i < this.props.graphData.length; i++) {
				closing_prices.push({x: new Date(this.props.graphData[i].timestamp), y: this.props.graphData[i].close});
				high_prices.push({x: new Date(this.props.graphData[i].timestamp), y: this.props.graphData[i].volumes});
			}
			this.dataPoint1 = closing_prices;
			this.dataPoint2 = high_prices;
		}
        const options = {
			theme: "dark2", // light2 works as well
			animationEnabled: true,
			title:{
				text: `Closing Price vs Volume (${this.props.graphData.length} Days)`
			},
			subtitles: [{
				text: "Click Legend to Hide or Show Data Series"
			}],
			axisX: {
				title: "Dates"
				//gridColor: "orange"
			},
			axisY: {
				title: "Closing Price",
				titleFontColor: "#6D78AD",
				lineColor: "#6D78AD",
				labelFontColor: "#6D78AD",
				tickColor: "#6D78AD",
				includeZero: false
			},
			axisY2: {
				title: "Volumes",
				titleFontColor: "#51CDA0",
				lineColor: "#51CDA0",
				labelFontColor: "#51CDA0",
				tickColor: "#51CDA0",
				includeZero: false
				//maximum: 110000000
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				itemclick: this.toggleDataSeries
			},
			data: [
				{
					type: "spline",
					name: "Closing Price",
					showInLegend: true,
					xValueFormatString: "DD MMM, YYYY",
					yValueFormatString: "$#,##0.##",
					dataPoints: this.dataPoint1
				},
				{
					type: "spline",
					name: "Volumes",
					axisYType: "secondary",
					showInLegend: true,
					xValueFormatString: "DD MMM, YYYY",
					yValueFormatString: "#,##0 Unit(s)",
					dataPoints: this.dataPoint2
			}]
		}
        return (
			
            <div className="chart">
                <CanvasJSChart options = {options} 
				    onRef={ref => this.chart = ref}
			    />
			    {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );

    }

}

export default MultiAxisChart;