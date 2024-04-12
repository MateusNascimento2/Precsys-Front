import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from "../components/SearchInput";
import FilterMenuItem from "../components/FilterMenuItem";

export default function Filter({ show, onSetShow, onSelectedCheckboxesChange, dataCessoes }) {
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentosAnos, setOrcamentosAnos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [teles, setTeles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [subMenuType, setSubMenuType] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [todosOsInputsStatus, setTodosOsInputsStatus] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [checkedStatus, setCheckedStatus] = useState(() => {
    const savedChecked = localStorage.getItem('checkedStatus');
    return savedChecked ? JSON.parse(savedChecked) : [];
  });


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
    fetchData('/tele', setTeles);
    fetchData('/users', setUsers)

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);


  useEffect(() => {
    // Salva o estado dos checkboxes no localStorage sempre que houver uma mudança
    localStorage.setItem('checkedStatus', JSON.stringify(checkedStatus));
  }, [checkedStatus]);

  useEffect(() => {
    // Recupera o estado salvo do localStorage quando o componente é montado
    const savedCheckedStatus = JSON.parse(localStorage.getItem('checkedStatus')) || {};
    setCheckedStatus(savedCheckedStatus);
  }, []);


  teles.forEach((tele) => {
    const telesAtualizado = users.find(u => parseInt(tele.usuario_id) === parseInt(u.id));

    if (telesAtualizado) {
      tele.nome = telesAtualizado.nome;
    }
  })



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
  const handleMarkAllCheckboxInEnte = (event, orcamento_id) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;
    const checkboxesWithTheSameID = document.querySelectorAll(`input[type="checkbox"][data-budget-id="${orcamento_id}"]`)


    const checkboxValor = { [checkboxName]: checkboxValue }

    if (isChecked) {
      const updatedCheckedStatus = { ...checkedStatus, [checkboxValue]: isChecked }; // Adiciona o novo valor ao estado
      setCheckedStatus(updatedCheckedStatus); // Atualiza o estado com o novo valor marcado

      onSelectedCheckboxesChange(prevState => [...prevState, checkboxValor]);
      checkboxesWithTheSameID.forEach(checkbox => {
        checkbox.checked = true;
        const checkboxValorFilho = checkbox.value;
        const objCheckBoxFilho = { [checkboxName]: checkboxValorFilho };
        onSelectedCheckboxesChange(prevState => [...prevState, objCheckBoxFilho]);
        updatedCheckedStatus[checkboxValorFilho] = isChecked; // Atualize o objeto de estado temporário
      });
      setCheckedStatus(updatedCheckedStatus); // Atualize o estado com base na cópia atualizada
    } else {
      const updatedCheckedStatus = { ...checkedStatus }; // Crie uma cópia do estado atual
      updatedCheckedStatus[checkboxValue] = isChecked; // Atualize o estado temporário com o novo valor desmarcado
      setCheckedStatus(updatedCheckedStatus); // Atualize o estado com o novo valor desmarcado

      onSelectedCheckboxesChange(prevState => prevState.filter(item => item.ente_id !== checkboxValor.ente_id)); // Remova o item desmarcado do estado
      checkboxesWithTheSameID.forEach(checkbox => {
        checkbox.checked = false;
        const checkboxValorFilho = checkbox.value;
        const objCheckBoxFilho = { [checkboxName]: checkboxValorFilho };
        onSelectedCheckboxesChange(prevState => prevState.filter(item => item.ente_id !== objCheckBoxFilho.ente_id));
        delete updatedCheckedStatus[checkboxValorFilho];// Remova o item desmarcado do estado
      });
    }


  };


  const handleDataChange = (event) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;

    console.log(checkboxName);

    setCheckedStatus({ ...checkedStatus, [checkboxName]: checkboxValue });

    // Cria o objeto checkbox
    const checkbox = { [checkboxName]: checkboxValue };

    console.log(checkbox);

    onSelectedCheckboxesChange(prevState => {
      // Verifica se o valor do checkbox é vazio ('')
      if (checkboxValue === '') {
        // Remove o objeto com a mesma chave, se existir
        delete prevState[checkboxName];
      } else {
        // Verifica se o checkbox já existe no estado
        const existingCheckbox = prevState.find(item => Object.keys(item)[0] === checkboxName);
        // Se o checkbox já existe, atualiza seu valor
        if (existingCheckbox) {
          existingCheckbox[checkboxName] = checkboxValue;
        } else {
          // Caso contrário, adiciona o checkbox ao estado
          prevState.push(checkbox);
        }
      }
      // Retorna o novo estado
      return [...prevState];
    });
  };


  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;

    console.log(checkboxValue)

    setCheckedStatus({ ...checkedStatus, [checkboxValue]: isChecked });


    const checkbox = { [checkboxName]: checkboxValue }

    console.log(checkbox)

    if (isChecked) {
      onSelectedCheckboxesChange(prevState => [...prevState, checkbox])
    } else {
      onSelectedCheckboxesChange(prevState => prevState.filter(item => {
        const [key] = Object.keys(item); // Obtém a chave do objeto
        return item[key] !== checkboxValue; // Filtra com base no valor da chave do objeto
      }));
    }

  }

  const handleClearCheckbox = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checkbox.checked = false;
      }
    })

    document.getElementById('data_cessao_inicial').value = "";
    document.getElementById('data_cessao_final').value = "";

    onSelectedCheckboxesChange([]);
    setCheckedStatus({});
  }

  const filteredEnte = orcamentos.filter(orcamento =>
    Object.entries(orcamento).some(([key, value]) =>
      value && typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const anuencia = ["Sem anuência", "Honorários", "Com anuência", "Quitação"]
  const obito = ["Vivo", "Não deixou bens", "Deixou bens", "Herdeiros habilitados"]

  return (
    <>
      <div onClick={handleShow} className={show ? "bg-neutral-800 opacity-60 w-screen h-screen fixed top-0 z-[51] transition-opacity duration-300 left-0 lg:hidden" : 'h-screen top-[9999px] bg-neutral-800 opacity-0 w-screen fixed transition-opacity duration-[700] left-0'}>
      </div>
      <div className={show ? "bg-white dark:bg-neutral-900 h-full w-screen fixed z-[60] top-[15%] transition-all ease-in-out duration-[0.3s] shadow rounded-t-[20px] lg:bg-transparent lg:border-r dark:border-neutral-700 lg:transition-none lg:rounded-none lg:w-[300px] lg:relative lg:shadow-none lg:mt-5 lg:h-full lg:z-0 left-0" : 'top-[100%] transition-all ease-in-out duration-[0.3s] w-screen fixed bg-white dark:bg-neutral-900 h-full left-0'}>
        <div className="p-4 lg:p-0 lg:px-2">
          <div className="flex items-center justify-between ">
            <span className="font-[700] dark:text-white">Filtros</span>
            <span className="cursor-pointer hover:rounded p-1 text-black hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white" onClick={() => handleClearCheckbox()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="122.88"
                height="110.668"
                x="0"
                y="0"
                version="1.1"
                viewBox="0 0 122.88 110.668"
                xmlSpace="preserve"
                className="w-5 h-5 dark:fill-white fill-black"
              >
                <path
                  fillRule="evenodd"
                  d="M91.124 15.645c12.928 0 23.406 10.479 23.406 23.406s-10.479 23.406-23.406 23.406-23.406-10.479-23.406-23.406c0-12.926 10.479-23.406 23.406-23.406zM2.756 0h117.322a2.801 2.801 0 012.802 2.802 2.75 2.75 0 01-.996 2.139l-10.667 13.556a28.777 28.777 0 00-4.614-3.672l6.628-9.22H9.43l37.975 46.171c.59.516.958 1.254.958 2.102v49.148l21.056-9.623V57.896a28.914 28.914 0 005.642 4.996v32.133a2.735 2.735 0 01-1.586 2.506l-26.476 12.758a2.753 2.753 0 01-3.798-1.033 2.74 2.74 0 01-.368-1.4V55.02L.803 4.756a2.825 2.825 0 010-3.945A2.731 2.731 0 012.756 0zM96.93 28.282a3.388 3.388 0 014.825-.013 3.47 3.47 0 01.013 4.872l-5.829 5.914 5.836 5.919c1.317 1.338 1.299 3.506-.04 4.843-1.34 1.336-3.493 1.333-4.81-.006l-5.797-5.878-5.807 5.889a3.39 3.39 0 01-4.826.013 3.47 3.47 0 01-.013-4.872l5.83-5.913-5.836-5.919c-1.317-1.338-1.3-3.507.04-4.843a3.385 3.385 0 014.81.006l5.796 5.878 5.808-5.89z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </div>

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
              <div className={showMenu && menuType === 'status' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[210px] overflow-y-hidden transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                {status.map((s) => (
                  <div className="flex items-center gap-2" key={s.id}>
                    <input type="checkbox" name={"status"} id={s.nome} value={s.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[s.nome] || false} />
                    <span
                      className={showMenu && menuType === 'status' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                        stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"></path>
                      </svg>
                    </span>
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

                <div className={showMenu && menuType === 'ente' ? 'mt-2 pl-2 flex flex-col gap-2 text-[12px] h-[350px] transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>

                  <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-1'} />

                  <div className="flex flex-col gap-2 overflow-y-scroll ">

                    {filteredEnte.map((orcamento) => (

                      <div key={orcamento.id}>
                        <div>
                          <div className="cursor-pointer">
                            <div className="flex items-center gap-2 ">
                              <div className="relative">
                                <input type="checkbox" name={"ente_id"} id={orcamento.id} value={orcamento.apelido} className="peer relative h-[18px] w-[18px] cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleMarkAllCheckboxInEnte(e, orcamento.id)} checked={checkedStatus[orcamento.apelido] || false} />
                                <span
                                  className="absolute left-[1px] right-0 top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                                    stroke="currentColor" strokeWidth="1">
                                    <path fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"></path>
                                  </svg>
                                </span>
                              </div>


                              <div className="w-full flex items-center justify-between pr-3" onClick={() => handleSubMenu(orcamento.apelido)}>
                                <p>{orcamento.apelido}</p>
                                <span className='text-[12px] '>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubMenu && subMenuType === orcamento.apelido ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={showSubMenu && subMenuType === orcamento.apelido ? "border-l dark:border-neutral-600 px-2 flex flex-col gap-1 mt-1 h-full" : 'hidden h-0 overflow-hidden '}>
                            {orcamentosAnos.map((orcamentoAno) => (

                              parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id) ? (
                                <div className="flex items-center gap-2 overflow-hidden" key={orcamentoAno.id}>
                                  <div className="relative">
                                    <input type="checkbox" name={"ente_id"} id={orcamento.apelido + " - " + orcamentoAno.ano} value={orcamento.apelido + " - " + orcamentoAno.ano} data-budget-id={orcamentoAno.budget_id} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e, orcamento.id, orcamentoAno.budget_id)} checked={checkedStatus[orcamento.apelido + " - " + orcamentoAno.ano] || false} />
                                    <span
                                      className="absolute left-0 right-0 top-[1px] text-white transition-opacity hidden pointer-events-none peer-checked:block dark:text-black">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                                        stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"></path>
                                      </svg>
                                    </span>
                                  </div>

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
              <div className={showMenu && menuType === 'empresa' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[165px] overflow-y-hidden transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                {empresas.map((empresa) => (
                  <div className="flex items-center gap-2" key={empresa.id}>
                    <input type="checkbox" name={'empresa_id'} id={empresa.nome} value={empresa.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[empresa.nome] || false} />
                    <span
                      className={showMenu && menuType === 'empresa' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px] dark:text-black" viewBox="0 0 20 20" fill="currentColor"
                        stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"></path>
                      </svg>
                    </span>
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

                <div className={showMenu && menuType === 'natureza' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[50px] overflow-y-hidden transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                  {natureza.map((na) => (
                    <div className="flex items-center gap-2" key={na.id}>
                      <input type="checkbox" name={"natureza"} id={na.nome} value={na.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[na.nome] || false} />
                      <span
                        className={showMenu && menuType === 'natureza' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <label htmlFor={na.nome} key={na.id}>{na.nome}</label>
                    </div>

                  ))}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">
              <div>
                <div onClick={() => handleMenu('anuencia')} className="flex justify-between items-center cursor-pointer">
                  <span>Anuência</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'anuencia' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'anuencia' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[100px] overflow-y-hidden transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                  {anuencia.map((an) => (
                    <div className="flex items-center gap-2" key={an}>
                      <input type="checkbox" name={"adv"} id={an} value={an} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[an] || false} />
                      <span
                        className={showMenu && menuType === 'anuencia' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <label htmlFor={an} key={an}>{an}</label>
                    </div>

                  ))}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">
              <div>
                <div onClick={() => handleMenu('obito')} className="flex justify-between items-center cursor-pointer">
                  <span>Óbito</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'obito' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'obito' ? 'mt-2 pl-2 flex flex-col gap-2 text-[12px] h-[105px] overflow-y-hidden transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                  {obito.map((ob) => (
                    <div className="flex items-center gap-2" key={ob}>
                      <input type="checkbox" name={"falecido"} id={ob} value={ob} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[ob] || false} />
                      <span
                        className={showMenu && menuType === 'obito' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <label htmlFor={ob} key={ob}>{ob}</label>
                    </div>

                  ))}
                </div>


              </div>
            </div>

            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">
              <div>
                <div onClick={() => handleMenu('rep_comercial')} className="flex justify-between items-center cursor-pointer">
                  <span>Rep. Comercial</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'rep_comercial' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'rep_comercial' ? 'mt-2 pl-2 flex flex-col gap-2 text-[12px] h-[200px] lg:h-[250px] overflow-y-scroll transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                  {teles.map((tele) => (
                    <div className="flex items-center gap-2 relative" key={tele.usuario_id}>
                      <input type="checkbox" name={"tele_id"} id={tele.id} value={tele.usuario_id} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[tele.usuario_id] || false} />
                      <span
                        className={showMenu && menuType === 'rep_comercial' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <label htmlFor={tele.nome} key={tele.id}>{tele.nome}</label>
                    </div>

                  ))}
                </div>


              </div>
            </div>

            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">
              <div>
                <div onClick={() => handleMenu('data_cessao')} className="flex justify-between items-center cursor-pointer">
                  <span>Data da Cessão</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'data_cessao' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'data_cessao' ? 'mt-2 pl-2 flex flex-col gap-2 h-[100px] transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2  border-l dark:border-neutral-600'}>
                  <div className="flex flex-col gap-2 justify-between text-neutral-600 py-3">
                    <div className="flex justify-between border rounded px-2 py-1 items-center">
                      <label htmlFor="dataInicio" className="text-[12px] font-bold">Data Inicial:</label>
                      <input className="text-[12px] outline-none" type="date" name="dataInicio" id="data_cessao_inicial" min={dataCessoes[0]} max={dataCessoes[dataCessoes.length - 1]} onChange={(e) => handleDataChange(e)} value={checkedStatus.dataInicio || false} />
                    </div>
                    <div className="flex justify-between border rounded px-2 py-1 items-center">
                      <label htmlFor="dataInicio" className="text-[12px] font-bold">Data Final:</label>
                      <input className="text-[12px] outline-none" type="date" name="dataFim" id="data_cessao_final" min={dataCessoes[0]} max={dataCessoes[dataCessoes.length - 1]} onChange={(e) => handleDataChange(e)} value={checkedStatus.dataFim || false} />
                    </div>


                  </div>
                </div>


              </div>
            </div>



          </div>
        </div>

      </div >
    </>

  )
}