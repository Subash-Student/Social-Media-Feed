import React, { useContext } from 'react';
import { StoreContext } from '../context/context.jsx';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(StoreContext);

  
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;