import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TabelaGeneradaCalculo from './TabelaGeneradaCalculo';
import Modal from './Modal';
import useAuth from "../hooks/useAuth";
import GerarProposta from './GerarProposta';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function NavBarAdmin({ show }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuType, setMenuType] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [emailsUsuarios, setEmailsUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!auth.user.permissao_email) return; // Adicione uma verificação no início do useEffect

    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal,
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchData('/empresas', setEmpresas)]);
        await Promise.all([fetchData('/emails_usuarios', setEmailsUsuarios)]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth.user.permissao_email, axiosPrivate]);


  const filteredEmails = emailsUsuarios
    .filter(email => email.usuario === String(auth.user.id)) // Filtra os e-mails pelo usuário
    .map(email => {
      const empresa = empresas.find(e => String(e.id) === String(email.empresa)); // Procura o nome da empresa correspondente
      return {
        ...email,
        empresaNome: empresa ? empresa.nome : null,
        empresaDominio: empresa ? empresa.site : null // Adiciona o nome da empresa (ou null se não encontrar)
      };
    });


  function handleShow(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState)
    } else {
      setShowMenu(true);
      setMenuType(type)
    }
  }

  const navigate = useNavigate();

  const handleRoute = (route) => {
    navigate(route)
  }

  const handleClick = (event) => {
    event.stopPropagation();
  }

  const handleSubmit = (user, pass, domain) => {

    const protocol = 'https://';
    const port = '2096'
    const actionUrl = `${protocol}${domain}:${port}/login`;

    // Cria um formulário dinamicamente e o submete
    const form = document.createElement('form');
    form.action = actionUrl;
    form.method = 'POST';
    form.target = '_blank'; // Abre em uma nova guia

    // Adiciona os campos necessários ao formulário
    const userInput = document.createElement('input');
    userInput.type = 'hidden';
    userInput.name = 'user';
    userInput.value = user;
    form.appendChild(userInput);

    const passInput = document.createElement('input');
    passInput.type = 'hidden';
    passInput.name = 'pass';
    passInput.value = pass;
    form.appendChild(passInput);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <div onClick={() => { setShowMenu(false) }} className={showMenu ? 'lg:w-screen lg:h-screen lg:opacity-100 lg:absolute lg:z-[40] lg:left-0 lg:top-[50px]' : 'hidden'}></div>
      <nav className={show ? 'shadow border-r border-neutral-300 fixed items-start bg-white w-[300px] z-50 h-screen top-[50px] left-0 px-4 lg:px-0 lg:static lg:w-full lg:h-full lg:shadow-none lg:border-0 dark:bg-neutral-900 dark:border-neutral-700 lg:flex lg:items-center' : 'border-r dark:border-neutral-700 flex items-start bg-[#FFF] w-[300px] z-50 fixed top-[52px] left-[-300px] h-screen dark:bg-neutral-900 lg:transition-none lg:duration-0'}>
        <ul className={auth.user.admin ? 'divide-y divide-neutral-300 dark:divide-neutral-700 flex w-full px-2 flex-col items-center gap-2 text-[13px] lg:flex-row lg:divide-y-0' : 'divide-y divide-neutral-300 dark:divide-neutral-700 flex w-full px-2 flex-col items-start lg:items-center gap-2 text-[13px] lg:flex-row lg:divide-y-0'}>

          {auth.user.admin ?
            <>
              <li onClick={() => handleShow('pessoal')} className='cursor-pointer w-full p-2 lg:px-2  lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800 hover:rounded'>
                <div className='flex justify-between items-center lg:gap-3'>
                  <span className='font-[500] text-[#666666] dark:text-neutral-300 '>Pessoal</span>
                  <span className='text-[12px] dark:text-neutral-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'pessoal' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <AnimatePresence>
                  {showMenu && menuType === 'pessoal' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 lg:w-[300px] overflow-hidden lg:absolute lg:right-auto xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600"
                    >
                      <ul className='lg:ml-0 '>
                        <li className='mb-3 mt-2'>
                          <span className='font-[600] text-[12px] text-[#666666]'>Categorias</span>
                        </li>
                        <li className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={() => handleRoute('/minhas-cessoes')}>
                          <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Minhas Cessões</span>
                          <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver as Minhas Cessões</p>
                        </li>
                        <li className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={() => handleRoute('/clientes')}>
                          <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300 text-nowrap'>Meus Clientes</span>
                          <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver os Meus Clientes</p>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              <li onClick={() => handleShow('controle')} className='cursor-pointer w-full p-2 lg:px-2  lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800 hover:rounded'>
                <div className='flex justify-between items-center lg:gap-3'>
                  <span className='font-[500] text-[#666666]  dark:text-neutral-300 '>Controle</span>
                  <span className='text-[12px] dark:text-neutral-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'controle' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <AnimatePresence>
                  {showMenu && menuType === 'controle' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 lg:w-[430px] overflow-hidden lg:absolute lg:right-auto xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600"
                    >
                      <ul className='lg:ml-0'>
                        <li className='mb-3 mt-2'>
                          <span className='font-[600] text-[12px] text-[#666666]'>Administração</span>
                        </li>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                          <li className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={() => handleRoute('/todas-cessoes')}>
                            <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Todas as Cessões</span>
                            <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todas as Cessões</p>
                          </li>
                          <li onClick={() => handleRoute('/usuarios')} className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                            <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Usuários</span>
                            <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Usuários</p>
                          </li>
                          <li onClick={() => handleRoute('/empresas')} className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                            <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Empresas</span>
                            <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todas as Empresas</p>
                          </li>
                          <li onClick={() => handleRoute('/juridicos')} className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                            <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Jurídicos</span>
                            <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Jurídicos</p>
                          </li>
                          <li onClick={() => handleRoute('/escreventes')} className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                            <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Escreventes</span>
                            <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Escreventes</p>
                          </li>
                          <li onClick={() => handleRoute('/orcamentos')} className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                            <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Orçamentos</span>
                            <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Orçamentos</p>
                          </li>
                        </div>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              <li onClick={() => handleShow('logs')} className='cursor-pointer w-full p-2 lg:px-2 lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800 hover:rounded'>
                <div className='flex justify-between items-center lg:gap-3 '>
                  <span className='font-[500] text-[#666666] dark:text-neutral-300 '>Logs</span>
                  <span className='text-[12px] dark:text-neutral-300 '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'logs' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <AnimatePresence>
                  {showMenu && menuType === 'logs' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 flex flex-col gap-2 text-[12px] lg:w-[300px] overflow-hidden lg:absolute lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 lg:shadow cursor-default dark:bg-neutral-900 dark:border-neutral-600 dark:lg:shadow-[#000]"
                    >
                      <ul className='lg:ml-0 '>
                        <li className='mb-3 mt-2'>
                          <span className='font-[600] text-[12px] text-[#666666] dark:text-neutral-500'>Categorias</span>
                        </li>
                        <li className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={() => handleRoute('/logs/login')}>
                          <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Logins</span>
                          <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todos os Logins</p>
                        </li>
                        <li className='p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={() => handleRoute('/logs/propostas')}>
                          <span className='font-[600] text-[14px] text-[#171717] dark:text-neutral-300'>Propostas</span>
                          <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver todas as Propostas</p>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              {auth.user.ver_calculo || auth.user.permissao_proposta ? <li onClick={() => handleShow('ferramentas')} className='cursor-pointer p-2 lg:px-2 w-full  lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800 hover:rounded'>
                <div className='flex justify-between items-center lg:gap-3'>
                  <span className='font-[500] text-[#666666] dark:text-neutral-300 '>Ferramentas</span>
                  <span className='text-[12px] dark:text-neutral-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'ferramentas' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <AnimatePresence>
                  {showMenu && menuType === 'ferramentas' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 lg:w-[200px] overflow-hidden lg:absolute lg:right-auto xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600"
                    >
                      <ul className='lg:ml-0 '>
                        <li className='mb-3 mt-2'>
                          <span className='font-[600] text-[12px] text-[#666666]'>Categorias</span>
                        </li>
                        {auth.user.ver_calculo ? <li onClick={handleClick}>
                          <Modal botaoAbrirModal={
                            <button title='Fazer cálculo' className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                              Cálculo
                              <p className='font-[600] text-[12px] text-[#666666]'>Fazer Cálculo </p>
                            </button>}>
                            <div className='h-[500px] lg:h-[650px] overflow-auto'>
                              <TabelaGeneradaCalculo />
                            </div>
                          </Modal>
                        </li> : null}
                        {auth.user.permissao_proposta ? <li onClick={handleClick}>
                          <Modal botaoAbrirModal={
                            <button title='Fazer cálculo' className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                              Proposta
                              <p className='font-[600] text-[12px] text-[#666666]'>Fazer Propostas </p>
                            </button>}>
                            <div className='h-[500px] lg:h-[650px] overflow-auto relative'>
                              <GerarProposta />
                            </div>
                          </Modal>
                        </li> : null}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li> : null}
              {auth.user.permissao_email ?
                <li onClick={filteredEmails.length > 0 ? () => handleShow('emails') : null} className='cursor-pointer px-2 py-4 lg:p-2 lg:rounded w-full  lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800'>
                  <div className='flex justify-between items-center lg:gap-3'>
                    <span className='font-[500] text-[#666666] dark:text-neutral-300 text-nowrap '>E-mails</span>
                    <span className='text-[12px] dark:text-neutral-300'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'emails' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'emails' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 lg:w-[200px] overflow-hidden lg:absolute lg:right-auto xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600"
                      >
                        <ul className='lg:ml-0 '>
                          <li className='mb-3 mt-2'>
                            <span className='font-[600] text-[12px] text-[#666666]'>E-mails </span>
                          </li>
                          <li>
                            {filteredEmails.map(emails => (
                              <>
                                <button onClick={() => handleSubmit(emails.email, emails.senha, emails.empresaDominio)} className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                                  <span>{emails.empresaNome}</span>
                                  <p className='font-[600] text-[12px] text-[#666666]'>E-mails Corporativos</p>
                                </button>


                              </>


                            ))}
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li> : null}
            </>
            :
            <ul className='flex flex-col lg:flex-row lg:items-center divide-y divide-neutral-300 dark:divide-neutral-700 lg:divide-y-0 w-full lg:gap-2'>
              <li className='px-2 py-4 lg:p-2 lg:rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full' onClick={() => handleRoute('/minhas-cessoes')}>
                <span className='font-[500] text-[#666666] dark:text-neutral-300 text-nowrap '>Minhas Cessões</span>
                {auth.user.admin ? <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver as Minhas Cessões</p> : null}
              </li>
              <li className='px-2 py-4 lg:p-2 lg:rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full' onClick={() => handleRoute('/clientes')}>
                <span className='font-[500] text-[#666666] dark:text-neutral-300 text-nowrap '>Meus Clientes</span>
                {auth.user.admin ? <p className='font-[500] text-[#666666] dark:text-neutral-500'>Ver os Meus Clientes</p> : null}
              </li>
              {auth.user.ver_calculo || auth.user.permissao_proposta ?
                <li onClick={() => handleShow('ferramentas')} className='cursor-pointer px-2 py-4 lg:p-2 lg:rounded w-full  lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800'>
                  <div className='flex justify-between items-center lg:gap-3'>
                    <span className='font-[500] text-[#666666] dark:text-neutral-300 '>Ferramentas</span>
                    <span className='text-[12px] dark:text-neutral-300'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'ferramentas' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'ferramentas' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 lg:w-[200px] overflow-hidden lg:absolute lg:right-auto xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600"
                      >
                        <ul className='lg:ml-0 '>
                          <li className='mb-3 mt-2'>
                            <span className='font-[600] text-[12px] text-[#666666]'>Categorias</span>
                          </li>
                          {auth.user.ver_calculo ? <li onClick={handleClick}>
                            <Modal botaoAbrirModal={
                              <button title='Fazer cálculo' className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                                Cálculo
                                <p className='font-[500] text-[#666666] dark:text-neutral-500'>Fazer Cálculo </p>
                              </button>}>
                              <div className='h-[500px] lg:h-[650px] overflow-auto'>
                                <TabelaGeneradaCalculo />
                              </div>
                            </Modal>
                          </li> : null}
                          {auth.user.permissao_proposta ? <li onClick={handleClick}>
                            <Modal botaoAbrirModal={
                              <button title='Fazer cálculo' className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                                Proposta
                                <p className='font-[500] text-[#666666] dark:text-neutral-500'>Fazer Propostas </p>
                              </button>}>
                              <div className='h-[500px] lg:h-[650px] overflow-auto relative'>
                                <GerarProposta />
                              </div>
                            </Modal>
                          </li> : null}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li> : null}
              {auth.user.permissao_email ?
                <li onClick={filteredEmails.length > 0 ? () => handleShow('emails') : null} className='cursor-pointer px-2 py-4 lg:p-2 lg:rounded w-full  lg:border-0 lg:hover:bg-neutral-100 lg:dark:hover:bg-neutral-800'>
                  <div className='flex justify-between items-center lg:gap-3'>
                    <span className='font-[500] text-[#666666] dark:text-neutral-300 text-nowrap  '>E-mails</span>
                    <span className='text-[12px] dark:text-neutral-300'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'emails' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'emails' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:shadow dark:lg:shadow-[#000] mt-2 flex flex-col gap-2 lg:w-[200px] overflow-hidden lg:absolute lg:right-auto xl:right-auto lg:z-50 lg:bg-white lg:py-2 lg:px-4 lg:rounded lg:border lg:border-gray-300 cursor-default dark:bg-neutral-900 dark:border-neutral-600"
                      >
                        <ul className='lg:ml-0 '>
                          <li className='mb-3 mt-2'>
                            <span className='font-[600] text-[12px] text-[#666666]'>E-mails</span>
                          </li>

                          <li>
                            {filteredEmails.map(emails => (
                              <>
                                <button onClick={() => handleSubmit(emails.email, emails.senha, emails.empresaDominio)} className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                                  <span>{emails.empresaNome}</span>
                                  <p className='font-[600] text-[12px] text-[#666666]'>E-mails Corporativos</p>
                                </button>


                              </>


                            ))}
                          </li>


                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li> : null}
            </ul>
          }


        </ul>
      </nav>
    </>
  )
}

export default NavBarAdmin;
