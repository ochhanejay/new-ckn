import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { authContext } from "../../contexts/cknContext";
import { expenseContext } from "../../contexts/expenseContext";
import { NavLink, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import "./showDailyExpense.css";



const ShowDailyExpense = () => {
    const history = useNavigate();

    const {

        URL,

    } = React.useContext(authContext);
    const { category, setCategory, refreshCategory, setRefreshCategory, expenseDate, dailyExpense, setDailyExpense, editExpenseDaily, setEditExpenseDaily, editExpenseDailyName, editExpenseDailyAmount, setEditExpenseDailyAmount } = React.useContext(expenseContext);


    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState(0);
    const [formValue, setFormValue] = useState({});
    const [updateData, setUpdateData] = useState({});
    const [show, setShow] = useState(false);
    const [formShow, setFormShow] = useState({});

    var isoDateString = new Date().toISOString();
    const formatDate = isoDateString.split("T")[0];
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
                const pushResult = { categoryName: finalResult, type: ct.categoryType, category: ct.categoryName }
                x.push(pushResult);
            });
            setCategory(x);
        }, err => {
            console.log(err);
        })
    }
    const showForm = (e) => {
        // let customerData = { ...formShow };
        let customerData = { [e]: true };
        setFormShow(customerData);
    }
    const hideForm = (e) => {
        setFormShow({});
    }
    useEffect(() => {
        getCategory();
        // getDailyExpense();
    }, [refreshCategory]);


    // const getDailyExpense = () => {
    //     const expense = expenseDate !== "" ? expenseDate : formatDate;

    //     axios.get(`${URL}/getDailyExpensesByDate?date=${expense}`, {
    //         headers: {
    //             "Content-type": "application/json",
    //             Authorization: `Bearer ${localStorage.getItem("tokens")}`
    //         },
    //     }).then(resp => {
    //         // const categoryText = resp.data.data;
    //         // const x = [];
    //         // categoryText.map(ct => {
    //         //     const result = ct.categoryName.replace(/([A-Z])/g, " $1");
    //         //     const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    //         //     x.push(finalResult);
    //         // });
    //         setDailyExpense(resp.data.data[0]);
    //     }, err => {
    //         console.log(err);
    //     })
    // }
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
            if (dailyExpense) {
                customerData[avail] = { description: value, amount: customerData[avail] ? customerData[avail].amount : 0 };
            }
            else {

                customerData[avail] = [{ description: value, amount: customerData[avail] ? customerData[avail].amount : 0 }];
            }
        }
        else if (label === "amount") {
            setAmount(value);
            if (dailyExpense) {
                customerData[avail] = { description: customerData[avail] ? customerData[avail].description : "", amount: value };
            }
            else {

                customerData[avail] = [{ description: customerData[avail] ? customerData[avail].description : "", amount: value }];
            }
        }
        setFormValue(customerData);

    }

    const addExpenses = async (event) => {
        if (formValue) {
            let y = { totalAmount: 0 };
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
                    await axios.post(`${URL}/addDailyExpenses`, y, {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("tokens")}`
                        },
                    }).then((resp) => {
                        setFormValue({});
                        setRefreshCategory(!refreshCategory);
                        // window. location. reload(false);


                    }).catch(err => {
                        console.log(err)

                    });
                } catch (error) {
                    console.log(error)
                }
            }
        }


    }
    const submitForm = (e) => {
        let customerData = { ...formShow };
        customerData[e] = false;
        setFormShow(customerData);
        // alert("111")
        if (dailyExpense) {
            updateExpenses();
        }
        else {
            addExpenses();
        }
    }
    const updateExpenses = async () => {
        let y = { totalAmount: 0 };
        category.map(ct => {
            if (ct.type === "description") {
                const avail = toCamelCase(ct.categoryName);
                const desc = dailyExpense[avail][avail];
                if (desc && formValue[avail]) {
                    desc.push(formValue[avail])
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: desc, amount: parseInt(formValue[avail].amount) + parseInt(dailyExpense[avail].amount) };


                    customerData.totalAmount = parseInt(formValue[avail].amount) + parseInt(dailyExpense[avail].amount) + customerData.totalAmount;

                    y = customerData;
                }
                else if (desc && !formValue[avail]) {
                    let customerData = { ...y };
                    customerData[avail] = { [avail]: desc, amount: parseInt(dailyExpense[avail].amount) };
                    customerData.totalAmount = parseInt(dailyExpense[avail].amount) + customerData.totalAmount;
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
                if (formValue[avail] && dailyExpense[avail]) {
                    result = parseInt(formValue[avail]) + parseInt(dailyExpense[avail])
                }
                else if (!formValue[avail] && dailyExpense[avail]) {
                    result = 0 + parseInt(dailyExpense[avail])

                }
                else if (formValue[avail] && !dailyExpense[avail]) {
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
        // setUpdateData(y);

        if (y.totalAmount > dailyExpense.totalAmount) {
            const expense = expenseDate !== "" ? expenseDate : formatDate;

            try {
                await axios.put(`${URL}/updateDailyExpenses?date=${expense}`, y, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("tokens")}`
                    },
                }).then((resp) => {
                    const empty = {};
                    setFormValue(empty);
                    setRefreshCategory(!refreshCategory);
                    // window. location. reload(false);


                }).catch(err => {
                    console.log(err)

                });
            } catch (error) {
                console.log(error)
            }
        }




    }
    const handleDailyExpenseNormal = (e) => {
        const { name, value } = e.target;
        const customerData = { ...dailyExpense }
        customerData[editExpenseDailyName.expenseName] = value === "" ? 0 : +(value);

        setDailyExpense(customerData);
        setEditExpenseDailyAmount(!editExpenseDailyAmount);
    }
    const handleDailyExpense = (e, i) => {
        const { name, value } = e.target;
        const customerData = { ...dailyExpense }
        let x = value === "" ? 0 : value;
        customerData[editExpenseDailyName.expenseName][editExpenseDailyName.expenseName].map(dt => {
            x = name === dt.description ? parseInt(x) + 0 : parseInt(x) + parseInt(dt.amount);
        })
        customerData[editExpenseDailyName.expenseName][editExpenseDailyName.expenseName][i].amount = value;
        customerData[editExpenseDailyName.expenseName].amount = x;


        setDailyExpense(customerData);
        setEditExpenseDailyAmount(!editExpenseDailyAmount);
    }
    const editExpenses = async () => {
        const expense = expenseDate !== "" ? expenseDate : formatDate;
        try {
            await axios.put(`${URL}/updateDailyExpenses?date=${expense}`, dailyExpense, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("tokens")}`
                },
            }).then((resp) => {
                const empty = {};
                setRefreshCategory(!refreshCategory);
                setEditExpenseDaily(false);
                // window. location. reload(false);


            }).catch(err => {
                console.log(err)

            });
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="row" style={{ marginRight: "0.2rem" }}>
            <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{ overflowY: "auto", overflowX: "hidden", height: "100vh", padding: "1rem" }}>
                {category && editExpenseDaily === false ? <div className='row'>
                    {category.map((ct, i) =>

                        <div key={i} className="col-sm-4 col-md-2 col-lg-3 col-xl-2" >
                            <div className={`card mt-1 showHide ${formShow[ct.categoryName] === true ? "d-none" : ""}`} >
                                <button className='btn' onClick={(e) => showForm(ct.categoryName)}>
                                    <div className="text-center fs-6 p-2">

                                        <h4 className='fs-5' style={{ color: "purple" }}>{ct.categoryName}</h4>
                                    </div>
                                </button>
                            </div>
                            <div className={`card mt-1 showBlock ${formShow[ct.categoryName] === true ? "" : "d-none"}`} >
                                <div className="text-center fs-6 p-2" >


                                    <h4 className='fs-5' style={{ color: "purple" }}>{ct.categoryName}</h4>
                                    {ct.type === "normal" ? <>
                                        <TextField
                                            margin="normal"
                                            color="secondary"
                                            fullWidth
                                            id="email"
                                            label="Amount"
                                            value={formValue ? formValue[ct.categoryName] : ""}

                                            name={ct.categoryName}
                                            type="number"
                                            onChange={(e) => handleChange(e)}
                                            // onBlur={(e)=>dailyExpense?updateExpenses(e):addExpenses(e)}
                                            sx={{ mt: 0, mb: 2 }}
                                        />
                                        <button type='button' onClick={(e) => submitForm(ct.categoryName)} className="glow-button  mb-2 mt-4" style={{ width: "6.5rem", height: "2.5rem", alignItems: "center" }}>SAVE </button></> : <><TextField
                                            margin="normal"
                                            color="secondary"
                                            fullWidth
                                            id="email"
                                            label="Description"
                                            value={formValue ? formValue[ct.categoryName.description] : ""}
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
                                            value={formValue ? formValue[ct.categoryName.amount] : ""}

                                            name={ct.categoryName}
                                            autoComplete="email"
                                            onChange={(e) => handleChangeDesc(e, "amount")}
                                            sx={{ mt: 0, mb: 2 }}
                                        />
                                        <button onClick={(e) => submitForm(ct.categoryName)} className="glow-button  mb-2 mt-4" style={{ width: "6.5rem", height: "2.5rem", alignItems: "center" }}>SAVE </button>
                                    </>}


                                </div>

                            </div>
                        </div>
                    )}

                </div> : ""}
                {category && editExpenseDaily === true && editExpenseDailyName.expenseType === "normal" ? <div className='card mt-1 w-25'>
                    <h4 className='fs-5' style={{ color: "purple" }}>{editExpenseDailyName.expenseName.toUpperCase()}</h4>
                    <div className="text-center fs-6 p-2" >
                        <>

                            <TextField
                                margin="normal"
                                color="secondary"
                                fullWidth
                                id="email"
                                label="Amount"
                                value={dailyExpense[editExpenseDailyName.expenseName]}

                                name={dailyExpense.editExpenseDailyName}
                                type="number"
                                onChange={(e) => handleDailyExpenseNormal(e)}
                                // onBlur={(e)=>dailyExpense?updateExpenses(e):addExpenses(e)}
                                sx={{ mt: 0, mb: 2 }}
                            />
                            <button type='button' onClick={(e) => editExpenses(e)} className="glow-button  mb-2 mt-4" style={{ width: "6.5rem", height: "2.5rem", alignItems: "center" }}>SAVE </button>
                        </>
                    </div>

                </div> : ""}
                {category && editExpenseDaily === true && editExpenseDailyName.expenseType === "description" ?
                    <div className='row p-4'>
                        <h4 className='fs-5' style={{ color: "white" }}>{editExpenseDailyName.expenseName.toUpperCase()}</h4>
                        {dailyExpense[editExpenseDailyName.expenseName][editExpenseDailyName.expenseName].map((dt, i) => <div className='card mt-1 mx-2 col-2' key={dt.description}>
                            <h4 className='fs-5 mt-2' style={{ color: "purple" }}>{dt.description.toUpperCase()}</h4>
                            <div className="text-center fs-6 p-2" >
                                <>

                                    <TextField
                                        margin="normal"
                                        color="secondary"
                                        fullWidth
                                        id="email"
                                        label="Amount"
                                        value={dt.amount}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}

                                        name={dt.description}
                                        type="number"
                                        onChange={(e) => handleDailyExpense(e, i)}
                                        // onBlur={(e)=>dailyExpense?updateExpenses(e):addExpenses(e)}
                                        sx={{ mt: 0, mb: 2 }}
                                    />
                                    <button type='button' onClick={(e) => editExpenses(e)} className="glow-button  mb-2 mt-4" style={{ width: "6.5rem", height: "2.5rem", alignItems: "center" }}>SAVE </button>
                                </>
                            </div>

                        </div>)}
                        <button hidden onClick={(e) => editExpenses(e)} className="glow-button  mb-2 mt-4" style={{ width: "10.5rem", height: "2.5rem", alignItems: "center" }}>UPDATE EXPENSE </button>
                    </div>
                    : ""}
                <button hidden onClick={(e) => dailyExpense ? updateExpenses(e) : addExpenses(e)} className="glow-button  mb-2 mt-4" style={{ width: "10.5rem", height: "2.5rem", alignItems: "center" }}>ADD EXPENSE </button>
            </section>

        </div>
    )
}

export default ShowDailyExpense;