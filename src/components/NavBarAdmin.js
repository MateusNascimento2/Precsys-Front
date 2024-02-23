import React, { useState } from 'react'
import LogoutButton from './LogoutButton';

function NavBarAdmin({ show }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuType, setMenuType] = useState(null);

  function handleShow(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState)
    } else {
      setShowMenu(true);
      setMenuType(type)
    }
  }

  return (
    <nav className={show ? 'absolute flex items-start bg-[#FFF] w-screen z-50 top-[calc(0vh+51px)] px-4 h-screen' : 'flex items-start bg-[#FFF] h-screen w-screen z-50 fixed top-[-100vh] '}>
      <ul className='flex w-full px-2 flex-col items-center gap-2 text-[13px]'>
        <li onClick={() => handleShow('logs')} className='w-full border-b p-2'>
          <div className='flex justify-between items-center'>
            <span>Logs</span>
            <span className='text-[12px]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'logs' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          <div className={showMenu && menuType === 'logs' ? 'mt-2 flex flex-col gap-2 text-[12px] h-[75px] overflow-y-hidden transition-all' : 'h-0 overflow-y-hidden transition-all'}>
            <ul className='ml-2'>
              <li className='my-3'><span>Logins</span></li>
              <li className='my-3'><span>Propostas</span></li>
            </ul>
          </div>
        </li>
        <li className='w-full border-b p-2'>Usuários</li>
        <li className='w-full border-b p-2'>Empresas</li>
        <li className='w-full border-b p-2'>Jurídicos</li>
        <li className='w-full border-b p-2'>Escreventes</li>
        <li className='w-full border-b p-2'>Orçamentos</li>
        <li onClick={() => handleShow('cessoes')} className='w-full border-b p-2'>
          <div className='flex justify-between items-center'>
            <span>Cessões</span>
            <span className='text-[12px]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'cessoes' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          <div className={showMenu && menuType === 'cessoes' ? 'mt-2 flex flex-col gap-2 text-[12px] h-[105px] overflow-y-hidden transition-all' : 'h-0 overflow-y-hidden transition-all'}>
            <ul className='ml-2'>
              <li className='my-3'><span>Todas as Cessões</span></li>
              <li className='my-3'><span>Cessionários Preenchidos</span></li>
              <li className='my-3'><span>Cessionários Vazios</span></li>
            </ul>
          </div>
        </li>
        <li className='w-full p-2'><LogoutButton /></li>
      </ul>
    </nav>
  )
}

export default NavBarAdmin;