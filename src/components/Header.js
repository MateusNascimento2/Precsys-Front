import React, { useState, useEffect } from 'react';
import logo_black from "../../public/assets/precsys-logo.png"
import logo_white from "../../public/assets/precsys-logo-white.png"
import useAuth from "../hooks/useAuth";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarUser from "../components/NavBarUser"
import ProfileImage from './ProfileImage';
import UserToolbar from './UserToolbar';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [logo, setLogo] = useState(logo_black)
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);

    updateLogo(darkMode)
  }, [darkMode]);

  const handleDarkModeChange = (newDarkMode) => {
    setDarkMode(newDarkMode);
  };

  const updateLogo = (darkMode) => {
    if (darkMode) {
      setLogo(logo_white);
    } else {
      setLogo(logo_black);
    }
  }


  const [menuType, setMenuType] = useState(null);

  function handleMenu(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState);
      console.log('showMenu ' + showMenu)
    } else {
      setShowMenu(true);
      setMenuType(type);
    }
  }

  const handleRoute = (route) => {
    navigate(route)
  }

  console.log(`Header auth: ${auth.user.admin}`)

  return (
    <>

      <header className='bg-white fixed z-50 border-b dark:border-neutral-700 dark:bg-neutral-900  w-full top-0 '>
        <div onClick={() => { setShowMenu((prevState) => !prevState) }} className={showMenu && menuType === 'navBar' ? 'fixed top-[50px] h-screen left-0 w-screen bg-neutral-700 opacity-60 z-[49] transition-opacity lg:opacity-0 lg:hidden' : showMenu && menuType === 'toolBar' ? 'fixed top-[52px] h-screen left-0 w-screen bg-white opacity-0 z-[49] transition-opacity lg:opacity-0' : ' fixed top-[-9999px] opacity-0 transition-opacity lg:hidden'}></div>
        <div className='lg:hidden'>
          {menuType === 'navBar' ? (auth?.user?.admin ? <NavBarAdmin show={showMenu} /> : <NavBarUser />) : null}
        </div>

        <section className='px-4 py-2 flex justify-between gap-4 bg-white dark:bg-neutral-900 lg:container lg:mx-auto lg:gap-20'>

          <div className='relative flex flex-col gap-[3px] justify-center lg:hidden  ' onClick={() => handleMenu('navBar')}>
            <div className={showMenu && menuType === 'navBar' ? 'rotate-45 w-5 h-[2px] bg-[#222] rounded-sm transition-all translate-x-[-2px] translate-y-[2px] dark:bg-white' : 'w-5 h-[2px] bg-[#222] rounded-sm rotate-0 transition-all dark:bg-white'}></div>
            <div className={showMenu && menuType === 'navBar' ? 'hidden' : 'dark:bg-white w-5 h-[2px] bg-[#222] rounded-sm'}></div>
            <div className={showMenu && menuType === 'navBar' ? 'rotate-[-45deg] w-5 h-[2px] bg-[#222] rounded-sm transition-all translate-x-[-3px] translate-y-[-3px] dark:bg-white' : 'w-5 h-[2px] bg-[#222] rounded-sm rotate-0 transition-all dark:bg-white'}></div>
          </div>




          <h1 className='flex items-center' onClick={() => handleRoute('/dashboard')}>
            <img className='h-[25px] lg:h-[35px]' src={logo} alt="Imagem da Logo do Precsys" />
          </h1>

          <div className='hidden lg:block' >
            {auth?.user.admin ? <NavBarAdmin show={true} /> : <NavBarUser />}
          </div>

          <div className='relative w-[35px] lg:w-[45px] bg-neutral-200 rounded ' >

            <div className='cursor-pointer' onClick={() => handleMenu('toolBar')}>
              <ProfileImage userImage={auth?.userImage} />
            </div>

            {menuType === 'toolBar' ? (<UserToolbar show={showMenu} updateLogo={updateLogo} darkMode={darkMode} onDarkModeChange={handleDarkModeChange} />) : null}

          </div>

        </section>
      </header>
    </>
  )
}


export default Header;