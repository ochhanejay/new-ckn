import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import MainScreen from './screens/mainScreen';
import CknContext from './contexts/cknContext';
import LoginUser from './login/login';
import { Route, Routes } from 'react-router';
import Expenses from './components/expenses/expenses';
import ExpenseContext from './contexts/expenseContext';
import Monthly from './components/expenses/monthly';

function App() {
  return (
    <div className="App ">
    <CknContext>
    <ExpenseContext>
    <Routes>
    <Route path="/"  element={<MainScreen />}/>
    <Route path="/login" element={<LoginUser></LoginUser>}/>
    <Route path="/expenses" element={<Expenses></Expenses>}/>
    <Route path="/monthly" element={<Monthly></Monthly>}/>
    
    <Route path="*" element={<div>404 not found</div>}/>
</Routes>
</ExpenseContext>
    </CknContext>
    </div>
  );
}

export default App;
