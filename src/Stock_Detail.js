import React, { useState, useEffect } from "react";
import "./styles.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
//import TextField from '@material-ui/core/TextField';
//import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button } from "reactstrap";


export default function Stock_Detail() {

  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [columnDefs, setColumnDefs] = useState([
		{ headerName: "Timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter", minWidth: 220 },
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
    fetch('http://131.181.190.87:3001/history?symbol=AAPL')
      .then(res => res.json())
      .then(data =>
        data.map(stock => {
          return {
            timestamp: new Date(stock.timestamp).toLocaleString("en-AU"),
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

  // const columns = [
  //   { headerName: "Timestamp", field: "timestamp", sortable: true, filter: "agDateColumnFilter", minWidth: 220 },
  //   //{ headerName: "Symbol", field: "symbol", sortable: true, filter: "agTextColumnFilter", minWidth: 250 },
  //   //{ headerName: "Name", field: "name", sortable: true, filter: "agTextColumnFilter", minWidth: 400 },
  //   //{ headerName: "Industry", field: "industry", sortable: true, filter: "agTextColumnFilter", minWidth: 350 },
  //   { headerName: "Open", field: "open", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
  //   { headerName: "High", field: "high", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
  //   { headerName: "Low", field: "low", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
  //   { headerName: "Close", field: "close", sortable: true, filter: "agNumberColumnFilter", maxWidth: 150 },
  //   { headerName: "Volumes", field: "volumes", sortable: true, filter: "agNumberColumnFilter" }
  // ];
  
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

  return (
    <div className="container">

      <h2>Stock History For: 
        <script>(rowData[0].symbol) rowData[0].name </script>
      </h2>
      <ExpansionPanel>
      <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Filters</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <div className="ag-theme-alpine-dark"
        style={{ height: "550px", width: "100%" }} >
        <AgGridReact
					columnDefs={columnDefs}
					rowData={rowData}
					onGridReady={ params => setGridApi(params.api) }
					// onRowClicked={}
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