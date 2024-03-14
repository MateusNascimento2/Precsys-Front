import React, { useState } from 'react'

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
    <nav className={show ? 'shadow border-r border-gray-300 transition-all duration-500 absolute flex items-start bg-white brightness-110 w-[300px] z-50 h-screen top-[44px] left-[-10px] px-4 lg:static lg:w-full lg:h-full ' : 'border-r transition-all duration-500 px-4 flex items-start bg-[#FFF] w-[300px] z-50 absolute top-[44px] left-[-100vw] h-screen'}>
      <ul className='flex w-full px-2 flex-col items-center gap-2 text-[13px] lg:flex-row'>
        <li onClick={() => handleShow('logs')} className='w-full border-b border-gray-300 p-2 lg:border-0'>
          <div className='flex justify-between items-center lg:gap-3'>
            <span className='font-[500] text-[#666666]'>Logs</span>
            <span className='text-[12px]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'logs' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          <div className={showMenu && menuType === 'logs' ? 'mt-2 flex flex-col gap-2 text-[12px] h-[180px] overflow-y-hidden transition-all lg:absolute lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border' : 'h-0 overflow-y-hidden transition-all lg:absolute lg:z-50'}>
            <ul className='lg:ml-0'>
              <li className='mb-3 mt-2'>
                <span className='font-[600] text-[12px] text-[#666666]'>Categorias</span>
              </li>
              <li className='p-2 rounded cursor-pointer hover:bg-neutral-200'>
                <span className='font-[600] text-[14px] text-[#171717]'>Logins</span>
                <p className='font-[500] text-[#666666]'>Ver todos os Logins</p>
              </li>
              <li className='p-2 rounded cursor-pointer hover:bg-neutral-200'>
                <span className='font-[600] text-[14px] text-[#171717]'>Propostas</span>
                <p className='font-[500] text-[#666666]'>Ver todas as Propostas</p>
              </li>
            </ul>
          </div>
        </li>
        <li className='w-full border-b border-gray-300 p-2 font-[500] text-[#666666] lg:border-0'>Usuários</li>
        <li className='w-full border-b border-gray-300 p-2 font-[500] text-[#666666] lg:border-0'>Empresas</li>
        <li className='w-full border-b border-gray-300 p-2 font-[500] text-[#666666] lg:border-0'>Jurídicos</li>
        <li className='w-full border-b border-gray-300 p-2 font-[500] text-[#666666] lg:border-0'>Escreventes</li>
        <li className='w-full border-b border-gray-300 p-2 font-[500] text-[#666666] lg:border-0'>Orçamentos</li>
        <li onClick={() => handleShow('cessoes')} className='w-full border-b border-gray-300 p-2 lg:border-0'>
          <div className='flex justify-between items-center lg:gap-3'>
            <span className='font-[500] text-[#666666]'>Cessões</span>
            <span className='text-[12px]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'cessoes' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          <div className={showMenu && menuType === 'cessoes' ? 'mt-2 flex flex-col gap-2 h-[240px] overflow-y-hidden transition-all lg:absolute lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border' : 'h-0 overflow-y-hidden transition-all lg:absolute lg:z-50 lg:bg-white'}>
            <ul className='lg:ml-0 '>
              <li className='mb-3 mt-2'>
                <span className='font-[600] text-[12px] text-[#666666]'>Categorias</span>
              </li>
              <li className='p-2 rounded cursor-pointer hover:bg-neutral-200'>
                <span className='font-[600] text-[14px] text-[#171717]'>Todas as Cessões</span>
                <p className='font-[500] text-[#666666]'>Ver todas as Cessões</p>
              </li>
              <li className='p-2 rounded cursor-pointer hover:bg-neutral-200'>
                <span className='font-[600] text-[14px] text-[#171717]'>Cessionários Preenchidos</span>
                <p className='font-[500] text-[#666666]'>Ver todos os Cessionários Preenchidos</p>
              </li>
              <li className='p-2 rounded cursor-pointer hover:bg-neutral-200'>
                <span className='font-[600] text-[14px] text-[#171717]'>Cessionários Vazios</span>
                <p className='font-[500] text-[#666666]'>Ver todos os Cessionários Vazios</p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default NavBarAdmin;