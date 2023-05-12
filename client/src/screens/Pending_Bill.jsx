import React, { useState,useEffect } from "react";
import "./screen.css";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSwipeable } from "react-swipeable";


import DoneIcon from '@mui/icons-material/Done';

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import { authContext } from "../contexts/cknContext";
import { NavLink, useNavigate } from "react-router-dom";


function Pending_Bill(props) {
  const { pendingOrder, setPendingOrder,successOrder, setSuccessOrder,editItem, setEditItem ,URL,newDate,token, setToken} = React.useContext(authContext);

  const [data,setData]=useState([]);
  const [paymentMode, setPaymentMode] = useState(true);
  const [paymentValue, setPaymentValue] = useState([]);
  const [handleValue, setHandleValue] = useState([]);
  const history = useNavigate();
  const logout=()=>{
    localStorage.removeItem("tokens");
    localStorage.removeItem("time");
    history("/login");
   }
  const getData=async()=>{
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedToday = dd + '/' + mm + '/' + yyyy;
   await axios.get(`${URL}/getCknItemsByDateAndStatus?date=${formattedToday}&status=PENDING`,{
    headers: {
      "Content-type": "application/json",
      Authorization:`Bearer ${localStorage.getItem("tokens")}`
    },
  }).then(resp=>{
      setData(resp.data.data);
      const x=[];
      resp.data.data.map(p=>x.push(p.paymentMode));
      setPaymentValue(x);
    },err=>{
      console.log(err);
      if(err.response.data==="Forbidden"){
        logout();
      }
    })
  }
  useEffect(() => {
    getData();
  }, [pendingOrder,newDate]);

  const addData=(e,dt,i)=>{
    const Id= dt._id;
    const data = {
      orderId:dt.orderId,
      orderNo:dt.orderNo,
      chai:dt.chai,
      chaiQuantity:dt.chaiQuantity,
      coffee:dt.coffee,
      coffeeQuantity:dt.coffeeQuantity,
      cigarette:dt.cigarette,
      cigaretteQuantity:dt.cigaretteQuantity,
      date:newDate,
      orderStatus:"success",
      paymentMode:paymentValue[i],
      orderTotal:dt.orderTotal
    }
    axios.put(`${URL}/updateCknItems?id=${Id}`,data,{
      headers: {
        "Content-type": "application/json",
        Authorization:`Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp=>{
      if(resp.status===200){
      setPendingOrder(!pendingOrder);
      setSuccessOrder(!successOrder);
      // setData(resp.data);
    }
    },err=>{
      console.log(err);
      if(err.response.data==="Forbidden"){
        logout();
      }
    })
  }
  const editData=(e,dt)=>{
    const Id= dt._id;
    
    axios.get(`${URL}/getCknItemsById?id=${Id}`,{
      headers: {
        "Content-type": "application/json",
        Authorization:`Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp=>{
      if(resp.status===200){
        setEditItem(resp.data.data);
      // setPendingOrder(!pendingOrder);
      // setSuccessOrder(!successOrder);
      // setData(resp.data);
    }
    },err=>{
      console.log(err);
      if(err.response.data==="Forbidden"){
        logout();
      }
    })
  }
  const removeItem=(e,dt)=>{
    const Id= dt._id;
    
    axios.delete(`${URL}/removeCknItemsById?id=${Id}`,{
      headers: {
        "Content-type": "application/json",
        Authorization:`Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp=>{
      if(resp.status===200){
        // setEditItem(resp.data.data);
      setPendingOrder(!pendingOrder);
      setSuccessOrder(!successOrder);
      // setData(resp.data);
    }
    },err=>{
      console.log(err);
      if(err.response.data==="Forbidden"){
        logout();
      }
    })
  }
  const changePaymentValue=(e,dt,i)=>{
    let payment={...paymentValue};
    payment[i]= payment[i]==="Online"?"Offline":"Online";
    setPaymentValue(payment);
  }
  // const createHandlers=()=>{
  //   for(let i=0;i<=data.length;data++){
      
  //   }
  // }
  // const handlers = useSwipeable({
  //   onSwipedRight: () =>   alert("11"),
  //   onSwipedLeft:  () => editData()
  
  // });
    return (
        <div className="row" style={{marginRight:"0.2rem"}}>
            <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{overflowY:"auto",scrollbarGutter:"stable-both-edges",overflowX:"hidden",height:"100vh",padding:"1rem"}}>
            {data.length > 0 ? 
              
             data.map((dt,i)=>
             
               <div key={i+18}
                 className="card mt-1" style={{ borderBottom: "dashed" }}>
             <div   className="text-center fs-6 ">
             <div className="d-flex justify-content-between">
      <button className="btn" onClick={(e)=>removeItem(e,dt)}>
      <DeleteIcon className="text-danger fs-1"  />
    </button>
    <div>OrderNo. {dt.orderNo} </div>

      <button className="btn text-success" onClick={(e)=>addData(e,dt,i)}>
      <CheckCircleIcon className="fs-1"  />
    </button>
      </div>
               
             </div>
             <div className="PS-3 fw-bold">
               <span className="ps-3 ">{dt.time}</span>
             </div>
             <div style={{ borderBottom: "dashed" }} ></div>
            {dt.chaiQuantity>0? <div className="row d-flex justify-content-around">
               <span key={i+1} className="text-start col-8" style={{ paddingLeft: "11%" }}>
                { `${dt.chaiQuantity} x Chai`}
               </span>
               <span key={i+2} className="col-4">{dt.chai} &#8377;</span>
             </div>:""}
            {dt.coffeeQuantity>0? <div className="row d-flex justify-content-around">
               <span key={i+3} className="text-start col-8" style={{ paddingLeft: "11%" }}>
               { `${dt.coffeeQuantity} x Coffee`}
               </span>
               <span key={i+4} className="col-4">{dt.coffee} &#8377;</span>
             </div>:""}
           {dt.cigaretteQuantity>0?<div className="row d-flex justify-content-around ">
               <span key={i+5} className="text-start col-8" style={{ paddingLeft: "11%" }}>
               { `${dt.cigaretteQuantity} x cigarette`}
               </span>
               <span key={i+6} className="col-4"> {dt.cigarette} &#8377;</span>
             </div>:""}
             
             <div style={{ borderBottom: "dashed" }} className="my-2"></div>
             <div className="fw-bold"  style={{fontSize:"0.9rem"}}>
          <div className="d-flex mx-3 justify-content-between ">
            <span className="">TOTAL AMOUNT</span>
            <span key={dt.orderTotal} className="fs-5">{dt.orderTotal} &#8377;</span>

          </div>
          <div className="d-flex mx-3 justify-content-between">
            <span className="">PAYMENT MODE</span>
            
            <span style={{cursor:"pointer"}}  onClick={(e)=>changePaymentValue(e,dt,i)}>{paymentValue[i]==="Online"?<p className="text-primary fs-4">Online</p>:<p className="text-danger fs-4">Offline</p>}</span>
          </div>
        </div>
             
            
           <div className="d-flex justify-content-center">
           <button className="btn" onClick={(e)=>editData(e,dt)}>
           <ArrowCircleLeftIcon sx={{ fontSize: 40 }}  />
         </button>
           
           </div> 
           </div>
           
           ) 
          
          :""}
            </section>
        </div>
    );
}

export default Pending_Bill;