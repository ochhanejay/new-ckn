import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { authContext } from "../../contexts/cknContext";
import { expenseContext } from "../../contexts/expenseContext";
import { NavLink, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';



const MonthlyExpense = () => {
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
    const { refreshCategory, setRefreshCategory } = React.useContext(expenseContext);

    const [category, setCategory] = useState();
    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState(0);
    const [formValue, setFormValue] = useState({});
    const [monthlyExpense, setMonthlyExpense] = useState();
    const [updateData, setUpdateData] = useState({});
    const [formShow, setFormShow] = useState({});


    const showForm = (e) => {
        let customerData = { [e]: true };
        setFormShow(customerData);
    }
    var isoDateString = new Date().toISOString();
    const formatDate = isoDateString.split("T")[0];
    const formatMonth = `${formatDate.split("-")[1]}-${formatDate.split("-")[0]}`;
    const getCategory = () => {
        axios.get(`${URL}/getCategory?categoryExpense=monthly`, {
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
                const pushResult = { categoryName: finalResult, type: ct.categoryType }
                x.push(pushResult);
            });
            setCategory(x);
        }, err => {
            console.log(err);
        })
    }
    useEffect(() => {
        getCategory();
        getMonthlyExpense();
    }, [refreshCategory]);

    const getMonthlyExpense = () => {
        axios.get(`${URL}/getMonthlyExpensesByDate?month=${formatMonth}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("tokens")}`
            },
        }).then(resp => {

            setMonthlyExpense(resp.data.data[0]);
        }, err => {
            console.log(err);
        })
    }
    function toCamelCase(str) {
        return str.split(' ').map(function (word, index) {
            // If it is the first word make sure to lowercase all the chars.
            if (index == 0) {
                return word.toLowerCase();
            }
            // If it is not the first word only upper case the first char and lowercase the rest.
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        const avail = toCamelCase(name);
        let customerData = { ...formValue };
        customerData[avail] = +(value);
        setFormValue(customerData);
    }

    const handleChangeDesc = (event, label) => {
        const { name, value } = event.target;
        const avail = toCamelCase(name);
        let customerData = { ...formValue };
        if (label === "description") {
            setDesc(value);
            if (monthlyExpense) {
                customerData[avail] = { description: value, amount: customerData[avail] ? customerData[avail].amount : 0 };
            }
            else {

                customerData[avail] = [{ description: value, amount: customerData[avail] ? customerData[avail].amount : 0 }];
            }
        }
        else if (label === "amount") {
            setAmount(value);
            if (monthlyExpense) {
                customerData[avail] = { description: customerData[avail] ? customerData[avail].description : "", amount: value };
            }
            else {

                customerData[avail] = [{ description: customerData[avail] ? customerData[avail].description : "", amount: value }];
            }
        }
        setFormValue(customerData);

    }
    const addExpenses = async (event) => {
        let y = { totalAmount: 0, month: formatMonth };
        category.map(ct => {
            if (ct.type === "description") {
                const avail = toCamelCase(ct.categoryName);

                if (formValue[avail]) {
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: [formValue[avail]], amount: formValue[avail][0].amount };
                    customerData.totalAmount = formValue[avail][0].amount + customerData.totalAmount;

                    y = customerData;
                }
                else {
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: [], amount: 0 };
                    y = customerData;
                }
            }
            if (ct.type === "normal") {
                const avail = toCamelCase(ct.categoryName);
                let result = 0;
                if (formValue[avail]) {
                    result = parseInt(formValue[avail]);
                }
                else {
                    result = 0;
                }
                let customerData = { ...y };
                customerData[avail] = result;
                customerData.totalAmount = result + customerData.totalAmount;
                y = customerData;
            }
        });
        if (y.totalAmount > 0) {
            try {
                await axios.post(`${URL}/addMonthlyExpenses`, y, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("tokens")}`
                    },
                }).then((resp) => {
                    setFormValue({});
                    setRefreshCategory(!refreshCategory);
                    window.location.reload(false);


                }).catch(err => {
                    console.log(err)

                });
            } catch (error) {
                console.log(error)
            }
        }

    }
    const updateExpenses = async (event) => {
        let y = { totalAmount: 0, month: monthlyExpense.month };
        category.map(ct => {
            if (ct.type === "description") {
                const avail = toCamelCase(ct.categoryName);
                const desc = monthlyExpense[avail][avail];
                if (desc && formValue[avail]) {
                    desc.push(formValue[avail])
                    let customerData = { ...y };

                    customerData[avail] = { [avail]: desc, amount: parseInt(formValue[avail].amount) + parseInt(monthlyExpense[avail].amount) };


                    customerData.totalAmount = parseInt(formValue[avail].amount) + parseInt(monthlyExpense[avail].amount) + customerData.totalAmount;

                    y = customerData;
                }
                else if (desc && !formValue[avail]) {
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: desc, amount: parseInt(monthlyExpense[avail].amount) };
                    customerData.totalAmount = parseInt(monthlyExpense[avail].amount) + customerData.totalAmount;
                    y = customerData;
                }
                else if (!desc && formValue[avail]) {
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: [formValue[avail]], amount: formValue[avail][0].amount };
                    customerData.totalAmount = parseInt(formValue[avail][0].amount) + customerData.totalAmount;
                    y = customerData;
                }
                else if (!desc && !formValue[avail]) {
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: [], amount: 0 };
                    y = customerData;
                }
            }
            if (ct.type === "normal") {
                const avail = toCamelCase(ct.categoryName);

                let result = 0;
                if (formValue[avail] && monthlyExpense[avail]) {
                    result = parseInt(formValue[avail]) + parseInt(monthlyExpense[avail])
                }
                else if (!formValue[avail] && monthlyExpense[avail]) {
                    result = 0 + parseInt(monthlyExpense[avail])

                }
                else if (formValue[avail] && !monthlyExpense[avail]) {
                    result = parseInt(formValue[avail]) + 0

                }
                else {
                    result = 0;
                }

                let customerData = { ...y };
                customerData.totalAmount = result + customerData.totalAmount;

                customerData[avail] = result;;
                y = customerData;

            }
        });
        setUpdateData(y);

        if (y.totalAmount > monthlyExpense.totalAmount) {
            try {
                await axios.put(`${URL}/updateMonthlyExpenses?month=${formatMonth}`, y, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("tokens")}`
                    },
                }).then((resp) => {
                    setFormValue("");
                    setRefreshCategory(!refreshCategory);
                    window.location.reload(false);


                }).catch(err => {
                    console.log(err)

                });
            } catch (error) {
                console.log(error)
            }
        }

    }

    const submitForm = (e) => {
        let customerData = { ...formShow };
        customerData[e] = false;
        setFormShow(customerData);
        // alert("111")
        if (monthlyExpense) {
            updateExpenses();
        }
        else {
            addExpenses();
        }
    }
    return (
        <div className="row" style={{ marginRight: "0.2rem" }}>
            <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{ overflowY: "auto", overflowX: "hidden", height: "100vh", padding: "1rem" }}>
                {category ? <div className='row'>
                    {category.map((ct, i) =>
                        <div key={i} className="col-sm-4 col-md-2 col-lg-3 col-xl-2">
                            <div className={`card mt-1 showHide ${formShow[ct.categoryName] === true ? "d-none" : ""}`} >
                                <button className='btn' onClick={(e) => showForm(ct.categoryName)}>
                                    <div className="text-center fs-6 p-2">

                                        <h4 className='fs-5' style={{ color: "purple" }}>{ct.categoryName}</h4>
                                    </div>
                                </button>
                            </div>
                            <div className={`card mt-1 showBlock ${formShow[ct.categoryName] === true ? "" : "d-none"}`}>
                                <div className="text-center fs-6 p-2">


                                    <h4 className='fs-5' style={{ color: "purple" }}>{ct.categoryName}</h4>
                                    {ct.type === "normal" ? <>
                                        <TextField
                                            margin="normal"
                                            color="secondary"
                                            fullWidth
                                            id="email"
                                            label="Amount"
                                            value={formValue[ct.categoryName]}
                                            name={ct.categoryName}
                                            type="number"
                                            onChange={(e) => handleChange(e)}
                                            sx={{ mt: 0, mb: 2 }}
                                        />

                                        <button type='button' onClick={(e) => submitForm(ct.categoryName)} className="glow-button  mb-2 mt-4" style={{ width: "6.5rem", height: "2.5rem", alignItems: "center" }}>SAVE </button></>
                                        : <><TextField
                                            margin="normal"
                                            color="secondary"
                                            fullWidth
                                            id="email"
                                            label="Description"
                                            value={formValue[ct.categoryName.description]}
                                            name={ct.categoryName}
                                            autoComplete="email"
                                            onChange={(e) => handleChangeDesc(e, "description")}
                                            sx={{ mt: 0, mb: 2 }}
                                        />
                                            <TextField
                                                margin="normal"
                                                color="secondary"
                                                fullWidth
                                                id="email"
                                                label="Amount"
                                                type="number"
                                                value={formValue[ct.categoryName.amount]}
                                                name={ct.categoryName}
                                                autoComplete="email"
                                                onChange={(e) => handleChangeDesc(e, "amount")}
                                                sx={{ mt: 0, mb: 2 }}
                                            />
                                            <button type='button' onClick={(e) => submitForm(ct.categoryName)} className="glow-button  mb-2 mt-4" style={{ width: "6.5rem", height: "2.5rem", alignItems: "center" }}>SAVE </button>
                                        </>}


                                </div>

                            </div>
                        </div>)}

                </div> : ""}
                <button hidden onClick={(e) => monthlyExpense ? updateExpenses(e) : addExpenses(e)} className="glow-button  mb-2 mt-4" style={{ width: "10.5rem", height: "2.5rem", alignItems: "center" }}>ADD EXPENSE </button>
            </section>

        </div>
    )
}

export default MonthlyExpense;