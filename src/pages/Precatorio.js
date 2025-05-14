import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NavMenu from '../components/NavMenu';
import InfoPrec from '../components/InfoPrec';
import Tags from '../components/Tags';
import { Modal } from '../components/EditarCessaoModal/Modal';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import EditarPrec from '../components/EditarPrec';
import DotsButton from '../components/DotsButton';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div onClick={onRequestClose} className="fixed inset-0 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex justify-center items-center z-50 p-2">
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [precDataNew, setPrecDataNew] = useState({});

  const { precID } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode');
    if (localStorage.getItem('cessaoEditada')) {
      toast.success('Cessão editada com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
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
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal,
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchData(`/cessao/${precID}`, setPrecDataNew),
        fetchData('/status', setStatus),
        fetchData('/users', setUsers)
      ]);
      setIsLoading(false);
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [precID]);

  const fetchDataCessao = async () => {
    try {

      if (document.body.style.overflow == "hidden") {
        document.body.style.overflow = "scroll";
      }

      const { data } = await axiosPrivate.get(`/cessao/${precID}`);
      setPrecDataNew(data);
    } catch (err) {
      console.log(err);
    }
  }

  const confirmDelete = async () => {
    const isDarkMode = localStorage.getItem('darkMode');
    const notify = (message, type) => toast[type](message, { position: 'top-right', autoClose: 3000, theme: isDarkMode === 'true' ? 'dark' : 'light', transition: Bounce });

    setIsLoading(true);

    try {
      const deleteFile = async (path, fileName) => await axiosPrivate.delete(`/deleteFile/${path}/${fileName}`);

      if (precDataNew.requisitorio) {
        const [path, name] = precDataNew.requisitorio.split('/');
        await deleteFile(path, name);
      }

      if (precDataNew.escritura) {
        const [path, name] = precDataNew.escritura.split('/');
        await deleteFile(path, name);
      }

      if (Array.isArray(precDataNew.cessionarios)) {
        for (const cessionario of precDataNew.cessionarios) {
          if (cessionario.nota) {
            const [path, name] = cessionario.nota.split('/');
            await deleteFile(path, name);
          }
          if (cessionario.mandado) {
            const [path, name] = cessionario.mandado.split('/');
            await deleteFile(path, name);
          }
          if (cessionario.comprovante) {
            const [path, name] = cessionario.comprovante.split('/');
            await deleteFile(path, name);
          }
        }
      }

      await axiosPrivate.delete(`/cessoes/${precID}`);
      notify('Cessão excluída com sucesso!', 'success');
      navigate('/todas-cessoes');
    } catch (err) {
      notify(`Erro ao deletar: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
      setModalIsOpen(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <AnimatePresence>
        {!isLoading ? (
          <motion.main
            className={`container mx-auto px-2 ${show ? '' : 'pt-[120px]'} dark:bg-neutral-900`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Tooltip id="my-tooltip" style={{ zIndex: 60 }} opacity={100} place="top" />
            <div className="flex flex-col mx-5 border-b dark:border-neutral-600 pb-6">
              <div className="flex gap-1 items-center w-full">
                <div className="flex w-full">
                  <div className="border-r dark:border-neutral-600 text-3xl pr-2 my-3 flex items-center justify-center">
                    <span className="font-bold dark:text-white">{precDataNew.cessao_id}</span>
                  </div>
                  <div className="flex flex-col justify-center text-xs pl-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold dark:text-white text-2xl">{precDataNew.precatorio}</span>
                      {auth.user.admin && (
                        <>
                          <DotsButton isModal>
                            <Modal cessaoInfo={precDataNew} precID={precID} fetchDataCessao={fetchDataCessao} />
                            <button onClick={() => setModalIsOpen(true)} className="hover:bg-red-800 bg-red-600 text-white text-sm px-4 py-2 rounded">Excluir</button>
                          </DotsButton>
                          <DeleteConfirmationModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} onConfirm={confirmDelete} />
                        </>
                      )}
                    </div>
                    <span className="text-neutral-400 font-medium line-clamp-1">{precDataNew.cedente}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {precDataNew.status && (
                  <a
                    style={{ backgroundColor: precDataNew.corStatus }}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={precDataNew.substatus || ''}
                    className="px-2 py-1 rounded text-xs flex gap-1 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100"
                  >
                    <span className="text-black font-bold">{precDataNew.status}</span>
                  </a>
                )}
                {precDataNew.ano && precDataNew.ente && <Tags text={`${precDataNew.ente} - ${precDataNew.ano}`} />}
                {precDataNew.natureza && <Tags text={precDataNew.natureza} />}
                {precDataNew.data_cessao && <Tags text={new Date(precDataNew.data_cessao).toLocaleDateString()} />}
                {precDataNew.empresa && <Tags text={precDataNew.empresa} />}
                {precDataNew.anuencia_advogado && <Tags text={precDataNew.anuencia_advogado} />}
                {precDataNew.falecido && <Tags text={precDataNew.falecido} />}
              </div>
            </div>
            <div className="px-5 mt-4">
              <div className="lg:flex lg:gap-4">
                <div className="hidden lg:block lg:sticky lg:top-[8%]">
                  <NavMenu />
                </div>
                <div className="lg:w-[calc(100%-300px)]">
                  <InfoPrec precInfoNew={precDataNew} status={status} fetchDataCessao={fetchDataCessao} />
                </div>
              </div>
            </div>
          </motion.main>
        ) : (
          <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-12 h-12">
              <LoadingSpinner />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
