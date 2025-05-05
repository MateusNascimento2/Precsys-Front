import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ProfileImage from '../components/ProfileImage';
import useAuth from "../hooks/useAuth";
import DetalhesPerfil from '../components/DetalhesPerfil';
import AtividadesPerfil from '../components/AtividadesPerfil';
import CessoesPerfil from '../components/CessoesPerfil';
import Cessoes from './Cessoes';
import NumerosPerfil from '../components/NumerosPerfil';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';
import FilterPerfil from '../layout/FilterPerfil';
import Filtro from '../components/FiltroCessoes/Filtro';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ConfiguracoesPerfil from '../components/ConfiguracoesPerfil';
import { useParams, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ClientesList from '../components/ClientesList';
import FerramentasPerfil from '../components/FerramentasPerfil';
import * as XLSX from 'xlsx';
import { Link, useNavigate } from 'react-router-dom';

export const ButtonEditProfile = ({ handleItemClick }) => {
  return (
    <button onClick={() => handleItemClick('configuracoes')} title='Editar Perfil' className='dark:text-white rounded text-black dark:font-medium p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    </button>
  );
}

const MeuPerfil = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState(auth.user);
  const [activeItem, setActiveItem] = useState('resumo');
  const [searchParams] = useSearchParams(); // Hook para acessar os parâmetros da URL
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveItem(section); // Define o item ativo com base na URL
    }
  }, [searchParams]);

  /*   useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 100) {  // ajuste o valor conforme a necessidade
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
   */
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const response = await axiosPrivate.get(`/users/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        auth.user.photoUrl = auth.userImage;
        setUser(auth.user);
      }
    };

    fetchUserData();
  }, [id, axiosPrivate, auth.user]);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId); // Define o item ativo
    setIsMenuOpen(false); // Fecha o menu, se estiver aberto

    // Obtenha a base da URL atual
    const basePath = window.location.pathname.split('/')[1];
    const baseId = id ? `/${id}` : '';

    // Navegue para a nova seção mantendo a base atual
    navigate(`/${basePath}${baseId}?section=${itemId}`);
  };

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'resumo':
        return (
          <>
            <motion.div
              key="detalhes"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.2 }}
              className='col-span-2'
            >
              <DetalhesPerfil user={user} handleItemClick={handleItemClick} />
            </motion.div>
            <motion.div
              key="atividades"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className='col-span-1 col-start-2 lg:border-r dark:border-neutral-600 mt-4'
            >
              <AtividadesPerfil user={user} ShowAllActivities={false} />
            </motion.div>
            <motion.div
              key="cessoes"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className='col-start-3 lg:mt-4'
            >
              <CessoesPerfil user={user} />
            </motion.div>
          </>
        );
      case 'atividades':
        return (
          <motion.div
            key="atividades"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className='col-span-2'
          >
            <AtividadesPerfil user={user} ShowAllActivities={true} />
            <ScrollToTopButton />
          </motion.div>
        );
      case 'cessoes':
        return (
          <motion.div
            key="cessoes"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className='p-2 dark:bg-neutral-900 lg:col-span-2 w-full'
          >
            <div className='w-full'>
              <Cessoes isInPerfilUsuario={true} userIdUrlParam={id} />
            </div>
          </motion.div>
        );
      case 'clientes':
        return (
          <motion.div
            key="clientes"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className='mt-4 px-5 dark:bg-neutral-900 lg:col-span-2 w-full flex flex-col gap-2'
          >
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'p-3'} />
            <ClientesList searchQuery={searchQuery} user={user} />
          </motion.div>
        );
      case 'configuracoes':
        return (
          <motion.div
            key="configuracoes"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className='col-span-2 justify-center px-2'
          >
            <ConfiguracoesPerfil user={user} id={id} />
          </motion.div>
        );
      case 'ferramentas':
        return (
          <motion.div
            key="ferramentas"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className='col-span-2 justify-center px-2'
          >
            <FerramentasPerfil user={user} id={id} />
          </motion.div>
        )
      default:
        return null;
    }
  };

  const toggleUserStatus = async () => {
    if (auth.user.admin && !isUpdatingStatus) {
      setIsUpdatingStatus(true);
      try {
        const updatedUser = { ...user, ativo: user.ativo ? 0 : 1 };
        await axiosPrivate.put(`/users/${user.id}`, updatedUser);
        setUser(updatedUser);
      } catch (error) {
        console.error('Erro ao atualizar status do usuário:', error);
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  return (
    <>
      <Header />
      <motion.main
        className='container mx-auto py-[120px] px-2 dark:bg-neutral-900'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className='border-b dark:border-neutral-600 pb-[24px]'>
          <div className='flex flex-col items-center lg:flex-row lg:items-start lg:w-full gap-4'>
            <div className='size-28 lg:size-24 lg:mt-1 bg-gray-100 rounded relative shrink-0'>
              <div className='absolute bottom-0 w-full h-full'>
                <ProfileImage userImage={id ? user.photoUrl : auth.userImage} />
              </div>
              {auth.user.admin ? (
                <button
                  onClick={toggleUserStatus}
                  disabled={isUpdatingStatus}
                  className="absolute top-3/4 right-[-12px] bg-white rounded-full p-[2px]"
                  title={user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={user.ativo ? "size-4 text-green-600" : "size-4 text-red-600"}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                  </svg>
                </button>
              ) : null}
            </div>
            <div className='flex flex-col items-center lg:items-start gap-2 lg:w-full xl:justify-between'>
              <div className='flex flex-col lg:items-start xl:items-start'>
                <div>
                  <span className='text-lg font-bold text-neutral-900 dark:text-white'>{user.nome}</span>
                </div>
                <div className='lg:flex lg:gap-4'>
                  <div className='text-neutral-400 flex items-center gap-[3px] text-[14px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className='font-medium text-[13px]'>{user.cpfcnpj}</span>
                  </div>
                  <div className='text-neutral-400 flex items-center gap-[3px] text-[14px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <span className='font-medium text-[13px]'>{user.email}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col mt-[6px] md:flex-row md:flex-wrap gap-4 items-center w-full'>
                <NumerosPerfil user={user} />
              </div>
            </div>
          </div>
        </section>
        <section className='lg:mt-4 lg:grid lg:grid-cols-[320px_1fr_1fr] lg:gap-2'>
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
                className="fixed bottom-0 left-0 w-full lg:h-full bg-white z-[100] lg:z-10 dark:bg-neutral-900 shadow-lg rounded-t-lg lg:relative lg:w-full lg:shadow-none lg:rounded-none lg:p-0 lg:!transform-none"
              >
                <div className={"lg:sticky lg:top-[8%]"}>
                  <div className="p-2 lg:p-0 lg:px-2 h-full lg:border-r dark:lg:border-neutral-600 lg:h-[320px]">
                    <span className="font-[700] dark:text-white">Navegação</span>
                    <ul className="flex flex-col mt-4 divide-y flex-wrap dark:divide-neutral-600">
                      <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('resumo')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'resumo' ? ' font-bold ' : ''}`}
                        >
                          Resumo
                        </a>
                      </li>
                      <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('atividades')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'atividades' ? ' font-bold ' : ''}`}
                        >
                          Atividades
                        </a>
                      </li>
                      <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('cessoes')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'cessoes' ? ' font-bold ' : ''}`}
                        >
                          Cessões
                        </a>
                      </li>
                      <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('clientes')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'clientes' ? ' font-bold ' : ''}`}
                        >
                          Clientes
                        </a>
                      </li>
                      {auth.user.admin || auth.user.acesso_api ? <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('ferramentas')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'ferramentas' ? ' font-bold ' : ''}`}
                        >
                          Ferramentas
                        </a>
                      </li> : null}
                      {!auth.user.admin && id ? null : <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('configuracoes')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'configuracoes' ? ' font-bold ' : ''}`}
                        >
                          Configurações
                        </a>
                      </li>}

                    </ul>
                  </div>
                </div>
              </motion.div>
            </>
          </aside>
          <AnimatePresence exitBeforeEnter>
            {renderContent()}
          </AnimatePresence>
        </section>
      </motion.main>
    </>
  );
};

export default MeuPerfil;
