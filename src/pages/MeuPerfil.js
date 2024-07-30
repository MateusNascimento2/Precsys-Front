import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Header from '../components/Header';
import ProfileImage from '../components/ProfileImage';
import useAuth from "../hooks/useAuth";

const useAnimatedNumber = (value) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 300,
    config: { mass: 1, tension: 170, friction: 30 },
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  console.log(number)

  return <animated.span>{number.to(n => formatNumber(n))}</animated.span>;
};

const MeuPerfil = () => {
  const { auth } = useAuth();
  const [activeItem, setActiveItem] = useState('info-gerais');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleItemClick = (id) => {
    setActiveItem(id);
    setIsMenuOpen(false); // Close the menu after selecting an item
  };

  const animatedExpAReceber = useAnimatedNumber(18825);
  const animatedExpRecebida = useAnimatedNumber(2720);
  const animatedValorGasto = useAnimatedNumber(10500);
  const animatedComissao = useAnimatedNumber(0);

  return (
    <>
      <Header />
      <motion.main
        className='container mx-auto px-2 pt-[120px] dark:bg-neutral-900'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className='border-b dark:border-neutral-600 pb-[24px]'>
          <div className='flex flex-col items-center lg:flex-row gap-4'>
            <div className='size-28 lg:size-36 bg-gray-100 rounded pt-2 relative'>
              <ProfileImage />
              <div className='absolute top-3/4 right-[-12px] bg-white rounded-full p-[2px]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={auth.user.ativo ? "size-5 text-green-600" : "size-5 text-red-600"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
              </div>


            </div>
            <div className='flex flex-col items-center gap-2'>
              <div>
                <span className='dark:text-white font-semibold text-[18px]'>{auth.user.nome}</span>
              </div>
              <div className='flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-5'>
                <div className='text-neutral-400 flex items-center gap-[3px] text-[14px]'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 1 0 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>

                  <span>{auth.user.cpfcnpj}</span>
                </div>
                <div className='text-neutral-400 flex items-center gap-[3px] text-[14px]'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>

                  <span>{auth.user.email}</span>
                </div>
              </div>
              <div className='flex flex-col mt-4 lg:flex-row gap-4 items-center w-full'>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>

                    <span className='dark:text-white font-semibold text-[18px]'>R$ {animatedExpAReceber}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Exp. A Receber</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>

                    <span className='dark:text-white font-semibold text-[18px]'>R$ {animatedExpRecebida}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Exp. Recebida</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                    <span className='dark:text-white font-semibold text-[18px]'>R$ {animatedValorGasto}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Valor Gasto</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                    <span className='dark:text-white font-semibold text-[18px]'>R$ {animatedComissao}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Comissão</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px]'>
                  <div className=''>
                    <span className='dark:text-white font-semibold text-[18px]'>4</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Cessões</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <aside>
          <>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="fixed bottom-4 right-4 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white p-2 rounded-full z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-black opacity-80 z-40"
                onClick={() => setIsMenuOpen(false)}
              ></div>
            )}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: isMenuOpen ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 w-full bg-white dark:bg-neutral-900 shadow-lg p-4 rounded-t-lg z-50"
            >
              <div className="p-2 lg:p-0 lg:px-2">
                <div className="">
                  <span className="font-[700] dark:text-white">Navegação</span>
                  <ul className="flex flex-col mt-4 divide-y flex-wrap dark:divide-neutral-600 justify-center">
                    <li className={"px-4 py-1 lg:py-2"}>
                      <a
                        onClick={() => handleItemClick('info-gerais')}
                        className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'info-gerais' ? ' font-bold ' : ''}`}
                      >
                        Resumo
                      </a>
                    </li>
                    <li className={"px-4 py-1 lg:py-2"}>
                      <a
                        onClick={() => handleItemClick('cessionarios')}
                        className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'cessionarios' ? ' font-bold ' : ''}`}
                      >
                        Atividades
                      </a>
                    </li>
                    <li className={"px-4 py-1 lg:py-2"}>
                      <a
                        onClick={() => handleItemClick('juridico')}
                        className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'juridico' ? ' font-bold ' : ''}`}
                      >
                        Cessões
                      </a>
                    </li>
                    <li className={"px-4 py-1 lg:py-2"}>
                      <a
                        onClick={() => handleItemClick('relacionados')}
                        className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'relacionados' ? ' font-bold ' : ''}`}
                      >
                        Clientes
                      </a>
                    </li>
                    <li className={"px-4 py-1 lg:py-2"}>
                      <a
                        onClick={() => handleItemClick('documentos')}
                        className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'documentos' ? ' font-bold ' : ''}`}
                      >
                        Documentos
                      </a>
                    </li>
                    <li className={"px-4 py-1 lg:py-2"}>
                      <a
                        onClick={() => handleItemClick('configuracoes')}
                        className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'configuracoes' ? ' font-bold ' : ''}`}
                      >
                        Configurações
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        </aside>
      </motion.main>
    </>
  );
};

export default MeuPerfil;
