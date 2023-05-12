import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const expenseContext = createContext();

export default function ExpenseContext({ children }) {
  const [refreshCategory, setRefreshCategory] = useState(false);
  const [editExpenseDaily, setEditExpenseDaily] = useState(false);
  const [editExpenseDailyAmount, setEditExpenseDailyAmount] = useState(false);
  const [editExpenseDailyName, setEditExpenseDailyName] = useState({ expenseName: "", expenseType: "" });
  const [editItem, setEditItem] = useState([]);
  const [expenseDate, setExpenseDate] = useState("");
  const [category, setCategory] = useState();

  const [dailyExpense, setDailyExpense] = useState();
  const handleDailyExpenseAmount = () => {

    const customerData = { ...dailyExpense }
    let x = 0;
    category.map(ct => {
      if (ct.type === "normal") {
        x = parseInt(x) + parseInt(customerData[ct.category]);
        console.log(parseInt(x) + parseInt(customerData[ct.category]));

      }
      else {
        x = parseInt(x) + parseInt(customerData[ct.category]?.amount);
        console.log(parseInt(x) + parseInt(customerData[ct.category]?.amount));
        console.log(ct);

      }
    })
    customerData.totalAmount = x;
    console.log(x);
    setDailyExpense(customerData);
  }
  useEffect(() => {
    if (dailyExpense?.totalAmount > 0) {
      handleDailyExpenseAmount();
    }


  }, [editExpenseDailyAmount]);

  return (
    <expenseContext.Provider
      value={{
        category, setCategory,
        refreshCategory, setRefreshCategory,
        expenseDate, setExpenseDate,
        dailyExpense, setDailyExpense,
        editExpenseDaily, setEditExpenseDaily,
        editExpenseDailyName, setEditExpenseDailyName,
        editExpenseDailyAmount, setEditExpenseDailyAmount

      }}
    >
      {children}
    </expenseContext.Provider>
  );
}
