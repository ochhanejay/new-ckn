import React from 'react'
import { authContext } from '../contexts/cknContext';
import Pending_Bill from './Pending_Bill'
import Success_Order from './Success_Order'
import TakeOrder from './takeOrder'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useSwipeable } from "react-swipeable";



export default function MainScreen() {
  const { auth, setAuth, token, showOrder, setShowOrder } = React.useContext(authContext);
  const history = useNavigate();
  const logout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("time");
    history("/login");
  }
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const checkLogin = () => {
    if (localStorage.getItem("tokens") === undefined || localStorage.getItem("tokens") === null) {
      history('/login');
    }

  }


  React.useEffect(checkLogin, [1]);
  React.useEffect(() => {
    setInterval(() => {
      window.location.reload(false);
      const decodedJwt = parseJwt(localStorage.getItem("tokens"));

      if (decodedJwt.exp * 1000 < Date.now()) {
        logout();
      }
    }, 600000);

  }, [0]);




  const handlers = useSwipeable({
    onSwipedLeft: () => history('/expenses')


  });

  return (
    <div className='mainScreen_Bg' {...handlers} style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className='row '>

        <div className='col-sm-7 col-md-7 col-lg-9 col-xl-8'>
          <TakeOrder ></TakeOrder>
        </div>
        <div className='col-sm-5 col-md-5 col-lg-3 col-xl-4'>
          <div className='row '>
            {showOrder === false ?
              <div className='col-lg-12 col-md-7 col-sm-6 col-xl-6 '>
                <Pending_Bill />
              </div>
              :
              <div className='col-lg-12 col-md-7 col-sm-6 col-xl-6 '>
                <Success_Order />
              </div>
            }
            <div className='col-lg-12 col-md-7 col-sm-6 col-xl-6 mobileHide'>
              <Success_Order />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
