import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function Dashboard() {

  return (

    <>
      <Header />
      <h1>Dashboard</h1>
      <ul>
        <li>
          <Link to="/">Login</Link>
          <Link to="/allCessoes">Cessoes</Link>
        </li>
      </ul>
    </>

  )
}

export default Dashboard;