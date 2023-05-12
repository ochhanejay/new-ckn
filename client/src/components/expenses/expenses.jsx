import React, { useState, useEffect } from "react";
import "../../screens/screen.css";
import "../../screens/dropDownCircle.css";
import axios from "axios";
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import TextField from '@mui/material/TextField';
import Pending_Bill from '../../screens/Pending_Bill'
import Success_Order from '../../screens/Success_Order'
import TakeOrder from '../../screens/takeOrder'
import ShowDailyExpense from "./showDailyExpense";
import AddCategory from "./addCategory";
import DailyExpense from "./dailyExpense";
import { expenseContext } from "../../contexts/expenseContext";

const Expenses = () => {
  const {
    refreshCategory, setRefreshCategory, setExpenseDate
  } = React.useContext(expenseContext);
  const history = useNavigate();

  const [dropDown, setDropDown] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const logout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("time");
    localStorage.removeItem("wangdu");
    history("/login");
  }
  const checkLogin = () => {
    if (localStorage.getItem("tokens") === undefined || localStorage.getItem("tokens") === null) {
      history('/login');
    }

  }


  React.useEffect(checkLogin, [1]);
  const handlers = useSwipeable({
    onSwipedRight: () => history('/'),
    onSwipedLeft: () => history('/monthly')

  });
  const handleDateChange = (e) => {
    setExpenseDate(e.target.value);
    setRefreshCategory(!refreshCategory);
  }

  const changeDate = () => { setRefreshCategory(!refreshCategory); }
  return (
    <div className='mainScreen_Bg' {...handlers} style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className='row '>
        <div className='col-sm-9 col-md-9 col-lg-9 col-xl-10'>
          <ShowDailyExpense ></ShowDailyExpense>
        </div>
        <div className='col-sm-3 col-md-3 col-lg-3 col-xl-2'>
          <div className='row '>

            <div className='col-lg-12 col-md-12 col-sm-12 col-xl-12'>
              {localStorage.getItem("wangdu") === "admin" ? <button className="glow-button  mb-2 mt-4" style={{ width: "10.5rem", height: "2.5rem", alignItems: "center" }} onClick={(e) => setShowExpense(!showExpense)}> {showExpense === false ? "Add Category" : "Show Expenses"}</button> :
                ""
              }
              {showExpense === false ? <DailyExpense /> : <AddCategory />}

            </div>
          </div>
        </div>

      </div>

      <div id="circularMenu1" className={`circular-menu circular-menu-left ${dropDown === true ? "active" : ""}`}>


        <a className="floating-btn dropDownCircle-hover" onClick={(e) => setDropDown(!dropDown)}>
          {dropDown === true ? <CloseIcon className="fs-1 mb-1"></CloseIcon> : <TableRowsRoundedIcon className="fs-1 mb-1" ></TableRowsRoundedIcon>}
        </a>

        <menu className="items-wrapper">
          <button href="#" className="menu-item dropDownMenu-hover">
            <NavLink to="/" style={{ textDecoration: "none", color: "white" }}>
              <p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }}>Order</p>
            </NavLink>
          </button>
          <button href="#" className="menu-item dropDownMenu-hover"><p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }} onClick={logout}>Logout</p></button>
          <button href="#" className="menu-item dropDownMenu-hover"><p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }} data-bs-toggle="modal"
            data-bs-target="#myTotal">Add</p></button>
          {localStorage.getItem("wangdu") === "admin" ?
            <button href="#" className="menu-item dropDownMenu-hover">
              <NavLink to="/monthly" style={{ textDecoration: "none", color: "white" }}>
                <p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }}>Month</p>
              </NavLink>
            </button>
            : ""}

        </menu>

      </div>
      <div id="myTotal" className="modal fade ">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header flex-column">

              <TextField
                id="date"
                label="Select Date"
                color="secondary"
                type="date"
                className="text-white"
                onChange={(e) => handleDateChange(e)}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => changeDate(e)}
                className="btn btn-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Change Date
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Expenses