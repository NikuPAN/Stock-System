import React, { Component } from "react";
import "./styles.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Badge } from "reactstrap";


class Stock extends Component {
    
	constructor(props) {
		super(props);
	
		this.state = {
			columnDefs: [
				{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
				{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
				{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 }
			],
			defaultColDef: {
				flex: 1,
				minWidth: 100,
				filter: true,
				resizable: true,
			},
			rowSelection: 'single',
			rowData: [],
		};
			
		this.stock_name_symbol = [];
		this.industries_uni = [];
	}
	//events
	onGridReady = params => {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
	
		const httpRequest = new XMLHttpRequest();
		const updateData = data => {
			this.setState({ rowData: data });
		};
		httpRequest.open(
			'GET',
			'http://131.181.190.87:3001/all'
		);
		httpRequest.send();
		httpRequest.onreadystatechange = () => {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				updateData(JSON.parse(httpRequest.responseText));
			}
		};
		this.onAutoComplete();
		console.log('The grid is now ready'); 
	};
		
	onRowClicked(params) {
		console.log('Row is clicked'); 
	};
	onCellFocused(params) {
		console.log('A Cell is clicked'); 
	};
	
	onAutoComlete() {
		for(var i = 0; i < this.rowData.length; i++) {
			this.stock_name_symbol.push({symbol: this.rowData[i].symbol, name: this.rowData[i].name});
		}
		var flags = [];
		// Filter only shows each industry once
		for(i = 0; i < this.rowData.length; i++) {
			// if this is true, don't copy
			if(flags[this.rowData[i].industry])
				continue;
			flags[this.rowData[i].industry] = true;
			this.industries_uni.push({industry: this.rowData[i].industry});
		}
	};

	onChangeStock() {
		console.log("Stock changed!");
		// determine the length of the string
		// if the length is greater than 4, then must not be a symbol
		var value = document.getElementById("search-stock-combo").value;
		if(value.length > 4) {
			this.gridApi.api.setFilterModel({
				name: {
					type: 'set',
					values: [document.getElementById("search-stock-combo").value],
				},
			});
		}
		else {
			this.gridApi.setFilterModel({
				symbol: {
					type: 'set',
					values: [document.getElementById("search-stock-combo").value],
				},
			});
		}

		this.gridApi.api.onFilterChanged();
	};

	onChangeIndustry() {

	};

	// clear the filter
	clearFilter() {
		this.gridApi.api.setFilterModel(null);
	};

	useStyles = makeStyles({
		option: {
			fontSize: 15,
			'& > span': {
			marginRight: 10,
			fontSize: 15,
			},
		},
	});
	classes = this.useStyles();

	render() {
		return (
			<div className="container">
				<p>
					<Badge color="success">{this.rowData.length}</Badge> Stocks found in the system
				</p>
				<form autoComplete="off" alignment="right">
					<label htmlFor="search-stock-combo">Search Stock:&nbsp;</label>
					<Autocomplete
						id="search-stock-combo"
						style={{ width: 300 }}
						onChange={this.onChangeStock}
						options={this.stock_name_symbol}
						classes={{
							option: this.classes.option,
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
					<label htmlFor="filter-industry-combo">Sort by Industry:&nbsp;</label>
					<Autocomplete
						id="filter-industry-combo"
						style={{ width: 300 }}
						onChange={this.onChangeIndustry}
						options={this.industries_uni}
						getOptionLabel={(option) => option.industry}
						renderInput={(params) => <TextField {...params} label="Sort by Industries" variant="outlined" />}
					/>
					<Button color="info" size="sm" className="mt-3" onClick={this.clearFilter}>Clear Filter</Button>
				</form>
				
				<div className="ag-theme-alpine-dark"
					style={{ height: "550px", width: "1024px" }} >
					<AgGridReact
						columnDefs={this.gridOptions.columnDefs}
						rowData={this.rowData}
						pagination={true}
						paginationPageSize={10}
					/>
				</div>
			</div>
		);
	}
}

export default Stock;