import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { UserProvider } from './context/UserContext';

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <Routes>
          <Route path='/' element={<Login />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </UserProvider>

    </BrowserRouter>
  )
}

export default App;