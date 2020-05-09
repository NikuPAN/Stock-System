import React, { useState, useEffect } from "react";
import "./styles.css";
import { AgGridReact } from "ag-grid-react";
import {Grid} from 'ag-grid-community';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Badge } from "reactstrap";


export default function Stock() {

	const [rowData, setRowData] = useState([]);
	//var gridApi, gridColumnApi;

	useEffect(() => {
    	fetch('http://131.181.190.87:3001/all')
      		.then(res => res.json())
      		.then(data =>
        	data.map(stock => {
				return {
					//timestamp: stock.timestamp,
					symbol: stock.symbol,
					name: stock.name,
					industry: stock.industry,
					//open: stock.open,
					//high: stock.high,
					//low: stock.low,
					//close: stock.close,
					//volume: stock.volume
				};
        	})
      	)
      	.then(stocks => setRowData(stocks));
	}, []);

	var gridOptions = {
		columnDefs: [
			//{ headerName: "Timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter" },
			{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
			{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
			{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 }
			//{ headerName: "Open", field: "open", sortable: true, filter: "agNumberColumnFilter" },
			//{ headerName: "High", field: "high", sortable: true, filter: "agNumberColumnFilter" },
			//{ headerName: "Low", field: "low", sortable: true, filter: "agNumberColumnFilter" },
			//{ headerName: "Close", field: "close", sortable: true, filter: "agNumberColumnFilter" },
			//{ headerName: "Volume", field: "volume", sortable: true, filter: "agNumberColumnFilter" }
		],
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			filter: true,
			resizable: true,
		},
		rowSelection: 'single',
		groupSelectsChildren: true,
		groupSelectsFiltered: true,
		suppressAggFuncInHeader: true,
		suppressRowClickSelection: true,
		//events
		onGridReady: function(event) { console.log('The grid is now ready'); },
		onRowClicked: function(event) { console.log('Row is clicked'); },
		onCellFocused: function(event) { console.log('A Cell is clicked'); },
	}
	
	// setup the grid after the page has finished loading
	document.addEventListener('DOMContentLoaded', function() {
		console.log("1234");
    	var gridDiv = document.querySelector('#myGrid');
		new Grid(gridDiv, gridOptions);
	});

	// create handler function
	function onRowClickedHandler(event) {
    	console.log('The row was clicked');
	}

	const stock_name_symbol = [];
	var i;
	for(i = 0; i < rowData.length; i++) {
		stock_name_symbol.push({symbol: rowData[i].symbol, name: rowData[i].name});
	}

	// Filter only shows each industry once
	const industries_uni = [];
	var flags = [];
	for(i = 0; i < rowData.length; i++) {
		// if this is true, don't copy
		if(flags[rowData[i].industry])
			continue;
		flags[rowData[i].industry] = true;
		industries_uni.push({industry: rowData[i].industry});
	}

	function onChangeStock(event, value) {
		// prints the selected value
		console.log("Stock changed! "+value.name);
		/* 
		When I try to console.log gridOptions, it shows everything, 
		but when I add .api behind, it shows undefined
		*/
		console.log(gridOptions);

		if(value.name.length !== "") {
			gridOptions.setFilterModel({
				name: {
					type: 'set',
					values: [value.name],
				},
			});
		}
		else { // reset the filter if the value is empty.

		}
		//gridOptions.api.onFilterChanged();
	}

	function onChangeIndustry(event, value) {
		console.log("Industry changed! "+value.industry);
		if(value.industry.length !== "") {
			;
		}
		else { // reset the filter if the value is empty.

		}
	}

	// button to reset the filter, perhaps this is redundant
	function clearFilter() {
		gridOptions.api.setFilterModel(null);
	}

	const useStyles = makeStyles({
		option: {
			fontSize: 15,
			'& > span': {
			marginRight: 10,
			fontSize: 15,
			},
		},
	});
	const classes = useStyles();

	return (
		<div className="container">
			<p>
				<Badge color="success">{rowData.length}</Badge> Stocks found in the
				system
			</p>
			<form autoComplete="off" alignment="right">
				<label htmlFor="search-stock-combo">Search Stock:&nbsp;</label>
				<Autocomplete
					id="search-stock-combo"
					style={{ width: 300 }}
					onChange={onChangeStock}
					options={stock_name_symbol}
					classes={{
						option: classes.option,
					}}
					autoHighlight
					getOptionLabel={(option) => option.name}
					renderOption={(option) => (
						<React.Fragment>
						<span><b>{option.symbol}</b></span>
						{option.name}
						</React.Fragment>
					)}
					renderInput={(params) => (
					<TextField {...params} 
						label="Search Stocks" 
						variant="outlined" 
						inputProps={{
						...params.inputProps,
						autoComplete: 'new-password', // disable autocomplete and autofill
						}} 
					/>
					)}
				/>
				<label htmlFor="filter-industry-combo">Filter by Industry:&nbsp;</label>
				<Autocomplete
					id="filter-industry-combo"
					style={{ width: 300 }}
					onChange={onChangeIndustry}
					options={industries_uni}
					getOptionLabel={(option) => option.industry}
					renderInput={(params) => <TextField {...params} label="Sort by Industries" variant="outlined" />}
				/>
				<Button color="info" size="sm" className="mt-3" onClick={clearFilter}>Clear Filter</Button>
			</form>
			<div className="ag-theme-alpine-dark"
				style={{ height: "550px", width: "1024px" }} >
				<AgGridReact
					columnDefs={gridOptions.columnDefs}
					rowData={rowData}
					pagination={true}
					paginationPageSize={10}
				/>
			</div>
		</div>
	);
}