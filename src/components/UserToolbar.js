import React from "react";
import useAuth from "../hooks/useAuth";
import ProfileImage from './ProfileImage';
import LogoutButton from './LogoutButton';


function UserToolbar({ show }) {
  const { auth } = useAuth();

  return (
    <>
      {/* <div className= {show ? "cursor-auto z-[51] w-[22px] h-[45px] overflow-hidden absolute float-center top-[25px] right-[17px] rotate-[90deg]" : "hidden" }>
        <div className="w-0 h-0 border-r-[16px] border-r-gray-300 border-t-[10px] border-t-transparent border-b-[30px] border-b-transparent absolute top-0 left-0"></div>
        <div className="w-0 h-0 border-r-[16px] border-r-[#fff] border-t-[10px] border-t-transparent border-b-[30px] border-b-transparent absolute top-0 left-[1px]"></div>
      </div> */}
      <section className={show ? 'cursor-auto shadow rounded right-0 absolute flex flex-col px-4 items-start bg-[#FFF] border w-[300px] z-50 top-[calc(0vh+40px)] transition-opacity delay-100 opacity-100' : 'rounded right-0 transition-opacity delay-100 flex flex-col items-start w-[300px] z-50 fixed top-[-100vh] opacity-0'}>
        <div className="flex items-center border-b gap-5 py-3 w-full">
          <div className="w-[70px] bg-gray-200 rounded pt-1">
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
        <ul className='flex w-full px-2 py-2 flex-col items-center gap-1 text-[13px]'>
          <li className='rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-300'>Meu Perfil
            <p className='font-[500] text-[#666666] text-[12px]'>Ver o seu Perfil</p>
          </li>
          <li className='rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-300'>Minhas Cessões
            <p className='font-[500] text-[#666666] text-[12px]'>Ver minhas Cessões</p>
          </li>
          <li className='rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-300'>Meus Clientes
            <p className='font-[500] text-[#666666] text-[12px]'>Ver meus Clientes</p>
          </li>
          <li className='rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-300'>Minha Atividade
            <p className='font-[500] text-[#666666] text-[12px]'>Ver minha Atividade</p>
          </li>
          <li className='rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-300'>Relatório IR
            <p className='font-[500] text-[#666666] text-[12px]'>Ver o seu Relatório IR</p>
          </li>
          <li className='rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-300'>Configurações
            <p className='font-[500] text-[#666666] text-[12px]'>Configurações de Perfil</p>
          </li>
          <li className='w-full p-2'><LogoutButton /></li>
        </ul>

      </section>
    </>

  )

}

export default UserToolbar;