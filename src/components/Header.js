import React, {useState} from 'react';
import logo from "../../public/assets/precsys-logo.png"
import useAuth from "../hooks/useAuth";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarUser from "../components/NavBarUser"
import ProfileImage from './ProfileImage';

function Header() {
  const { auth } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  function handleMenu() {
    setShowMenu(prevState => !prevState);
    console.log(showMenu);
  }
  

  console.log(`Header auth: ${auth.user.admin}`)

  return (
    <>
      <header className='bg-white sticky z-50 top-0 border-b xl:justify-center'>
        <section className='px-2 py-2 flex justify-between gap-4 bg-white xl:w-[1280px]'>
          <h1 className='flex items-center'><img className='h-[25px]' src={logo} alt="Imagem da Logo do Precsys" /></h1>
          <div className='w-[35px] h-[35px]' onClick={handleMenu}>
            <ProfileImage userImage={auth?.userImage} />
          </div>
        </section>
      </header>
      {auth?.user && (auth?.user.admin ? <NavBarAdmin show={showMenu} /> : <NavBarUser />)}
    </>
  )
}


export default Header;