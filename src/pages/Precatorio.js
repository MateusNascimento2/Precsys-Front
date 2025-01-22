import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NavMenu from '../components/NavMenu';
import InfoPrec from '../components/InfoPrec';
import Tags from '../components/Tags';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';
import useAuth from "../hooks/useAuth";
import Modal from '../components/Modal';
import EditarPrec from '../components/EditarPrec';
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
  const [precData, setPrecData] = useState({});
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [varas, setVaras] = useState([]);
  const [teles, setTeles] = useState([]);
  const [users, setUsers] = useState([]);
  const [todasCessoes, setTodasCessoes] = useState([]);
  const [escreventes, setEscreventes] = useState([]);
  const [cessionarios, setCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingData, setSendingData] = useState(false);
  const [juridico, setJuridico] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [precatorioEditado, setPrecatorioEditado] = useState('');
  const [processoEditado, setProcessoEditado] = useState('');
  const [cedenteEditado, setCedenteEditado] = useState('');
  const [varaEditado, setVaraEditado] = useState(null);
  const [enteEditado, setEnteEditado] = useState(null);
  const [anoEditado, setAnoEditado] = useState(null);
  const [naturezaEditado, setNaturezaEditado] = useState(null);
  const [empresaEditado, setEmpresaEditado] = useState(null);
  const [dataCessaoEditado, setDataCessaoEditado] = useState(null);
  const [repComercialEditado, setRepComercialEditado] = useState(null);
  const [escreventeEditado, setEscreventeEditado] = useState(null);
  const [juridicoEditado, setJuridicoEditado] = useState(null);
  const [requisitorioEditado, setRequisitorioEditado] = useState('');
  const [escrituraEditado, setEscrituraEditado] = useState('');
  const [requisitorioEditadoFile, setRequisitorioEditadoFile] = useState('');
  const [escrituraEditadoFile, setEscrituraEditadoFile] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [key, setKey] = useState(0); // Add key state here
  const [loadingFiles, setLoadingFiles] = useState({});
  const [clientes, setClientes] = useState([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const cessionariosDaCessao = cessionarios.filter(cessionario => parseInt(precData.id) === parseInt(cessionario.cessao_id));


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
          fetchData(`/cessoes/${String(precID)}`, setPrecData),
          fetchData('/status', setStatus),
          fetchData('/orcamentos', setOrcamentos),
          fetchData('/natureza', setNatureza),
          fetchData('/empresas', setEmpresas),
          fetchData('/vara', setVaras),
          fetchData('/tele', setTeles),
          fetchData('/cessoes', setTodasCessoes),
          fetchData('/escreventes', setEscreventes),
          fetchData('/users', setUsers),
          fetchData('/cessionarios', setCessionarios),
          fetchData('/juridicos', setJuridico),
          fetchData('/cliente', setClientes)
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

  useEffect(() => {
    if (!isDataLoaded) return; // Garantir que todos os dados foram carregados antes de atualizar

    const updatedPrecData = { ...precData };
    const orcamentoAtualizado = orcamentos.find(o => parseInt(updatedPrecData.ente_id) === parseInt(o.id));

    if (orcamentoAtualizado && updatedPrecData.ano) {
      updatedPrecData.orcamento = orcamentoAtualizado.apelido + " - " + updatedPrecData.ano;
      updatedPrecData.nome_ente = orcamentoAtualizado.ente;
    } else if (orcamentoAtualizado) {
      updatedPrecData.orcamento = orcamentoAtualizado.apelido;
      updatedPrecData.nome_ente = orcamentoAtualizado.ente;
    }

    const naturezaAtualizada = natureza.find(n => parseInt(updatedPrecData.natureza) === parseInt(n.id));
    const empresaAtualizada = empresas.find(e => parseInt(updatedPrecData.empresa_id) === parseInt(e.id));
    const statusAtualizado = status.find(s => parseInt(updatedPrecData.status) === parseInt(s.id));
    const varasAtualizada = varas.find(v => parseInt(updatedPrecData.vara_processo) === parseInt(v.id));
    const telesAtualizado = users.find(u => parseInt(updatedPrecData.tele_id) === parseInt(u.id));
    const escreventesAtualizado = escreventes.find(escrevente => parseInt(updatedPrecData.escrevente_id) === parseInt(escrevente.id));
    const juridicoAtualizado = juridico.find(juridico => parseInt(updatedPrecData.juridico_id) === parseInt(juridico.id));
    const statusColor = status.find(s => s.id === parseInt(precData.status))

    const anuenciaValores = {
      "0": "Sem anuência",
      "1": "Honorários",
      "2": "Com anuência",
      "3": "Quitação"
    };

    const falecidoValores = {
      "0": "Vivo",
      "1": "Não deixou bens",
      "2": "Deixou bens",
      "3": "Solicitada habilitação",
      "4": "Herdeiros habilitados"
    };

    const anuencia = anuenciaValores[precData.adv];
    if (anuencia) {
      updatedPrecData.adv = anuencia;
    }

    const falecido = falecidoValores[precData.falecido];
    if (falecido) {
      updatedPrecData.falecido = falecido;
    }

    if (statusColor) {
      updatedPrecData.statusColor = statusColor.extra
    }

    if (naturezaAtualizada) {
      updatedPrecData.nome_natureza = naturezaAtualizada.nome;
    }

    if (empresaAtualizada) {
      updatedPrecData.nome_empresa = empresaAtualizada.nome;
    }

    if (statusAtualizado) {
      updatedPrecData.status = statusAtualizado.nome;
    }

    if (varasAtualizada) {
      updatedPrecData.nome_vara = varasAtualizada.nome;
    }

    if (telesAtualizado) {
      updatedPrecData.nome_tele = telesAtualizado.nome;
    }

    if (escreventesAtualizado) {
      updatedPrecData.nome_escrevente = escreventesAtualizado.nome;
    }

    if (juridicoAtualizado) {
      updatedPrecData.juridico_nome = juridicoAtualizado.nome;
    }

    const cessionarioRefPrec = cessionarios.filter(cessionario => parseInt(updatedPrecData.id) === parseInt(cessionario.cessao_id));
    const updatedCessionario = [...cessionarioRefPrec];

    updatedCessionario.forEach(cessionario => {
      const nomeDoCessionario = users.find(user => parseInt(cessionario.user_id) === parseInt(user.id));
      if (nomeDoCessionario) {
        cessionario.nome_user = nomeDoCessionario.nome;
        cessionario.cpfcnpj = nomeDoCessionario.cpfcnpj;
      }
    });

    const cessoesRelacionadas = todasCessoes.filter(cessao => {
      if (updatedPrecData.id === cessao.id) {
        return '';
      }
      return updatedPrecData.processo === cessao.processo || updatedPrecData.cedente === cessao.cedente || updatedPrecData.precatorio === cessao.precatorio;
    });

    cessoesRelacionadas.forEach(cessao => {
      const statusAtualizado = status.find(s => parseInt(cessao.status) === parseInt(s.id));
      if (statusAtualizado) {
        cessao.status = statusAtualizado.nome;
        cessao.statusColor = statusAtualizado.extra;
      }

      const orcamentoAtualizado = orcamentos.find(o => parseInt(cessao.ente_id) === parseInt(o.id));
      if (orcamentoAtualizado && cessao.ano) {
        cessao.ente_id = orcamentoAtualizado.apelido + " - " + cessao.ano;
      } else if (orcamentoAtualizado) {
        cessao.ente_id = orcamentoAtualizado.apelido;
      }

      const naturezaAtualizada = natureza.find(n => parseInt(cessao.natureza) === parseInt(n.id));
      if (naturezaAtualizada) {
        cessao.natureza = naturezaAtualizada.nome;
      }

      const empresaAtualizada = empresas.find(e => parseInt(cessao.empresa_id) === parseInt(e.id));
      if (empresaAtualizada) {
        cessao.empresa_id = empresaAtualizada.nome;
      }

      const anuencia = anuenciaValores[cessao.adv];
      if (anuencia) {
        cessao.adv = anuencia;
      }

      const falecido = falecidoValores[cessao.falecido];
      if (falecido) {
        cessao.falecido = falecido;
      }
    });

    setPrecData(updatedPrecData);

  }, [isDataLoaded]); // Executa o efeito apenas quando todos os dados foram carregados

  const handleShow = () => {
    setShow((prevState) => !prevState);
  };

  const handleUpdate = (newData) => {
    setPrecData((prevData) => {
      return {
        ...prevData,
        ...newData
      };
    });
  };

  const handleReceberValores = (valores) => {
    setPrecatorioEditado(valores.precatorioEditado);
    setProcessoEditado(valores.processoEditado);
    setCedenteEditado(valores.cedenteEditado);
    setVaraEditado(valores.varaEditado);
    setEnteEditado(valores.enteEditado);
    setAnoEditado(valores.anoEditado);
    setNaturezaEditado(valores.naturezaEditado);
    setEmpresaEditado(valores.empresaEditado);
    setDataCessaoEditado(valores.dataCessaoEditado);
    setRepComercialEditado(valores.repComercialEditado);
    setEscreventeEditado(valores.escreventeEditado);
    setJuridicoEditado(valores.juridicoEditado);
    setRequisitorioEditado(valores.requisitorioEditado);
    setEscrituraEditado(valores.escrituraEditado);
    setRequisitorioEditadoFile(valores.requisitorioEditadoFile);
    setEscrituraEditadoFile(valores.escrituraEditadoFile);
  };

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
      if (precData.requisitorio) {
        const [requisitorioPath, requisitorioFileName] = precData.requisitorio.split('/');
        console.log(`Deletando requisitório: ${requisitorioPath}/${requisitorioFileName}`);
        await deleteFile(requisitorioPath, requisitorioFileName);
      }

      if (precData.escritura) {
        const [escrituraPath, escrituraFileName] = precData.escritura.split('/');
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

  const handleEditarCessao = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    // Verificação de campos obrigatórios
    if (precatorioEditado.length < 12 || processoEditado.length < 12 || !cedenteEditado || !varaEditado || !enteEditado || !anoEditado || !naturezaEditado || !empresaEditado || !dataCessaoEditado || !repComercialEditado || !escreventeEditado || !juridicoEditado) {
      toast.error('Todos os campos da cessão precisam ser preenchidos!', {
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
      return;
    }

    // Criação do objeto da cessão editada
    const cessaoEditada = {
      precatorioEditado,
      processoEditado,
      cedenteEditado,
      varaEditado,
      enteEditado,
      anoEditado,
      naturezaEditado,
      empresaEditado,
      dataCessaoEditado,
      repComercialEditado,
      escreventeEditado,
      juridicoEditado,
      requisitorioEditado: requisitorioEditadoFile ? `cessoes_requisitorios/${precID}-requisitorio-${requisitorioEditadoFile.name}` : requisitorioEditado ? `${requisitorioEditado}` : null,
      escrituraEditado: escrituraEditadoFile ? `cessoes_escrituras/${precID}-escritura-${escrituraEditadoFile.name}` : escrituraEditado ? `${escrituraEditado}` : null,
    };

    try {
      setSendingData(true);
      console.log(`cessaoEditada: ${JSON.stringify(cessaoEditada)}`);

      // Envio dos dados da cessão editada
      await axiosPrivate.put(`/cessoes/${precID}`, cessaoEditada);

      // Função para upload de arquivos
      const uploadFiles = async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          // Adicionando precID ao nome do arquivo
          const fileNameWithPrecID = `${precID}-${file.name}-${file.file.name}`;
          formData.append(file.name, new File([file.file], fileNameWithPrecID)); // Substitui o nome do arquivo
        });

        try {
          await axiosPrivate.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (err) {
          toast.error(`Erro ao enviar arquivos: ${err}`, {
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
          setSendingData(false);
        }
      };

      // Verifica se há arquivos para upload
      if (requisitorioEditadoFile) {
        await uploadFiles([
          { name: 'requisitorio', file: requisitorioEditadoFile, isRequisitorio: true },
        ]);
      }

      if (escrituraEditadoFile) {
        await uploadFiles([
          { name: 'escritura', file: escrituraEditadoFile, isEscritura:true },
        ]);
      }


    } catch (err) {
      toast.error(`Erro ao editar cessão: ${err}`, {
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
      setSendingData(false);
      return;
    }

    setSendingData(false);

    // Set flag in local storage and reload the page
    localStorage.setItem('cessaoEditada', 'true');
    window.location.reload();
  };


  const isGestor = clientes.some(cliente => String(cliente.id_gestor) === String(auth.user.id))

  const cessionariosFiltrados = cessionarios.filter(cessionario => {
    const cessaoIdMatch = parseInt(precData.id) === parseInt(cessionario.cessao_id);

    if (isAdmin) {
      return cessaoIdMatch; // Admin pode ver todos os cessionários
    }

    // Verificar se o cessionário está relacionado ao próprio usuário
    if (cessionario.user_id === String(auth.user.id) && cessaoIdMatch) {
      return true; // Usuário comum pode ver seus próprios cessionários
    }

    // Verificar se o cessionário está relacionado a algum cliente do gestor
    if (isGestor && cessaoIdMatch) {
      return clientes.some(cliente => cliente.id_usuario === cessionario.user_id && cliente.id_gestor === String(auth.user.id));
    }

    return false; // Caso contrário, o cessionário não será mostrado
  });

  // Passo 1: Extrair os cessao_id dos cessionariosFiltrados
  const cessaoIds = cessionariosFiltrados.map(cessionario => cessionario.cessao_id);

  // Passo 2: Filtrar as cessões relacionadas, mas excluir onde precData.id for igual a cessao.id
  const cessoesRelacionadas = todasCessoes.filter(cessao =>
    cessaoIds.includes(String(cessao.id)) &&
    precData.id !== cessao.id
  );

  // Passo 3: Combinar as cessões filtradas existentes com as cessões relacionadas
  const cessoesFiltradas = todasCessoes.filter(cessao =>
    precData.id !== cessao.id &&
    (precData.processo === cessao.processo || precData.cedente === cessao.cedente || precData.precatorio === cessao.precatorio)
  ).concat(cessoesRelacionadas);

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
                      <span className="font-[700] dark:text-white">{precData.id}</span>
                    </div>
                    <div className="flex flex-col justify-center text-[12px] pl-2 w-full">
                      <div className='flex justify-between items-center w-full'>
                        <span className="font-bold dark:text-white text-[24px]">{precData.precatorio}</span>
                        {auth.user.admin ?
                          <>
                            <DotsButton isModal={true}>
                              <Modal
                                botaoAbrirModal={
                                  <button title='Editar precatório' className='hover:bg-neutral-100  dark:hover:bg-neutral-800 dark:text-white text-sm px-4 py-2 rounded'>
                                    Editar
                                  </button>}
                                tituloModal={'Editar cessão'}
                                botaoSalvar={
                                  <button onClick={(e) => handleEditarCessao(e)}
                                    className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-1 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                                    Salvar
                                  </button>
                                }
                              >
                                <div className='h-[450px] overflow-auto relative'>
                                  {sendingData && (<div className='absolute bg-neutral-800 w-full h-full opacity-85  left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                                    <div className='absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8'>
                                      <LoadingSpinner />
                                    </div>
                                  </div>)}
                                  <EditarPrec precInfo={precData} varas={varas} orcamentos={orcamentos} naturezas={natureza} empresas={empresas} users={users} teles={teles} escreventes={escreventes} juridico={juridico} enviarValores={(valores) => handleReceberValores(valores)} />
                                </div>
                              </Modal>
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
                      <span className="text-neutral-400 font-medium line-clamp-1">{precData.cedente}</span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-wrap gap-1 mb-[13px] '>
                  <a
                    style={{ backgroundColor: `${precData.statusColor}` }}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={`${precData.substatus ? precData.substatus : ''}`}
                    data-tooltip-place="top"
                    className={`px-2 py-1 rounded text-[10px] flex gap-1 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100`}>
                    <span className="text-black font-bold">{precData.status}</span>
                  </a>
                  {precData.orcamento ? (<Tags text={precData.orcamento} />) : null}
                  {precData.nome_natureza ? (<Tags text={precData.nome_natureza} />) : null}
                  {precData.nome_empresa ? (<Tags text={precData.nome_empresa} />) : null}
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
                    precInfo={precData}
                    status={status}
                    cessionario={cessionariosFiltrados}
                    cessoes={cessoesFiltradas}
                    varas={varas}
                    orcamentos={orcamentos}
                    naturezas={natureza}
                    empresas={empresas}
                    users={users}
                    teles={teles}
                    escreventes={escreventes}
                    juridico={juridico}
                    handleUpdate={handleUpdate}
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
