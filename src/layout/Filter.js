import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from "../components/SearchInput";
import FilterMenuItem from "../components/FilterMenuItem";

export default function Filter({ show, onSetShow, onSelectedCheckboxesChange }) {
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentosAnos, setOrcamentosAnos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [subMenuType, setSubMenuType] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

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
      } catch (err) {
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    };
    fetchData('/status', setStatus);
    fetchData('/orcamentos', setOrcamentos);
    fetchData('/orcamentosAnos', setOrcamentosAnos);
    fetchData('/natureza', setNatureza);
    fetchData('/empresas', setEmpresas);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleShow = () => {
    onSetShow((prevState) => !prevState)
  }

  function handleMenu(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState)

    } else {
      setShowMenu(true);
      setMenuType(type);

    }
  }

  function handleSubMenu(type) {
    if (subMenuType === type) {
      setShowSubMenu(prevState => !prevState)

    } else {
      setShowSubMenu(true);
      setSubMenuType(type);

    }
  }

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  // Função para lidar com a seleção/deseleção de um checkbox
  const handleCheckboxChange = (event, budget_id, orcamento_id) => {
    const checkboxName = event.target.name;
    const isChecked = event.target.checked;

    console.log(checkboxName)


    // Verifica se o checkbox foi marcado ou desmarcado e atualiza o estado em conformidade
    if (isChecked && parseInt(budget_id) === parseInt(orcamento_id)) {

      const apelidoCheckBox = document.getElementById(orcamento_id);

      apelidoCheckBox.checked = true;
      setSelectedCheckboxes(prevState => [...prevState, checkboxName])
      onSelectedCheckboxesChange(prevState => [...prevState, checkboxName])
      

    } else if (isChecked) {

      setSelectedCheckboxes(prevState => [...prevState, checkboxName])
      onSelectedCheckboxesChange(prevState => [...prevState, checkboxName]);

    } else {
      onSelectedCheckboxesChange(prevState => prevState.filter(item => item !== checkboxName));
      setSelectedCheckboxes(prevState => prevState.filter(item => item !== checkboxName))

    }
  };





  const filteredEnte = orcamentos.filter(orcamento =>
    Object.entries(orcamento).some(([key, value]) =>
      value && typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div onClick={handleShow} className={show ? "bg-neutral-800 opacity-60 w-screen h-screen fixed top-0 z-[51] transition-opacity duration-300 left-0 lg:hidden" : 'h-screen top-[9999px] bg-neutral-800 opacity-0 w-screen fixed transition-opacity duration-[700] left-0'}>
      </div>
      <div className={show ? "bg-white dark:bg-neutral-900 h-full w-screen fixed z-[60] top-[15%] transition-all ease-in-out duration-[0.3s] shadow rounded-t-[20px] lg:bg-transparent lg:border-r dark:border-neutral-700 lg:transition-none lg:rounded-none lg:w-[300px] lg:relative lg:shadow-none lg:mt-5 lg:h-full lg:z-0 left-0" : 'top-[100%] transition-all ease-in-out duration-[0.3s] w-screen fixed bg-white dark:bg-neutral-900 h-full left-0'}>
        <div className="p-4 lg:p-0 lg:px-2">
          <span className="font-[700] dark:text-white">Filtros:</span>
          <div className="mt-4 flex flex-col gap-2 lg:divide-y dark:divide-neutral-700">
            <div className="rounded px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('status')} className="flex justify-between items-center cursor-pointer">
                  <span>Status</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'status' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className={showMenu && menuType === 'status' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[210px] overflow-y-hidden transition-all cursor-default border-l' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l'}>
                {status.map((s) => (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name={s.nome} id={s.nome} className="accent-black mb-[1px]" onClick={(e) => handleCheckboxChange(e)} />
                    <label htmlFor={s.nome} key={s.id}>{s.nome}</label>
                  </div>

                ))}
              </div>
            </div>
            <div className=" px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">

              <div className="cursor-pointer">
                <div onClick={() => handleMenu('ente')} className="flex items-center justify-between">
                  <span>Ente</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'ente' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'ente' ? 'mt-2 pl-2 flex flex-col gap-2 text-[12px] h-[250px] transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-hidden transition-all flex flex-col gap-2 text-[12px] border-l'}>

                  <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-1'} />

                  <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-300 dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-300">

                    {filteredEnte.map((orcamento) => (

                      <div>
                        <div>
                          <div className="cursor-pointer">
                            <div className="flex items-center gap-2 ">
                              <input type="checkbox" name={orcamento.apelido} id={orcamento.id} className="accent-black mb-[1px]" onClick={(e) => handleCheckboxChange(e)} />
                              <div className="w-full flex items-center justify-between" onClick={() => handleSubMenu(orcamento.apelido)}>
                                <p>{orcamento.apelido}</p>
                                <span className='text-[12px] '>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubMenu && subMenuType === orcamento.apelido ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={showSubMenu && subMenuType === orcamento.apelido ? "border-l dark:border-neutral-600 px-2 flex flex-col gap-1 mt-1 h-full" : 'h-0 overflow-hidden '}>
                            {orcamentosAnos.map((orcamentoAno) => (

                              parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id) ? (
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" name={orcamento.apelido + " " + orcamentoAno.ano} id={orcamentoAno.ano} className="accent-black mb-[1px]" onClick={(e) => handleCheckboxChange(e, orcamentoAno.budget_id, orcamento.id)} />
                                  <p key={orcamentoAno.id}>{orcamentoAno.ano}</p>
                                </div>
                              ) : null
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}

                  </div>
                </div>
              </div>



            </div>
            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('empresa')} className="flex justify-between items-center cursor-pointer">
                  <span>Empresa</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'empresa' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className={showMenu && menuType === 'empresa' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[165px] overflow-y-hidden transition-all cursor-default border-l' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l'}>
                {empresas.map((empresa) => (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name={empresa.nome} id={empresa.nome} className="accent-black mb-[1px]" onClick={(e) => handleCheckboxChange(e)} />
                    <label htmlFor={empresa.nome} key={empresa.id}>{empresa.nome}</label>
                  </div>


                ))}
              </div>
            </div>
            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">
              <div>
                <div onClick={() => handleMenu('natureza')} className="flex justify-between items-center cursor-pointer">
                  <span>Natureza</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'natureza' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'natureza' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[50px] overflow-y-hidden transition-all cursor-default border-l' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l'}>
                  {natureza.map((na) => (
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name={na.nome} id={na.nome} className="accent-black mb-[1px]" onClick={(e) => handleCheckboxChange(e)} />
                      <label htmlFor={na.nome} key={na.id}>{na.nome}</label>
                    </div>

                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>

  )
}