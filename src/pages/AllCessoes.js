import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import AdicionarCessao from "../components/AdicionarCessao";
import AdicionarCessionario from "../components/AdicionarCessionario";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';

export default function AllCessoes() {
  const [voltarAdicionarCessao, setVoltarAdicionarCessao] = useState(false);
  const [varas, setVaras] = useState([]);
  const [teles, setTeles] = useState([]);
  const [users, setUsers] = useState([]);
  const [escreventes, setEscreventes] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [naturezas, setNaturezas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [juridicos, setJuridicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModalAdicionarCessionario, setShowModalAdicionarCessionario] = useState(false);
  const [cessionarios, setCessionarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : [];
  });
  const [show, setShow] = useState(false);
  const [dataCessoes, setDataCessoes] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const adicionarCessaoRef = useRef(null);

  const [precatorio, setPrecatorio] = useState('');
  const [processo, setProcesso] = useState('');
  const [cedente, setCedente] = useState('');
  const [vara, setVara] = useState(null);
  const [ente, setEnte] = useState(null);
  const [ano, setAno] = useState(null);
  const [natureza, setNatureza] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [dataCessao, setDataCessao] = useState(null);
  const [repComercial, setRepComercial] = useState(null);
  const [escrevente, setEscrevente] = useState(null);
  const [juridico, setJuridico] = useState(null);
  const [requisitorio, setRequisitorio] = useState(null);
  const [escritura, setEscritura] = useState(null);

  const [valorPago, setValorPago] = useState('');
  const [comissao, setComissao] = useState('');
  const [percentual, setPercentual] = useState('');
  const [expectativa, setExpectativa] = useState('');

  const [filteredCessoes, setFilteredCessoes] = useState([]);

  const handleFilteredCessoes = (filteredData) => {
    setFilteredCessoes(filteredData);
  };

  const [valoresCessionarios, setValoresCessionarios] = useState([]);

  const { minhascessoes } = useParams();


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal
        });
        if (isMounted) setter(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData('/vara', setVaras);
    fetchData('/tele', setTeles);
    fetchData('/escreventes', setEscreventes);
    fetchData('/users', setUsers);
    fetchData('/orcamentos', setOrcamentos);
    fetchData('/natureza', setNaturezas);
    fetchData('/empresas', setEmpresas);
    fetchData('/juridicos', setJuridicos);


    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);


  const addCessionario = () => {
    setShowModalAdicionarCessionario(true);
    if (voltarAdicionarCessao) {
      setVoltarAdicionarCessao(false);
      return;
    } else {
      const id = uuidv4();
      const novoCessionario = {
        componente: <AdicionarCessionario valorPago={valorPago} setValorPago={setValorPago} comissao={comissao} setComissao={setComissao} percentual={percentual} setPercentual={setPercentual} expectativa={expectativa} setExpectativa={setExpectativa} key={id} users={users} enviarValores={(valores) => handleReceberValoresCessionario(valores, id)} />,
        index: id,
        valores: {} // Inicialmente os valores são um objeto vazio
      };
      setCessionarios([...cessionarios, novoCessionario]);
      setValoresCessionarios([...valoresCessionarios, {}]);
    }
  }

  const handleReceberValoresCessionario = (valores, id) => {
    console.log(valores)
    setCessionarios(prev => {
      return prev.map(cessionario => {
        if (cessionario.index === id) {
          return { ...cessionario, valores: valores };
        } else {
          return cessionario;
        }
      });
    });
  };

  const handleExcluirCessionario = (id) => {
    const novaListaCessionarios = cessionarios.filter(cessionario => cessionario.index !== id);
    setCessionarios(novaListaCessionarios);
    setValoresCessionarios(prev => {
      return prev.filter((_, index) => index !== id);
    });
  };

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(selectedCheckboxes));
  }, [selectedCheckboxes]);

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  const handleData = (data) => {
    setDataCessoes(data);
  }

  const handleShow = () => {
    setShow((prevState) => !prevState);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

  const handleSelectedCheckboxesChange = (childData) => {
    setSelectedCheckboxes(childData);
  };

  const handleVoltarAdicionarCessao = () => {
    setVoltarAdicionarCessao(true);
    setShowModalAdicionarCessionario(prevState => !prevState);
  }

  const handleReceberValoresCessao = (valores) => {
    setPrecatorio(valores.precatorio);
    setProcesso(valores.processo);
    setCedente(valores.cedente);
    setVara(valores.vara);
    setEnte(valores.ente);
    setAno(valores.ano);
    setNatureza(valores.natureza);
    setEmpresa(valores.empresa);
    setDataCessao(valores.dataCessao);
    setRepComercial(valores.repComercial);
    setEscrevente(valores.escrevente);
    setJuridico(valores.juridico);
    setRequisitorio(valores.requisitorio);
    setEscritura(valores.escritura);
    console.log(requisitorio)
    console.log(escritura)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    // Verifica se há cessionários e se todos têm os valores corretos
    if (cessionarios.length > 0) {
      for (const cessionario of cessionarios) {
        if (!cessionario.valores.cessionario) {
          toast.error(`Adicione um cessionário!`, {
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
      }
    }

    // Verifica se todos os campos obrigatórios da cessão foram preenchidos
    if (precatorio.length < 12 || processo.length < 12 || !cedente || !vara || !ente || !ano || !natureza || !empresa || !dataCessao || !repComercial || !escrevente || !juridico) {
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

    // Cria o objeto inicial da cessão, sem os arquivos
    const cessao = {
      precatorio,
      processo,
      cedente,
      vara,
      ente,
      ano,
      natureza,
      empresa,
      dataCessao,
      repComercial,
      escrevente,
      juridico,
      status: "1",
      escritura: null, // Arquivo será adicionado depois
      requisitorio: null // Arquivo será adicionado depois
    };

    let cessaoId;

    try {
      setIsLoading(true);

      // Primeiro POST para criar a cessão e obter o cessaoId
      const response = await axiosPrivate.post('/cessoes', cessao);
      cessaoId = response.data.insertId;

      // Agora que temos o cessaoId, podemos atualizar o objeto cessao com os arquivos
      /*       if (requisitorio) {
              cessao.requisitorio = `cessoes_requisitorios/${cessaoId}-requisitorio-${requisitorio.name}`;
            }
            if (escritura) {
              cessao.escritura = `cessoes_escrituras/${cessaoId}-escritura-${escritura.name}`;
            } */

      // Agora que temos o cessaoId, podemos atualizar o objeto cessao com os arquivos
      // Agora que temos o cessaoId, podemos criar o objeto com os nomes que o backend espera
      const cessaoEditada = {
        precatorioEditado: precatorio,
        processoEditado: processo,
        cedenteEditado: cedente,
        varaEditado: vara,
        enteEditado: ente,
        anoEditado: ano,
        naturezaEditado: natureza,
        empresaEditado: empresa,
        dataCessaoEditado: dataCessao,
        repComercialEditado: repComercial,
        escreventeEditado: escrevente,
        juridicoEditado: juridico,
        requisitorioEditado: requisitorio ? `cessoes_requisitorios/${cessaoId}-requisitorio-${requisitorio.name}` : null,
        escrituraEditado: escritura ? `cessoes_escrituras/${cessaoId}-escritura-${escritura.name}` : null
      };

      // Atualiza o registro da cessão com os arquivos usando o novo objeto
      await axiosPrivate.put(`/cessoes/${cessaoId}`, cessaoEditada);

      // Agora, se houver arquivos, fazemos o upload
      if (requisitorio || escritura) {
        const filesToUpload = [];
        if (requisitorio) {
          filesToUpload.push({ name: 'requisitorio', file: requisitorio, path: cessaoEditada.requisitorio, isRequisitorio: true });
        }
        if (escritura) {
          filesToUpload.push({ name: 'escritura', file: escritura, path: cessaoEditada.escritura, isEscritura: true });
        }

        // Função de upload dos arquivos
        await uploadFiles(filesToUpload, cessaoId);
      }

    } catch (err) {
      toast.error(`Erro ao adicionar Cessão: ${err}`, {
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
      setIsLoading(false);
      return;
    }

    // Adiciona os cessionários, se houver
    if (cessionarios.length > 0) {
      try {
        for (const cessionario of cessionarios) {
          cessionario.valores.id_cessao = cessaoId;

          // Adiciona os caminhos dos arquivos no cessionário
          if (cessionario.valores.nota) {
            cessionario.valores.notaPath = `cessionarios_nota/${cessionario.valores.nota.name}`;
          }
          if (cessionario.valores.oficioTransferencia) {
            cessionario.valores.oficioTransferenciaPath = `cessionarios_mandado/${cessionario.valores.oficioTransferencia.name}`;
          }
          if (cessionario.valores.comprovantePagamento) {
            cessionario.valores.comprovantePagamentoPath = `cessionarios_comprovante/${cessionario.valores.comprovantePagamento.name}`;
          }

          // POST para adicionar o cessionário
          await axiosPrivate.post('/cessionarios', cessionario.valores);

          // Upload de arquivos do cessionário, se houver
          const filesToUpload = [];
          if (cessionario.valores.nota) {
            filesToUpload.push({ name: 'nota', file: cessionario.valores.nota });
          }
          if (cessionario.valores.oficioTransferencia) {
            filesToUpload.push({ name: 'oficio_transferencia', file: cessionario.valores.oficioTransferencia });
          }
          if (cessionario.valores.comprovantePagamento) {
            filesToUpload.push({ name: 'comprovante_pagamento', file: cessionario.valores.comprovantePagamento });
          }
          if (filesToUpload.length > 0) {
            await uploadFiles(filesToUpload);
          }
        }
      } catch (err) {
        toast.error(`Erro ao adicionar cessionário: ${err}`, {
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
        setIsLoading(false);
        return;
      }
    }

    toast.success('Cessão cadastrada com sucesso!', {
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

    setIsLoading(false);
    adicionarCessaoRef.current.resetForm();
    navigate('/todas-cessoes');
  };

  // Função para upload de arquivos
  const uploadFiles = async (files, cessaoId) => {
    const formData = new FormData();

    files.forEach((file) => {
      const fileNameWithPrecID = `${cessaoId}-${file.name}-${file.file.name}`
      formData.append(file.name, new File([file.file], fileNameWithPrecID));  // Adiciona o arquivo
      formData.append('path', file.path);     // Adiciona o caminho do arquivo com o cessaoId

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
      setIsLoading(false);
      return;
    }
  };

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

  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative' : 'relative container mx-auto pt-[120px] dark:bg-neutral-900 h-full'}>
        <ToastContainer />
        <div className='px-[20px]'>
          <div className='flex justify-between items-center md:items-end'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='font-[700] text-[32px] md:mt-[16px] dark:text-white'
              id='cessoes'
            >
              Cessões
            </motion.h2>
            {!minhascessoes ?
              <Modal
                botaoAbrirModal={
                  <motion.button
                    title='Adicionar nova cessão'
                    className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[20px] p-1 lg:mb-0 lg:p-2 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>

                  </motion.button>
                }
                tituloModal={
                  showModalAdicionarCessionario && cessionarios.length > 0
                    ? (
                      <div className='flex gap-2 items-center'>
                        <button className='rounded hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={() => handleVoltarAdicionarCessao()}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                          </svg>
                        </button>
                        <span>Adicionar cessão</span>
                      </div>
                    )
                    : (<span>Adicionar cessão</span>)
                }
                botaoSalvar={
                  <motion.button
                    className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'
                    onClick={(e) => handleSubmit(e)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Salvar
                  </motion.button>
                }
                botaoAdicionarCessionario={
                  <motion.button
                    onClick={() => addCessionario()}
                    className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Adicionar cessionário
                  </motion.button>
                }
              >
                <div className='h-[450px] overflow-auto relative'>
                  <div className={showModalAdicionarCessionario && cessionarios.length !== 0 ? 'absolute left-[-1100px] transition-all ease-in-out duration-300 overflow-hidden' : 'absolute left-0 transition-all ease-in-out duration-300 overflow-y-hidden w-full'}>
                    {isLoading && (<div className='absolute bg-neutral-800 w-full h-full opacity-85 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                      <div className='absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8'>
                        <LoadingSpinner />
                      </div>
                    </div>)}
                    <AdicionarCessao ref={adicionarCessaoRef} varas={varas} orcamentos={orcamentos} naturezas={naturezas} empresas={empresas} users={users} teles={teles} escreventes={escreventes} juridicos={juridicos} enviarValores={handleReceberValoresCessao} />
                  </div>

                  <div className={showModalAdicionarCessionario && cessionarios.length !== 0 ? "absolute right-0 transition-all ease-in-out duration-300 overflow-y-auto w-full" : 'w-full absolute right-[1100px] transition-all ease-in-out duration-300 overflow-y-hidden'}>
                    <div className="w-full flex flex-col gap-10 divide-y dark:divide-neutral-600">
                      {isLoading && (<div className='absolute bg-neutral-800 w-full h-full opacity-85 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                        <div className='absolute left-1/2 top-[33%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8'>
                          <LoadingSpinner />
                        </div>
                      </div>)}
                      {cessionarios.map((componente) => (
                        <div key={componente.index} className='w-full pt-5'>
                          <div className='px-4 flex justify-between items-center'>
                            <span className='dark:text-white text-black font-medium py-2 text-[18px]'>Adicionar cessionário</span>
                            <button onClick={() => handleExcluirCessionario(componente.index)} className='rounded hover:bg-neutral-100 float-right w-4 h-4 dark:hover:bg-neutral-800'>
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
                </div>
              </Modal> : null}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mt-[24px] px-5 dark:bg-neutral-900'
        >
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
              <Filter show={true} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} dataCessoes={dataCessoes} onExportPDF={() => exportPDF(filteredCessoes)} />
            </div>
            <div className='w-full h-full max-h-full'>
              <Lista searchQuery={searchQuery} selectedFilters={selectedCheckboxes} setData={handleData} isPerfilCessoes={false} onFilteredCessoes={handleFilteredCessoes} />
            </div>
          </div>
        </motion.div>
        <Filter show={show} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} selectedCheckboxes={selectedCheckboxes} dataCessoes={dataCessoes} onExportPDF={() => exportPDF(filteredCessoes)} />

        {/* Scroll-to-top button */}
        <ScrollToTopButton />
      </main>
    </>
  )
}
