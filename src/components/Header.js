import React from 'react';
import logo from "../../public/assets/precsys-logo.png"

import { Outlet } from "react-router-dom";


function Header ({ title, children }) {
  return (
    <>
      <header className='px-4 py-3 bg-white xl:w-[1280px]'>
        <h1><img className='w-36' src={logo} alt="Imagem da Logo do Precsys" /></h1>
      </header>

      <Outlet />
    </>
  )

}


export default Header;