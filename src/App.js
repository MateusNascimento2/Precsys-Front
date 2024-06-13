import React from 'react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cessoes from './pages/Cessoes';
import AllCessoes from './pages/AllCessoes';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import PersistLogin from './components/PersistLogin';
import { RequireAdminAuth, RequireNormalUserAuth } from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import Usuarios from './pages/Usuarios';
import Precatorio from './pages/Precatorio';
import Calculo from './pages/Calculo';

function App() {

  return (
    <Routes>

      <Route path='/' element={<Layout />}>
        {/* Public Routes*/}
        <Route path='/' element={<Login />} />

        {/* Protected Routes*/}
        <Route element={<PersistLogin />}>
          <Route element={<RequireNormalUserAuth />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path=':minhascessoes' element={<AllCessoes />} />
            <Route path='precatorio/:precID' element={<Precatorio />} />
          </Route>

          <Route element={<RequireAdminAuth />}>
            <Route path='todas-cessoes' element={<AllCessoes />} />
            <Route path='usuarios' element={<Usuarios />} />
            <Route path='calculo' element={<Calculo />} />
          </Route>
        </Route>

        <Route path='*' element={<Unauthorized />} />
      </Route>
    </Routes>

  )
}

export default App;