import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import PieChart from '../components/PieChart';
import useAuth from "../hooks/useAuth";
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';

function Dashboard() {
  const [show, setShow] = useState(false)
  const { auth } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Gambiarra para o tema dark pegar no Tooltip
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      setIsDarkTheme(htmlElement.classList.contains('dark'));
    };

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    checkDarkMode();

    return () => observer.disconnect();
  }, []);

  const handleShow = () => {
    setShow((prevState) => !prevState)
  }

  return (
    <>
      <Header show={show} onSetShow={handleShow} />
      <main className='px-2 container mx-auto mt-[120px]'>
        <div className='mt-[120px] mb-[120px] flex flex-col gap-6 justify-between px-2 lg:flex-row lg:mt-[150px] lg:mb-[200px]'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='flex flex-col gap-4'
          >
            <h2 className='font-[800] text-[24px] text-center md:text-left lg:text-[34px] dark:text-white'>Bem-vindo, {auth.user.nome.split(' ')[0]}.</h2>
            <p className='text-[#666666] text-center text-[15px] md:text-left lg:text-[16px] md:w-[650px] dark:text-neutral-400'>O PrecSys é uma ferramenta desenvolvida para oferecer uma visualização organizada e clara das informações de cessões. Seu objetivo é aprimorar o acesso aos dados, permitindo que o usuário veja detalhes cruciais de maneira eficiente. Nesta versão, o PrecSys está ainda mais ágil, garantindo acesso rápido e descomplicado aos dados apresentados.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex flex-col items-center justify-center gap-4 lg:gap-2'
          >
            <Link to={'/minhas-cessoes'}><button className='w-[200px] bg-black text-white rounded px-4 py-2 font-[600] shadow lg:px-8 dark:bg-white dark:text-black'>Minhas Cessões</button></Link>
            <button className='w-[200px] border rounded border-gray-300 px-4 py-2 font-[600] shadow lg:px-8 dark:text-white dark:bg-neutral-800 dark:border-neutral-800'>Abrir Ticket</button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='mt-[120px] mb-[120px] flex flex-col justify-center items-center lg:mt-[200px] lg:mb-[200px]'
        >
          <Tooltip id="my-tooltip3" style={{
            position: 'absolute',
            zIndex: 60,
            backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF',
            color: isDarkTheme ? '#FFF' : '#000',
            fontSize: '12px',
            fontWeight: '500',
            fontStyle: 'italic',
            maxWidth: '250px'
          }}
            border={isDarkTheme ? '1px solid rgb(82 82 82)' : "1px solid #d4d4d4"}
            opacity={100}
            place="top"
          />
          {auth.user.ver_dashboard ? <>
            <div className='flex gap-2 items-center'>
              <h2 className='text-center font-[800] text-[24px] lg:text-[34px] dark:text-white'>Resumo das suas Cessões</h2>
              <svg
                data-tooltip-id="my-tooltip3"
                data-tooltip-content={'Os valores apresentados são estimativas sujeitas a mudanças, com os totais dependendo da atualização dos status dos precatórios.'}
                data-tooltip-place="left"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 dark:text-white mt-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className='mt-[40px] lg:gap-[2rem] xl:gap-[10rem] w-full'>
              <div className='w-full'>
                <PieChart />
              </div>
            </div>
          </> : null}
        </motion.div>
      </main>
    </>
  )
}

export default Dashboard;
