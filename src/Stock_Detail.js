import React, { useState, useEffect } from 'react';
import "./styles.css";
import { Button } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import MultiAxisChart from './component/MultiAxisChart';
import DatePickers from './component/DatePickers';
import PricePickers from './component/PricePickers';
import moment from 'moment';


export default function Stock_Detail() {

	const [rowData, setRowData] = useState([]);
	const [filterData, setFilterData] = useState([]);
	const [gridApi, setGridApi] = useState(null);
	const { symbol } = useParams();
	const history = useHistory();

	const [columnDefs, setColumnDefs] = useState([
		//{ headerName: "timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter", minWidth: 220, valueFormatter: currencyFormatter },
		{ headerName: "Date", field: "date", sortable: true, filter: "agDateColumnFilter",
			filterParams: {
				comparator: function(filterLocalDateAtMidnight, cellValue) {
					var dateAsString = cellValue; // days is stored as DD/MM/YYYY
					if (dateAsString == null) 
						return -1;
					var dateParts = dateAsString.split('/');
					var cellDate = new Date(
						Number(dateParts[2]),
						Number(dateParts[1]) - 1,
						Number(dateParts[0])
					);
					if (cellDate < filterLocalDateAtMidnight) {
						return -1;
					} else if (cellDate > filterLocalDateAtMidnight) {
						return 1;
					} else {
						return 0;
					}
				},
            },
		 minWidth: 220 },
		//{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
		//{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
		//{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 },
		{ headerName: "Open", field: "open", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
		{ headerName: "High", field: "high", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
		{ headerName: "Low", field: "low", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
		{ headerName: "Close", field: "close", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
		{ headerName: "Volumes", field: "volumes", sortable: true, filter: "agNumberColumnFilter" }
	]);

	useEffect(() => {
		fetch(`http://131.181.190.87:3001/history?symbol=${symbol}`)
			.then(res => res.json())
			.then(data =>
				data.map(stock => {
					return {
					timestamp: stock.timestamp,
					date: timestampToDDMMYYYY(stock.timestamp),
					symbol: stock.symbol,
					name: stock.name,
					industry: stock.industry,
					open: stock.open,
					high: stock.high,
					low: stock.low,
					close: stock.close,
					volumes: stock.volumes
					};
				})
			)
			.then(stocks => setRowData(stocks));
	}, [rowData, symbol]);

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
		},
		heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightRegular,
		},
	}));
	const classes = useStyles();

	function timestampToDDMMYYYY(timestamp) {
		var dateobj = new Date(timestamp);
		return dateobj.getDate()+'/' + (dateobj.getMonth()+1) + '/'+dateobj.getFullYear();
	}

	function onClearFilterClick() {
		gridApi.setFilterModel(null);
		gridApi.onFilterChanged();
		setFilterData(rowData);
	}

	function onGridReady(params) {
		setGridApi(params.api);
		console.log(rowData);

	}

	function onBackButtonClick() {
		history.push("/stocks");
	}

	// just a small effect change of hint texts
	function onExpandPanelChange(event, expand) {
		document.getElementById('filterDetail').innerHTML = "<b>Filters</b> (Click to "+(expand?"collapse":"expand")+")";
	}
	// functions from online
	function replaceAll(string, search, replace) {
		return string.split(search).join(replace);
	  }

	function onDateRangeChange(from, to) {
		console.log("onDateRangeChange is called!");
		if(gridApi) {
			var filterInstance = gridApi.getFilterInstance('date');
			if(from != null && to != null) {
				var toStrFrom = replaceAll(from.toLocaleDateString(), '/', '-');
				var toStrTo = replaceAll(to.toLocaleDateString(), '/', '-');
				console.log("From: "+toStrFrom);
				console.log("To: "+toStrTo);
				filterInstance.setModel({
					condition1: {
						type: 'inRange',
						dateFrom: toStrFrom,
						dateTo: toStrTo,
					},
					operator: 'OR',
					condition2: {
						type: 'equals',
						dateFrom: toStrFrom,
						dateTo: null,
					},
				});
				
			} 
			// reset the filter if the value is empty.
			else { 
				filterInstance.setModel(null);
			}
			// Tell grid to run filter operation again
			gridApi.onFilterChanged();

			var data = gridApi.getModel().rootNode.childrenAfterFilter;
			console.log(data.length +" results after filtered")
			//console.log(data);
			var i, realdata = [];
			for(i = 0; i < data.length; i++) {
				realdata.push(data[i].data);
			}
			//console.log(realdata);
			setFilterData(realdata);
			var height = 100 + (data.length >= 5 ? 220 : data.length * 55);
			setWidthAndHeight('100%', `${height}px`);
		}
	}

	function onPriceRangeChange(from, to) {
		console.log("onPriceRangeChange is called! (From: "+from+", To:"+to);
		if(gridApi) {
			var filterInstance = gridApi.getFilterInstance('close');
			if(from != null && to != null && from !== '' && to !== '') {
				filterInstance.setModel({
					condition1: {
						type: 'greaterThanOrEqual',
						filter: from,
						filterTo: null,
					}, 
					operator: 'AND',
					condition2: {
						type: 'lessThanOrEqual',
						filter: to,
						filterTo: null,
					}
				});
				
			} 
			// reset the filter if the value is empty.
			else { 
				filterInstance.setModel(null);
			}
			// Tell grid to run filter operation again
			gridApi.onFilterChanged();

			var data = gridApi.getModel().rootNode.childrenAfterFilter;
			console.log(data.length +" results after filtered")
			//console.log(data);
			var i, realdata = [];
			for(i = 0; i < data.length; i++) {
				realdata.push(data[i].data);
			}
			//console.log(realdata);
			setFilterData(realdata);
			var height = 100 + (data.length >= 5 ? 220 : data.length * 55);
			setWidthAndHeight('100%', `${height}px`);
		}
	}

	function setWidthAndHeight(width, height) {
		var eGridDiv = document.querySelector('#myGrid');
		eGridDiv.style.width = width;
		eGridDiv.style.height = height;
		gridApi.doLayout();
	}

	return (
		<div className="container">
			<ExpansionPanel 
				defaultExpanded="true"
				onChange={onExpandPanelChange}
			>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.heading} id="filterDetail"><b>Filters</b> (Click to collapse)</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
				<form autoComplete="off" alignment="right">
					{/* Import from component so we do not have to put all codes into one file. */}
					<label><b>Showing Date Range</b></label>
					<DatePickers /*data={rowData}*/ onDatesChange={onDateRangeChange} />
					<br/>
					<label><b>Closing Price Range</b></label>
					<PricePickers /*data={filterData}*/ onPricesChange={onPriceRangeChange}/>
					{/* <br/>
					<label><b>Showing Stocks' High Price</b></label>
					<PricePickers /> */}
					<Button 
						color="info" size="sm" className="mt-3" onClick={onClearFilterClick}>
						Clear Filter
					</Button>
				</form>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<br/>
			<h3>
				Stock History For ({symbol}) {rowData.length && rowData[0].name}
			</h3>
			<Button 
				color="info" size="sm" className="mt-3" onClick={onBackButtonClick}>
				Back to Stocks Page
			</Button>
			<div id="myGrid" className="ag-theme-alpine-dark"
				style={{ height: "320px", width: "100%" }} >
				<AgGridReact
					columnDefs={columnDefs}
					rowData={rowData}
					onGridReady={onGridReady}
					// onRowClicked={}
					pagination={true}
					paginationPageSize={5}
				/>
			</div>
			<div>
				<MultiAxisChart 
					width="100%" 
					height="400px" 
					graphData={filterData.length>0?filterData:rowData}
				/>
			</div>
		</div>
	);
}