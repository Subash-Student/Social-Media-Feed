import React, { useContext } from 'react';
import { StoreContext } from '../context/context.jsx';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(StoreContext);

  // If the token exists, render the children (protected component)
  // Otherwise, redirect to the login page
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;