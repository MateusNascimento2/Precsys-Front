import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ProfileImage from '../components/ProfileImage';
import useAuth from "../hooks/useAuth";
import DetalhesPerfil from '../components/DetalhesPerfil';
import AtividadesPerfil from '../components/AtividadesPerfil';
import CessoesPerfil from '../components/CessoesPerfil';
import NumerosPerfil from '../components/NumerosPerfil';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';
import FilterPerfil from '../layout/FilterPerfil';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ConfiguracoesPerfil from '../components/ConfiguracoesPerfil';
import { useParams, useSearchParams  } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ClientesList from '../components/ClientesList';

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
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : [];
  });
  const [show, setShow] = useState(false);
  const [dataCessoes, setDataCessoes] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [filteredCessoes, setFilteredCessoes] = useState([]);

  const handleFilteredCessoes = (filteredData) => {
    setFilteredCessoes(filteredData);
  };
  
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveItem(section); // Define o item ativo com base na URL
    }
  }, [searchParams]);

  useEffect(() => {
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
        auth.user.photoUrl = auth.userImage
        setUser(auth.user);
      }
    };

    fetchUserData();
  }, [id, axiosPrivate, auth.user]);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsMenuOpen(false); // Fechar o menu após selecionar um item
  };

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  const handleData = (data) => {
    setDataCessoes(data);
  };

  const handleShow = () => {
    setShow((prevState) => !prevState);
    document.body.style.overflow = document.body.style.overflow !== "hidden" ? "hidden" : "scroll";
  };

  const handleSelectedCheckboxesChange = (childData) => {
    setSelectedCheckboxes(childData);
  };

  console.log(user)


  const exportPDF = (filteredData) => {

    const statusColors = {
      'Em Andamento': '#d2c7b3',
      'Em Andamento Com Depósito': '#bdb4a9',
      'Em Andamento Com Pendência': '#aaa59e',
      'Homologado': '#9eabaf',
      'Homologado Com Depósito': '#aabcb5',
      'Homologado Com Pendência': '#9299a8',
      'Ofício de Transferência Expedido': '#b2c8b7',
      'Recebido': '#bad3b9',
    };

    const chunks = [];
    for (let i = 0; i < filteredData.length; i += 8) {
      chunks.push(filteredData.slice(i, i + 8));
    }

    const docDefinition = {
      content: chunks.map((chunk, index) => [
        ...chunk.map(cessao => [
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    columns: [
                      { width: 60, text: cessao.id, style: 'id', margin: [10, 10, 0, 5] },
                      {
                        width: '*', stack: [
                          { text: cessao.precatorio, style: 'precatorio', margin: [5, 5, 0, 2] },
                          { text: cessao.cedente, style: 'cedente', margin: [5, 0, 0, 5] },
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return '#f5f5f5'; // Cor de fundo cinza
              },
              hLineWidth: function (i, node) {
                return 0; // Sem linhas horizontais internas
              },
              vLineWidth: function (i, node) {
                return 0; // Sem linhas verticais
              }
            },
            margin: [0, 10, 0, 0],
            keepTogether: true, // Mantém este bloco junto
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      {
                        columns: [
                          { text: cessao.status, style: 'status', color: statusColors[cessao.status] || '#000000' },
                          ...(cessao.ente_id ? [{ text: cessao.ente_id, style: 'badge' }] : []),
                          ...(cessao.natureza ? [{ text: cessao.natureza, style: 'badge' }] : []),
                          ...(cessao.data_cessao ? [{ text: cessao.data_cessao.split('-').reverse().join('/'), style: 'badge' }] : []),
                          ...(cessao.empresa_id ? [{ text: cessao.empresa_id, style: 'badge' }] : []),
                          ...(cessao.adv ? [{ text: cessao.adv, style: 'badge' }] : []),
                          ...(cessao.falecido ? [{ text: cessao.falecido, style: 'badge' }] : []),
                        ],
                        columnGap: 5,
                        margin: [10, 5, 0, 5]
                      }
                    ]
                  }
                ]
              ]
            },
            layout: {
              hLineWidth: function (i, node) {
                return 0; // Sem linhas horizontais internas
              },
              vLineWidth: function (i, node) {
                return 0; // Sem linhas verticais
              },
              hLineColor: function (i, node) {
                return '#ccc'; // Cor da borda
              },
              paddingLeft: function (i, node) { return 10; },
              paddingRight: function (i, node) { return 10; },
              border: function (i, node) {
                return { left: 1, top: 1, right: 1, bottom: 1 }; // Borda ao redor do container
              }
            },
            margin: [0, 0, 0, 10],
            keepTogether: true, // Mantém este bloco junto
          }
        ]),
        ...(index < chunks.length - 1 ? [{ text: '', pageBreak: 'after' }] : []) // Adiciona quebra de página após cada grupo, exceto o último
      ]).flat(),
      styles: {
        id: {
          fontSize: 9,
          bold: true
        },
        precatorio: {
          fontSize: 9,
          bold: true
        },
        cedente: {
          fontSize: 8,
          color: '#757575'
        },
        status: {
          bold: true,
          fontSize: 7,
          margin: [0, 0, 0, 5],
          alignment: 'center'
        },
        badge: {
          color: '#000',
          fontSize: 7,
          margin: [0, 0, 0, 5],
          bold: true,
          alignment: 'center'
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('lista.pdf');
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
            className='mt-4 px-5 dark:bg-neutral-900 lg:col-span-2 w-full'
          >
            <div className='w-full'>
              <div className={`flex gap-3 items-center w-full mb-4 ${isFixed ? 'sticky top-[72px] z-50' : ''}`}>
                <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
                <FilterButton onSetShow={handleShow} isPerfilCessao={true} />
              </div>
              <div className={`lg:flex lg:gap-4 lg:items-start`}>
                <div className='w-full h-full max-h-full'>
                  <Lista searchQuery={searchQuery} selectedFilters={selectedCheckboxes} setData={handleData} isPerfilCessoes={true} user={user} onFilteredCessoes={handleFilteredCessoes} />
                </div>
              </div>
              <div className='hidden lg:block'>
                <FilterPerfil show={show} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} selectedCheckboxes={selectedCheckboxes} dataCessoes={dataCessoes} onExportPDF={() => exportPDF(filteredCessoes)} />
              </div>
              <div className='lg:hidden'>
                <Filter show={show} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} dataCessoes={dataCessoes} />
              </div>
              <ScrollToTopButton />

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
      case 'documentos':
        return (
          <motion.div
            key="documentos"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            Documentos Component
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
            <ConfiguracoesPerfil user={user} />
          </motion.div>
        );
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
                      {/* <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('documentos')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'documentos' ? ' font-bold ' : ''}`}
                        >
                          Documentos
                        </a>
                      </li> */}
                      {!id || auth.user.admin  ? <li className={"px-4 py-1 lg:py-2"}>
                        <a
                          onClick={() => handleItemClick('configuracoes')}
                          className={`text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline ${activeItem === 'configuracoes' ? ' font-bold ' : ''}`}
                        >
                          Configurações
                        </a>
                      </li> : null}
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
