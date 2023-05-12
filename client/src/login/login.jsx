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
import { authContext } from '../contexts/cknContext';

const theme = createTheme();

export default function LoginUser() {

  const { URL, auth, setAuth, token, setToken } = React.useContext(authContext);
  const [userSign, setUserSign] = React.useState({
    email: "", password: ""
  });
  const history = useNavigate();
  const handleSave = (event) => {
    const { name, value } = event.target;

    let customerData = { ...userSign };
    customerData[name] = value;
    setUserSign(customerData);

  };
  // React.useEffect(() => {
  //   setInterval(()=>{
  //     window. location. reload(false);
  //     alert("545454");
  //   },600000);

  //     }, [0]);



  const signIn = async (e) => {
    const user = {
      email: userSign.email,
      password: userSign.password
    }
    try {
      await axios.post(`${URL}/logIn`, user).then((resp) => {
        setToken(resp.data.accessToken);
        localStorage.setItem("tokens", resp?.data.accessToken?.toString());
        localStorage.setItem("time", "1d");
        localStorage.setItem("wangdu", resp?.data.roles);

        history("/");
      }).catch(err => {
        if (err.response.data === "Unauthorized") {
          alert("Invalid Credentials");
        }


      });
    } catch (error) {

    }


  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mode: 'dark'
          }}
        >
          <img src="/images/logo.png" style={{ width: "7rem" }}></img>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              color="secondary"

              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => handleSave(e)}
              autoFocus
            />
            <TextField
              margin="normal"
              color="secondary"

              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => handleSave(e)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="secondary"
              />}
              label="Remember me"
            />
            <Button
              type="button"
              color="secondary"
              fullWidth
              variant="contained"
              className='glow-button'
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => signIn(e)}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" color="secondary">
                  Forgot password?
                </Link>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}