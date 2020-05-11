import React, { useState, useEffect } from "react";
import "./styles.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Badge } from "reactstrap";
import { useHistory } from 'react-router-dom';


export default function Stock() {

	const [rowData, setRowData] = useState([]);
	const [gridApi, setGridApi] = useState(null);
	const [textValue, setTextValue] = useState(''); // for stock textfield
	const [textValue2, setTextValue2] = useState(''); // for industry textfield
	const history = useHistory();
	const [columnDefs, setColumnDefs] = useState([
		{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
		{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
		{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 }
	]);
	//var gridApi, gridColumnApi;

	useEffect(() => {
    	fetch('http://131.181.190.87:3001/all')
      		.then(res => res.json())
      		.then(data =>
        	data.map(stock => {
				return {
					symbol: stock.symbol,
					name: stock.name,
					industry: stock.industry
				};
        	})
      	)
      	.then(stocks => setRowData(stocks));
	}, []);

	// const gridOptions = {
	// 	columnDefs: [
	// 		//{ headerName: "Timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter" },
	// 		{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
	// 		{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
	// 		{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 }
	// 		//{ headerName: "Open", field: "open", sortable: true, filter: "agNumberColumnFilter" },
	// 		//{ headerName: "High", field: "high", sortable: true, filter: "agNumberColumnFilter" },
	// 		//{ headerName: "Low", field: "low", sortable: true, filter: "agNumberColumnFilter" },
	// 		//{ headerName: "Close", field: "close", sortable: true, filter: "agNumberColumnFilter" },
	// 		//{ headerName: "Volume", field: "volume", sortable: true, filter: "agNumberColumnFilter" }
	// 	],
	// 	defaultColDef: {
	// 		flex: 1,
	// 		minWidth: 100,
	// 		filter: true,
	// 		resizable: true,
	// 	},
	// 	rowSelection: 'single',
	// 	// groupSelectsChildren: true,
	// 	// groupSelectsFiltered: true,
	// 	// suppressAggFuncInHeader: true,
	// 	// suppressRowClickSelection: true,
	// 	//events
	// 	onGridReady: onGridReady,
	// 	onRowClicked: onRowClicked,
	// 	onCellFocused: onCellFocused,
	// };

	// create handler function
	// function onGridReady() {
	// 	var gridDiv = document.querySelector('#myGrid');
	// 	new Grid(gridDiv, gridOptions);
	// 	console.log('The grid is now ready');
	// }
	
	function onRowClicked(event, val) {
		console.log('a row was clicked', event.rowIndex);
		const selectedSymbol = event.data.symbol;
		history.push(`/stocks_detail/${selectedSymbol}`);
	}

	// function onCellFocused(event, val) {
	// 	console.log('a cell was clicked');
	// }

	const stock_name_symbol = [];
	var i;
	for(i = 0; i < rowData.length; i++) {
		stock_name_symbol.push({symbol: rowData[i].symbol, name: rowData[i].name});
	}

	// Creata a unique industry array
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

		//console.log(gridApi);
		console.log("Stock Search changed! "+(value!==null?value.name:"Null"));
		if(gridApi) {
			var filterInstance = gridApi.getFilterInstance('name');
			if(value && value.name.length !== "") {
				filterInstance.setModel({
					type: 'equals',
					filter: value.name
				});
				setTextValue(event.target.value);
			} 
			// reset the filter if the value is empty.
			else { 
				filterInstance.setModel(null);
				setTextValue('');
			}
			// Tell grid to run filter operation again
			gridApi.onFilterChanged();
			var dataLength = gridApi.getModel().rootNode.childrenAfterFilter.length;
			console.log(dataLength +" results after filtered")
			var height = 100 + (dataLength >= 10 ? 450 : dataLength * 50);
			setWidthAndHeight('100%', `${height}px`);
		}
	}

	function onChangeIndustry(event, value) {
		
		console.log("Industry Filter changed! "+(value!==null?value.industry:"Null"));

		if(gridApi) {
			var filterInstance = gridApi.getFilterInstance('industry');
			if(value && value.industry.length !== "") {
				filterInstance.setModel({
					type: 'equals',
					filter: value.industry
				});
				setTextValue2(event.target.value);
				
			} 
			// reset the filter if the value is empty.
			else { 
				filterInstance.setModel(null);
				setTextValue2('');
			}
			// Tell grid to run filter operation again
			gridApi.onFilterChanged();
			var dataLength = gridApi.getModel().rootNode.childrenAfterFilter.length;
			console.log(dataLength +" results after filtered")
			var height = 100 + (dataLength >= 10 ? 450 : dataLength * 50);
			setWidthAndHeight('100%', `${height}px`);
		}
	}

	// button to reset the filter, perhaps this is redundant
	function clearFilter() {
		gridApi.setFilterModel(null);
		setTextValue('');
		setTextValue2('');
		// Tell grid to run filter operation again
		gridApi.onFilterChanged();
		//document.getElementById("search-stock-combo").value = null;
		//document.getElementById("filter-industry-combo").value = null;
		setWidthAndHeight('100%', '550px');
	}

	function setWidthAndHeight(width, height) {
		var eGridDiv = document.querySelector('#myGrid');
		eGridDiv.style.width = width;
		eGridDiv.style.height = height;
		gridApi.doLayout();
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

	// just a small effect change of hint texts
	function onExpandPanelChange(event, expand) {
		document.getElementById('filterHint').innerHTML = "<b>Filters</b> (Click to "+(expand?"collapse":"expand")+")";
	}

	return (
		<div className="container">
			<p>
				<Badge color="success">{rowData.length}</Badge> Stocks found in the
				system
			</p>
			<ExpansionPanel 
				defaultExpanded="true"
				onChange={onExpandPanelChange}
			>
      			<ExpansionPanelSummary
          			expandIcon={<ExpandMoreIcon />}
          			aria-controls="panel1a-content"
          			id="panel1a-header"
        		>
          		<Typography className={classes.heading} id="filterHint"><b>Filters</b> (Click to collapse)</Typography>
        		</ExpansionPanelSummary>

        		<ExpansionPanelDetails>
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
								value={textValue}
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
							renderInput={(params) => (
							<TextField {...params} 
								label="Filter by Industries" 
								variant="outlined"
								value={textValue2}
							/>
							)}
						/>
						<Button color="info" size="sm" className="mt-3" onClick={clearFilter}>Clear Filter</Button>
					</form>
        		</ExpansionPanelDetails>
      		</ExpansionPanel>
			
			<div id="myGrid" className="ag-theme-alpine-dark"
				style={{ height: "550px", width: "100%" }} >
				<AgGridReact
					columnDefs={columnDefs}
					rowData={rowData}
					onGridReady={ params => setGridApi(params.api) }
					onRowClicked={onRowClicked}
					pagination={true}
					paginationPageSize={10}
				/>
			</div>
		</div>
	);
}