import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import EditarCessionario from './EditarCessionario';
import AdicionarCessionario from './AdicionarCessionario';
import DotsButton from './DotsButton';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

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

export default function ListaCessionarios({ cessionario, users, precID }) {
  const [valorPago, setValorPago] = useState('');
  const [comissao, setComissao] = useState('');
  const [percentual, setPercentual] = useState('');
  const [expectativa, setExpectativa] = useState('');
  const [cessionarios, setCessionarios] = useState([]);
  const [valoresCessionarios, setValoresCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [valorPagoEditado, setValorPagoEditado] = useState('');
  const [comissaoEditado, setComissaoEditado] = useState('');
  const [percentualEditado, setPercentualEditado] = useState('');
  const [expectativaEditado, setExpectativaEditado] = useState('');
  const [cessionarioEditado, setCessionarioEditado] = useState('');
  const [obsEditado, setObsEditado] = useState('');
  const [assinaturaEditado, setAssinaturaEditado] = useState(false);
  const [expedidoEditado, setExpedidoEditado] = useState(false);
  const [recebidoEditado, setRecebidoEditado] = useState(false);
  const [notaEditado, setNotaEditado] = useState(cessionario.nota ? cessionario.nota : null);
  const [oficioTransferenciaEditado, setOficioTransferenciaEditado] = useState(cessionario.mandado ? cessionario.mandado : null);
  const [comprovantePagamentoEditado, setComprovantePagamentoEditado] = useState(cessionario.comprovante ? cessionario.comprovante : null); // Change to null
  const [notaFile, setNotaFile] = useState('');
  const [oficioTransferenciaFile, setOficioTransferenciaFile] = useState('');
  const [comprovantePagamentoFile, setComprovantePagamentoFile] = useState('');

  const [loadingFiles, setLoadingFiles] = useState({});

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  console.log(cessionario)

  const confirmDelete = async (id, files) => {
    const isDarkMode = localStorage.getItem('darkMode');

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


      localStorage.setItem('cessionarioExcluido', 'true');

      window.location.reload();
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

  useEffect(() => {
    addCessionario();
  }, []);

  const addCessionario = () => {
    const id = uuidv4();
    const novoCessionario = {
      componente: (
        <AdicionarCessionario
          index={id}
          valorPago={valorPago}
          setValorPago={setValorPago}
          comissao={comissao}
          setComissao={setComissao}
          percentual={percentual}
          setPercentual={setPercentual}
          expectativa={expectativa}
          setExpectativa={setExpectativa}
          key={id}
          users={users}
          enviarValores={(valores) => handleReceberValoresNovoCessionarios(valores, id)}
        />
      ),
      index: id,
      valores: {}, // Inicialmente os valores são um objeto vazio
    };
    setCessionarios([...cessionarios, novoCessionario]);
    setValoresCessionarios([...valoresCessionarios, {}]);
  };

  const handleReceberValoresNovoCessionarios = (valores, id) => {
    setCessionarios((prev) => {
      return prev.map((cessionario) => {
        if (cessionario.index === id) {
          return { ...cessionario, valores: valores };
        } else {
          return cessionario;
        }
      });
    });

  };

  console.log(cessionarios);

  const handleReceberValoresCessionarioEditado = (valores) => {
    console.log(valores);
    setValorPagoEditado(valores.valorPagoEditado);
    setComissaoEditado(valores.comissaoEditado);
    setPercentualEditado(valores.percentualEditado);
    setExpectativaEditado(valores.expectativaEditado);
    setCessionarioEditado(valores.cessionarioEditado);
    setObsEditado(valores.obsEditado);
    setAssinaturaEditado(valores.assinaturaEditado);
    setExpedidoEditado(valores.expedidoEditado);
    setRecebidoEditado(valores.recebidoEditado);
    setNotaEditado(valores.notaEditado);
    setOficioTransferenciaEditado(valores.oficioTransferenciaEditado);
    setComprovantePagamentoEditado(valores.comprovantePagamentoEditado);
    setNotaFile(valores.notaFile);
    setOficioTransferenciaFile(valores.oficioTransferenciaFile);
    setComprovantePagamentoFile(valores.comprovantePagamentoFile);
  };

  const handleExcluirCessionario = (id) => {
    const novaListaCessionarios = cessionarios.filter((cessionario) => cessionario.index !== id);
    setCessionarios(novaListaCessionarios);
    setValoresCessionarios((prev) => {
      return prev.filter((_, index) => index !== id);
    });
  };

  const handleEditarCessionarioSubmit = async (id) => {
    const isDarkMode = localStorage.getItem('darkMode');
    console.log(id, valorPagoEditado, comissaoEditado, percentualEditado, expectativaEditado, cessionarioEditado, obsEditado, assinaturaEditado, expedidoEditado, recebidoEditado);

    try {
      setIsLoading(true);

      if (!valorPagoEditado || !comissaoEditado || !percentualEditado || !expectativaEditado || !cessionarioEditado) {
        toast.error('Os campos (cessionário, valor pago, comissão, porcentagem e expectativa) precisam ser preenchidos!', {
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

      const cessionariosEditados = { valorPagoEditado, comissaoEditado, percentualEditado, expectativaEditado, cessionarioEditado, obsEditado, assinaturaEditado, expedidoEditado, recebidoEditado, notaEditado: notaFile ? `cessionarios_nota/${notaFile.name}` : notaEditado, oficioTransferenciaEditado: oficioTransferenciaFile ? `cessionarios_mandado/${oficioTransferenciaFile.name}` : oficioTransferenciaEditado, comprovantePagamentoEditado: comprovantePagamentoFile ? `cessionarios_comprovante/${comprovantePagamentoFile.name}` : comprovantePagamentoEditado };

      const uploadFiles = async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(file.name, file.file);
        });

        try {
          const response = await axiosPrivate.post('/uploadFileCessionario', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (err) {
          toast.error(`Erro ao enviar arquivos: ${err}`, {
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
      };

      if (notaFile || oficioTransferenciaFile || comprovantePagamentoFile) {
        await uploadFiles([
          { name: 'nota', file: notaFile },
          { name: 'oficio_transferencia', file: oficioTransferenciaFile },
          { name: 'comprovante_pagamento', file: comprovantePagamentoFile },
        ]);
      }

      await axiosPrivate.put(`/cessionarios/${id}`, cessionariosEditados);




      console.log('Cessionario editado com sucesso.');
    } catch (err) {
      toast.error(`Erro ao editar cessionário: ${err}`, {
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
      console.error('Erro ao editar cessionario:', err);
      return;
    }

    setIsLoading(false);

    localStorage.setItem('cessionarioEditado', 'true');

    window.location.reload();
  };

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode');
    if (localStorage.getItem('cessionarioEditado')) {
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
      localStorage.removeItem('cessionarioEditado');
    }
  }, []);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode');
    if (localStorage.getItem('cessionarioAdicionado')) {
      toast.success('Cessionário(s) adicionado(s) com sucesso!', {
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
      localStorage.removeItem('cessionarioAdicionado');
    }
  }, []);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode');
    if (localStorage.getItem('cessionarioExcluido')) {
      toast.success('Cessionário excluído com sucesso!', {
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
      localStorage.removeItem('cessionarioExcluido');
    }
  }, []);

  const handleSubmit = async () => {
    console.log('Iniciando handleSubmit', cessionarios);
    const isDarkMode = localStorage.getItem('darkMode');
    setIsLoading(true);

    if (cessionarios.length > 0) {
      for (const cessionario of cessionarios) {
        if (!cessionario.valores.valorPago || !cessionario.valores.comissao || !cessionario.valores.percentual || !cessionario.valores.expectativa || !cessionario.valores.cessionario) {
          toast.error('Os campos (cessionário, valor pago, comissão, porcentagem e expectativa) precisam ser preenchidos!', {
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
      }

      try {
        for (const cessionario of cessionarios) {
          cessionario.valores.id_cessao = precID;

          if (cessionario.valores.nota) {
            cessionario.valores.notaPath = `cessionarios_nota/${cessionario.valores.nota.name}`;
          }

          if (cessionario.valores.oficioTransferencia) {
            cessionario.valores.oficioTransferenciaPath = `cessionarios_mandado/${cessionario.valores.oficioTransferencia.name}`;
          }

          if (cessionario.valores.comprovantePagamento) {
            cessionario.valores.comprovantePagamentoPath = `cessionarios_comprovante/${cessionario.valores.comprovantePagamento.name}`
          }


          try {
            setIsLoading(true)
            await axiosPrivate.post('/cessionarios', cessionario.valores);

            const uploadFiles = async (files) => {
              const formData = new FormData();
              files.forEach((file) => {
                formData.append(file.name, file.file);
              });

              try {
                const response = await axiosPrivate.post('/uploadFileCessionario', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
              } catch (err) {
                toast.error(`Erro ao enviar arquivos: ${err}`, {
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
              }
            };

            if (cessionario.valores.nota || cessionario.valores.oficioTransferencia || cessionario.valores.comprovantePagamento) {
              await uploadFiles([
                { name: 'nota', file: cessionario.valores.nota },
                { name: 'oficio_transferencia', file: cessionario.valores.oficioTransferencia },
                { name: 'comprovante_pagamento', file: cessionario.valores.comprovantePagamento },
              ]);
            }

            console.log(`Cessionario ${cessionario.valores} adicionado com sucesso.`);
            setIsLoading(false)
          } catch (err) {
            toast.error(`Erro ao adicionar cessionário: ${err}`, {
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
            console.error('Erro ao adicionar cessionario:', err);
            return;
          }
        }

        localStorage.setItem('cessionarioAdicionado', 'true');

        window.location.reload();
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        return;
      }

      setIsLoading(false);

      const id = uuidv4();
      const novoCessionario = {
        componente: (
          <AdicionarCessionario
            valorPago={''}
            setValorPago={setValorPago}
            comissao={''}
            setComissao={setComissao}
            percentual={''}
            setPercentual={setPercentual}
            expectativa={''}
            setExpectativa={setExpectativa}
            key={id}
            users={users}
            enviarValores={(valores) => handleReceberValoresNovoCessionarios(valores, id)}
          />
        ),
        index: id,
        valores: {}, // Inicialmente os valores são um objeto vazio
      };
      setCessionarios([novoCessionario]);

      window.location.reload();
    }
  };

  const downloadFile = async (filename) => {
    const isDarkMode = localStorage.getItem('darkMode');
    console.log(filename);
    const path = filename.split('/')[0];
    const file = filename.split('/')[1];

    setLoadingFiles(prev => ({ ...prev, [filename]: true }));

    try {
      const response = await axiosPrivate.get(`/download/${path}/${file}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log('urL:' + url)
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

  return cessionario.length !== 0 ? (
    <div className="w-full mb-[60px] flex flex-col">
      <div className="mb-[16px] flex items-center justify-between">
        <span className="font-[700] dark:text-white" id="cessionarios">
          Cessionários
        </span>
        <Modal
          botaoAbrirModal={
            <button title="Adicionar cessionário" className="hover:bg-neutral-100 flex justify-center items-center dark:text-white dark:hover:bg-neutral-800 rounded w-[25px] h-[25px] p-[2px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          }
          tituloModal="Adicionar cessionário"
          botaoSalvar={
            <button
              onClick={() => handleSubmit()}
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
            >
              Salvar
            </button>
          }
          botaoAdicionarCessionario={
            <button
              onClick={() => addCessionario()}
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
            >
              Adicionar cessionário
            </button>
          }
        >
          <div className="h-[450px] overflow-auto">
            {isLoading && (
              <div className="absolute bg-neutral-800 w-full h-full opacity-85 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20">
                <div className="absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 h-12 w-12">
                  <LoadingSpinner />
                </div>
              </div>
            )}
            <div className="w-full flex flex-col gap-10 divide-y dark:divide-neutral-600">
              {cessionarios.map((componente) => (
                <div key={componente.index} className="w-full pt-5">
                  <div className="px-4 flex justify-end items-center">
                    <button
                      onClick={() => handleExcluirCessionario(componente.index)}
                      className={cessionarios.length > 1 ? 'rounded hover:bg-neutral-100 float-right w-4 h-4 dark:hover:bg-neutral-800' : 'hidden'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 dark:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {componente.componente}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-600">
          <div className="min-w-[250px] w-[24%] dark:text-white">Nome</div>
          <div className="min-w-[120px] w-[15%] text-center dark:text-white">valor pago</div>
          <div className="min-w-[120px] w-[17%] text-center dark:text-white">comissão</div>
          <div className="min-w-[60px] w-[5%] text-center dark:text-white">%</div>
          <div className="min-w-[120px] w-[17%] text-center dark:text-white">expectativa</div>
          <div className="min-w-[180px] w-[18%] text-center dark:text-white">nota</div>
          <div className="min-w-[50px] w-[5%] ml-auto text-center dark:text-white"></div>
        </div>
        {cessionario.map((c) => (
          <div className="w-max lg:w-full flex text-[12px] items-center border-b dark:border-neutral-600 last:border-0 py-[10px] border-gray-300" key={c.id}>
            <div className="min-w-[250px] w-[24%]">
              <div className="flex flex-col justify-center text-[12px]">
                <span className="font-bold dark:text-neutral-200">{c.nome_user} </span>
                <span className=" text-neutral-400 font-medium">{c.cpfcnpj}</span>
              </div>
            </div>
            <div className="min-w-[120px] w-[15%] text-center dark:text-neutral-200">{c.valor_pago}</div>
            <div className="min-w-[120px] w-[17%] text-center dark:text-neutral-200">{c.comissao}</div>
            <div className="min-w-[60px] w-[5%] text-center dark:text-neutral-200">{c.percentual}</div>
            <div className="min-w-[120px] w-[17%] text-center dark:text-neutral-200">{c.exp_recebimento}</div>
            <div className="min-w-[180px] w-[18%] text-center">
              {c.nota ? <button title="Baixar nota" className="cursor-pointer text-[12px] hover:underline dark:text-white" onClick={() => downloadFile(c.nota)}>
                {loadingFiles[c.nota] ? (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4"><LoadingSpinner /></div>

                    <span>{c.nota ? c.nota.split('/')[1] : null}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span className="cursor-pointer text-[12px] hover:underline dark:text-white">{c.nota ? c.nota.split('/')[1] : null}</span>

                  </div>


                )}
              </button> : null}
            </div>
            <div className="min-w-[50px] w-[5%] ml-auto flex justify-center dark:text-neutral-200">
              <DotsButton>
                <Modal
                  botaoAbrirModal={
                    <button title="Editar cessionário" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm px-4 py-2 rounded">
                      Editar
                    </button>
                  }
                  tituloModal={`Editar cessionário #${c.id}`}
                  botaoSalvar={
                    <button
                      onClick={() => handleEditarCessionarioSubmit(c.id)}
                      className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
                    >
                      Salvar
                    </button>
                  }
                >
                  {isLoading && (
                    <div className="absolute bg-neutral-800 w-full h-full opacity-85 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20">
                      <div className="absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8">
                        <LoadingSpinner />
                      </div>
                    </div>
                  )}
                  <EditarCessionario cessionario={c} users={users} enviarValores={(valores) => handleReceberValoresCessionarioEditado(valores)} />
                </Modal>
                <button onClick={openModal} className="hover:bg-red-800 bg-red-600 text-white text-sm px-4 py-2 rounded">
                  Excluir
                </button>
              </DotsButton>

              <DeleteConfirmationModal isOpen={modalIsOpen} onRequestClose={closeModal} onConfirm={() => confirmDelete(c.id, { nota: c.nota, comprovante: c.comprovante, mandado: c.mandado })} />
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
          <div className="min-w-[180px] w-[18%] text-center dark:text-neutral-200"></div>
          <div className="min-w-[50px] w-[5%] ml-auto text-center dark:text-neutral-200"></div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="mb-[16px] flex items-center gap-4">
        <span className="font-[400] text-[12px] dark:text-white" id="cessionarios">
          Não há cessionários
        </span>
        <Modal
          botaoAbrirModal={
            <button title="Adicionar cessionário" className="hover:bg-neutral-100 flex justify-center items-center dark:text-white dark:hover:bg-neutral-800 rounded w-[20px] h-[20px] p-[1px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          }
          tituloModal="Adicionar cessionário"
          botaoSalvar={
            <button
              onClick={() => handleSubmit()}
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
            >
              Salvar
            </button>
          }
          botaoAdicionarCessionario={
            <button
              onClick={() => addCessionario()}
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
            >
              Adicionar cessionário
            </button>
          }
        >
          {isLoading && (
            <div className="absolute bg-neutral-800 w-full h-full opacity-85 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20">
              <div className="absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8">
                <LoadingSpinner />
              </div>
            </div>
          )}
          <div className="h-[450px] overflow-auto">
            <div className="w-full flex flex-col gap-10 divide-y dark:divide-neutral-600">
              {cessionarios.map((componente) => (
                <div key={componente.index} className="w-full pt-5">
                  <div className="px-4 flex justify-end items-center">
                    <button
                      onClick={() => handleExcluirCessionario(componente.index)}
                      className={cessionarios.length > 1 ? 'rounded hover:bg-neutral-100 float-right w-4 h-4 dark:hover:bg-neutral-800' : 'hidden'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 dark:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {componente.componente}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
