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


export default function Stock_Detail() {

	const [rowData, setRowData] = useState([]);
	const [gridApi, setGridApi] = useState(null);
	const { symbol } = useParams();
	const history = useHistory();

	const [columnDefs, setColumnDefs] = useState([
		//{ headerName: "timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter", minWidth: 220, valueFormatter: currencyFormatter },
		{ headerName: "Date", field: "date", sortable: true, filter: "agDateColumnFilter", minWidth: 220 },
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
					date: new Date(stock.timestamp).toLocaleDateString(),
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
	}, []);

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

	function onBackButtonClick() {
		history.push("/stocks");
	}

	// just a small effect change of hint texts
	function onExpandPanelChange(event, expand) {
		document.getElementById('filterDetail').innerHTML = "<b>Filters</b> (Click to "+(expand?"collapse":"expand")+")";
	}

	function onDateRangeChange(from, to) {
		console.log("onDateRangeChange is called! (From: "+from+", To:"+to);
	}


	function onPriceRangeChange(from, to) {
		console.log("onPriceRangeChange is called! (From: "+from+", To:"+to);
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
					<DatePickers data={rowData} onDatesChange={onDateRangeChange} />
					<br/>
					<label><b>Closing Price Range</b></label>
					<PricePickers data={rowData} onPricesChange={onPriceRangeChange}/>
					{/* <br/>
					<label><b>Showing Stocks' High Price</b></label>
					<PricePickers /> */}
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
					onGridReady={ params => setGridApi(params.api) }
					// onRowClicked={}
					pagination={true}
					paginationPageSize={5}
				/>
			</div>
			{/* {console.log(rowData)} */}
			<div>
				<MultiAxisChart 
					width="100%" 
					height="400px" 
					graphData={rowData}
				/>
			</div>
		</div>
	);
}