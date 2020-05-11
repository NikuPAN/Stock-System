import 'date-fns';
import React, { useState }  from 'react';
import Grid from '@material-ui/core/Grid';
//import { FormRow } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePickers() {

  // The first commit of Material-UI
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date());
  const [selectedDateTo, setSelectedDateTo] = useState(new Date());

  function dateChangeFrom(date) {
    setSelectedDateFrom(date);
  }

  function dateChangeTo(date) {
    setSelectedDateTo(date);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          id="date-picker-from"
          label="From"
          variant="inline"
          margin="normal"
          format="yyyy/MM/dd"
          value={selectedDateFrom}
          onChange={dateChangeFrom}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          id="date-picker-to"
          label="To"
          variant="inline"
          margin="normal"
          format="yyyy/MM/dd"
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