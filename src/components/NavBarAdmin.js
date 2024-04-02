import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


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

  const navigate = useNavigate();

  const handleRoute = (route) => {
    navigate(route)
  }

  


  return (
    <>
      <div onClick={() => {setShowMenu((prevState) => !prevState)}} className={showMenu && menuType === 'logs' ? 'lg:w-screen lg:h-screen lg:opacity-100 lg:absolute lg:z-[40] lg:left-0 lg:top-[50px]' : 'hidden'}></div>
      <div onClick={() => {setShowMenu((prevState) => !prevState)}} className={showMenu && menuType === 'cessoes' ? 'lg:w-screen lg:h-screen lg:opacity-100 lg:absolute lg:z-[40] lg:left-0 lg:top-[50px]' : 'hidden'}></div>
      <nav className={show ? 'shadow border-t border-r border-neutral-300 transition-all duration-[0.3s] ease-in-out fixed flex items-start bg-white w-[300px] z-50 h-screen top-[52px] left-0 px-4 lg:static lg:w-full lg:h-full lg:shadow-none lg:border-0 dark:bg-neutral-900 dark:border-neutral-700 lg:transition-none lg:duration-0 lg:flex lg:items-center' : 'border-r dark:border-neutral-700 transition-all duration-[0.3s] ease-in-out px-4 flex items-start bg-[#FFF] w-[300px] z-50 fixed top-[52px] left-[-300px] h-screen dark:bg-neutral-900 lg:transition-none lg:duration-0'}>
        <ul className='divide-y divide-neutral-300 dark:divide-neutral-700 flex w-full px-2 flex-col items-center gap-2 text-[13px] lg:flex-row lg:divide-y-0'>
          <li onClick={() => handleShow('logs')} className='cursor-pointer w-full p-2 lg:px-2 lg:border-0'>
            <div className='flex justify-between items-center lg:gap-3 '>
              <span className='font-[500] text-[#666666] dark:text-neutral-300 hover:text-black hover:font-[600] dark:hover:text-white'>Logs</span>
              <span className='text-[12px] dark:text-neutral-300 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'logs' ? "w-3 h-3 inline-block rotate-180 transition-all " : 'w-3 h-3 inline-block'}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
            
            <div className={showMenu && menuType === 'logs' ? 'mt-2 flex flex-col gap-2 text-[12px] h-[180px] overflow-y-hidden transition-all lg:absolute lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 lg:shadow cursor-default dark:bg-neutral-900 dark:border-neutral-600 dark:lg:shadow-[#000]' : 'h-0 overflow-y-hidden transition-all lg:absolute lg:z-50 dark:bg-neutral-900 dark:border-neutral-600'}>
              <ul className='lg:ml-0 '>
                <li className='mb-3 mt-2'>
                  <span className='font-[600] text-[12px] text-[#666666] dark:text-neutral-500'>Categorias</span>
                </li>
                <li className='p-2 rounded cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800'>
                  <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Logins</span>
                  <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Logins</p>
                </li>
                <li className='p-2 rounded cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800'>
                  <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Propostas</span>
                  <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todas as Propostas</p>
                </li>
              </ul>
            </div>
          </li>
          <li className='cursor-pointer w-full p-2 lg:px-2  font-[500] text-[#666666] lg:border-0 hover:text-black hover:font-[600] dark:text-neutral-300 dark:hover:text-white'>Usuários</li>
          <li className='cursor-pointer w-full p-2 lg:px-2  font-[500] text-[#666666] lg:border-0 hover:text-black hover:font-[600] dark:text-neutral-300 dark:hover:text-white'>Empresas</li>
          <li className='cursor-pointer w-full p-2 lg:px-2  font-[500] text-[#666666] lg:border-0 hover:text-black hover:font-[600] dark:text-neutral-300 dark:hover:text-white'>Jurídicos</li>
          <li className='cursor-pointer w-full p-2 lg:px-2  font-[500] text-[#666666] lg:border-0 hover:text-black hover:font-[600] dark:text-neutral-300 dark:hover:text-white'>Escreventes</li>
          <li className='cursor-pointer w-full p-2 lg:px-2  font-[500] text-[#666666] lg:border-0 hover:text-black hover:font-[600] dark:text-neutral-300 dark:hover:text-white'>Orçamentos</li>
          <li onClick={() => handleShow('cessoes')} className='cursor-pointer w-full p-2 lg:px-2  lg:border-0'>
            <div className='flex justify-between items-center lg:gap-3'>
              <span className='font-[500] text-[#666666] hover:text-black hover:font-[600] dark:text-neutral-300 dark:hover:text-white'>Cessões</span>
              <span className='text-[12px] dark:text-neutral-300'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'cessoes' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
            <div className={showMenu && menuType === 'cessoes' ? 'lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 h-[230px] lg:w-[300px] overflow-y-hidden transition-all lg:absolute lg:right-8 xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all lg:absolute lg:z-50 lg:bg-white lg:right-8 xl:right-auto dark:bg-neutral-900 dark:border-neutral-600'}>
              <ul className='lg:ml-0 '>
                <li className='mb-3 mt-2'>
                  <span className='font-[600] text-[12px] text-[#666666]'>Categorias</span>
                </li>
                <li className='p-2 rounded cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800' onClick={() => handleRoute('/todas-cessoes')}>
                  <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Todas as Cessões</span>
                  <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todas as Cessões
                  </p>
                </li>
                <li className='p-2 rounded cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800'>
                  <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Cessionários Preenchidos</span>
                  <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Cessionários Preenchidos</p>
                </li>
                <li className='p-2 rounded cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800'>
                  <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Cessionários Vazios</span>
                  <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Cessionários Vazios</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </>

  )
}

export default NavBarAdmin;