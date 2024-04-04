import React from "react";
import useAuth from "../hooks/useAuth";
import ProfileImage from './ProfileImage';
import LogoutButton from './LogoutButton';
import ThemeSwitcher from "./ThemeSwitcher";


function UserToolbar({ show, updateLogo, darkMode, onDarkModeChange }) {
  const { auth } = useAuth();

  return (
    <>
      <section className={show ? 'cursor-auto shadow rounded right-0 absolute flex flex-col px-4 items-start bg-[#FFF] dark:bg-neutral-900 dark:text-white dark:border-neutral-600 border w-[300px] z-50 top-[calc(0vh+40px)] lg:top-[calc(0vh+45px)] transition-opacity duration-[0.3s] ease-in-out' : 'rounded right-0 transition-opacity duration-[0.3s] ease-in-out flex flex-col items-start w-[300px] z-50 fixed top-[-100vh] opacity-0'}>
        <div className="flex items-center border-b dark:border-neutral-600 gap-5 py-3 w-full">
          <div className="w-[70px] bg-gray-100 rounded pt-1">
            <ProfileImage userImage={auth?.userImage} />
          </div>
          <div className="flex flex-col w-full">
            <span className="font-semibold flex justify-between items-center">
              {auth?.user.nome}
              <span className={auth?.user.admin ? 'bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white text-[11px] font-bold rounded py-[1px] px-[4px]' : 'hidden'}>
                ADM
              </span>
            </span>
            <span className="text-sm text-[#555] dark:text-neutral-500">{auth?.user.email}</span>
          </div>
        </div>
        <ul className='flex w-full px-2 py-2 flex-col items-center gap-1 text-[13px] border-b dark:border-neutral-700'>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Meu Perfil
            <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Ver o seu Perfil</p>
          </li>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Minha Atividade
            <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Ver minha Atividade</p>
          </li>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Relatório IR
            <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Ver o seu Relatório IR</p>
          </li>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Configurações
            <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Configurações de Perfil</p>
          </li>
        </ul>
        <div className="w-full py-2 pl-2 flex justify-between">
          <LogoutButton />
          <ThemeSwitcher updateLogo={updateLogo} darkMode={darkMode} onDarkModeChange={onDarkModeChange} />
        </div>


      </section>
    </>

  )

}

export default UserToolbar;