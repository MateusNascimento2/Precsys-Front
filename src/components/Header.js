import React from 'react';
import logo from "../../public/assets/precsys-logo.png"

import { Outlet } from "react-router-dom";


function Header({ title, children }) {
  return (
    <>
      <header className='sticky z-50 top-0 border-b flex justify-center'>
        <section className='px-4 py-3 bg-white xl:w-[1280px]'>
          <h1><img className='w-36' src={logo} alt="Imagem da Logo do Precsys" /></h1>
        </section>

      </header>


      <Outlet />
    </>

  )

}


export default Header;