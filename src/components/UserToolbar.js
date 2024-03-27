import React, {useEffect, useRef} from "react";
import useAuth from "../hooks/useAuth";
import ProfileImage from './ProfileImage';
import LogoutButton from './LogoutButton';
import ThemeSwitcher from "./ThemeSwitcher";


function UserToolbar({ show, onClickOutside }) {
  const { auth } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ onClickOutside ]);

  if(!show) {
    return null;
  }

  return (
    <>
      <section ref={ref} className={show ? 'cursor-auto shadow rounded right-0 absolute flex flex-col px-4 items-start bg-[#FFF] border w-[300px] z-50 top-[calc(0vh+40px)] transition-opacity delay-100 opacity-100' : 'rounded right-0 transition-opacity delay-100 flex flex-col items-start w-[300px] z-50 fixed top-[-100vh] opacity-0'}>
        <div className="flex items-center border-b gap-5 py-3 w-full">
          <div className="w-[70px] bg-gray-100 rounded pt-1">
            <ProfileImage userImage={auth?.userImage} />
          </div>
          <div className="flex flex-col w-full">
            <span className="font-semibold flex justify-between items-center">
              {auth?.user.nome}
              <span className={auth?.user.admin ? 'bg-[#181c32] text-white text-[11px] font-bold rounded py-[1px] px-[4px]' : 'hidden'}>
                ADM
              </span>
            </span>
            <span className="text-sm text-[#555]">{auth?.user.email}</span>
          </div>
        </div>
        <ul className='flex w-full px-2 py-2 flex-col items-center gap-1 text-[13px] border-b'>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100'>Meu Perfil
            <p className='font-[500] text-[#666666] text-[12px]'>Ver o seu Perfil</p>
          </li>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100'>Minha Atividade
            <p className='font-[500] text-[#666666] text-[12px]'>Ver minha Atividade</p>
          </li>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100'>Relatório IR
            <p className='font-[500] text-[#666666] text-[12px]'>Ver o seu Relatório IR</p>
          </li>
          <li className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100'>Configurações
            <p className='font-[500] text-[#666666] text-[12px]'>Configurações de Perfil</p>
          </li>
        </ul>
        <div className="w-full py-2 pl-2 flex justify-between">
          <LogoutButton />
          <ThemeSwitcher />
        </div>


      </section>
    </>

  )

}

export default UserToolbar;