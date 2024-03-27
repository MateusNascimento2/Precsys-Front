import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import PieChart from '../components/PieChart';
import Topics from '../components/Topics';
import TextBox from '../components/TextBox';

function Dashboard() {
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow((prevState) => !prevState)
    console.log(show);
  }

  return (

    <>
      <Header show={show} onSetShow={handleShow} />
      <main className='container mx-auto mt-[120px]'>
        <div className='mt-[120px] mb-[120px] flex flex-col gap-6 justify-between px-2 lg:flex-row lg:mt-[150px] lg:mb-[200px]'>
          <div className='flex flex-col gap-4'>
            <h2 className='font-[800] text-[24px] text-center md:text-left lg:text-[34px]'>Develop.Preview.Ship.</h2>
            <p className='text-[#666666] text-center text-[15px] md:text-left lg:text-[16px] md:w-[650px]'>Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.</p>
          </div>
          <div className='flex flex-col items-center justify-center gap-4 lg:gap-2'>
            <button className='w-[200px] bg-black text-white rounded px-4 py-2 font-[600] shadow lg:px-8'>Start Deploying</button>
            <button className='w-[200px] border rounded border-gray-300 px-4 py-2 font-[600] shadow lg:px-8'>Tour the Product</button>
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
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
            <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            )} />
          </div>
        </div>
      </main>
    </>

  )
}

export default Dashboard;