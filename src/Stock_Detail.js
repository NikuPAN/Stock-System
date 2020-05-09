import React, { useState, useEffect } from "react";
import "./styles.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "reactstrap";


export default function Stock_Detail(name) {

  const [rowData, setRowData] = useState([]);
  
  useEffect(() => {
    fetch('http://131.181.190.87:3001/history?symbol='+name)
      .then(res => res.json())
      .then(data =>
        data.map(stock => {
          return {
            timestamp: stock.timestamp,
            symbol: stock.symbol,
            name: stock.name,
            industry: stock.industry,
            open: stock.open,
            high: stock.high,
            low: stock.low,
            close: stock.close,
            volume: stock.volume
          };
        })
      )
      .then(stocks => setRowData(stocks));
  }, []);

  const columns = [
    { headerName: "Timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter" },
    //{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
    //{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
    //{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 },
    { headerName: "Open", field: "open", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "High", field: "high", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "Low", field: "low", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "Close", field: "close", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "Volume", field: "volume", sortable: true, filter: "agNumberColumnFilter" }
  ];
  
  const stock_name_symbol = [];
  const industries = [];
  var i;
  for(i = 0; i < rowData.length; i++) {
    stock_name_symbol.push({symbol: rowData[i].symbol, name: rowData[i].name});
    industries.push({industry: rowData[i].industry});
  }

  // Filter only shows unique value
  var industries_uni = [], flags = [];
  for(i = 0; i < rowData.length; i++) {
    // if this is true, don't copy
    if(flags[rowData[i].industry])
        continue;
    flags[rowData[i].industry] = true;
    industries_uni.push({industry: rowData[i].industry});
  }

  return (
    <div className="container">

      <h1>Stock History For: 
        <script>(rowData[0].symbol) rowData[0].name </script>
      </h1>
      
      <div className="ag-theme-alpine-dark"
        style={{ height: "550px", width: "1024px" }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
      <Button
        color="info" size="sm" className="mt-3"
        target="_blank"
        
      >
        Back to Stocks Page
      </Button>
    </div>
  );
}