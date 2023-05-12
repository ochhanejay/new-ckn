import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const authContext = createContext();

export default function CknContext({ children }) {
  const [pendingOrder, setPendingOrder] = useState(false);
  const [successOrder, setSuccessOrder] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [orderNumber, setOrderNumber] = useState(1);
  const [getOrder, setGetOrder] = useState(false);
  const [auth, setAuth] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [token, setToken] = useState("");
  const [URL, setURL] = useState("http://localhost:8080/api");

  const [editItem, setEditItem] = useState([]);
  // const loginActivity = () => {
  //   axios.get('http://localhost:8080/loginActivity');
  // }
  const dateSet = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;
    setNewDate(formattedToday);
  }
  const getOrderNumber = () => {
    axios.get(`${URL}/getCounterNumber`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokens")}`
      },
    }).then(resp => {
      const orderNum = parseInt(resp.data.data[0].sequenceNo) + 1;

      setOrderNumber(orderNum);
    })
  }
  useEffect(() => {
    dateSet();

  }, [0]);
  useEffect(() => {
    getOrderNumber();
    // loginActivity();
  }, [getOrder]);

  return (
    <authContext.Provider
      value={{
        pendingOrder, setPendingOrder,
        successOrder, setSuccessOrder,
        editItem, setEditItem,
        URL, setURL,
        newDate, setNewDate,
        orderNumber, setOrderNumber,
        getOrder, setGetOrder,
        auth, setAuth,
        token, setToken,
        showOrder, setShowOrder

      }}
    >
      {children}
    </authContext.Provider>
  );
}
