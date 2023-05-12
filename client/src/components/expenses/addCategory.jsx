import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { authContext } from '../../contexts/cknContext';
import { expenseContext } from '../../contexts/expenseContext';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const theme = createTheme();


const AddCategory = () => {

    const {URL,auth, setAuth,token, setToken} = React.useContext(authContext);
    const {refreshCategory, setRefreshCategory} = React.useContext(expenseContext);
    const [formValue,setFormValue]=React.useState({
    categoryName:"",type:"",expense:""
   });
   const history = useNavigate();
    function toCamelCase(str){
        return str.split(' ').map(function(word,index){
          // If it is the first word make sure to lowercase all the chars.
          if(index == 0){
            return word.toLowerCase();
          }
          // If it is not the first word only upper case the first char and lowercase the rest.
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
      }
   const handleSave = (event) => {
    const { name, value } = event.target;
   
    let customerData = { ...formValue };
    customerData[name] = value;
    setFormValue(customerData);
   
  };

  const addCategory= async(e)=>{
    const avail= toCamelCase(formValue.categoryName);

    const category={
        categoryName:avail,
        categoryType:formValue.type,
        categoryExpense:formValue.expense
    }
  if(formValue.categoryName!=="" && formValue.type!=="" && formValue.expense) { try {
      await axios.post(`${URL}/addCategory`,category,{
        headers: {
          "Content-type": "application/json",
          Authorization:`Bearer ${localStorage.getItem("tokens")}`
        },
      }).then((resp)=>{
        const newCategory=resp.data.data.categoryName;

        if(resp.data.data.categoryExpense==="daily" && resp.data.data.categoryType==="normal"){
            const updatedExpenses={  
              key:[newCategory],
              expenseData:0
            }
            axios.put(`${URL}/updateAllDailyExpenses`,updatedExpenses,{
                headers: {
                  "Content-type": "application/json",
                  Authorization:`Bearer ${localStorage.getItem("tokens")}`
                },
              });
        }
       else if(resp.data.data.categoryExpense==="daily" && resp.data.data.categoryType==="description"){
            const updatedExpenses={
              key:[newCategory],
              expenseData:{[newCategory]:[],amount:0}
              }
            axios.put(`${URL}/updateAllDailyExpenses`,updatedExpenses,{
                headers: {
                  "Content-type": "application/json",
                  Authorization:`Bearer ${localStorage.getItem("tokens")}`
                },
              });
        }
        else if(resp.data.data.categoryExpense==="monthly" && resp.data.data.categoryType==="description"){
            const updatedExpenses={ key:[newCategory],
              expenseData:{[newCategory]:[],amount:0}}
            axios.put(`${URL}/updateAllMonthlyExpenses`,updatedExpenses,{
                headers: {
                  "Content-type": "application/json",
                  Authorization:`Bearer ${localStorage.getItem("tokens")}`
                },
              });
        }
        else if(resp.data.data.categoryExpense==="monthly" && resp.data.data.categoryType==="normal"){
            const updatedExpenses={ key:[newCategory],
              expenseData:0}
            axios.put(`${URL}/updateAllMonthlyExpenses`,updatedExpenses,{
                headers: {
                  "Content-type": "application/json",
                  Authorization:`Bearer ${localStorage.getItem("tokens")}`
                },
              });
        }
        
        
        let customerData = { ...formValue };
    customerData.categoryName = "";
    customerData.type = "";
    setFormValue(customerData);
    setRefreshCategory(!refreshCategory);
     
    }).catch(err => {
      console.log(err)
  
  });
    } catch (error) {
      console.log(error)
    }}
    else{
        alert("Please add all fields");
    }
    
  
  }

  return (
    <div className="row" style={{marginRight:"0.2rem"}}>
      <section className="col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{overflowY:"auto",overflowX:"hidden",height:"100vh",padding:"1rem"}}>
 
       <div  className="card mt-1" style={{ borderBottom: "dashed" }}>
       <div  className="text-center fs-6 ">
       <ThemeProvider theme={theme} className="mainScreen_Bg">
       <Container component="main" maxWidth="xs" >
         <CssBaseline />
         <Box
           sx={{
             marginTop: 2,
             marginBottom: 2,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             mode:'dark'
           }}
         >
           
           <Box component="form" noValidate sx={{ mt: 0}}>
             <TextField
               margin="normal"
               required
               color="secondary"
                value={formValue.categoryName}
               fullWidth
               id="email"
               label="Category Name"
               name="categoryName"
               autoComplete="email"
               onChange={(e)=>handleSave(e)}
               sx={{ mt: 0 ,mb:2}}
             />
             <FormLabel id="demo-controlled-radio-buttons-group" ><h6 style={{color:"purple"}}>Select Type</h6></FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="type"
        color="secondary"
        value={formValue.type}
        onChange={handleSave}
      >
        
        <FormControlLabel   value="normal" control={<Radio color="secondary" />} label="Normal" />
        <FormControlLabel value="description" control={<Radio color="secondary" />} label="Description" />
      </RadioGroup>
      <FormLabel id="demo-controlled-radio-buttons-group" ><h6 style={{color:"purple"}}>Select Expense</h6></FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="expense"
        color="secondary"
        value={formValue.expense}
        onChange={handleSave}
      >
        
        <FormControlLabel   value="daily" control={<Radio color="secondary" />} label="Daily" />
        <FormControlLabel value="monthly" control={<Radio color="secondary" />} label="Monthly" />
      </RadioGroup>
             
             <Button
               type="button"
               color="secondary"
               fullWidth
               variant="contained"
               className='glow-button'
               sx={{ mt: 3, mb: 2 }}
               onClick={(e)=>addCategory(e)}
             >
               Add Category
             </Button>
           </Box>
         </Box>
       </Container>
     </ThemeProvider>
       </div>
    
     </div>
      </section>
  </div>
  )
}

export default AddCategory