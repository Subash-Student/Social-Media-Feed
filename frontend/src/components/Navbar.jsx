import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { StoreContext } from '../context/context';
import { useNavigate } from "react-router";

const NavBar = () => {

    const {setToken}  = useContext(StoreContext);

    const logOut = ()=>{
      localStorage.removeItem("token")
        setToken(null);
        useNavigate("/login")
    }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#fff',paddingLeft:"30px", color: '#000', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <img 
            src="logo.jpeg" 
            alt="logo" 
            style={{ marginRight: 8, borderRadius: '50%',width:"60px" }}
          />
          InstaClone
        </Typography>
        <IconButton onClick={logOut} edge="end" color="inherit" aria-label="logout">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
