import 'date-fns';
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
//import { FormRow } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// export default function DatePickers(props) {
export default function DatePickers(props) {
  
  // Initialize
  // note the month index is from 0 to 11, represents january to december 
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date(2019, 10, 6));
  const [selectedDateTo, setSelectedDateTo] = useState(new Date(2020, 2, 25));

  // useEffect(() => {
  //   var i, earliest, latest;
  //   // Get the earliest and lastest date of the stock
  //   // Make sure there is data available
  //   if(props.data.length > 0) {
  //     earliest = new Date(props.data[0].timestamp);
  //     latest = new Date(props.data[0].timestamp);
  //     for(i = 0; i < props.data.length; i++) {
  //       var currDate = new Date(props.data[i].timestamp);
  //       if(currDate > latest) {
  //         latest = currDate;
  //       }
  //       if(currDate < earliest) {
  //         earliest = currDate;
  //       }
  //       // else not doing anything
  //     }
  //     setSelectedDateFrom(earliest);
  //     setSelectedDateTo(latest);
  //   }
  // }, [props.data, props.data.length]);

  // Handling functions for change
  function dateChangeFrom(date) { // (event, date) can be used but event is not needed
    setSelectedDateFrom(date);
    // update parent
    props.onDatesChange(date, selectedDateTo);
  }

  function dateChangeTo(date) { // (event, date) can be used but event is not needed
    setSelectedDateTo(date);
    // update parent
    props.onDatesChange(selectedDateFrom, date);
  }
  
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          id="date-picker-from"
          label="From (Inclusive)"
          variant="inline"
          margin="normal"
          format="dd/MM/yyyy"
          value={selectedDateFrom}
          onChange={dateChangeFrom}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          id="date-picker-to"
          label="To (Exclusive)"
          variant="inline"
          margin="normal"
          format="dd/MM/yyyy"
          value={selectedDateTo}
          onChange={dateChangeTo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}