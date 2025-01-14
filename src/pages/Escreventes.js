import React from 'react'
import Header from '../components/Header'
import { motion, AnimatePresence } from 'framer-motion';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from '../components/SearchInput';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import DotsButton from "../components/DotsButton";
import placeholder from "../../public/assets/no-logo.png";
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from '../components/Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';

function EditCompanyModal({ isOpen, onRequestClose, onSave, companyData }) {
  const [nome, setNome] = React.useState('');
  const [cnpj, setCnpj] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [razaoSocial, setRazaoSocial] = React.useState('');
  const [site, setSite] = React.useState('');
  const axiosPrivate = useAxiosPrivate();

  // Atualiza os valores quando o modal é aberto
  React.useEffect(() => {
    if (isOpen && companyData) {
      setNome(companyData.nome || '');
      setCnpj(companyData.cnpj || '');
      setRazaoSocial(companyData.razaosocial || '');
      setEndereco(companyData.endereco || '');
      setSite(companyData.site || '');
    }
  }, [isOpen, companyData]);


  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  const handleCancel = () => {
    // Reseta os valores ao cancelar ou fechar
    setNome(companyData.nome || '');
    setCnpj(companyData.cnpj || '');
    setRazaoSocial(companyData.razaosocial || '');
    setEndereco(companyData.endereco || '');
    setSite(companyData.site || '');
    onRequestClose();
  };

  const handleSave = async () => {
    try {
      const isDarkMode = localStorage.getItem('darkMode');

      // Atualiza os dados da escrevente
      await axiosPrivate.put(`/escreventes/${companyData.id}`, {
        nome,
        cnpj,
        razaoSocial,
        endereco,
        site,
      });

      toast.success('Empresa atualizada com sucesso!', {
        position: 'top-right',
        autoClose: 1000,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(),
      });

      // Envia os dados atualizados
      onSave({
        ...companyData,
        nome,
        cnpj,
        razaoSocial,
        endereco,
        site,
      });
    } catch (error) {
      console.error('Erro ao atualizar escrevente:', error);
      toast.error('Erro ao atualizar escrevente. Verifique os dados.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  return (
    isOpen && (
      <div
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex justify-center items-center z-50 p-2"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md"
        >
          <h2 className="text-lg text-black dark:text-white font-semibold">
            Editar Empresa
          </h2>
          <form className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col">
              <label htmlFor="nome" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="cnpj" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="razao-social" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Razão social
              </label>
              <input
                type="text"
                id="razao-social"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endereco" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="site" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Site
              </label>
              <input
                type="text"
                id="site"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
          </form>
          <div className="flex justify-between mt-4">
            <button
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right ml-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
              onClick={handleSave}
            >
              Salvar
            </button>

          </div>
          <button
            className="absolute top-3 right-3 rounded hover:bg-neutral-100 text-white dark:hover:bg-neutral-800"
            onClick={onRequestClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[20px] h-[20px] dark:text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  );
}

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm }) {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex justify-center items-center z-50 p-2">
      <div onClick={(e) => e.stopPropagation()} className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md">
        <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir a escrevente?</h2>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
            onClick={onRequestClose}
          >
            Cancelar
          </button>
        </div>
        <button
          className="absolute top-3 right-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={onRequestClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}


export default function Empresas() {
  const [escreventes, setEscreventes] = React.useState([]);
  const [nome, setNome] = React.useState('');
  const [cnpj, setCnpj] = React.useState('');
  const [razaoSocial, setRazaoSocial] = React.useState('');
  const [site, setSite] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [companyToEdit, setCompanyToEdit] = React.useState(null);
  const axiosPrivate = useAxiosPrivate();
  const openModal = () => {
    setModalIsOpen(true)
  };
  const closeModal = () => setModalIsOpen(false);

  const openEditModal = (company) => {
    setCompanyToEdit(company);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => setEditModalIsOpen(false);

  React.useEffect(() => {
    async function fetchEmpresas() {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get('/escreventes')
        console.log(data)
        setEscreventes(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmpresas()

  }, [])

  const handleAdicionarEmpresa = async (e) => {
    const isDarkMode = localStorage.getItem('darkMode');
    e.preventDefault()
    console.log(nome, cnpj, razaoSocial, site, endereco)
    try {
      setIsLoading(true)
      await axiosPrivate.post('/escreventes', { nome, cnpj, razaoSocial, site, endereco })

      toast.success("Empresa criada com sucesso!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });
      setNome('');
      setCnpj('');
      setRazaoSocial('');
      setEndereco('');
    } catch (e) {
      toast.error(`Erro ao criar nova escrevente: ${e}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false)
      return;
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = async (id) => {
    const isDarkMode = localStorage.getItem('darkMode');
    try {

      setIsLoading(true);
      await axiosPrivate.delete(`/escreventes/${id}`); // Passa o budget_id para a API
      toast.success('Empresa deletada com sucesso!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });
    } catch (err) {
      console.error(`Erro ao deletar escrevente: ${err}`);
      toast.error(`Erro ao deletar escrevente: ${err}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <Header />
      <motion.main
        className='container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='flex justify-between items-center mx-5'>
          <motion.h2
            className='font-[700] text-[32px] md:mt-[16px] dark:text-white'
            id='escreventes'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Escreventes
          </motion.h2>
          <Modal
            botaoAbrirModal={
              <motion.button
                title='Adicionar novo escrevente'
                className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[20px] lg:mb-0 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>


              </motion.button>
            }
            tituloModal={

              <div className='flex gap-2 items-center'>
                <span>Adicionar novo escrevente</span>
              </div>

            }
            botaoSalvar={
              <motion.button
                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700 flex gap-2 items-center'
                onClick={(e) => handleAdicionarEmpresa(e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Salvar
                {isLoading && <div className='w-5 h-5'>
                  < LoadingSpinner />
                </div>}

              </motion.button>
            }

          >
            <ToastContainer />
            <form className='flex flex-col gap-4 justify-center  items-center'>
              <div className='lg:w-[650px] flex flex-col gap-4'>
                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='nome'>Nome</label>
                  <input name='nome' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={nome} onChange={(e) => setNome(e.target.value)} ></input>
                </div>

                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='cpnj'>CNPJ</label>
                  <input name='cnpj' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={cnpj} onChange={(e) => setCnpj(e.target.value)}></input>
                </div>

                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='razao-social'>Razão social</label>
                  <input name='razao-social' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)}></input>
                </div>

                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='site'>Site</label>
                  <input name='site' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={site} onChange={(e) => setSite(e.target.value)}></input>
                </div>

                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='endereco'>Endereço</label>
                  <input name='endereco' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={endereco} onChange={(e) => setEndereco(e.target.value)}></input>
                </div>

              </div>


            </form>

          </Modal>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mt-[24px] px-5 dark:bg-neutral-900'
        >
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput p={'py-3'} />
          </div>

          <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
            Mostrando {escreventes.length} escreventes

          </p>

          <div className={`lg:flex lg:flex-col lg:gap-4 lg:items-start mb-10`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
            </div>
            {escreventes ?
              escreventes.map(escrevente =>
                <div className='w-full h-full max-h-full mb-4 lg:mb-0'>
                  <motion.div
                    className="dark:bg-neutral-900"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className=" dark:bg-neutral-900 ">
                      <div className="flex border dark:border-neutral-700 dark:bg-neutral-900 px-2 py-4 rounded items-center">
                        <div className="flex w-full">
                          <div className="flex grow flex-col justify-center text-[12px] pl-2">

                            <span className="font-bold dark:text-white"><Link><span className='hover:underline'>{escrevente.nome}</span></Link></span>
                          </div>
                        </div>
                        <ToastContainer />
                        <DotsButton isModal={true}>



                          <button
                            onClick={() => openEditModal(escrevente)}
                            className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:dark:bg-neutral-900"
                          >
                            Editar
                          </button>

                          <button onClick={(e) => {
                            e.stopPropagation();
                            openModal();

                          }} title="Excluir orçamento" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900">
                            Excluir
                          </button>

                          <EditCompanyModal
                            isOpen={editModalIsOpen}
                            onRequestClose={closeEditModal}
                            onSave={(updatedCompany) => {
                              console.log('Empresa atualizada:', updatedCompany);
                              closeEditModal();
                            }}
                            companyData={companyToEdit}
                          />
                          <DeleteConfirmationModal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            onConfirm={() => confirmDelete(escrevente.id)}
                          />




                          {/* <button title="Baixar escritura" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900" onClick={() => downloadFile(cessao.escritura)} disabled={!cessao.escritura}>
                            {loadingFiles[cessao.escritura] ? (
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4"><LoadingSpinner /></div>
                                <span>Escritura</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span>Escritura</span>

                              </div>
                            )}
                          </button> */}

                        </DotsButton>
                      </div>
                    </div>
                    {/* <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="top" /> */}
                  </motion.div>
                </div>
              )
              : <div className="w-full flex justify-center">
                <div className="w-12 h-12">
                  <LoadingSpinner />
                </div>
              </div>}

          </div>
        </motion.div>
      </motion.main>

    </>
  )
}