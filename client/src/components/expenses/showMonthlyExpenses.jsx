import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { authContext } from "../../contexts/cknContext";
import { expenseContext } from "../../contexts/expenseContext";
import { NavLink, useNavigate } from "react-router-dom";

const ShowMonthlyExpense = () => {
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
    const {refreshCategory, setRefreshCategory} = React.useContext(expenseContext);

    const [category, setCategory] = useState();
    const [monthlyExpense, setMonthlyExpense] = useState();
    const getCategory = () => {
        axios.get(`${URL}/getCategory?categoryExpense=monthly`,{
            headers: {
              "Content-type": "application/json",
              Authorization:`Bearer ${localStorage.getItem("tokens")}`
            },
          }).then(resp => {
            const categoryText = resp.data.data;
            const x = [];
            categoryText.map(ct => {
                const result = ct.categoryName.replace(/([A-Z])/g, " $1");
                const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                const pushResult={categoryName:finalResult,category:ct.categoryName,type:ct.categoryType}
                x.push(pushResult);
                // x.push(finalResult);
            });
            setCategory(x);

        }, err => {
            console.log(err);
        })
    }
        var isoDateString = new Date().toISOString();
        const formatDate=  isoDateString.split("T")[0];
    const formatMonth= `${formatDate.split("-")[1]}-${formatDate.split("-")[0]}`;

    const getMonthlyExpense = () => {        
        axios.get(`${URL}/getMonthlyExpensesByDate?month=${formatMonth}`,{
            headers: {
              "Content-type": "application/json",
              Authorization:`Bearer ${localStorage.getItem("tokens")}`
            },
          }).then(resp => {
            setMonthlyExpense(resp.data.data[0]);
        }, err => {
            console.log(err);
        })
    }
    useEffect(() => {
        getCategory();
        getMonthlyExpense();
    }, [refreshCategory]);
  return (
    <div> <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2" style={{ overflowY: "auto", overflowX: "hidden", height: "90vh", padding: "0.5rem" }}>
    {category && monthlyExpense? <div className='row' style={{ overflowY: "scroll" }}>
     <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2 mb-5 ">
            <div className="card mt-1" >
            <h5>Monthly Expenses</h5>
       <div  style={{ borderBottom: "dashed" }} className="my-1"></div>   
       <h5>{formatMonth}</h5>
       <div  style={{ borderBottom: "dashed" }} className="my-1"></div>

            {category.map((ct, i) => 
            <div key={i}  className="d-flex mx-3 justify-content-between ">
            <h5  className="">{ct.categoryName}</h5>
            {ct.type==="normal" ?<h6 key={i+19}>{monthlyExpense[ct.category]} &#8377;</h6>:<h6 key={i+19}>{monthlyExpense[ct.category].amount} &#8377;</h6>}
           

          </div>)}
          <div  style={{ borderBottom: "dashed" }} className="my-1"></div>   
          <div  className="d-flex mx-1 my-2 justify-content-between ">
            <h5  className="fs-5">Total Expense-</h5>
            <h5>{monthlyExpense.totalAmount} &#8377;</h5>

          </div>

            </div>
        </div>

    </div> : ""}
</section></div>
  )
}

export default ShowMonthlyExpense;