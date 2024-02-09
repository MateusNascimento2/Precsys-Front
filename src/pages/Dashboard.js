import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Dashboard() {

  return (
    <>
      <h1>Dashboard</h1>
      <ul>
        <li>
          <Link to="/">Login</Link>
        </li>
      </ul>
    </>

  )
}

export default Dashboard;