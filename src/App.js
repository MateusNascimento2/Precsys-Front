import React, {useState} from 'react';

import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cessoes from './pages/Cessoes';
import AllCessoes from './pages/AllCessoes';
import { UserProvider } from './context/UserContext';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import {RequireAdminAuth, RequireNormalUserAuth} from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized';

function App() {

  return (
    <Routes>
      
      <Route path='/' element={<Layout />}>
        {/* Public Routes*/}
        <Route path='login' element={<Login />} />  

        {/* Protected Routes*/}
        <Route element={<RequireNormalUserAuth />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='cessoes' element={<Cessoes />} />
        </Route>  

        <Route element={<RequireAdminAuth />}>
          <Route path='allCessoes' element={<AllCessoes />} />
        </Route>  

        <Route path='*' element={<Unauthorized />} />
      </Route>
    </Routes>

  )
}

export default App;