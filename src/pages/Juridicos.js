import React from 'react'
import Header from '../components/Header'
import { motion, AnimatePresence } from 'framer-motion';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from '../components/SearchInput';
import DotsButton from "../components/DotsButton";
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from '../components/Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';

function EditJuridicoModal({ isOpen, onRequestClose, onSave, juridicoData }) {
  const [nome, setNome] = React.useState('');
  const [razaoSocial, setRazaoSocial] = React.useState('');
  const axiosPrivate = useAxiosPrivate();

  // Atualiza os valores quando o modal é aberto
  React.useEffect(() => {
    if (isOpen && juridicoData) {
      setNome(juridicoData.nome || '');
      setRazaoSocial(juridicoData.razaosocial || '');
    }
  }, [isOpen, juridicoData]);


  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  const handleCancel = () => {
    // Reseta os valores ao cancelar ou fechar
    setNome(juridicoData.nome || '');
    setRazaoSocial(juridicoData.razaosocial || '');
    onRequestClose();
  };

  const handleSave = async () => {
    try {
      const isDarkMode = localStorage.getItem('darkMode');

      // Atualiza os dados da juridico
      await axiosPrivate.put(`/juridicos/${juridicoData.id}`, {
        nome,
        razaoSocial,
      });

      toast.success('Jurídico atualizado com sucesso!', {
        position: 'top-right',
        autoClose: 1000,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(),
      });

      // Envia os dados atualizados
      onSave({
        ...juridicoData,
        nome,
        razaoSocial,
      });
    } catch (error) {
      console.error('Erro ao atualizar juridico:', error);
      toast.error('Erro ao atualizar juridico. Verifique os dados.', {
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
            Editar Juridico
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
        <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir o juridico?</h2>
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


export default function Juridicos() {
  const [juridicos, setJuridicos] = React.useState([]);
  const [nome, setNome] = React.useState('');
  const [razaoSocial, setRazaoSocial] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [juridicoToEdit, setJuridicoToEdit] = React.useState(null);
  const axiosPrivate = useAxiosPrivate();
  const openModal = () => {
    setModalIsOpen(true)
  };
  const closeModal = () => setModalIsOpen(false);

  const openEditModal = (juridico) => {
    setJuridicoToEdit(juridico);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => setEditModalIsOpen(false);

  React.useEffect(() => {
    async function fetchJuridicos() {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get('/juridicos')
        setJuridicos(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJuridicos()

  }, [])

  const handleAdicionarJuridico = async (e) => {
    const isDarkMode = localStorage.getItem('darkMode');
    e.preventDefault()
    try {
      setIsLoading(true)
      await axiosPrivate.post('/juridicos', { nome, razaoSocial })

      toast.success("Jurídico adicionado com sucesso!", {
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
      setRazaoSocial('');
    } catch (e) {
      toast.error(`Erro ao adicionar novo jurídico: ${e}`, {
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
      await axiosPrivate.delete(`/juridicos/${id}`); // Passa o budget_id para a API
      toast.success('Juridico deletado com sucesso!', {
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
      console.error(`Erro ao deletar jurídico: ${err}`);
      toast.error(`Erro ao deletar jurídico: ${err}`, {
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
            id='juridicos'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Juridicos
          </motion.h2>
          <Modal
            botaoAbrirModal={
              <motion.button
                title='Adicionar novo juridico'
                className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[20px] lg:mb-0 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>



              </motion.button>
            }
            tituloModal={

              <div className='flex gap-2 items-center'>
                <span>Adicionar novo jurídico</span>
              </div>

            }
            botaoSalvar={
              <motion.button
                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700 flex gap-2 items-center'
                onClick={(e) => handleAdicionarJuridico(e)}
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
                  <label htmlFor='razao-social'>Razão social</label>
                  <input name='razao-social' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)}></input>
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
            Mostrando {juridicos.length} jurídicos

          </p>

          {!isLoading ? <div className={`lg:flex lg:flex-col lg:gap-4 lg:items-start mb-10`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
            </div>
            {juridicos &&
              juridicos.map(juridico =>
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

                            <span className="font-bold dark:text-white"><span className='hover:underline'>{juridico.nome}</span></span>
                          </div>
                        </div>
                        <ToastContainer />
                        <DotsButton isModal={true}>



                          <button
                            onClick={() => openEditModal(juridico)}
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

                          <EditJuridicoModal
                            isOpen={editModalIsOpen}
                            onRequestClose={closeEditModal}
                            onSave={(updatedEscrevente) => {
                              console.log('Juridico atualizado:', updatedEscrevente);
                              closeEditModal();
                            }}
                            juridicoData={juridicoToEdit}
                          />
                          <DeleteConfirmationModal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            onConfirm={() => confirmDelete(juridico.id)}
                          />

                        </DotsButton>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            }

          </div> : <div className="w-full flex justify-center">
            <div className="w-12 h-12">
              <LoadingSpinner />
            </div>
          </div>}
        </motion.div>
      </motion.main>

    </>
  )
}