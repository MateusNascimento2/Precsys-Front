import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NavMenu from '../components/NavMenu';
import InfoPrec from '../components/InfoPrec';
import Tags from '../components/Tags';
import { Modal } from '../components/EditarCessaoModal/Modal';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';
import useAuth from "../hooks/useAuth";
/* import Modal from '../components/Modal';
 */import EditarPrec from '../components/EditarPrec';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DotsButton from '../components/DotsButton';
import { motion, AnimatePresence } from 'framer-motion';

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
        <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir a cessão?</h2>
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

export default function Precatorio() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [precDataNew, setprecDataNew] = useState({});

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { precID } = useParams();
  const { auth } = useAuth();
  const userID = String(auth.user.id);
  const isAdmin = auth.user.admin;
  const axiosPrivate = useAxiosPrivate();


  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode');
    if (localStorage.getItem('cessaoEditada')) {
      toast.success('Cessão editada com sucesso!', {
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
      localStorage.removeItem('cessaoEditada');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal,
          headers: {
            'UserID': userID,
            'isAdmin': isAdmin,
          }
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchData(`/cessao/${String(precID)}`, setprecDataNew),
          fetchData('/status', setStatus),
        ]);
      } finally {
        setIsLoading(false);
        setIsDataLoaded(true); // Marcar que todos os dados foram carregados
      }
    };

    fetchAllData();


    return () => {
      isMounted = false;
      controller.abort();
    };

  }, [precID]);

  const confirmDelete = async () => {
    const isDarkMode = localStorage.getItem('darkMode');

    const getToastOptions = (message, type) => ({
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: false,
      theme: isDarkMode === 'true' ? 'dark' : 'light',
      transition: Bounce,
      type: type,
      message: message,
    });

    const deleteFile = async (path, fileName) => {
      try {
        console.log(`Tentando deletar arquivo: /deleteFile/${path}/${fileName}`);
        await axiosPrivate.delete(`/deleteFile/${path}/${fileName}`);
        console.log(`Arquivo deletado: ${path}/${fileName}`);
      } catch (err) {
        toast.error(getToastOptions(`Erro ao deletar arquivo: ${err.message}`, 'error'));
        throw err;
      }
    };

    setIsLoading(true);

    try {
      if (precDataNew.requisitorio) {
        const [requisitorioPath, requisitorioFileName] = precDataNew.requisitorio.split('/');
        console.log(`Deletando requisitório: ${requisitorioPath}/${requisitorioFileName}`);
        await deleteFile(requisitorioPath, requisitorioFileName);
      }

      if (precDataNew.escritura) {
        const [escrituraPath, escrituraFileName] = precDataNew.escritura.split('/');
        console.log(`Deletando escritura: ${escrituraPath}/${escrituraFileName}`);
        await deleteFile(escrituraPath, escrituraFileName);
      }

      // Deletando arquivos associados aos cessionários
      if (cessionariosDaCessao.length > 1) {
        for (const cessionario of cessionariosDaCessao) {
          if (cessionario.nota) {
            const [notaPath, notaFileName] = cessionario.nota.split('/');
            console.log(`Deletando nota: ${notaPath}/${notaFileName}`);
            await deleteFile(notaPath, notaFileName);
          }

          if (cessionario.oficioTransferencia) {
            const [mandadoPath, mandadoFileName] = cessionario.oficioTransferencia.split('/');
            console.log(`Deletando mandado: ${mandadoPath}/${mandadoFileName}`);
            await deleteFile(mandadoPath, mandadoFileName);
          }

          if (cessionario.comprovantePagamento) {
            const [comprovantePath, comprovanteFileName] = cessionario.comprovantePagamento.split('/');
            console.log(`Deletando comprovante: ${comprovantePath}/${comprovanteFileName}`);
            await deleteFile(comprovantePath, comprovanteFileName);
          }
        }

      }


      console.log(`Deletando cessão: ${precID}`);
      await axiosPrivate.delete(`/cessoes/${precID}`);
      console.log('Cessão excluída com sucesso');
      toast.success(getToastOptions('Cessão excluída com sucesso!', 'success'));
      navigate('/todas-cessoes');
    } catch (err) {
      console.error(`Erro ao deletar cessão: ${err.message}`);
      toast.error(getToastOptions(`Erro ao deletar cessão: ${err.message}`, 'error'));
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <AnimatePresence>
        {!isLoading ? (
          <motion.main
            className={show ? 'container mx-auto px-2 overflow-hidden dark:bg-neutral-900' : 'container mx-auto px-2 pt-[120px] dark:bg-neutral-900'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}

          >
            <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border="1px solid #d4d4d4" opacity={100} place="top" />
            <div>
              <div className='flex flex-col mx-[20px] border-b dark:border-neutral-600 pb-[24px]'>
                <div className='flex gap-1 items-center w-full'>
                  <div className="flex w-full">
                    <div className="border-r dark:border-neutral-600 text-[36px] pr-2 my-3 flex items-center justify-center">
                      <span className="font-[700] dark:text-white">{precDataNew.cessao_id}</span>
                    </div>
                    <div className="flex flex-col justify-center text-[12px] pl-2 w-full">
                      <div className='flex justify-between items-center w-full'>
                        <span className="font-bold dark:text-white text-[24px]">{precDataNew.precatorio}</span>
                        {auth.user.admin ?
                          <>
                            <DotsButton isModal={true}>
                              <div>
                                <Modal cessaoInfo={precDataNew} precID={precID} />
                              </div>
                              <button onClick={openModal} className='hover:bg-red-800  bg-red-600 text-white text-sm px-4 py-2 rounded'>
                                Excluir
                              </button>
                            </DotsButton>
                            <DeleteConfirmationModal
                              isOpen={modalIsOpen}
                              onRequestClose={closeModal}
                              onConfirm={confirmDelete}
                            />
                          </>
                          : null
                        }

                      </div>
                      <span className="text-neutral-400 font-medium line-clamp-1">{precDataNew.cedente}</span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-wrap gap-1 mb-[13px] '>
                  <a
                    style={{ backgroundColor: `${precDataNew.corStatus}` }}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={`${precDataNew.substatus ? precDataNew.substatus : ''}`}
                    data-tooltip-place="top"
                    className={`px-2 py-1 rounded text-[10px] flex gap-1 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100`}>
                    <span className="text-black font-bold">{precDataNew.status}</span>
                  </a>
                  {precDataNew.ano && precDataNew.ente ? (<Tags text={`${precDataNew.ente} - ${precDataNew.ano}`} />) : null}
                  {precDataNew.natureza ? (<Tags text={precDataNew.natureza} />) : null}
                  {precDataNew.data_cessao ? (<Tags text={`${precDataNew.data_cessao.split('-')[2]}/${precDataNew.data_cessao.split('-')[1]}/${precDataNew.data_cessao.split('-')[0]}`} />) : null}
                  {precDataNew.empresa ? (<Tags text={precDataNew.empresa} />) : null}
                  {precDataNew.anuencia_advogado ? (<Tags text={precDataNew.anuencia_advogado} />) : null}
                  {precDataNew.falecido ? (<Tags text={precDataNew.falecido} />) : null}
                </div>
              </div>
            </div>
            <div className='px-5 dark:bg-neutral-900 mt-[16px] max-w-full h-full'>
              <div className='lg:flex lg:gap-4 lg:items-start max-w-full h-full'>
                <div className='hidden lg:block lg:sticky lg:h-full lg:max-h-full lg:top-[8%]'>
                  <NavMenu />
                </div>
                <div className='lg:w-[calc(100%-300px)]'>
                  <InfoPrec
                    precInfoNew={precDataNew}
                    status={status}
                    users={users}
                  />
                </div>
              </div>
            </div>
          </motion.main>
        ) : (
          <div className='w-screen h-screen flex items-center justify-center'>
            <div className="w-12 h-12">
              <LoadingSpinner />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
