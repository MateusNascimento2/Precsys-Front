import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from "../components/SearchInput";

export default function FilterPerfil({ show, onSetShow, onSelectedCheckboxesChange, dataCessoes }) {
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
  const [showSubSubMenu, setShowSubSubMenu] = useState(false);
  const [subSubMenuType, setSubSubMenuType] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [todosOsInputsStatus, setTodosOsInputsStatus] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [comarcasChecked, setComarcasChecked] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState(() => {
    const savedChecked = localStorage.getItem('checkedStatus');
    return savedChecked ? JSON.parse(savedChecked) : [];
  });

  const axiosPrivate = useAxiosPrivate();

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
      }
    };
    fetchData('/status', setStatus);
    fetchData('/orcamentos', setOrcamentos);
    fetchData('/orcamentosAnos', setOrcamentosAnos);
    fetchData('/natureza', setNatureza);
    fetchData('/empresas', setEmpresas);
    fetchData('/tele', setTeles);
    fetchData('/users', setUsers);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  useEffect(() => {
    localStorage.setItem('checkedStatus', JSON.stringify(checkedStatus));
  }, [checkedStatus]);

  useEffect(() => {
    const savedCheckedStatus = JSON.parse(localStorage.getItem('checkedStatus')) || {};
    setCheckedStatus(savedCheckedStatus);
  }, []);

  teles.forEach((tele) => {
    const telesAtualizado = users.find(u => parseInt(tele.usuario_id) === parseInt(u.id));
    if (telesAtualizado) {
      tele.nome = telesAtualizado.nome;
    }
  });

  const handleShow = () => {
    onSetShow((prevState) => !prevState);
  };

  function handleMenu(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState);
    } else {
      setShowMenu(true);
      setMenuType(type);
    }

    if (showSubSubMenu === true) {
      setShowSubSubMenu(false);
    }
  }

  function handleSubMenu(type) {
    if (subMenuType === type) {
      setShowSubMenu(prevState => !prevState);
    } else {
      setShowSubMenu(true);
      setSubMenuType(type);
    }
  }

  function handleSubSubMenu(type) {
    if (subSubMenuType === type) {
      setShowSubSubMenu(prevState => !prevState);
    } else {
      setShowSubSubMenu(true);
      setSubSubMenuType(type);
    }
  }

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  const handleComarcasCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    console.log(isChecked);
    setComarcasChecked(isChecked);

    const updatedCheckedStatus = filteredEnte.reduce((acc, orcamento) => {
      orcamentosAnos.forEach(orcamentoAno => {
        if (orcamento.obs === '1' && parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id)) {
          acc[orcamento.apelido] = isChecked;
          acc[orcamento.apelido + " - " + orcamentoAno.ano] = isChecked;
        }
      });
      return acc;
    }, { ...checkedStatus });

    filteredEnte.forEach((orcamento) => {
      if (orcamento.obs === '1') {
        const inputElement = document.getElementById(orcamento.id);
        if (inputElement) {
          inputElement.checked = isChecked;
          handleMarkAllCheckboxInEnte({ target: inputElement }, orcamento.id);
        } else {
          console.warn(`Elemento com ID ${orcamento.id} não encontrado.`);
        }
      }
    });

    setCheckedStatus(updatedCheckedStatus);
  };

  const handleMarkAllCheckboxInEnte = (event, orcamento_id) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;

    const checkboxesWithTheSameID = document.querySelectorAll(`input[type="checkbox"][data-budget-id="${orcamento_id}"]`);

    const checkboxValor = { [checkboxName]: checkboxValue };

    if (isChecked) {
      const updatedCheckedStatus = { ...checkedStatus, [checkboxValue]: isChecked };
      setCheckedStatus(updatedCheckedStatus);
      onSelectedCheckboxesChange(prevState => [...prevState, checkboxValor]);
      checkboxesWithTheSameID.forEach(checkbox => {
        checkbox.checked = true;
        const checkboxValorFilho = checkbox.value;
        const objCheckBoxFilho = { [checkboxName]: checkboxValorFilho };
        onSelectedCheckboxesChange(prevState => [...prevState, objCheckBoxFilho]);
        updatedCheckedStatus[checkboxValorFilho] = isChecked;
      });
      setCheckedStatus(updatedCheckedStatus);
    } else {
      const updatedCheckedStatus = { ...checkedStatus };
      updatedCheckedStatus[checkboxValue] = isChecked;
      setCheckedStatus(updatedCheckedStatus);

      onSelectedCheckboxesChange(prevState => prevState.filter(item => item.ente_id !== checkboxValor.ente_id));
      checkboxesWithTheSameID.forEach(checkbox => {
        checkbox.checked = false;
        const checkboxValorFilho = checkbox.value;
        const objCheckBoxFilho = { [checkboxName]: checkboxValorFilho };
        onSelectedCheckboxesChange(prevState => prevState.filter(item => item.ente_id !== objCheckBoxFilho.ente_id));
        delete updatedCheckedStatus[checkboxValorFilho];
      });
    }
  };

  const handleDataChange = (event) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;

    setCheckedStatus({ ...checkedStatus, [checkboxName]: checkboxValue });

    const checkbox = { [checkboxName]: checkboxValue };

    onSelectedCheckboxesChange(prevState => {
      if (checkboxValue === '') {
        delete prevState[checkboxName];
      } else {
        const existingCheckbox = prevState.find(item => Object.keys(item)[0] === checkboxName);
        if (existingCheckbox) {
          existingCheckbox[checkboxName] = checkboxValue;
        } else {
          prevState.push(checkbox);
        }
      }
      return [...prevState];
    });
  };

  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;

    setCheckedStatus({ ...checkedStatus, [checkboxValue]: isChecked });

    const checkbox = { [checkboxName]: checkboxValue };

    if (isChecked) {
      onSelectedCheckboxesChange(prevState => [...prevState, checkbox]);
    } else {
      onSelectedCheckboxesChange(prevState => prevState.filter(item => {
        const [key] = Object.keys(item);
        return item[key] !== checkboxValue;
      }));
    }
  };

  const handleClearCheckbox = () => {
    setComarcasChecked(false);

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checkbox.checked = false;
      }
    });

    const dataCessaoInicial = document.getElementById('data_cessao_inicial');
    const dataCessaoFinal = document.getElementById('data_cessao_final');

    if (dataCessaoInicial) {
      dataCessaoInicial.value = "";
    }
    if (dataCessaoFinal) {
      dataCessaoFinal.value = "";
    }

    onSelectedCheckboxesChange([]);
    setCheckedStatus({});
  };

  const filteredEnte = orcamentos.filter(orcamento =>
    Object.entries(orcamento).some(([key, value]) =>
      value && typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const anuencia = ["Sem anuência", "Honorários", "Com anuência", "Quitação"];
  const obito = ["Vivo", "Não deixou bens", "Deixou bens", "Herdeiros habilitados", "Solicitada habilitação"];

  return (
    <>
      {show && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleShow}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg z-60 max-w-lg w-full overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-lg dark:text-white">Filtros</span>
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

                <button
                  className="text-black dark:text-white"
                  onClick={handleShow}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('status')}>
                    <span className="text-gray-700 dark:text-neutral-300">Status</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'status' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'status' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        {status.map((s) => (
                          <div className="flex items-center gap-2" key={s.id}>
                            <input type="checkbox" name={"status"} id={s.nome} value={s.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[s.nome] || false} />
                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                            <label htmlFor={s.nome} key={s.id} className="dark:text-neutral-300">{s.nome}</label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('ente')}>
                    <span className="text-gray-700 dark:text-neutral-300">Ente</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'ente' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'ente' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-1'} />
                        <div className="flex flex-col gap-2 overflow-y-auto">
                          {filteredEnte.map((orcamento) => (
                            orcamento.obs === '0'
                              ? (
                                <div key={orcamento.id}>
                                  <div className="cursor-pointer">
                                    <div className="flex items-center gap-2 ">
                                      <div className="relative">
                                        <input type="checkbox" name={"ente_id"} id={orcamento.id} value={orcamento.apelido} className="peer relative h-[18px] w-[18px] cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleMarkAllCheckboxInEnte(e, orcamento.id)} checked={checkedStatus[orcamento.apelido] || false} />
                                        <span className="absolute left-[1px] right-0 top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                          </svg>
                                        </span>
                                      </div>
                                      <div className="w-full flex items-center justify-between pr-3" onClick={() => handleSubMenu(orcamento.apelido)}>
                                        <p className="dark:text-white">{orcamento.apelido}</p>
                                        <span className="text-[12px]">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubMenu && subMenuType === orcamento.apelido ? "w-3 h-3 inline-block rotate-180 dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {showSubMenu && subMenuType === orcamento.apelido && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-l dark:border-neutral-600 px-2 flex flex-col gap-1 mt-1 h-full"
                                      >
                                        {orcamentosAnos.map((orcamentoAno) => (
                                          parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id) ? (
                                            <div className="flex items-center gap-2 overflow-hidden" key={orcamentoAno.id}>
                                              <div className="relative">
                                                <input type="checkbox" name={"ente_id"} id={orcamento.apelido + " - " + orcamentoAno.ano} value={orcamento.apelido + " - " + orcamentoAno.ano} data-budget-id={orcamentoAno.budget_id} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e, orcamento.id, orcamentoAno.budget_id)} checked={checkedStatus[orcamento.apelido + " - " + orcamentoAno.ano] || false} />
                                                <span className="absolute left-0 right-0 top-[1px] text-white transition-opacity hidden pointer-events-none peer-checked:block dark:text-black">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                  </svg>
                                                </span>
                                              </div>
                                              <p key={orcamentoAno.id} className="dark:text-white">{orcamentoAno.ano}</p>
                                            </div>
                                          ) : null
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>)
                              : (null)
                          ))}
                          <div>
                            <div className="cursor-pointer">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <input type="checkbox" name={"comarcas"} className="peer relative h-[18px] w-[18px] cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleComarcasCheckboxChange(e)} checked={comarcasChecked} />
                                  <span className="absolute left-[1px] right-0 top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                  </span>
                                </div>
                                <div className="w-full flex items-center justify-between pr-3" onClick={() => handleSubSubMenu('comarcas')}>
                                  <p className="dark:text-white">Comarcas</p>
                                  <span className="text-[12px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubSubMenu && subSubMenuType === 'comarcas' ? "w-3 h-3 inline-block rotate-180 dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <AnimatePresence>
                              {showSubSubMenu && subSubMenuType === 'comarcas' && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex flex-col border-l pl-2 pt-1 dark:border-neutral-600"
                                >
                                  {filteredEnte.map((orcamento) => (
                                    orcamento.obs === '1'
                                      ? (
                                        <div key={orcamento.id}>
                                          <div className="cursor-pointer">
                                            <div className="flex items-center gap-2 " onClick={() => handleSubMenu(orcamento.apelido)}>
                                              <div className="relative">
                                                <input type="checkbox" name={"ente_id"} id={orcamento.id} data-iscomarca={orcamento.obs} value={orcamento.apelido} className="peer relative h-[18px] w-[18px] cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleMarkAllCheckboxInEnte(e, orcamento.id)} checked={checkedStatus[orcamento.apelido] || false} />
                                                <span className="absolute left-[1px] right-0 top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                  </svg>
                                                </span>
                                              </div>
                                              <div className="w-full flex items-center justify-between pr-3">
                                                <p className="mb-[2px] dark:text-white">{orcamento.apelido}</p>
                                                <span className="text-[12px]">
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubMenu && subMenuType === orcamento.apelido ? "w-3 h-3 inline-block rotate-180 dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                  </svg>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <AnimatePresence>
                                            {showSubMenu && subMenuType === orcamento.apelido && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-l dark:border-neutral-600 px-2 flex flex-col mt-1 h-full"
                                              >
                                                {orcamentosAnos.map((orcamentoAno) => (
                                                  parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id) ? (
                                                    <div className="flex items-center gap-2 overflow-hidden" key={orcamentoAno.id}>
                                                      <div className="relative">
                                                        <input type="checkbox" name={"ente_id"} id={orcamento.apelido + " - " + orcamentoAno.ano} value={orcamento.apelido + " - " + orcamentoAno.ano} data-budget-id={orcamentoAno.budget_id} data-iscomarca={orcamento.obs} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e, orcamento.id, orcamentoAno.budget_id)} checked={checkedStatus[orcamento.apelido + " - " + orcamentoAno.ano] || false} />
                                                        <span className="absolute left-0 right-0 top-[1px] text-white transition-opacity hidden pointer-events-none peer-checked:block dark:text-black">
                                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                          </svg>
                                                        </span>
                                                      </div>
                                                      <p className="mb-[2px] dark:text-white" key={orcamentoAno.id}>{orcamentoAno.ano}</p>
                                                    </div>
                                                  ) : null
                                                ))}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>)
                                      : (null)
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('empresa')}>
                    <span className="text-gray-700 dark:text-neutral-300">Empresa</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'empresa' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'empresa' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        {empresas.map((empresa) => (
                          <div className="flex items-center gap-2" key={empresa.id}>
                            <input type="checkbox" name={'empresa_id'} id={empresa.nome} value={empresa.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[empresa.nome] || false} />
                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                            <label htmlFor={empresa.nome} key={empresa.id} className="dark:text-neutral-300">{empresa.nome}</label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('natureza')}>
                    <span className="text-gray-700 dark:text-neutral-300">Natureza</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'natureza' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'natureza' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        {natureza.map((na) => (
                          <div className="flex items-center gap-2" key={na.id}>
                            <input type="checkbox" name={"natureza"} id={na.nome} value={na.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[na.nome] || false} />
                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                            <label htmlFor={na.nome} key={na.id} className="dark:text-neutral-300">{na.nome}</label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('anuencia')}>
                    <span className="text-gray-700 dark:text-neutral-300">Anuência</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'anuencia' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'anuencia' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        {anuencia.map((an) => (
                          <div className="flex items-center gap-2" key={an}>
                            <input type="checkbox" name={"adv"} id={an} value={an} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[an] || false} />
                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                            <label htmlFor={an} key={an} className="dark:text-neutral-300">{an}</label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('obito')}>
                    <span className="text-gray-700 dark:text-neutral-300">Óbito</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'obito' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'obito' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        {obito.map((ob) => (
                          <div className="flex items-center gap-2" key={ob}>
                            <input type="checkbox" name={"falecido"} id={ob} value={ob} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[ob] || false} />
                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                            <label htmlFor={ob} key={ob} className="dark:text-neutral-300">{ob}</label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('rep_comercial')}>
                    <span className="text-gray-700 dark:text-neutral-300">Rep. Comercial</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'rep_comercial' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'rep_comercial' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-auto cursor-default border-l dark:border-neutral-600"
                      >
                        {teles.map((tele) => (
                          <div className="flex items-center gap-2 relative" key={tele.usuario_id}>
                            <input type="checkbox" name={"tele_id"} id={tele.id} value={tele.usuario_id} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[tele.usuario_id] || false} />
                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                            <label htmlFor={tele.nome} key={tele.id} className="dark:text-neutral-300">{tele.nome}</label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => handleMenu('data_cessao')}>
                    <span className="text-gray-700 dark:text-neutral-300">Data da Cessão</span>
                    <span className="text-[12px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'data_cessao' ? "w-3 h-3 inline-block rotate-180 transition-all dark:text-white" : 'w-3 h-3 inline-block dark:text-white'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                  <AnimatePresence>
                    {showMenu && menuType === 'data_cessao' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-2 flex flex-col gap-2 h-full max-h-[300px] cursor-default border-l dark:border-neutral-600"
                      >
                        <div className="flex flex-col gap-2 justify-between text-neutral-600 dark:text-neutral-400 py-3">
                          <div className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
                            <label htmlFor="dataInicio" className="text-[12px] font-bold">Data Inicial:</label>
                            <input className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded" type="date" name="dataInicio" id="data_cessao_inicial" min={dataCessoes[0]} max={dataCessoes[dataCessoes.length - 1]} onChange={(e) => handleDataChange(e)} value={checkedStatus.dataInicio || ''} />
                          </div>
                          <div className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
                            <label htmlFor="dataInicio" className="text-[12px] font-bold">Data Final:</label>
                            <input className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded" type="date" name="dataFim" id="data_cessao_final" min={dataCessoes[0]} max={dataCessoes[dataCessoes.length - 1]} onChange={(e) => handleDataChange(e)} value={checkedStatus.dataFim || ''} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}