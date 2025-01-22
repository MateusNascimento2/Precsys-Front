import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { motion } from 'framer-motion';

const adjustToUserTimezone = (utcDateString) => {
  const date = new Date(utcDateString);
  return date.toLocaleString();
};

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};

const getCurrentMonth = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${month}`;
};

const getCurrentYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  return `${year}`;
};

const tabs = ["Dia", "Semana", "Mês", "Geral"];

export default function AtividadesPerfil({ user, ShowAllActivities }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });

        if (isMounted) {

          if (ShowAllActivities) {
            const userLogs = data.filter(log => log.usuario === String(user.id));
            const filteredLogs = filterLogs(userLogs);
            setState(filteredLogs);
          } else {
            const userLogs = data.filter(log => log.usuario === String(user.id)).slice(0, 4);
            const filteredLogs = filterLogs(userLogs);
            setState(filteredLogs);
          }

        }

      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData('/loginLogs', setLogs);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user.id, activeTab]);

  const filterLogs = (logs) => {
    const currentDate = new Date();

    if (ShowAllActivities) {
      switch (activeTab) {
        case 0: // Dia
          return logs.filter(log => {
            const logDate = new Date(log.data);
            return logDate.toDateString() === currentDate.toDateString();
          });
        case 1: // Semana
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          return logs.filter(log => {
            const logDate = new Date(log.data);
            return logDate >= startOfWeek && logDate <= currentDate;
          });
        case 2: // Mês
          return logs.filter(log => {
            const logDate = new Date(log.data);
            return logDate.getMonth() === currentDate.getMonth() && logDate.getFullYear() === currentDate.getFullYear();
          });
        case 3: // Geral
        default:
          return logs;
      }
    } else {
      return logs;
    }


  };

  const tabVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  };

  const handlePrevTab = () => {
    setActiveTab((prevTab) => (prevTab === 0 ? tabs.length - 1 : prevTab - 1));
  };

  const handleNextTab = () => {
    setActiveTab((prevTab) => (prevTab === tabs.length - 1 ? 0 : prevTab + 1));
  };

  return (
    <section className='p-2'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <span className='font-semibold dark:text-white'>Atividades</span>
          <span className='text-[12px] font-medium dark:text-neutral-400 text-neutral-600'>Acompanhe suas atividades no sistema</span>
        </div>

        {ShowAllActivities && (

          <div className='dark:text-white bg-transparent flex items-center justify-around rounded w-[103px] h-[30px] relative'>
            <button onClick={handlePrevTab} className='hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded h-full px-1'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className='w-[70px] text-center mb-[2px] overflow-hidden'>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={tabVariants}
                transition={{ duration: 0.3 }}
                key={activeTab}
                className='rounded text-sm font-medium'
              >
                {tabs[activeTab]}
              </motion.div>
            </div>

            <button onClick={handleNextTab} className='hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded h-full px-1'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

        )

        }

      </div>
      <div className='mt-8'>
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div className="size-8">
              <LoadingSpinner />
            </div>
          </div>
        ) : logs.length > 0 ? (
          <ul className=' gap-6 justify-center'>
            {logs.map((log, index) => (
              <div className='flex gap-4 items-start relative' key={index}>
                <div className='bg-neutral-100 dark:bg-neutral-700 rounded-full shrink-0  relative z-[1] size-10 flex items-center justify-center '>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-neutral-400 relative z-[1]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                  </svg>
                </div>
                <div className={`z-0 absolute left-0 top-0 h-full translate-x-1/2 border-l border-dashed w-[40px] ${index === logs.length - 1 ? 'border-transparent border-0' : 'border-neutral-400 dark:border-neutral-600'}`}></div>
                <div className='flex flex-col gap-1 mb-10'>
                  <span className='font-medium text-[16px] dark:text-white'>Você fez um login no sistema.</span>
                  <li className='text-neutral-600 text-[12px] dark:text-neutral-400'>{adjustToUserTimezone(log.data).split(',')[0]} às {adjustToUserTimezone(log.data).split(',')[1]}, pelo ip {log.ip}</li>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className='font-medium text-[16px] dark:text-white'>Nenhuma atividade encontrada.</p>
        )}
      </div>
    </section >
  );
}
