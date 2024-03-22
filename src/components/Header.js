import React, {useState} from 'react';
import logo from "../../public/assets/precsys-logo.png"
import useAuth from "../hooks/useAuth";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarUser from "../components/NavBarUser"
import ProfileImage from './ProfileImage';
import UserToolbar from './UserToolbar';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [menuType, setMenuType] = useState(null);

  function handleMenu(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState);
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
      <header className='bg-white sticky z-50 top-0 border-b'>
        <section className='px-2 py-2 flex justify-between gap-4 bg-white lg:container lg:mx-auto lg:gap-20'>
          <div  className='relative flex flex-col gap-[3px] justify-center lg:hidden'>
            <div onClick={() => handleMenu('navBar')} className={showMenu && menuType === 'navBar' ? 'rotate-45 w-5 h-[2px] bg-[#222] rounded-sm transition-all translate-x-[-2px] translate-y-[2px]' : 'w-5 h-[2px] bg-[#222] rounded-sm rotate-0 transition-all'}></div>
            <div onClick={() => handleMenu('navBar')} className={showMenu && menuType === 'navBar' ? 'hidden' : 'w-5 h-[2px] bg-[#222] rounded-sm'}></div>
            <div onClick={() => handleMenu('navBar')} className={showMenu && menuType === 'navBar' ? 'rotate-[-45deg] w-5 h-[2px] bg-[#222] rounded-sm transition-all translate-x-[-3px] translate-y-[-3px]' : 'w-5 h-[2px] bg-[#222] rounded-sm rotate-0 transition-all'}></div>
            {auth?.user && menuType === 'navBar' ? (auth?.user?.admin ? <NavBarAdmin show={showMenu} /> : <NavBarUser />) : null}
          </div>
          <h1 className='flex items-center' onClick={() => handleRoute('/dashboard')}><img className='h-[25px] lg:h-[35px]' src={logo} alt="Imagem da Logo do Precsys" /></h1>
          <div onClick={() => handleMenu('navBar')} className='hidden lg:block'>
            {auth?.user.admin ? <NavBarAdmin show={true} /> : <NavBarUser />}  
          </div>
          <div className='relative w-[35px] h-[35px] bg-gray-200 py-[2px] rounded ' >
            <div className='cursor-pointer' onClick={() => handleMenu('toolBar')}>
              <ProfileImage userImage={auth?.userImage} />
              {auth?.user && menuType === 'toolBar' ? (<UserToolbar show={showMenu} />) : null }
            </div>
          </div>
        </section>
      </header>
    </>
  )
}


export default Header;