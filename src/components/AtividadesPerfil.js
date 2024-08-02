import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

const adjustToUserTimezone = (utcDateString) => {
  const date = new Date(utcDateString); // Converte a string UTC para um objeto Date
  return date.toLocaleString(); // Converte para a hora local do usuário
};

export default function AtividadesPerfil({ user }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });
        console.log(data);

        if (isMounted) {
          const userLogs = data.filter(log => log.usuario == user.id).slice(0, 4);
          console.log(userLogs)
          setState(userLogs);
        };

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
  }, [user.id]);



  return (
    <section className='p-2'>
      <div className='flex flex-col'>
        <span className='font-semibold dark:text-white'>Atividades</span>
        <span className='text-[12px] font-medium dark:text-neutral-400 text-neutral-600'>Acompanhe suas atividades no sistema</span>
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
              <div className='flex gap-4 items-start relative '>
                <div className='bg-neutral-100 dark:bg-neutral-700 rounded-full shrink-0  relative z-[1] size-10 flex items-center justify-center '>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-neutral-400 relative z-[1]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                  </svg>
                </div>
                <div className={`z-0 absolute left-0 top-0 h-full translate-x-1/2 border-l border-dashed w-[40px] ${index === logs.length - 1 ? 'border-transparent border-0' : 'border-neutral-400 dark:border-neutral-600'}`}></div>
                <div className='flex flex-col gap-1 mb-10'>
                  <span className='font-medium text-[16px] dark:text-white'>Você fez um login no sistema.</span>
                  <li className='text-neutral-600 text-[12px] dark:text-neutral-400' key={index}>{adjustToUserTimezone(log.data).split(',')[0]} às {adjustToUserTimezone(log.data).split(',')[1]}, pelo ip {log.ip}</li>
                </div>
              </div>


            ))}
          </ul>
        ) : (
          <p>Nenhuma atividade encontrada.</p>
        )}
      </div>

    </section>
  )
}