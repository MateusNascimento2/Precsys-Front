import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import PieChart from '../components/PieChart';

function Dashboard() {

/*   useEffect(() => {
    axios.get("https://precsys2.vercel.app/api/refresh")
  }) */

  return (

    <>
      <Header />
      <h1>Dashboard</h1>
      <ul>
        <li>
          <Link to="/">Login</Link>
          <Link to="/allCessoes">Cessoes</Link>
          <Link to="/users">Todos os Usuarios</Link>
        </li>
      </ul>
      <PieChart />
    </>

  )
}

export default Dashboard;