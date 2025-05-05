import React from 'react'
import { ButtonEditProfile } from '../pages/MeuPerfil';
/* import PieChart from './PieChart';
 */
export default function DetalhesPerfil({ user, handleItemClick }) {

  return (
    <section className='px-2 mt-3 lg:mt-0'>
      <div className='flex justify-between items-center pb-4'>
        <span className='font-semibold dark:text-white'>Detalhes do Perfil</span>

        <ButtonEditProfile handleItemClick={handleItemClick} />

      </div>
      <div className='pt-4 flex flex-col gap-4'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium'>Nome</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.nome}</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium' >CPF/CNPJ</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.cpfcnpj}</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium'>E-mail</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.email}</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium'>Telefone</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.telefone}</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium mr-4'>Endereço</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.endereco}</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium mr-4'>Obs</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.obs ? user.obs : '-'}</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-[13px] text-neutral-400 font-medium mr-4'>Qualificação</span>
          <span className='dark:text-white font-medium text-[14px]'>{user.qualificacao}</span>
        </div>
      </div>

{/*       <div className='mt-4'>
        <PieChart />
      </div> */}
    </section>
  )
}