import React, { useState, useEffect } from 'react'
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

export default function AllCessoes() {
  const [varas, setVaras] = useState([]);
  const [teles, setTeles] = useState([]);
  const [users, setUsers] = useState([]);
  const [escreventes, setEscreventes] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
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
    fetchData('/natureza', setNatureza);
    fetchData('/empresas', setEmpresas);


    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);


  const addCessionario = () => {
    setShowModalAdicionarCessionario(true)
    const novoCessionario = <AdicionarCessionario key={cessionarios.length} users={users} />;
    setCessionarios([...cessionarios, novoCessionario]);
  }

  const handleExcluirCessionario = (index) => {
    const novaLista = [...cessionarios];
    novaLista.splice(index, 1);
    setCessionarios(novaLista);
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

  const scroll = (id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative' : 'relative container mx-auto pt-[120px] dark:bg-neutral-900 h-full'}>
        <div className='px-[20px]'>
          <div className='flex justify-between items-end'>
            <h2 className='font-[700] text-[32px] mt-[16px] dark:text-white' id='cessoes'>Cessões</h2>
            <Modal
              botaoAbrirModal={
                <button title='Adicionar nova cessão' className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:bg-neutral-800 dark:border-neutral-800 dark:hover:bg-neutral-700 rounded-full border text-[20px] p-1 lg:mb-0 lg:p-2 md:text-[24px] w-[30px] h-[30px] md:w-[40px] md:h-[40px] '>
                  +
                </button>}
              tituloModal={'Adicionar cessão'}
              botaoSalvar={<button
                onClick={(e) => handleAddCessionario(e)}
                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                Salvar
              </button>
              }
              botaoAdicionarCessionario={<button
                onClick={() => addCessionario()}
                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                Adicionar cessionário
              </button>}
            >
              <div className="">
                <AdicionarCessao varas={varas} orcamentos={orcamentos} naturezas={natureza} empresas={empresas} users={users} teles={teles} escreventes={escreventes} />
              </div>

              <div className={showModalAdicionarCessionario && cessionarios.length !== 0 ? "pt-2 mt-[40px] border-t" : 'hidden'}>

                <div className="flex flex-col gap-10">
                  {cessionarios.map((componente, index) => (
                    <div key={index}>
                      <div className='px-4 flex justify-between'>
                        <p className='dark:text-white text-black font-medium py-2 text-[18px]'>Adicionar cessionário</p>
                        <button onClick={() => handleExcluirCessionario(index)} className='rounded hover:bg-neutral-100 float-right dark:hover:bg-neutral-800'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 dark:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {componente}
                    </div>
                  ))}
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
