import React from 'react'
import {  Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './utils/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
        }/>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
    </Routes>
  )
}

export default App