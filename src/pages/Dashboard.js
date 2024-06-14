import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import PieChart from '../components/PieChart';
import Topics from '../components/Topics';
import TextBox from '../components/TextBox';
import useAuth from "../hooks/useAuth";
import { Link } from 'react-router-dom'

function Dashboard() {
  const [show, setShow] = useState(false)
  const { auth } = useAuth();

  const handleShow = () => {
    setShow((prevState) => !prevState)
    console.log(show);
  }

  return (

    <>
      <Header show={show} onSetShow={handleShow} />
      <main className='px-2 container mx-auto mt-[120px]'>
        <div className='mt-[120px] mb-[120px] flex flex-col gap-6 justify-between px-2 lg:flex-row lg:mt-[150px] lg:mb-[200px]'>
          <div className='flex flex-col gap-4'>
            <h2 className='font-[800] text-[24px] text-center md:text-left lg:text-[34px]'>Bem-vindo, {auth.user.nome.split(' ')[0]}.</h2>
            <p className='text-[#666666] text-center text-[15px] md:text-left lg:text-[16px] md:w-[650px]'>O PrecSys é uma ferramenta desenvolvida para oferecer uma visualização organizada e clara das informações de cessões. Seu objetivo é aprimorar o acesso aos dados, permitindo que o usuário veja detalhes cruciais de maneira eficiente. Nesta versão, o PrecSys está ainda mais ágil, garantindo acesso rápido e descomplicado aos dados apresentados.</p>
          </div>
          <div className='flex flex-col items-center justify-center gap-4 lg:gap-2'>
            <button className='w-[200px] bg-black text-white rounded px-4 py-2 font-[600] shadow lg:px-8'><Link to={'/minhas-cessoes'}>Minhas Cessões</Link></button>
            <button className='w-[200px] border rounded border-gray-300 px-4 py-2 font-[600] shadow lg:px-8'>Abrir Ticket</button>
          </div>
        </div>
        <div className='px-2 mt-[120px] mb-[120px] flex flex-col justify-center items-center lg:mt-[200px] lg:mb-[200px]'>
          <h2 className='text-center font-[800] text-[24px] md:text-left lg:text-[34px]'>One codebase, endless benefits.</h2>
          <div className='px-2 mt-[40px] flex flex-col justify-center items-center lg:gap-[2rem] xl:gap-[10rem] lg:flex-row '>
            <div className='shrink-0'>
              <PieChart />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 md:mt-10'>
              <div className='flex flex-col items-center justify-center gap-4'>
                <TextBox title={'Zero config deployments'} text={'Automate your deployment process then review among your team with Preview Deployments, generated with every commit.'} />
                <TextBox title={'Zero config deployments'} text={'Automate your deployment process then review among your team with Preview Deployments, generated with every commit.'} />
              </div>
              <div className='pt-3 flex flex-col gap-4 md:pt-0'>
                <TextBox title={'Zero config deployments'} text={'Automate your deployment process then review among your team with Preview Deployments, generated with every commit.'} />
                <TextBox title={'Zero config deployments'} text={'Automate your deployment process then review among your team with Preview Deployments, generated with every commit.'} />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-[120px] mb-[120px] px-2 md:block lg:mt-[200px] lg:mb-[200px]'>
          <span className='text-[#666666] text-[14px]'>Topics</span>
          <div className='p-4 grid grid-cols-1 grid-rows-2 gap-2 mt-4 md:grid-cols-3 lg:grid-cols-4'>
          </div>
        </div>
      </main>
    </>

  )
}

export default Dashboard;