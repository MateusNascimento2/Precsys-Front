import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';

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
  const year = today.getFullYear();
  return `${year}-${month}`;
};

const getCurrentYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  return `${year}`;
};

const tabs = ["Dia", "Semana", "Ano"];

export default function CessoesPerfil({ user }) {
  const [cessoes, setCessoes] = useState([]);
  const [cessionarios, setCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });
        if (isMounted) setState(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData('/cessoes', setCessoes);
    fetchData('/cessionarios', setCessionarios);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const minhasCessoes = cessionarios
    .filter(cessionario => cessionario.user_id === String(user.id))
    .map(cessionario => {
      return cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id));
    })
    .filter(cessao => cessao); // Remover possíveis valores indefinidos

  const filteredCessoes = minhasCessoes.filter(cessao => {
    if (!cessao) return false;

    const cessaoDate = new Date(cessao.data_cessao);
    const cessaoYear = cessaoDate.getFullYear();
    const cessaoMonth = String(cessaoDate.getMonth() + 1).padStart(2, '0');
    const cessaoDay = String(cessaoDate.getDate()).padStart(2, '0');

    if (tabs[activeTab] === 'Dia') {
      return cessao.data_cessao === getCurrentDate();
    } else if (tabs[activeTab] === 'Semana') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
      return cessaoDate >= startOfWeek && cessaoDate <= endOfWeek;
    } else if (tabs[activeTab] === 'Ano') {
      return cessaoYear === parseInt(getCurrentYear());
    }
    return false;
  });

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
          <span className='font-semibold dark:text-white'>Cessões</span>
          <span className='text-[12px] font-medium dark:text-neutral-400 text-neutral-600'>Últimas cessões compradas</span>
        </div>
        <div className='dark:text-black dark:bg-white bg-black text-white flex items-center justify-around rounded w-[103px] h-[30px] relative'>
          <button onClick={handlePrevTab}>
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

          <button onClick={handleNextTab}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center">
          <div className="size-8 mt-8">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <ul className='mt-8'>
          <div className='h-[330px] overflow-y-auto'>
            {filteredCessoes.map((cessao, index) => (
              <li key={index} className="flex p-2 items-center border dark:border-neutral-600 rounded  mb-2">
                <div className='border-r dark:border-neutral-600 pr-2'>
                  <span className="font-bold dark:text-white">
                    {cessao.id}
                  </span>
                </div>
                <div className='flex flex-col gap-1 pl-2'>
                  <span className="font-bold dark:text-white hover:underline text-sm"><Link to={`/cessao/${String(cessao.id)}`}>{cessao.precatorio}</Link></span>
                  <span className="text-xs text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cessao.cedente}</span>
                </div>
              </li>
            ))}
          </div>
        </ul>
      )}
    </section>
  );
}
