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
import LoginLogs from './pages/LoginLogs';
import PropostasLogs from './pages/PropostasLogs'
import MeuPerfil from './pages/MeuPerfil';
import Clientes from './pages/Clientes';
import Empresas from './pages/Empresas';
import Orcamentos from './pages/Orcamentos';
import Escreventes from './pages/Escreventes';

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
            <Route path='cessao/:precID' element={<Precatorio />} />
            <Route path='perfil' element={<MeuPerfil />} />
            <Route path='clientes' element={<Clientes />} />
            <Route path='cliente/:id' element={<MeuPerfil />} />
          </Route>

          <Route element={<RequireAdminAuth />}>
            <Route path='todas-cessoes' element={<AllCessoes />} />
            <Route path='usuarios' element={<Usuarios />} />
            <Route path='usuario/:id' element={<MeuPerfil />} />
            <Route path='calculo' element={<Calculo />} />
            <Route path ='logs/login' element={<LoginLogs />}/>
            <Route path='logs/propostas' element={<PropostasLogs />} />
            <Route path='empresas' element={<Empresas />} />
            <Route path='orcamentos' element={<Orcamentos />} />
            <Route path='escreventes' element={<Escreventes />} />
          </Route>
        </Route>

        <Route path='*' element={<Unauthorized />} />
      </Route>
    </Routes>

  )
}

export default App;