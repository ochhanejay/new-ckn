import React, { useState,useEffect } from "react";
import "./screen.css";
import axios from "axios";
import { authContext } from "../contexts/cknContext";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import { NavLink, useNavigate } from "react-router-dom";


function Success_Order(props) {
  const { successOrder, setSuccessOrder,URL,newDate } = React.useContext(authContext);

  const [data,setData]=useState([]);
  const [paymentMode, setPaymentMode] = useState(true);
  const [reverse, setReverse] = useState(true);

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
    await axios.get(`${URL}/getCknItemsByDateAndStatus?date=${formattedToday}&status=success`,{
      headers: {
        "Content-type": "application/json",
        Authorization:`Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp=>{
      setData(resp.data.data);
      
    },err=>{
      console.log(err);
      if(err.response.data==="Forbidden"){
        logout();
      }
    })
  }
  useEffect(() => {
    getData();
  }, [successOrder,newDate]);
  const ascend=reverse===true? data.slice(0).reverse():data;
    return (
      <div className="row" style={{marginRight:"0.2rem"}}>
      <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{overflowY:"auto",overflowX:"hidden",height:"100vh",padding:"1rem"}}>
      <button className="glow-on-hover w-1 h-10 mb-2" style={{width:"1.5rem",height:"1.5rem",alignItems:"center"}} onClick={(e)=>setReverse(!reverse)}>{reverse===true?<UploadIcon className="fs-4" style={{marginLeft:"-0.3rem"}}/>:<DownloadIcon className="fs-4" style={{marginLeft:"-0.3rem"}}/>}</button>

      {data.length > 0 ? 
        
        ascend.map((dt,i)=>
       ( <div key={i+1} className="card mt-1" style={{ borderBottom: "dashed" }}>
       <div  className="text-center fs-6 ">
       <div key={i+3}>OrderNo. {dt.orderNo} </div>

       </div>
       <div  className="PS-3 fw-bold">
         <span key={dt.time} className="ps-3 ">{dt.time}</span>
       </div>
       <div  style={{ borderBottom: "dashed" }}></div>
      
       
       {dt.chaiQuantity>0? <div className="row d-flex justify-content-around">
       <span key={i+7} className="text-start col-8" style={{ paddingLeft: "11%" }}>
        { `${dt.chaiQuantity} x Chai`}
       </span>
       <span key={i+8} className="col-4">{dt.chai} &#8377;</span>
     </div>:""}
    {dt.coffeeQuantity>0? <div  className="row d-flex justify-content-around">
       <span key={i+10} className="text-start col-8" style={{ paddingLeft: "11%" }}>
       { `${dt.coffeeQuantity} x Coffee`}
       </span>
       <span key={i+11} className="col-4">{dt.coffee} &#8377;</span>
     </div>:""}
   {dt.cigaretteQuantity>0?<div className="row d-flex justify-content-around ">
       <span key={i+13} className="text-start col-8" style={{ paddingLeft: "11%" }}>
       { `${dt.cigaretteQuantity} x cigarette`}
       </span>
       <span key={i+14} className="col-4"> {dt.cigarette} &#8377;</span>
     </div>:""}
       
       <div  style={{ borderBottom: "dashed" }} className="my-2"></div>

       <div  className="fw-bold"  style={{fontSize:"0.9rem"}}>
          <div  className="d-flex mx-3 justify-content-between ">
            <span  className="">TOTAL AMOUNT</span>
            <span key={i+19}>{dt.orderTotal} &#8377;</span>

          </div>
          <div className="d-flex mx-3 justify-content-between">
            <span className="">PAYMENT MODE</span>
            
            <span key={i+22} >{dt.paymentMode==="Online"?<p className="text-primary">Online</p>:<p className="text-danger">Offline</p>}</span>
          </div>
        </div>
   
     
       {/* <div className=""><span className="fs-3">*****</span><span>THANK YOU</span><span className="fs-3">*****</span></div>*/}
     </div>)
     ) 
    
    :""}
      </section>
  </div>
    );
}

export default Success_Order;