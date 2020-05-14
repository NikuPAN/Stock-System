import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

export default function PricePickers(props) {

    // Initialize
    const [selectedPriceFrom, setSelectedPriceFrom] = useState(0.0);
    const [selectedPriceTo, setSelectedPriceTo] = useState(500.0);

    const useStyles = makeStyles(theme => ({
        root: {
          "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "25ch"
          }
        }
      }));
    const classes = useStyles();

    // useEffect(() => {
    //     // Initialize value of close
    //     var close_lowest = 0.0;
    //     var close_highest = 999.0;
    //     // Make sure there is data available
    //     if(props.data.length > 0) {
    //         var i;
    //         // get the highest and lowest price of close.
    //         close_highest = props.data[0].close;
    //         close_lowest = props.data[0].close;
            
    //         for(i = 0; i < props.data.length; i++) {
    //             if(props.data[i].close > close_highest) {
    //                 close_highest = props.data[i].close;
    //             } 
    //             if(props.data[i].close < close_lowest) {
    //                 close_lowest = props.data[i].close;
    //             }
    //             // else not doing anything
    //         }
    //     }
    //     setSelectedPriceFrom(close_lowest);
    //     setSelectedPriceTo(close_highest);
    // }, [props.data, props.data.length]);
    
    // Although setstate can be used
    // There is some custom trick to pass the data back to stock detail
    function priceChangeFrom(event) {
        var value = event.target.value;
        setSelectedPriceFrom(value);
        // update parent
        props.onPricesChange(value, selectedPriceTo);
        
    }

    function priceChangeTo(event) {
        var value = event.target.value;
        setSelectedPriceTo(value);
        // update parent
        props.onPricesChange(selectedPriceFrom, value);
    }

    // function priceUpdated() {
    //     props.onPricesChange(selectedPriceFrom, selectedPriceTo);
    // }

    return (
        <form className={classes.root} noValidate autoComplete="off">
          <div>
            <TextField
                id="outlined-number"
                label="From"
                type="number"
                inputProps={{ min: "0.0", max: "999.9", step: "1.0" }}
                InputLabelProps={{
                    shrink: true
                }}
                variant="outlined"
                value={selectedPriceFrom}
                onChange={priceChangeFrom}
            />
            <TextField
                id="outlined-number"
                label="To"
                type="number"
                inputProps={{ min: "0.0", max: "999.9", step: "1.0" }}
                InputLabelProps={{
                    shrink: true
                }}
                variant="outlined"
                value={selectedPriceTo}
                onChange={priceChangeTo}
            />
            {/*console.log(props.min+":"+props.max)*/}
          </div>
        </form>
    );
}