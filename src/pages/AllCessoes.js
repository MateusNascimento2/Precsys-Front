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
      escritura: escritura ? `cessoes_escrituras/${escritura.name}` : null,
      requisitorio: requisitorio ? `cessoes_requisitorios/${requisitorio.name}` : null,
    };

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

    let cessaoId;

    try {
      setIsLoading(true)
      const response = await axiosPrivate.post('/cessoes', cessao);
      cessaoId = response.data.insertId;

      const uploadFiles = async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(file.name, file.file);
        });

        try {
          const response = await axiosPrivate.post('/upload', formData, {
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
        }
      };

      if (requisitorio || escritura) {
        await uploadFiles([
          { name: 'requisitorio', file: requisitorio },
          { name: 'escritura', file: escritura },
        ]);
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
      setIsLoading(false)
      return;
    }


    if (cessionarios.length > 0) {
      try {
        for (const cessionario of cessionarios) {
          cessionario.valores.id_cessao = cessaoId;
          cessionario.valores.nota = `cessionarios_nota/${cessionario.valores.nota.name}`
          cessionario.valores.oficioTransferencia = `cessionarios_mandado/${cessionario.valores.oficioTransferencia.name}`
          cessionario.valores.comprovantePagamento = `cessionarios_comprovante/${cessionario.valores.comprovantePagamento.name}`
          try {
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
              }
            };

            if (cessionario.valores.nota || cessionario.valores.oficioTransferencia || cessionario.valores.comprovantePagamento) {
              await uploadFiles([
                { name: 'nota', file: cessionario.valores.nota },
                { name: 'oficio_transferencia', file: cessionario.valores.oficioTransferencia },
                { name: 'comprovante_pagamento', file: cessionario.valores.comprovantePagamento },
              ]);
            }


          } catch (err) {
            toast.error(`Erro ao adicionar cessionario: ${err}`, {
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
          }
        }
      } catch (err) {
        setIsLoading(false)
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

    setIsLoading(false)

    adicionarCessaoRef.current.resetForm();
    navigate('/todas-cessoes')
  }

  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative' : 'relative container mx-auto pt-[120px] dark:bg-neutral-900 h-full'}>
        <ToastContainer />
        <div className='px-[20px]'>
          <div className='flex justify-between items-center md:items-end'>
            <h2 className='font-[700] text-[32px] md:mt-[16px] dark:text-white' id='cessoes'>Cessões</h2>
            {!minhascessoes ?
              <Modal
                botaoAbrirModal={
                  <button title='Adicionar nova cessão' className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded-full text-[20px] p-1 lg:mb-0 lg:p-2 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px]'>
                    +
                  </button>}
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
                botaoSalvar={<button
                  className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700' onClick={(e) => handleSubmit(e)}>
                  Salvar
                </button>
                }
                botaoAdicionarCessionario={<button
                  onClick={() => addCessionario()}
                  className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                  Adicionar cessionário
                </button>}
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
                        <div className='absolute left-1/2 top-[33%] -translate-x-[50%] -translate-y-[50%] z-30'>
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
        <div className='mt-[24px] px-5 dark:bg-neutral-900'>
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
              <Filter show={true} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} dataCessoes={dataCessoes} />
            </div>
            <div className='w-full h-full max-h-full'>
              <Lista searchQuery={searchQuery} selectedFilters={selectedCheckboxes} setData={handleData} />
            </div>
          </div>
        </div>
        <Filter show={show} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} selectedCheckboxes={selectedCheckboxes} dataCessoes={dataCessoes} />
      </main>
    </>
  )
}
