import React from 'react';
import logo from "../../public/assets/precsys-logo.png"

import { useUser } from '../context/UserContext'
import useAuth from "../hooks/useAuth";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarUser from "../components/NavBarUser"
import { Outlet } from 'react-router';


function Header() {
  // const { user } = useUser();
  const { auth } = useAuth();
  // console.log(user);
  console.log(`Header auth: ${auth.user.admin}`)

  return (
    <>
      <header className='bg-white sticky z-50 top-0 border-b flex justify-center'>
        <section className='px-4 py-3 bg-white xl:w-[1280px]'>
          <h1><img className='w-36' src={logo} alt="Imagem da Logo do Precsys" /></h1>
           {auth?.user && (auth?.user.admin ? <NavBarAdmin /> : <NavBarUser />)}
        </section>
      </header>
    </>

  )

}


export default Header;