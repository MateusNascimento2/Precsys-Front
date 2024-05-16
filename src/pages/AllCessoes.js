import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';
import Modal from '../components/Modal';
import AdicionarCessao from "../components/AdicionarCessao";
import AdicionarCessionario from "../components/AdicionarCessionario";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { CessaoContext } from '../components/AdicionarCessao';

import { v4 as uuidv4 } from 'uuid';


export default function AllCessoes() {
  const [voltarAdicionarCessao, setVoltarAdicionarCessao] = useState(false)
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
  const [show, setShow] = useState(false)
  const [dataCessoes, setDataCessoes] = useState([])
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();
  const location = useLocation();

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
  
  const [cessionario, setCessionario] = useState(null);
  const [valorPago, setValorPago] = useState('');
  const [comissao, setComissao] = useState('');
  const [percentual, setPercentual] = useState('');
  const [expectativa, setExpectativa] = useState('');
  const [obs, setObs] = useState('');
  const [assinatura, setAssinatura] = useState(null);
  const [expedido, setExpedido] = useState(null);
  const [recebido, setRecebido] = useState(null);

  const [valoresCessionarios, setValoresCessionarios] = useState([])

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
        navigate('/', { state: { from: location }, replace: true });
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
    setShowModalAdicionarCessionario(true)
    if (voltarAdicionarCessao) {
      setVoltarAdicionarCessao(false)
      return
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
    // Atualize apenas os valores do componente com o ID correspondente
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
    // Filtra os cessionários com base no ID para removê-lo
    const novaListaCessionarios = cessionarios.filter(cessionario => cessionario.index !== id);
    setCessionarios(novaListaCessionarios);

    // Filtra os valores correspondentes com base no ID para removê-los
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
    setDataCessoes(data)
  }

  const handleShow = () => {
    setShow((prevState) => !prevState)


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
    setVoltarAdicionarCessao(true)
    setShowModalAdicionarCessionario(prevState => !prevState);
  }

  const handleReceberValoresCessao = (valores) => {
    // Atualiza os estados com os valores recebidos
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
    setJuridico(valores.juridico)
    // Atualize os outros estados conforme necessário
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cessao = {
      precatorio, processo, cedente, vara, ente, ano, natureza, empresa, dataCessao, repComercial, escrevente, juridico
    }

    console.log('submitado', cessao)

    console.log(cessionarios)
  }


  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative' : 'relative container mx-auto pt-[120px] dark:bg-neutral-900 h-full'}>
        <div className='px-[20px]'>
          <div className='flex justify-between items-center md:items-end'>
            <h2 className='font-[700] text-[32px] md:mt-[16px] dark:text-white' id='cessoes'>Cessões</h2>
            <Modal
              botaoAbrirModal={
                <button title='Adicionar nova cessão' className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:bg-neutral-800 dark:border-neutral-800 dark:hover:bg-neutral-700 rounded-full border text-[20px] p-1 lg:mb-0 lg:p-2 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px] '>
                  +
                </button>}
              tituloModal=
              {showModalAdicionarCessionario && cessionarios.length > 0
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
                <div className={showModalAdicionarCessionario && cessionarios.length !== 0 ? 'absolute left-[-1100px] transition-all ease-in-out duration-300 overflow-hidden' : 'absolute left-0 transition-all ease-in-out duration-300 overflow-y-hidden'}>
                  <AdicionarCessao varas={varas} orcamentos={orcamentos} naturezas={naturezas} empresas={empresas} users={users} teles={teles} escreventes={escreventes} juridicos={juridicos} enviarValores={handleReceberValoresCessao} />
                </div>

                <div className={showModalAdicionarCessionario && cessionarios.length !== 0 ? "absolute right-0 transition-all ease-in-out duration-300 overflow-y-auto w-full" : 'w-full absolute right-[1100px] transition-all ease-in-out duration-300 overflow-y-hidden'}>

                  <div className="w-full flex flex-col gap-10 divide-y dark:divide-neutral-600">
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



            </Modal>
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
