import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { authContext } from "../../contexts/cknContext";
import { expenseContext } from "../../contexts/expenseContext";
import { NavLink, useNavigate } from "react-router-dom";

const DailyExpense = () => {
  const history = useNavigate();

  const {
    URL,
  } = React.useContext(authContext);

  const { refreshCategory, expenseDate, dailyExpense, setDailyExpense, editExpenseDaily, setEditExpenseDaily,
    editExpenseDailyName, setEditExpenseDailyName } = React.useContext(expenseContext);

  const [category, setCategory] = useState();
  const getCategory = () => {
    axios.get(`${URL}/getCategory?categoryExpense=daily`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp => {
      const categoryText = resp.data.data;
      const x = [];
      categoryText.map(ct => {
        const result = ct.categoryName.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        const pushResult = { categoryName: finalResult, category: ct.categoryName, type: ct.categoryType }
        x.push(pushResult);
        // x.push(finalResult);
      });
      setCategory(x);

    }, err => {
      console.log(err);
    })
  }
  var isoDateString = new Date().toISOString();
  const formatDate = isoDateString.split("T")[0];
  const getDailyExpense = () => {
    const expense = expenseDate !== "" ? expenseDate : formatDate;
    axios.get(`${URL}/getDailyExpensesByDate?date=${expense}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp => {
      setDailyExpense(resp.data.data[0]);
    }, err => {
      console.log(err);
    })
  }
  useEffect(() => {
    console.log("11");
    getCategory();
    getDailyExpense();
  }, [refreshCategory]);
  const editDailyExpense = (e, type) => {
    const customerData = { ...editExpenseDailyName }
    customerData.expenseName = e;
    customerData.expenseType = type;
    setEditExpenseDailyName(customerData);
    setEditExpenseDaily(true)
  }
  return (
    <div> <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-4" style={{ overflowY: "auto", overflowX: "hidden", height: "90vh", padding: "0.5rem", marginBottom: "1rem" }}>
      {category && dailyExpense ? <div className='row mb-2' style={{ overflowY: "scroll" }}>
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
          <div className="card mt-1" >
            <h5>Today Expenses</h5>
            <div style={{ borderBottom: "dashed" }} className="my-1"></div>
            <h5>{expenseDate !== "" ? expenseDate : formatDate}</h5>
            <div style={{ borderBottom: "dashed" }} className="my-1"></div>

            {category.map((ct, i) =>
              <div style={{ cursor: "pointer" }} onClick={(e) => editDailyExpense(ct.category, ct.type)} key={i} className="d-flex mx-3 justify-content-between ">
                <h5 className="">{ct.categoryName}</h5>
                {ct.type === "normal" ? <h6 key={i + 19}>{dailyExpense[ct.category]} &#8377;</h6> : <h6 key={i + 19}>{dailyExpense[ct.category].amount} &#8377;</h6>}


              </div>)}
            <div style={{ borderBottom: "dashed" }} className="my-1"></div>
            <div className="d-flex mx-1 my-2 justify-content-between ">
              <h5 className="">Total Expenses</h5>
              <h5>{dailyExpense.totalAmount} &#8377;</h5>

            </div>

          </div>
        </div>

      </div> : ""}
    </section></div>
  )
}

export default DailyExpense;