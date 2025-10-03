import React, { useState, useEffect } from 'react';
import { Modal } from './AdicionarCessionarioModal/Modal';
import { useNavigate } from 'react-router-dom';
import EditarCessionario from './EditarCessionario';
import AdicionarCessionario from './AdicionarCessionario';
import { ModalEditarCessionario } from './EditarCessionarioModal/ModalEditarCessionario';
import DotsButton from './DotsButton';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from 'react-tooltip';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm }) {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 bg-white dark:bg-black bg-opacity-40 dark:bg-opacity-40 flex justify-center items-center z-50 p-2">
      <div onClick={(e) => e.stopPropagation()} className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md">
        <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir o cessionário?</h2>
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800" onClick={onRequestClose}>
            Cancelar
          </button>
        </div>
        <button className="absolute top-3 right-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onRequestClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ListaCessionarios({ cessionario, precID, fetchDataCessao }) {
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const [loadingFiles, setLoadingFiles] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cessionarioSelecionado, setCessionarioSelecionado] = useState(null);
  const [status, setStatus] = useState('typing');
  const [formDataCessionario, setFormDataCessionario] = useState({
    user_id: '',
    valor_pago: '',
    valor_oficio_pagamento: '',
    comissao: '',
    percentual: '',
    exp_recebimento: '',
    recebido: '',
    assinatura: '',
    mandado: '',
    comprovante: '',
    expedido: '',
    obs: '',
    nota: ''
  })
  const [formDataCessionarioEditar, setFormDataCessionarioEditar] = useState({
    user_id: '',
    valor_pago: '',
    valor_oficio_pagamento: '',
    comissao: '',
    percentual: '',
    exp_recebimento: '',
    recebido: '',
    assinatura: '',
    mandado: '',
    comprovante: '',
    expedido: '',
    obs: '',
    nota: ''
  })
  const [fileCessionario, setFileCessionario] = useState({
    nota: '',
    mandado: '',
    comprovante: ''
  })
  const [fileCessionarioEditar, setFileCessionarioEditar] = useState({
    nota: '',
    mandado: '',
    comprovante: ''
  })
  const [cessionariosQtd, setCessionariosQtd] = useState([{ id: uuidv4(), nomeTab: '', formDataCessionario: { ...formDataCessionario }, fileCessionarios: { ...fileCessionario } }]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Verifica se a classe 'dark' está presente no HTML
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      setIsDarkTheme(htmlElement.classList.contains('dark'));
    };

    // Adiciona um evento de escuta para mudanças na classe do HTML
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    // Checa inicialmente o tema
    checkDarkMode();

    // Limpa o observador quando o componente é desmontado
    return () => observer.disconnect();
  }, []);


  const handleCessionarioInputChange = (id, values, name) => {

    //Função para checar se é um objeto por causa dos inputs que possuem a lib "Select" que retornam um object no parametro values
    function isObject(obj) {
      return obj === Object(obj) && !obj instanceof File
    }


    if (isObject(values)) {

      const { value } = values;

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: value } }
            : cessionario
        )
      );

    } else if (values instanceof File) {
      let value;
      let file;

      if (name === 'nota') {
        value = `cessionarios_nota/${values.name}`
        file = values
      } else if (name === 'mandado') {
        value = `cessionarios_mandado/${values.name}`
        file = values
      } else if (name === 'comprovante') {
        value = value = `cessionarios_comprovante/${values.name}`
        file = values
      }

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: value }, fileCessionarios: { ...cessionario.fileCessionarios, [name]: file } }
            : cessionario
        )
      );


    } else if (values === null) {
      let value;
      let file;

      if (name === 'nota') {
        value = ''
        file = ''
      } else if (name === 'mandado') {
        value = ''
        file = ''
      } else if (name === 'comprovante') {
        value = ''
        file = ''
      }

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: value }, fileCessionarios: { ...cessionario.fileCessionarios, [name]: file } }
            : cessionario
        )
      );

    }

    else {

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: values } }
            : cessionario
        )
      );

    }


  };

  const handleNomeTab = (nome, id) => {
    setCessionariosQtd(prevCessionarios =>
      prevCessionarios.map(cessionario =>
        cessionario.id === id
          ? { ...cessionario, nomeTab: nome }
          : cessionario
      )
    );
  }

  const handleAddCessionario = () => {
    const newCessionario = {
      id: uuidv4(),
      nomeTab: '',
      formDataCessionario: { ...formDataCessionario },
      fileCessionarios: { ...fileCessionario },
    };

    setCessionariosQtd(prev => [...prev, newCessionario]);
  };

  const handleDeleteCessionarioForm = (id) => {
    setCessionariosQtd(
      cessionariosQtd.filter(cessionarioForm => cessionarioForm.id !== id)
    )
  }

  const uploadFiles = async (flag) => {
    try {
      const formDataCessionarios = new FormData();

      if (flag === 'Adicionar') {
        // Adicionando arquivos dos cessionários ao formDataCessionarios
        cessionariosQtd.forEach((cessionario) => {
          const files = cessionario.fileCessionarios || {};

          if (files.nota) {
            // Verifica se `files.nota` é um array antes de adicionar os arquivos corretamente
            if (Array.isArray(files.nota)) {
              files.nota.forEach((file) => formDataCessionarios.append("nota", file));
            } else {
              formDataCessionarios.append("nota", files.nota);
            }
          }

          if (files.mandado) {
            if (Array.isArray(files.mandado)) {
              files.mandado.forEach((file) => formDataCessionarios.append("oficio_transferencia", file));
            } else {
              formDataCessionarios.append("oficio_transferencia", files.mandado);
            }
          }

          if (files.comprovante) {
            if (Array.isArray(files.comprovante)) {
              files.comprovante.forEach((file) => formDataCessionarios.append("comprovante_pagamento", file));
            } else {
              formDataCessionarios.append("comprovante_pagamento", files.comprovante);
            }
          }
        });

        // Enviar arquivos dos cessionários, se existirem
        if (formDataCessionarios.has("nota") || formDataCessionarios.has("oficio_transferencia") || formDataCessionarios.has("comprovante_pagamento")) {
          await axiosPrivate.post("/uploadFileCessionario", formDataCessionarios, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Upload dos arquivos dos cessionários realizado com sucesso!");
        }

        return true;
      } else if (flag === 'Editar') {

        const files = fileCessionarioEditar || {};


        if (files.nota) {

          formDataCessionarios.append("nota", files.nota);

        }

        if (files.mandado) {

          formDataCessionarios.append("oficio_transferencia", files.mandado);

        }

        if (files.comprovante) {

          formDataCessionarios.append("comprovante_pagamento", files.comprovante);

        }


        // Enviar arquivos dos cessionários, se existirem
        if (formDataCessionarios.has("nota") || formDataCessionarios.has("oficio_transferencia") || formDataCessionarios.has("comprovante_pagamento")) {
          await axiosPrivate.post("/uploadFileCessionario", formDataCessionarios, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Upload dos arquivos dos cessionários realizado com sucesso!");
        }

        return true;
      }
    }

    catch (error) {
      console.error("Erro ao enviar os arquivos:", error);
      return false;
    }
  };

  const handleSubmitAdicionarCessionario = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');


    // Estado inicial: envio iniciado
    setStatus({ status: "sending", message: "Enviando dados..." });

    try {

      //  Validação dos cessionários
      if (cessionariosQtd.length > 0) {
        const algumCessionarioInvalido = cessionariosQtd.some((cessionario) => {
          const {
            user_id,
            valor_pago,
            comissao,
            exp_recebimento,
            percentual,
          } = cessionario.formDataCessionario;

          return !user_id || !valor_pago || !comissao || !exp_recebimento || !percentual;
        });

        if (algumCessionarioInvalido) {
          toast.error(`Preencha todos os campos obrigatórios do cessionário!`, {
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
          /*           setStatus({
                      status: 'error',
                      message: 'Preencha todos os campos obrigatórios do cessionário!',
                    }); */
          return;
        }
      }

      //  Upload dos arquivos
      const uploadResponse = await uploadFiles('Adicionar');

      if (!uploadResponse) {
        toast.error(`Erro no upload dos arquivos. Cadastro cancelado.`, {
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
        setStatus({
          status: 'error',
        });
        return;
      }

      //  Montagem do payload
      const payload = {
        cessionarios: cessionariosQtd.map(c => c.formDataCessionario),
      };

      //  Envio da cessão
      const response = await axiosPrivate.post(`/cessionarios/${precID}`, payload);

      setStatus({
        status: 'success',
      });

      toast.success(`Cessionário cadastrado com sucesso!`, {
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

      fetchDataCessao()

    } catch (error) {
      console.error("Erro ao cadastrar cessionário:", error);

      toast.error(`Erro ao cadastrar cessionário: ${error}`, {
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

      /*       setStatus({
              status: 'error',
              message: 'Erro ao enviar dados. Tente novamente.',
            }); */
    }
  };

  const modalProps = {
    onAddCessionario: handleAddCessionario,
    handleCessionarioInputChange,
    onDeleteCessionarioForm: handleDeleteCessionarioForm,
    cessionariosQtd,
    formCessionario: formDataCessionario,
    setFormDataCessionario,
    handleSubmitAdicionarCessionario,
    status,
    handleNomeTab
  };

  const navigate = useNavigate();

  const openModal = (cessionario) => {
    setCessionarioSelecionado(cessionario);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setCessionarioSelecionado(null);
    setModalIsOpen(false);
  };

  const confirmDelete = async (id, files) => {
    const isDarkMode = localStorage.getItem('darkMode');

    console.log(id)

    const deleteFile = async (path, fileName) => {
      try {
        console.log(`Tentando deletar arquivo: /deleteFile/${path}/${fileName}`);
        await axiosPrivate.delete(`/deleteFile/${path}/${fileName}`);
        console.log(`Arquivo deletado: ${path}/${fileName}`);
      } catch (err) {
        toast.error(`Erro ao deletar arquivo: ${err.message}`);
        throw err;
      }
    };

    try {
      setIsLoading(true);


      if (files.nota) {
        const [notaPath, notaFileName] = files.nota.split('/');
        console.log(`Deletando nota: ${notaPath}/${notaFileName}`);
        await deleteFile(notaPath, notaFileName);
      }

      if (files.comprovante) {
        const [comprovantePath, comprovanteFileName] = files.comprovante.split('/');
        console.log(`Deletando comprovante: ${comprovantePath}/${comprovanteFileName}`);
        await deleteFile(comprovantePath, comprovanteFileName);
      }

      if (files.mandado) {
        const [mandadoPath, mandadoFileName] = files.mandado.split('/');
        console.log(`Deletando mandado: ${mandadoPath}/${mandadoFileName}`);
        await deleteFile(mandadoPath, mandadoFileName);
      }


      const response = await axiosPrivate.delete(`/cessionarios/${id}`);

      toast.success(`Cessionário excluído com sucesso!`, {
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

      fetchDataCessao();


    } catch (err) {
      toast.error(`Erro ao deletar cessionário: ${err}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }
    closeModal();
  };

  const axiosPrivate = useAxiosPrivate();

  const handleEditarCessionarioSubmit = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');


    // Estado inicial: envio iniciado
    setStatus({ status: "sending", message: "Enviando dados..." });

    try {

      //  Validação dos cessionários
      const algumCessionarioInvalido = !formDataCessionarioEditar.user_id ||
        !formDataCessionarioEditar.valor_pago ||
        !formDataCessionarioEditar.comissao ||
        !formDataCessionarioEditar.exp_recebimento ||
        !formDataCessionarioEditar.percentual;


      if (algumCessionarioInvalido) {
        toast.error('Preencha todos os campos obrigatórios do cessionário!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
          theme: isDarkMode === 'true' ? 'dark' : 'light',
          transition: Bounce,
        });
        setStatus({
          status: 'error',
        });
        return;
      }


      //  Upload dos arquivos
      const uploadResponse = await uploadFiles('Editar');

      if (!uploadResponse) {

        toast.error('Erro no upload dos arquivos. Cadastro cancelado.', {
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

        setStatus({
          status: 'error',
        });
        return;
      }

      //  Montagem do payload
      const payload = {
        ...formDataCessionarioEditar
      };

      //  Envio da cessão
      const response = await axiosPrivate.put(`/cessionarios/${formDataCessionarioEditar.cessionario_id}`, payload);

      toast.success('Cessionário editado com sucesso!', {
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


      setStatus({
        status: 'success',
      });

      fetchDataCessao();

    } catch (error) {
      console.error("Erro ao editar cessionário:", error);

      toast.err('Erro ao enviar dados. Tente novamente.', {
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

      setStatus({
        status: 'error',
      });
    }
  };


  const downloadFile = async (filename) => {
    const isDarkMode = localStorage.getItem('darkMode');
    const path = filename.split('/')[0];
    const file = filename.split('/')[1];

    setLoadingFiles(prev => ({ ...prev, [filename]: true }));

    try {
      const response = await axiosPrivate.get(`/download/${path}/${file}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(`Erro ao baixar arquivo: ${error}`, {
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
      console.error('Error downloading the file:', error);
    } finally {
      setLoadingFiles(prev => ({ ...prev, [filename]: false }));
    }
  };

  function changeStringFloat(a) {
    const virgulaParaBarra = a.replace(',', '/');
    const valorSemPonto = virgulaParaBarra.replace(/\./g, '');
    const semMoeda = valorSemPonto.replace('R$ ', '');
    const barraParaPonto = semMoeda.replace('/', '.');
    const valorFloat = Number(barraParaPonto);
    return valorFloat;
  }

  function localeTwoDecimals(a) {
    if (Number.isInteger(a)) {
      return a.toLocaleString() + ',00';
    } else {
      return a.toLocaleString();
    }
  }

  function changePorcentagemToFloat(numero) {
    const valorSemPorcentagem = parseFloat(numero.replace(',', '.'));
    return valorSemPorcentagem;
  }

  const valorPagoTotal = cessionario.reduce((previousValue, currentValue) => {
    return previousValue + changeStringFloat(currentValue.valor_pago);
  }, 0);

  const valorComissaoTotal = cessionario.reduce((previousValue, currentValue) => {
    return previousValue + changeStringFloat(currentValue.comissao);
  }, 0);

  const valorExpTotal = cessionario.reduce((previousValue, currentValue) => {
    return previousValue + changeStringFloat(currentValue.exp_recebimento);
  }, 0);

  const valorPorcentagemTotal = cessionario.reduce((previousValue, currentValue) => {
    return previousValue + changePorcentagemToFloat(currentValue.percentual);
  }, 0);

  const valorOficioTotal = cessionario.reduce((previousValue, currentValue) => {
    return previousValue + changeStringFloat(currentValue.valor_oficio_pagamento)
  }, 0);

  return cessionario.length > 0 ? (
    <div className="w-full mb-[60px] flex flex-col">
      <div className="mb-[16px] flex items-center justify-between">
        <span className="font-[700] dark:text-white" id="cessionarios">
          Cessionários
        </span>
        {auth.user.admin ? <Modal {...modalProps} /> : null}
      </div>
      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-600">
          <div className="min-w-[250px] w-[24%] dark:text-white">Nome</div>
          <div className="min-w-[120px] w-[15%] text-center dark:text-white">valor pago</div>
          <div className="min-w-[120px] w-[17%] text-center dark:text-white">comissão</div>
          <div className="min-w-[60px] w-[5%] text-center dark:text-white">%</div>
          <div className="min-w-[120px] w-[17%] text-center dark:text-white">expectativa</div>
          {auth.user.admin ? <div className="min-w-[120px] w-[17%] text-center dark:text-white">Valor recebido</div> : null}
          <div className="min-w-[180px] w-[18%] text-center dark:text-white">nota</div>
          <div className="min-w-[50px] w-[5%] ml-auto text-center dark:text-white"></div>
        </div>
        {cessionario.map((c, index) => (
          <div className="w-max lg:w-full flex text-[12px] items-center border-b dark:border-neutral-600 last:border-0 py-[10px] border-gray-300" key={index}>
            <div className="min-w-[250px] w-[24%]">
              <div className={`flex flex-col justify-center text-[12px] ${c.nome_gestor ? 'mb-1' : ''}`}>
                <span className="font-bold dark:text-neutral-200">
                  {c.nome}
                </span>
                <span className=" text-neutral-400 font-medium">{c.cpfcnpj}</span>
              </div>
              {c.nome_gestor ? <span
                data-tooltip-id="gestores"
                data-tooltip-content={`${c.nome_gestor ? c.nome_gestor : ''}`}
                data-tooltip-place="right"
                className='py-1'
              >
                <span className='text-black font-medium dark:text-neutral-100 px-2 py-1 rounded gap-1 bg-neutral-200 dark:bg-neutral-700'>Gestores</span>
              </span>
                : null}
            </div>
            <div className="min-w-[120px] w-[15%] text-center dark:text-neutral-200">{c.valor_pago}</div>
            <div className="min-w-[120px] w-[17%] text-center dark:text-neutral-200">{c.comissao}</div>
            <div className="min-w-[60px] w-[5%] text-center dark:text-neutral-200">{c.percentual}</div>
            <div className="min-w-[120px] w-[17%] text-center dark:text-neutral-200">{c.exp_recebimento}</div>
            {auth.user.admin ? <div className="min-w-[120px] w-[17%] text-center dark:text-neutral-200">{c.valor_oficio_pagamento}</div> : null}

            <div className="min-w-[180px] w-[18%] text-center overflow-hidden">
              {c.nota ? <button title="Baixar nota" className="cursor-pointer text-[12px] hover:underline dark:text-white" onClick={() => downloadFile(c.nota)}>
                {loadingFiles[c.nota] ? (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 shrink-0"><LoadingSpinner /></div>

                    <span>{c.nota ? c.nota.split('/')[1] : null}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span className="cursor-pointer text-[12px] hover:underline dark:text-white overflow-hidden text-ellipsis">{c.nota ? c.nota.split('/')[1] : null}</span>

                  </div>


                )}
              </button> : null}
            </div>
            <div className="min-w-[50px] w-[5%] ml-auto flex justify-center dark:text-neutral-200">
              {auth.user.admin ?
                <>
                  <DotsButton isModal={true}>

                    <ModalEditarCessionario dadosCessionario={c} status={status} handleCessionarioInputChange={handleCessionarioInputChange} formDataCessionario={formDataCessionarioEditar} setFormDataCessionario={setFormDataCessionarioEditar} fileCessionario={fileCessionarioEditar} setFileCessionario={setFileCessionarioEditar} handleEditarCessionarioSubmit={handleEditarCessionarioSubmit} />

                    <button onClick={() => openModal(c)} className="hover:bg-red-800 bg-red-600 text-white text-sm px-4 py-2 rounded">
                      Excluir
                    </button>
                  </DotsButton>

                  <DeleteConfirmationModal isOpen={modalIsOpen} onRequestClose={closeModal} onConfirm={() => confirmDelete(cessionarioSelecionado?.cessionario_id, { nota: cessionarioSelecionado?.nota, comprovante: cessionarioSelecionado?.comprovante, mandado: cessionarioSelecionado?.mandado })} />
                </> : null}

            </div>
          </div>
        ))}
        <div className="w-max lg:w-full flex text-[12px] items-center border-b last:border-0 py-[10px] border-gray-300">
          <div className="min-w-[250px] w-[24%]">
            <div className="flex flex-col justify-center text-[12px]">
              <span className="font-bold dark:text-white">TOTAL </span>
            </div>
          </div>
          <div className="min-w-[120px] w-[15%] font-bold text-center dark:text-neutral-200">R$ {localeTwoDecimals(valorPagoTotal)}</div>
          <div className="min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200">R$ {localeTwoDecimals(valorComissaoTotal)}</div>
          <div className="min-w-[60px] w-[5%] font-bold text-center dark:text-neutral-200">{valorPorcentagemTotal.toLocaleString()}%</div>
          <div className="min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200">R$ {localeTwoDecimals(valorExpTotal)}</div>
          {auth.user.admin ? <div className="min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200">R$ {localeTwoDecimals(valorOficioTotal)}</div> : null}
          <div className="min-w-[180px] w-[18%] text-center dark:text-neutral-200"></div>
          <div className="min-w-[50px] w-[5%] ml-auto text-center dark:text-neutral-200"></div>
        </div>
      </div>
      <Tooltip id="gestores" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
    </div>
  ) : (
    <>
      <div className="mb-[16px] flex items-center gap-4">
        <span className="font-[400] text-[12px] dark:text-white" id="cessionarios">
          Não há cessionários
        </span>
        {auth.user.admin ? <Modal {...modalProps} /> : null}
      </div>
    </>
  );
}
