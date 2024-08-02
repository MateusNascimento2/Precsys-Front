import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import ProfileImage from '../components/ProfileImage';
import useAuth from "../hooks/useAuth";
import DetalhesPerfil from '../components/DetalhesPerfil';
import AtividadesPerfil from '../components/AtividadesPerfil';
import CessoesPerfil from '../components/CessoesPerfil';

const useAnimatedNumber = (value) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 300,
    config: { mass: 1, tension: 170, friction: 30 },
  });

  number.to(n => console.log(n))

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL'
    }).format(num);
  };

  return <animated.span>{number.to(n => formatNumber(n))}</animated.span>;
};

const MeuPerfil = () => {
  const { auth } = useAuth();
  const [activeItem, setActiveItem] = useState('info-gerais');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cessoes, setCessoes] = useState([]);
  const [cessionarios, setCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [myCessions, setMyCessions] = useState([]);

  const [expAReceber, setExpAReceber] = useState(0);
  const [expRecebida, setExpRecebida] = useState(0);
  const [valorGasto, setValorGasto] = useState(0);
  const [comissao, setComissao] = useState(0);
  const [qtdCessao, setQtdCessao] = useState(0);

  function changeStringFloat(a) {
    const virgulaParaBarra = a.replace(',', '/');
    const valorSemPonto = virgulaParaBarra.replace(/\./g, '');
    const semMoeda = valorSemPonto.replace('R$ ', '');
    const barraParaPonto = semMoeda.replace('/', '.');
    const valorFloat = Number(barraParaPonto);
    return valorFloat;
  }

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
    fetchData('/status', setStatus);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const cessionariosPorIDdoUsuarios = cessionarios.filter(cessionario => String(cessionario.user_id) === String(auth.user.id));
    console.log(cessionariosPorIDdoUsuarios)

    const minhasCessoes = cessionariosPorIDdoUsuarios
      .map(cessionario => {
        const cessao = cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id));
        if (cessao) {
          cessao.exp_recebimento = changeStringFloat(cessionario.exp_recebimento);
        }
        return cessao;
      })
      .filter(cessao => cessao !== undefined);

    setQtdCessao(minhasCessoes.length)

    status.forEach(statusItem => {
      minhasCessoes.forEach(cessao => {
        if (cessao.status === String(statusItem.id)) {
          cessao.x = statusItem.nome;
        }
      });
    });

    setMyCessions(minhasCessoes);

    // Calcular expAReceber e expRecebida
    const totalExpAReceber = minhasCessoes
      .filter(cessao => cessao.x !== 'Recebido') // Excluir os recebidos
      .reduce((total, cessao) => total + parseFloat(cessao.exp_recebimento), 0);

    const totalExpRecebida = minhasCessoes
      .filter(cessao => cessao.x === 'Recebido') // Somente os recebidos
      .reduce((total, cessao) => total + parseFloat(cessao.exp_recebimento), 0);

    const totalValorGasto = cessionariosPorIDdoUsuarios
      .reduce((total, cessionario) => total + parseFloat(changeStringFloat(cessionario.valor_pago)), 0);

    const totalComissao = cessionariosPorIDdoUsuarios
      .reduce((total, cessionario) => total + parseFloat(changeStringFloat(cessionario.comissao)), 0);

    setExpAReceber(totalExpAReceber);
    setExpRecebida(totalExpRecebida);
    setValorGasto(totalValorGasto)
    setComissao(totalComissao)
  }, [cessionarios, cessoes, status, auth.user.id]);

  const minhasCessoesData = useMemo(() => {
    const statusQtd = [
      { x: 'Em Andamento', y: 0, color: '#d2c7b3', expRecebimentoTotal: 0 },
      { x: 'Em Andamento Com Depósito', y: 0, color: '#bdb4a9', expRecebimentoTotal: 0 },
      { x: 'Em Andamento Com Pendência', y: 0, color: '#aaa59e', expRecebimentoTotal: 0 },
      { x: 'Homologado', y: 0, color: '#9eabaf', expRecebimentoTotal: 0 },
      { x: 'Homologado Com Depósito', y: 0, color: '#aabcb5', expRecebimentoTotal: 0 },
      { x: 'Homologado Com Pendência', y: 0, color: '#9299a8', expRecebimentoTotal: 0 },
      { x: 'Ofício de Transferência Expedido', y: 0, color: '#b2c8b7', expRecebimentoTotal: 0 },
      { x: 'Recebido', y: 0, color: '#bad3b9', expRecebimentoTotal: 0 }
    ];

    myCessions.forEach(cessao => {
      const statusIndex = statusQtd.findIndex(status => status.x === cessao.x);
      if (statusIndex !== -1) {
        statusQtd[statusIndex].y += 1;
        statusQtd[statusIndex].expRecebimentoTotal += parseFloat(cessao.exp_recebimento);
      }
    });

    return statusQtd;
  }, [myCessions]);

  const handleItemClick = (id) => {
    setActiveItem(id);
    setIsMenuOpen(false); // Close the menu after selecting an item
  };

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const animatedExpAReceber = useAnimatedNumber(expAReceber);
  const animatedExpRecebida = useAnimatedNumber(expRecebida);
  const animatedValorGasto = useAnimatedNumber(valorGasto);
  const animatedComissao = useAnimatedNumber(comissao);

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
          <div className='flex flex-col items-center lg:flex-row lg:items-start lg:w-full gap-4'>
            <div className='size-28 lg:size-36 bg-gray-100 rounded pt-2 lg:pt-7 relative'>
              <ProfileImage />
              <div className='absolute top-3/4 right-[-12px] bg-white rounded-full p-[2px]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={auth.user.ativo ? "size-5 text-green-600" : "size-5 text-red-600"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
              </div>
            </div>
            <div className='flex flex-col items-center lg:items-start gap-2 lg:w-full xl:justify-between'>

              <div className='flex flex-col lg:items-start xl:items-start'>
                <div>
                  <span className='text-lg font-bold text-neutral-900 dark:text-white'>{auth.user.nome}</span>
                </div>
                <div className='lg:flex lg:gap-4'>
                  <div className='text-neutral-400 flex items-center gap-[3px] text-[14px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 1 0 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                    <span className='font-medium'>{auth.user.cpfcnpj}</span>
                  </div>
                  <div className='text-neutral-400 flex items-center gap-[3px] text-[14px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>

                    <span className='font-medium'>{auth.user.email}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col mt-5 md:flex-row md:flex-wrap gap-4 items-center w-full'>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>

                    <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedExpAReceber}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Exp. A Receber</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>

                    <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedExpRecebida}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Exp. Recebida</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                    <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedValorGasto}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Valor Gasto</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
                  <div className='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                    <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedComissao}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Comissão</p>
                </div>
                <div className='border dark:border-neutral-600 py-3 px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
                  <div className='flex'>
                    <span className='text-sm font-bold text-neutral-900 dark:text-white'>{qtdCessao}</span>
                  </div>
                  <p className='text-neutral-400 text-[15px]'>Cessões</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='lg:mt-4 lg:grid lg:grid-cols-3 lg:gap-2'>
          <aside className='col-span-1'>
            <>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed bottom-4 right-4 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white p-2 rounded-full z-50 lg:hidden"
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
                className="fixed bottom-0 left-0 w-full lg:h-full bg-white dark:bg-neutral-900 shadow-lg rounded-t-lg z-50 lg:static lg:w-full lg:shadow-none lg:rounded-none lg:p-0 lg:!transform-none"
              >
                <div className="p-2 lg:p-0 lg:px-2 lg:border-r dark:lg:border-neutral-600 lg:h-full">
                  <div className="h-full">
                    <span className="font-[700] dark:text-white">Navegação</span>
                    <ul className="flex flex-col mt-4 divide-y flex-wrap dark:divide-neutral-600 lg:h-full">
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
          <div className='col-span-2'>
            <DetalhesPerfil user={auth.user} />
          </div>
          <div className='col-span-1 col-start-2 border-r dark:border-neutral-600 lg:mt-4'>
            <AtividadesPerfil user={auth.user} />
          </div>
          <div className='col-start-3 lg:mt-4'>
            <CessoesPerfil user={auth.user} />
          </div>
        </section>
      </motion.main>
    </>
  );
};

export default MeuPerfil;
