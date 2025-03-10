import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from "../components/SearchInput";
import useAuth from "../hooks/useAuth";
import Modal from "../components/Modal";

export default function Filter({ show, onSetShow, onSelectedCheckboxesChange, dataCessoes, onExportPDF, onExportExcel, onFieldSelectionChange,
  selectedExportFields,
}) {
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
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
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
    setComarcasChecked(isChecked);

    const updatedCheckedStatus = { ...checkedStatus };

    filteredEnte.forEach((orcamento) => {
      if (orcamento.obs === '1') {
        // Marca/desmarca o item principal (ex.: "M. Cachoeiras de Macacu")
        updatedCheckedStatus[orcamento.apelido] = isChecked;

        // Marca/desmarca os subitens (ex.: "2019")
        orcamentosAnos.forEach((orcamentoAno) => {
          if (parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id)) {
            const key = `${orcamento.apelido} - ${orcamentoAno.ano}`;
            updatedCheckedStatus[key] = isChecked;
          }
        });
      }
    });

    setCheckedStatus(updatedCheckedStatus);

    // Atualiza a lista de checkboxes selecionados
    if (isChecked) {
      const newSelections = [
        ...filteredEnte
          .filter((orcamento) => orcamento.obs === '1')
          .map((orcamento) => ({
            ente_id: orcamento.apelido,
          })),
        ...filteredEnte.flatMap((orcamento) =>
          orcamentosAnos
            .filter(
              (orcamentoAno) =>
                orcamento.obs === '1' &&
                parseInt(orcamento.id) === parseInt(orcamentoAno.budget_id)
            )
            .map((orcamentoAno) => ({
              ente_id: `${orcamento.apelido} - ${orcamentoAno.ano}`,
            }))
        ),
      ];

      onSelectedCheckboxesChange((prev) => [...prev, ...newSelections]);
    } else {
      // Remove todos os itens relacionados a "Comarcas"
      onSelectedCheckboxesChange((prev) =>
        prev.filter(
          (item) =>
            !filteredEnte.some(
              (orcamento) =>
                orcamento.apelido === item.ente_id ||
                orcamentosAnos.some(
                  (orcamentoAno) =>
                    item.ente_id ===
                    `${orcamento.apelido} - ${orcamentoAno.ano}` &&
                    orcamento.obs === '1'
                )
            )
        )
      );
    }
  };


  const handleMarkAllCheckboxInEnte = (event, orcamento_id) => {
    const checkboxName = event.target.name;
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;

    /* console.log("Filtro", checkboxName, checkboxValue, isChecked); */

    // Atualiza o estado checkedStatus
    const updatedCheckedStatus = { ...checkedStatus };

    // Itera sobre os orcamentosAnos para marcar ou desmarcar todos os itens relacionados
    orcamentosAnos.forEach((orcamentoAno) => {
      if (parseInt(orcamentoAno.budget_id) === parseInt(orcamento_id)) {
        const childCheckboxValue = `${checkboxValue} - ${orcamentoAno.ano}`;
        updatedCheckedStatus[childCheckboxValue] = isChecked;

        // Atualiza o estado de checkboxes filhos na lista de selecionados
        if (isChecked) {
          onSelectedCheckboxesChange((prevState) => [
            ...prevState,
            { [checkboxName]: childCheckboxValue },
          ]);
        } else {
          onSelectedCheckboxesChange((prevState) =>
            prevState.filter((item) => item[checkboxName] !== childCheckboxValue)
          );
        }
      }
    });

    // Atualiza o checkbox principal no estado
    updatedCheckedStatus[checkboxValue] = isChecked;
    setCheckedStatus(updatedCheckedStatus);
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
    const isChecked = event.target.checked;
    let checkboxValue
    let checkbox

    if (checkboxName === 'requisitorio' || checkboxName === 'escritura') {
      checkboxValue = null
      setCheckedStatus({ ...checkedStatus, [checkboxName]: isChecked });
      checkbox = { [checkboxName]: checkboxValue };

      
    if (isChecked) {
      onSelectedCheckboxesChange(prevState => [...prevState, checkbox]);
    } else {
      onSelectedCheckboxesChange(prevState => prevState.filter(item => {
        const [key] = Object.keys(item);
        console.log(item)
        console.log(key)
        console.log(item[key])
        return key !== checkboxName;
      }));
    }
    } else {
      checkboxValue = event.target.value;
      setCheckedStatus({ ...checkedStatus, [checkboxValue]: isChecked });
      checkbox = { [checkboxName]: checkboxValue };

      if (isChecked) {
        onSelectedCheckboxesChange(prevState => [...prevState, checkbox]);
      } else {
        onSelectedCheckboxesChange(prevState => prevState.filter(item => {
          const [key] = Object.keys(item);
          console.log(item)
          console.log(key)
          console.log(item[key])
          return item[key] !== checkboxValue;
        }));
      }

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
  const fieldLabels = {
    id: "Id",
    precatorio: "Precatório",
    processo: 'Processo',
    cedente: "Cedente",
    status: "Status",
    ente_id: "Ente Público",
    natureza: "Natureza",
    data_cessao: "Data da Cessão",
    empresa_id: "Empresa",
    adv: "Anuência",
    falecido: "Falecido",
  };

  return (
    <>
      <div onClick={handleShow} className={show ? "bg-neutral-800 opacity-60 w-screen h-screen fixed top-0 z-[55] transition-opacity duration-300 left-0 lg:hidden" : 'h-screen top-[9999px] bg-neutral-800 opacity-0 w-screen fixed transition-opacity duration-[700] left-0'}>
      </div>
      <motion.div className={show ? "bg-white dark:bg-neutral-900 h-full w-screen fixed z-[60] top-[15%] transition-all ease-in-out duration-[0.3s] shadow rounded-t-[20px] lg:bg-transparent lg:border-r dark:border-neutral-700 lg:transition-none lg:rounded-none lg:w-[300px] lg:relative lg:shadow-none lg:mt-5 lg:h-full lg:z-0 left-0" : 'top-[100%] transition-all ease-in-out duration-[0.3s] w-screen fixed bg-white dark:bg-neutral-900 h-full left-0'}>
        <div className="p-4 lg:p-0 lg:px-2">
          <div className="flex items-center justify-between ">
            <span className="font-[700] dark:text-white">Filtros</span>
            <div className="flex items-center">
              <Modal
                botaoAbrirModal={
                  <button className="dark:hover:bg-neutral-800 p-1 rounded  hover:bg-neutral-100"
                    title="Exportar para Excel">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  dark:text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                  </button>
                }
                tituloModal="Selecione os campos para exportação"
                botaoSalvar={
                  <button
                    onClick={() => onExportExcel(selectedExportFields)}
                    title="Exportar para Excel"
                    className="bg-black dark:bg-neutral-800 text-white px-4 py-2 ml-4 rounded "
                  >
                    Exportar
                  </button>
                }
              >
                <div className="flex flex-col gap-2 p-4 lg:grid lg:grid-cols-2">
                  {[
                    "id",
                    "precatorio",
                    "processo",
                    "cedente",
                    "status",
                    "ente_id",
                    "natureza",
                    "data_cessao",
                    "empresa_id",
                    "adv",
                    "falecido",
                  ].map((field) => (
                    <div className="flex gap-2 items-center justify-start" key={field}>
                      <div className="relative mt-[6px]">
                        <input
                          type="checkbox"
                          name={field}
                          id={field}
                          onChange={() => onFieldSelectionChange(field)}
                          checked={selectedExportFields.includes(field)}
                          className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
                        />
                        <span
                          className="absolute right-[1px] top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 ml-[2px] mt-[1px]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </div>

                      <label className="font-medium text-sm dark:text-white" htmlFor={field}>
                        {fieldLabels[field]} {/* Texto personalizado para o label */}
                      </label>
                    </div>
                  ))}
                </div>
              </Modal>
              <button onClick={onExportPDF} title="Exportar para PDF" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.} stroke="currentColor" className="size-5  dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </button>

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

          </div>

          <motion.div className="mt-4 flex flex-col gap-2 lg:divide-y dark:divide-neutral-700">
            <motion.div className="rounded px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
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
              <AnimatePresence>
                {showMenu && menuType === 'status' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden cursor-default border-l dark:border-neutral-600"
                  >
                    {status.map((s) => (
                      <div className="flex items-center gap-2" key={s.id}>
                        <input type="checkbox" name={"status"} id={s.nome} value={s.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[s.nome] || false} />
                        <span
                          className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div className="cursor-pointer">
                <div onClick={() => handleMenu('ente')} className="flex items-center justify-between">
                  <span>Ente</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'ente' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
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
                      className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] cursor-default border-l dark:border-neutral-600"
                    >
                      <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-1'} />

                      <div className="flex flex-col gap-2 overflow-y-scroll ">
                        {filteredEnte.map((orcamento) => (
                          orcamento.comarca === '0'
                            ? (
                              <div key={orcamento.id}>
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

                              <div className="w-full flex items-center justify-between pr-3" onClick={() => handleSubSubMenu('comarcas')}>
                                <p>Comarcas</p>
                                <span className='text-[12px] '>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubSubMenu && subSubMenuType === 'comarcas' ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
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
                                  orcamento.comarca === '1'
                                    ? (
                                      <div key={orcamento.id}>
                                        <div className="cursor-pointer">
                                          <div className="flex items-center gap-2 " onClick={() => handleSubMenu(orcamento.apelido)}>
                                            <div className="relative">
                                              <input type="checkbox" name={"ente_id"} id={orcamento.id} data-iscomarca={orcamento.obs} value={orcamento.apelido} className="peer relative h-[18px] w-[18px] cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleMarkAllCheckboxInEnte(e, orcamento.id)} checked={checkedStatus[orcamento.apelido] || false} />
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

                                            <div className="w-full flex items-center justify-between pr-3">
                                              <p className="mb-[2px]">{orcamento.apelido}</p>
                                              <span className='text-[12px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showSubMenu && subMenuType === orcamento.apelido ? "w-3 h-3 inline-block rotate-180" : 'w-3 h-3 inline-block'}>
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
                                                    <p className="mb-[2px]" key={orcamentoAno.id}>{orcamentoAno.ano}</p>
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
            </motion.div>

            <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
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
              <AnimatePresence>
                {showMenu && menuType === 'empresa' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden  cursor-default border-l dark:border-neutral-600"
                  >
                    {empresas.map((empresa) => (
                      <div className="flex items-center gap-2" key={empresa.id}>
                        <input type="checkbox" name={'empresa_id'} id={empresa.nome} value={empresa.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[empresa.nome] || false} />
                        <span
                          className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                            stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"></path>
                          </svg>
                        </span>
                        <label htmlFor={empresa.nome} key={empresa.id}>{empresa.nome}</label>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('natureza')} className="flex justify-between items-center cursor-pointer">
                  <span>Natureza</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'natureza' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
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
                      className="mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden  cursor-default border-l dark:border-neutral-600"
                    >
                      {natureza.map((na) => (
                        <div className="flex items-center gap-2" key={na.id}>
                          <input type="checkbox" name={"natureza"} id={na.nome} value={na.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[na.nome] || false} />
                          <span
                            className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('anuencia')} className="flex justify-between items-center cursor-pointer">
                  <span>Anuência</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'anuencia' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
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
                      className="mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden  cursor-default border-l dark:border-neutral-600"
                    >
                      {anuencia.map((an) => (
                        <div className="flex items-center gap-2" key={an}>
                          <input type="checkbox" name={"adv"} id={an} value={an} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[an] || false} />
                          <span
                            className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {auth.user.admin ? <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('obito')} className="flex justify-between items-center cursor-pointer">
                  <span>Óbito</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'obito' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
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
                      className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden  cursor-default border-l dark:border-neutral-600"
                    >
                      {obito.map((ob) => (
                        <div className="flex items-center gap-2" key={ob}>
                          <input type="checkbox" name={"falecido"} id={ob} value={ob} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[ob] || false} />
                          <span
                            className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div> : null}

            {auth.user.admin ? <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('rep_comercial')} className="flex justify-between items-center cursor-pointer">
                  <span>Rep. Comercial</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'rep_comercial' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
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
                      className="mt-2 pl-2 flex flex-col gap-2 text-[12px] h-full max-h-[300px] overflow-y-scroll cursor-default border-l dark:border-neutral-600"
                    >
                      {teles.map((tele) => (
                        <div className="flex items-center gap-2 relative" key={tele.usuario_id}>
                          <input type="checkbox" name={"tele_id"} id={tele.id} value={tele.usuario_id} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[tele.usuario_id] || false} />
                          <span
                            className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div> : null}

            <motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('data_cessao')} className="flex justify-between items-center cursor-pointer">
                  <span>Data da Cessão</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'data_cessao' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
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
            </motion.div>
            {auth.user.admin && (<motion.div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('documentos')} className="flex justify-between items-center cursor-pointer">
                  <span>Documentos Faltantes</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'documentos' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>
              <AnimatePresence>
                {showMenu && menuType === 'documentos' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden  cursor-default border-l dark:border-neutral-600"
                  >

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="requisitorio" name={'requisitorio'} value={'requisitorio'} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus['requisitorio'] || false} />
                      <span
                        className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <label htmlFor={'requisitorio'}>Requisitório</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="escritura" name={'escritura'} value={''} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus['escritura'] || false} />
                      <span
                        className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <label htmlFor={'escritura'}>Escritura</label>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>)}
          </motion.div>
        </div>
      </motion.div >
    </>
  )
}
