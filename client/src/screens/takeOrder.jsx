import React, { useState, useEffect } from "react";
import "./screen.css";
import "./dropDownCircle.css";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { authContext } from "../contexts/cknContext";
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import $ from "jquery";
import { NavLink, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import ShowTotal from "./showTotal";
import TextField from '@mui/material/TextField';

export default function TakeOrder() {
  const history = useNavigate();

  const {
    pendingOrder,
    setPendingOrder,
    editItem,
    setEditItem,
    URL,
    newDate,
    setNewDate,
    successOrder,
    setSuccessOrder,
    orderNumber, setOrderNumber,
    getOrder, setGetOrder,
    showOrder, setShowOrder,
    token
  } = React.useContext(authContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState(true);
  const [orderNo, setOrderNo] = useState(0);
  const [chai, setChai] = useState(false);
  const [chaiAmount, setChaiAmount] = useState(0);
  const [chaiQuantity, setChaiQuantity] = useState(0);
  const [coffee, setCoffee] = useState(false);
  const [coffeeAmount, setCoffeeAmount] = useState(0);
  const [coffeeQuantity, setCoffeeQuantity] = useState(0);
  const [cigarette, setcigarette] = useState(false);
  const [cigaretteAmount, setCigaretteAmount] = useState(0);
  const [cigaretteQuantity, setCigaretteQuantity] = useState(0);
  const [dropDown, setDropDown] = useState(false);
  const [dateTotal, setDateTotal] = useState();
  const [totalRevenue, setTotalRevenue] = useState([]);

  const chaiItem = [10, 12, 15];
  const coffeeItem = [20, 25, 60];
  const cigaretteItem = [8, 12, 15, 20];
  const clearData = () => {
    setCigaretteQuantity(0);
    setCigaretteAmount(0);
    setcigarette(false);
    setCoffeeQuantity(0);
    setCoffeeAmount(0);
    setCoffee(false);
    setChaiQuantity(0);
    setChaiAmount(0);
    setChai(false);
    setTotalAmount(0);
  };



  const addAmount = (e) => {
    const { name, value } = e.target;
    if (name === "chaiAmount") {
      if (chai === true) {
        const chai = parseInt(chaiAmount) - parseInt(value);
        setChaiQuantity(parseInt(chaiQuantity) - 1);
        setChaiAmount(chai);
      } else {
        const chai = parseInt(chaiAmount) + parseInt(value);
        setChaiQuantity(parseInt(chaiQuantity) + 1);
        setChaiAmount(chai);
      }
    }
    else if (name === "coffeeAmount") {
      if (coffee === true) {
        const coffee = parseInt(coffeeAmount) - parseInt(value);
        setCoffeeQuantity(parseInt(coffeeQuantity) - 1);
        setCoffeeAmount(coffee);


      } else {
        const coffee = parseInt(coffeeAmount) + parseInt(value);
        setCoffeeQuantity(parseInt(coffeeQuantity) + 1);
        setCoffeeAmount(coffee);
      }
    }
    else if (name === "cigaretteAmount") {
      if (cigarette === true) {
        const cigarette = parseInt(cigaretteAmount) - parseInt(value);
        setCigaretteQuantity(parseInt(cigaretteQuantity) - 1);
        setCigaretteAmount(cigarette);

      }
      else {
        const cigarette = parseInt(cigaretteAmount) + parseInt(value);
        setCigaretteQuantity(parseInt(cigaretteQuantity) + 1);
        setCigaretteAmount(cigarette);
      }
    }
  };
  useEffect(() => {
    let total =
      parseInt(chaiAmount) + parseInt(coffeeAmount) + parseInt(cigaretteAmount);
    setTotalAmount(total);
  }, [chaiAmount, coffeeAmount, cigaretteAmount]);

  useEffect(() => {
    if (editItem.length > 0) {
      setOrderNo(editItem[0].orderNo);
      setCigaretteQuantity(editItem[0].cigaretteQuantity);
      setCigaretteAmount(editItem[0].cigarette);
      setcigarette(false);
      setCoffeeQuantity(editItem[0].coffeeQuantity);
      setCoffeeAmount(editItem[0].coffee);
      setCoffee(false);
      setChaiQuantity(editItem[0].chaiQuantity);
      setChaiAmount(editItem[0].chai);
      setChai(false);
      // setTotalAmount(editItem[0].orderTotal);
    }
  }, [editItem]);

  const addData = async () => {
    const data = {
      orderNo: orderNumber,
      chai: chaiAmount,
      chaiQuantity: chaiQuantity,
      coffee: coffeeAmount,
      coffeeQuantity: coffeeQuantity,
      cigarette: cigaretteAmount,
      cigaretteQuantity: cigaretteQuantity,
      date: newDate,
      time: new Date().toLocaleTimeString(),
      orderStatus: "PENDING",
      paymentMode: paymentMode === true ? "Online" : "Offline",
      orderTotal: totalAmount,
    };
    if (totalAmount > 0 && coffeeAmount >= 0 && chaiAmount >= 0 && cigaretteAmount >= 0) {
      await axios.post(`${URL}/setCknItems`, data,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokens")}`
          },
        }
      ).then(
        async (resp) => {
          if (resp.status === 200) {
            clearData();
            setPendingOrder(!pendingOrder);
            setGetOrder(!getOrder);
          }
        },
        (err) => {
          console.log(err);
          if (err.response.data === "Forbidden") {
            logout();
          }
        }
      );
    } else {
      if (coffeeAmount <= 0) {
        setCoffeeQuantity(0);
        setCoffeeAmount(0);
      }
      if (chaiAmount <= 0) {
        setChaiAmount(0);
        setChaiQuantity(0);
      }
      if (cigaretteAmount <= 0) {
        setCigaretteAmount(0);
        setCigaretteQuantity(0);
      }
      alert("please add something");
    }
  };
  const addSuccessData = async () => {
    const data = {
      orderNo: orderNumber,
      chai: chaiAmount,
      chaiQuantity: chaiQuantity,
      coffee: coffeeAmount,
      coffeeQuantity: coffeeQuantity,
      cigarette: cigaretteAmount,
      cigaretteQuantity: cigaretteQuantity,
      date: newDate,
      time: new Date().toLocaleTimeString(),
      orderStatus: "success",
      paymentMode: paymentMode === true ? "Online" : "Offline",
      orderTotal: totalAmount,
    };
    if (totalAmount > 0) {
      await axios.post(`${URL}/setCknItems`, data, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("tokens")}`
        },
      }).then(
        async (resp) => {
          if (resp.status === 200) {
            clearData();
            setPendingOrder(!pendingOrder);
            setSuccessOrder(!successOrder);
            setGetOrder(!getOrder);
          }
        },
        (err) => {
          console.log(err);
          if (err.response.data === "Forbidden") {
            logout();
          }
        }
      );
    } else {
      alert("please add something");
    }
  };
  const editData = (e, dt) => {
    const Id = editItem[0]._id;
    const data = {
      orderId: editItem[0].orderId,
      orderNo: editItem[0].orderNo,
      chai: chaiAmount,
      chaiQuantity: chaiQuantity,
      coffee: coffeeAmount,
      coffeeQuantity: coffeeQuantity,
      cigarette: cigaretteAmount,
      cigaretteQuantity: cigaretteQuantity,
      date: newDate,
      time: editItem[0].time,
      orderStatus: "PENDING",
      paymentMode: paymentMode === true ? "Online" : "Offline",
      orderTotal: totalAmount,
    };
    axios.put(`${URL}/updateCknItems?id=${Id}`, data, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(
      (resp) => {
        if (resp.status === 200) {
          setPendingOrder(!pendingOrder);
          setEditItem([]);
          clearData();
          setGetOrder(!getOrder);

          // setSuccessOrder(!successOrder);
          // setData(resp.data);
        }
      },
      (err) => {
        console.log(err);
        if (err.response.data === "Forbidden") {
          logout();
        }
      }
    );
  };
  const editDataSuccess = (e, dt) => {
    const Id = editItem[0]._id;
    const data = {
      orderId: editItem[0].orderId,
      orderNo: editItem[0].orderNo,
      chai: chaiAmount,
      chaiQuantity: chaiQuantity,
      coffee: coffeeAmount,
      coffeeQuantity: coffeeQuantity,
      cigarette: cigaretteAmount,
      cigaretteQuantity: cigaretteQuantity,
      date: newDate,
      time: editItem[0].time,
      orderStatus: "success",
      paymentMode: paymentMode === true ? "Online" : "Offline",
      orderTotal: totalAmount,
    };
    axios.put(`${URL}/updateCknItems?id=${Id}`, data, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(
      (resp) => {
        setPendingOrder(!pendingOrder);
        setSuccessOrder(!successOrder);
        if (resp.status === 200) {

          setEditItem([]);
          clearData();
          setGetOrder(!getOrder);
        }
      },
      (err) => {
        console.log(err);
        if (err.response.data === "Forbidden") {
          logout();
        }
      }
    );
  };
  useEffect(() => {
    if (coffeeAmount <= 0 || coffeeQuantity <= 0) {
      setCoffeeQuantity(0);
      setCoffeeAmount(0);
      setCoffee(false);

    }
    if (chaiAmount <= 0 || chaiQuantity <= 0) {
      setChaiAmount(0);
      setChaiQuantity(0);
      setChai(false);

    }
    if (cigaretteAmount <= 0 || cigaretteQuantity <= 0) {
      setCigaretteAmount(0);
      setCigaretteQuantity(0);
      setcigarette(false);
    }
  }, [chaiAmount, coffeeAmount, cigaretteAmount]);
  const logout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("time");
    localStorage.removeItem("wangdu");

    history("/login");
  }
  const swipeEvent = () => {
  }
  const handlers = useSwipeable({
    onSwipedRight: () => editItem.length > 0 ? editData() : addData()

  });
  const clearOrderNumber = () => {
    axios.put(`${URL}/deleteCounterNumber`);
    setGetOrder(!getOrder);

  }
  const handleTotalChange = (e) => {
    const dates = e.target.value;
    const my = dates.split("-");
    const myArray = `${my[2]}/${my[1]}/${my[0]}`;
    setDateTotal(myArray);
  }
  const getTodayRevenue = () => {
    axios.get(`${URL}/getTotalByDate?date=${dateTotal}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp => {
      setTotalRevenue(resp.data.data);
    }, err => {
      console.log(err)
    });
  }
  return (
    <div className="mt-5 ps-2" style={{ height: "100vh" }}>
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-sm-7 col-md-7 col-lg-12 col-xl-12" style={{ height: "100vh" }}>
          <div className="row">
            <div className="col-lg-3 tea col-xl-3">
              <div className={`btn-g btn-blob glow-image-hover ${chai === true ? "imggg" : ""}`} onClick={(e) => setChai(!chai)}><img className="img-fluid d-flex align-item-center" src="/images/chai.png"></img></div>
              <div className="buttonHolder">
                {[
                  { className: "button heart", value: "10" },
                  { className: "button cross", value: "12" },
                  // { className: "button flower", value: "20" },
                  { className: "button tick", value: "15" },
                ].map((c, i) => (

                  <button
                    onClick={(e) => addAmount(e)}
                    name="chaiAmount"
                    type="button"
                    className={` glow-on-hover text-light text-center fs-3  fw-bold ${c.className} ${chai === true ? "imggg" : ""}`}
                    value={c.value}
                    key={i}
                  >
                    {c.value}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-1">
              <div className="divider"></div>
            </div>
            <div className="col-lg-3 tea col-xl-3">
              <div onClick={(e) => setCoffee(!coffee)} className={`btn-g btn-blob glow-image-hover ${coffee === true ? "imggg" : ""}`}><img className="img-fluid d-flex align-item-center" src="/images/coffee.png"></img></div>

              <div className="buttonHolder">
                {[
                  { className: "button heart", value: "20" },
                  { className: "button cross", value: "22" },
                  { className: "button cross", value: "25" },
                  // { className: "button flower", value: "20" },
                  { className: "button tick", value: "59" },
                  { className: "button tick", value: "69" },
                  // { className: "button tick", value: "79" },
                  // { className: "button tick", value: "89" },
                ].map((c, i) => (

                  <button
                    onClick={(e) => addAmount(e)}
                    name="coffeeAmount"
                    type="button"
                    className={` glow-on-hover text-light text-center fs-3  fw-bold ${c.className} ${coffee === true ? "imggg" : ""}`}
                    value={c.value}
                    key={i}
                  >
                    {c.value}
                  </button>
                ))}
              </div>




            </div>
            <div className="col-lg-1">
              <div className="divider"></div>
            </div>
            <div className="col-lg-3 tea col-xl-3">
              <div onClick={(e) => setcigarette(!cigarette)} className={`btn-g btn-blob glow-image-hover ${cigarette === true ? "imggg" : ""}`}><img className="img-fluid d-flex align-item-center" src="/images/cigrate.png"></img></div>

              <div className="buttonHolder justify-content-center">
                {[
                  { className: "button heart", value: "8" },
                  { className: "button heart", value: "12" },
                  { className: "button heart", value: "15" },
                  { className: "button heart ml-5", value: "20" },
                ].map((c) => (

                  <button
                    onClick={(e) => addAmount(e)}
                    name="cigaretteAmount"
                    type="button"
                    className={` glow-on-hover text-light text-center fs-3  fw-bold ${c.className} ${cigarette === true ? "imggg" : ""}`}
                    value={c.value}
                    key={c.value}
                  >
                    {c.value}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-12 tea col-xl-12">
              <div className="row">
                <div className="col-sm-5 col-md-5 col-lg-1 offset-lg-8 col-xl-1 ">


                  <div id="circularMenu1" className={`circular-menu circular-menu-left ${dropDown === true ? "active" : ""}`}>

                    <a className="floating-btn dropDownCircle-hover" onClick={(e) => setDropDown(!dropDown)}>
                      {dropDown === true ? <CloseIcon className="fs-1 mb-1"></CloseIcon> : <TableRowsRoundedIcon className="fs-1 mb-1" ></TableRowsRoundedIcon>}
                    </a>

                    <menu className="items-wrapper">
                      <button href="#" className="menu-item fs-6 dropDownMenu-hover" onClick={(e) => setShowOrder(!showOrder)}><p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }}>{showOrder === false ? "Success" : "Pending"}</p></button>
                      <button href="#" className="menu-item dropDownMenu-hover"><p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }} onClick={logout}>Logout</p></button>
                      {localStorage.getItem("wangdu") === "admin" ? <button href="#" className="menu-item dropDownMenu-hover"><p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }} data-bs-toggle="modal"
                        data-bs-target="#myTotal">Total</p></button> : ""}
                      <button href="#" className="menu-item dropDownMenu-hover"><p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }} data-bs-toggle="modal"
                        data-bs-target="#myModal">Clear</p></button>
                      {localStorage.getItem("wangdu") === "worker" ? <button href="#" className="menu-item dropDownMenu-hover">
                        <NavLink to="/expenses" style={{ textDecoration: "none", color: "white" }}>
                          <p style={{ fontSize: "0.7rem", marginTop: "0.4rem" }}>Catego</p>
                        </NavLink>
                      </button> : ""}
                    </menu>

                  </div>
                </div>
                <div id="myModal" className="modal fade">
                  <div className="modal-dialog modal-confirm">
                    <div className="modal-content">
                      <div className="modal-header flex-column">
                        <div className="icon-box">
                          <CloseIcon
                            className="material-icons"
                            type="button"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            &#xE5CD;
                          </CloseIcon>
                        </div>
                        <h4 className="modal-title w-100">Are you sure?</h4>
                      </div>
                      <div className="modal-body">
                        <p>
                          Do you really want to delete Order Numbers? This process cannot be
                          undone.
                        </p>
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
                          onClick={clearOrderNumber}
                          className="btn btn-danger"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Clear Order Number
                        </button>
                      </div>
                    </div>
                  </div>
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
                          onChange={(e) => handleTotalChange(e)}
                          sx={{ width: 220 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      {totalRevenue ?
                        totalRevenue.map((total) => <div className="modal-body">
                          <h6>Chai Amount ={total.chaiAmount} </h6>
                          <h6>Coffee Amount = {total.coffeeAmount}</h6>
                          <h6>Cigarette Amount = {total.cigaretteAmount}</h6>
                          <h4>Total Amount ={total.totalAmount}</h4>

                        </div>) : ""}
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
                          onClick={getTodayRevenue}
                          className="btn btn-danger"
                        // data-bs-dismiss="modal"
                        // aria-label="Close"
                        >
                          Get Total
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-5 col-md-5 col-lg-4 offset-lg-8 col-xl-3 "  {...handlers} >
                  <section
                    style={{ overflowY: "auto", maxHeight: "44rem", padding: "1rem", marginTop: "-1rem" }}
                  >
                    <div className="card col-lg-12 col-xl-12" style={{ borderBottom: "dashed" }}>
                      <div className="text-center fs-6 ">
                        <div className="d-flex justify-content-between">
                          <button className="btn" onClick={(e) => clearData(e)}>
                            <DeleteIcon className="text-danger fs-1" />
                          </button>
                          <div> Order No.{editItem.length > 0 ? orderNo : orderNumber} </div>

                          {editItem.length > 0 ? <button
                            className="btn text-success"
                            onClick={(e) => editDataSuccess(e)}
                          >
                            <CheckCircleIcon className="fs-1" />
                          </button> : <button
                            className="btn text-success"
                            onClick={(e) => addSuccessData(e)}
                          >
                            <CheckCircleIcon className="fs-1" />
                          </button>}
                        </div>
                      </div>

                      <div style={{ borderBottom: "dashed" }}></div>
                      {chaiAmount > 0 ? (
                        <div className="row d-flex justify-content-around mt-1">
                          <span
                            className="text-start col-8"
                            style={{ paddingLeft: "11%" }}
                          >
                            {`${chaiQuantity} x Chai`}
                          </span>
                          <span className="col-4">{chaiAmount} &#8377;</span>
                        </div>
                      ) : (
                        ""
                      )}
                      {coffeeAmount > 0 ? (
                        <div className="row d-flex justify-content-around mt-1">
                          <span
                            className="text-start col-8"
                            style={{ paddingLeft: "11%" }}
                          >
                            {`${coffeeQuantity} x Coffee`}
                          </span>
                          <span className="col-4">{coffeeAmount} &#8377;</span>
                        </div>
                      ) : (
                        ""
                      )}
                      {cigaretteAmount > 0 ? (
                        <div className="row d-flex justify-content-around mt-1">
                          <span
                            className="text-start col-8"
                            style={{ paddingLeft: "11%" }}
                          >
                            {`${cigaretteQuantity} x cigarette`}
                          </span>
                          <span className="col-4"> {cigaretteAmount} &#8377;</span>
                        </div>
                      ) : (
                        ""
                      )}

                      <div style={{ borderBottom: "dashed" }} className="my-2"></div>

                      <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        <div className="d-flex mx-3 justify-content-between ">
                          <span className="">TOTAL AMOUNT</span>
                          <span>{totalAmount} &#8377;</span>
                        </div>
                        <div className="d-flex mx-3 justify-content-between">
                          <span className="mt-2">PAYMENT MODE</span>

                          <span
                            style={{ cursor: "pointer" }}
                            onClick={(e) => setPaymentMode(!paymentMode)}
                          >
                            {paymentMode === true ? (
                              <p className="text-primary fs-4">Online</p>
                            ) : (
                              <p className="text-danger fs-4">Offline</p>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        {editItem.length > 0 ? (
                          <button className="btn" onClick={(e) => editData(e)}>
                            <ArrowCircleRightIcon sx={{ fontSize: 40 }} />
                          </button>
                        ) : (
                          <button className="btn" onClick={(e) => addData(e)}>
                            <ArrowCircleRightIcon sx={{ fontSize: 40 }} />
                          </button>
                        )}
                      </div>
                      {/* <div className=""><span className="fs-3">*****</span><span>THANK YOU</span><span className="fs-3">*****</span></div>*/}
                    </div>
                  </section>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
