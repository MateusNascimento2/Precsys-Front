import React from 'react'
import LogoutButton from './LogoutButton';

function NavBarAdmin({show}) {
  return (
    <nav className={show ? 'flex flex-col items-center justify-center bg-white w-screen fixed top-[50px]' : 'hidden'}>
      <span className='text-sm mt-2' >ADMIN</span>
      <ul className='flex w-full px-8 flex-col items-center gap-2 text-sm bg-white'>
        <li className='border-b w-full p-2'>Logs</li>
        <li className='border-b w-full p-2'>Usuários</li>
        <li className='border-b w-full p-2'>Empresas</li>
        <li className='border-b w-full p-2'>Jurídicos</li>
        <li className='border-b w-full p-2'>Escreventes</li>
        <li className='border-b w-full p-2'>Orçamentos</li>
        <li className='border-b w-full p-2'>Cessões
          <div className='flex flex-col gap-2 text-[12px] hidden'>
            <span>Todas as Cessões</span>
            <span>Cessionários Preenchidos</span>
            <span>Cessionários Vazios</span>
          </div>
        </li>
        <li className='border-b w-full p-2'><LogoutButton /></li>
      </ul>
    </nav>
  )
}

export default NavBarAdmin;