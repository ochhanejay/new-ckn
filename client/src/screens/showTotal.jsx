import React from 'react';
import "./showTotal.css";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const ShowTotal = () => {
  return (
    <div><div className="col-4 card itemCard">
    
  <TextField
        id="date"
        label="Birthday"
        type="date"
        defaultValue="2017-05-24"
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        className="cardItem"
      />
  <div className="card-body">
    <h5 className="card-title textCard">Select Date</h5>
    <div className='d-flex' style={{justifyContent:"space-between"}}>
    <h4 className='text-danger'>djdjjd</h4>
    <button variant="contained" color="secondary">Add To Cart</button>
    </div>
   
</div>
    </div></div>
  )
}

export default ShowTotal;