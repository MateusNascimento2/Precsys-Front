import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { motion } from 'framer-motion';
import DotsButton from "./DotsButton";
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from './Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosPrivate } from '../api/axios';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm }) {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex justify-center items-center z-50 p-2">
      <div onClick={(e) => e.stopPropagation()} className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md">
        <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir o orçamento?</h2>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
            onClick={onRequestClose}
          >
            Cancelar
          </button>
        </div>
        <button
          className="absolute top-3 right-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={onRequestClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function EditBudgetModal({ isOpen, onRequestClose, onSave, budgetData }) {
  const [ente, setEnte] = useState('');
  const [apelido, setApelido] = useState('');
  const [comarca, setComarca] = useState('0');
  const [anos, setAnos] = useState('');

  useEffect(() => {
    if (isOpen && budgetData) {
      setEnte(budgetData.ente || '');
      setApelido(budgetData.apelido || '');
      setComarca(budgetData.comarca || '0');
      setAnos(budgetData.anos ? budgetData.anos.join(', ') : '');
    }
  }, [isOpen, budgetData]);

  const handleComarcaChange = (e) => {
    setComarca(e.target.checked ? "1" : "0"); // Se marcado, define "1"; senão, "0"
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  const handleRemoveAno = (e, index) => {
    e.preventDefault()
    setAnos((prev) => {
      const anosArray = prev.split(',').map((ano) => ano.trim());
      anosArray.splice(index, 1); // Remove o ano pelo índice
      return anosArray.join(', '); // Retorna a string atualizada
    });
  };

  const handleSave = async () => {
    const isDarkMode = localStorage.getItem('darkMode');
    try {
      // Atualizar os dados do orçamento (ente, apelido, comarca)
      await axiosPrivate.put(`/orcamentos/${budgetData.budget_id}`, {
        ente,
        apelido,
        comarca: comarca, // Converte para o formato correto
      });

      // Atualizar os anos do orçamento
      await axiosPrivate.put(`/orcamentosAnos/${budgetData.budget_id}/anos`, {
        anos: anos.split(',').map((ano) => ano.trim()), // Divide os anos em uma lista e remove espaços
      });

      // Exibe uma mensagem de sucesso
      toast.success("Orçamento atualizado com sucesso!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });

      // Fechar o modal após salvar
      onSave({
        ...budgetData,
        ente,
        apelido,
        comarca: comarca ? "1" : "0",
        anos: anos.split(',').map((ano) => ano.trim()),
      });
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      toast.error("Erro ao salvar orçamento. Verifique os dados.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleCancel = () => {
    // Reseta os valores ao cancelar ou fechar
    setEnte(budgetData?.ente || '');
    setApelido(budgetData?.apelido || '');
    setComarca(budgetData?.comarca || '0');
    setAnos(budgetData?.anos ? budgetData.anos.join(', ') : '');
    onRequestClose();
  };

  return (
    isOpen && (
      <div
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex justify-center items-center z-50 p-2"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md"
        >
          <h2 className="text-lg text-black dark:text-white font-semibold">
            Editar Orçamento
          </h2>
          <form className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col">
              <label htmlFor="ente" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Ente
              </label>
              <input
                type="text"
                id="ente"
                value={ente}
                onChange={(e) => setEnte(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="apelido" className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Apelido
              </label>
              <input
                type="text"
                id="apelido"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]"
              />
            </div>
            <div className='flex flex-col gap-1 dark:text-white'>
              <label className="text-sm text-neutral-700 dark:text-neutral-300" htmlFor='comarca'>Comarca:</label>
              <div className='flex gap-1 items-center'>
                <div className='relative'>
                  <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={comarca === '1'} onChange={handleComarcaChange} />
                  <span
                    className="absolute right-[1px] top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[2px] mt-[1px]" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </span>
                </div>

              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="anos" className="text-sm text-neutral-700 dark:text-neutral-300">
                Anos
              </label>
              <div className="grid grid-cols-[80px_80px_80px_80px] justify-center gap-1 mt-2">
                {anos.split(',').map((ano, index) => (
                  <div
                    key={index}
                    className="flex text-[14px] items-center justify-between px-3 py-1 font-medium bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 rounded"
                  >
                    <span>{ano.trim()}</span>
                    <button
                      onClick={(e) => handleRemoveAno(e, index)}
                      className="dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[15px] h-[15px] hover:text-red-600 dark:hover:text-red-600 dark:text-white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
          <div className="flex justify-between mt-4">
            <button
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right ml-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700"
              onClick={handleSave}
            >
              Salvar
            </button>

          </div>
          <button
            className="absolute top-3 right-3 rounded hover:bg-neutral-100 text-white dark:hover:bg-neutral-800"
            onClick={onRequestClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[20px] h-[20px] dark:text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  );
}


export default function OrcamentosList({ searchQuery, orcamentos }) {
  const listRef = useRef();
  const [ano, setAno] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [ente, setEnte] = useState('');
  const [apelido, setApelido] = useState('');
  const [comarca, setComarca] = useState(""); // Inicializa como "0"
  const openModal = () => {
    setModalIsOpen(true)
  };
  const closeModal = () => setModalIsOpen(false);

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  const openEditModal = (budget) => {
    setBudgetToEdit(budget);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => setEditModalIsOpen(false);

  const handleSaveEdit = (updatedBudget) => {
    console.log('Orçamento atualizado:', updatedBudget);
    // Lógica para salvar alterações no orçamento
    closeEditModal();
  };


  const handleComarcaChange = (e) => {
    setComarca(e.target.checked ? "1" : "0"); // Se marcado, define "1"; senão, "0"
  };

  // Agrupar os orçamentos por `ente`
  const groupedOrcamentos = useMemo(() => {
    const groups = {};
    orcamentos.forEach((orcamento) => {
      if (!groups[orcamento.ente]) {
        groups[orcamento.ente] = { budget_id: String(orcamento.orcamento_id), ente: orcamento.ente, comarca: orcamento.comarca, apelido: orcamento.apelido, anos: [] };
      }
      groups[orcamento.ente].anos.push(orcamento.orcamento_ano);
    });
    return Object.entries(groups);
  }, [orcamentos]);

  const filteredOrcamentos = useMemo(() => {
    if (!searchQuery.trim()) return groupedOrcamentos;

    return groupedOrcamentos.filter(([ente, data]) => {
      const query = searchQuery.toLowerCase();
      return (
        ente.toLowerCase().includes(query) || // Verifica o campo `ente`
        data.apelido.toLowerCase().includes(query) || // Verifica o campo `apelido`
        data.anos.some((ano) => ano.toString().includes(query)) // Verifica os anos
      );
    });
  }, [searchQuery, groupedOrcamentos]);

  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100,
      }),
    []
  );

  const handleAdicionarOrcamentoAno = async (e, budget_id) => {
    e.preventDefault()
    const isDarkMode = localStorage.getItem('darkMode');
    try {

      if (!ano || !budget_id) {
        console.log(budget_id, ano)
        toast.error(`Erro ao adicionar ano ao orçamento: Ano faltando`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          theme: "light",
          transition: Bounce,
        });
        return
      }

      await axiosPrivate.post(
        '/adicionarOrcamentoAno',
        {
          budget_id, ano
        },
      );

      toast.success("Ano adicionado ao orçamento com sucesso!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });

    } catch (e) {
      toast.error(`Erro ao adicionar ano ao orçamento: ${e}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });

    }
  }

  const confirmDelete = async (budget_id) => {
    try {
      const isDarkMode = localStorage.getItem('darkMode');
      setIsLoading(true);
      await axiosPrivate.delete(`/orcamentos/${budget_id}`); // Passa o budget_id para a API
      toast.success('Orçamento deletado com sucesso!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });
    } catch (err) {
      console.error(`Erro ao deletar orçamento: ${err}`);
      toast.error(`Erro ao deletar orçamento: ${err}`, {
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
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const renderRow = useCallback(
    ({ index, key, parent, style }) => {
      const [nome_ente, data] = filteredOrcamentos[index];

      return (
        <CellMeasurer cache={cache} columnIndex={0} rowIndex={index} key={key} parent={parent}>
          <motion.div
            style={{ ...style }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='pb-[40px] w-full'>

              <div className="flex relative">

                <div className="flex-col items-start gap-2 flex justify-between divide-y-[1px] border dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 rounded w-full">
                  <div className="flex flex-col p-2">
                    <span className="font-bold dark:text-white text-[14px]">{nome_ente}</span>
                    <span className="text-neutral-400 dark:text-neutral-300 text-[12px]">{data.apelido}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-2 w-full">
                    {data.anos.map((ano, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] w-[42px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 "
                      >
                        {ano}
                      </span>
                    ))}
                  </div>
                </div>
                <div className='absolute right-2 top-6'>
                  <DotsButton isModal={true}>

                    <Modal
                      botaoAbrirModal={

                        <button title="Adicionar ano" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900 text-nowrap">
                          Adicionar Ano
                        </button>

                      }
                      tituloModal={

                        <div className='flex gap-2 items-center'>
                          <span>Adicionar novo ano</span>
                        </div>

                      }
                      botaoSalvar={
                        <motion.button
                          className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'
                          onClick={(e) => handleAdicionarOrcamentoAno(e, data.budget_id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          Salvar
                        </motion.button>
                      }

                    >

                      <form className='flex flex-col gap-4 justify-center  items-center'>
                        <div className='lg:w-[650px] flex flex-col gap-4'>
                          <div className='flex flex-col gap-1 dark:text-white'>
                            <label htmlFor='ano'>Ano</label>
                            <input name='ano' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={ano} onChange={(e) => {
                              console.log('Valor do input:', e.target.value);
                              setAno(e.target.value);
                            }}></input>
                          </div>
                        </div>
                      </form>

                    </Modal>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evita o clique de propagação
                        openEditModal(data); // Chama a função com os dados
                      }}
                      title="Editar orçamento"
                      className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:dark:bg-neutral-900"
                    >
                      Editar
                    </button>




                    <button onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBudgetId(data.budget_id)
                      openModal();

                    }} title="Excluir orçamento" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900">
                      Excluir
                    </button>

                  </DotsButton>

                </div>



              </div>
            </div>

          </motion.div>
        </CellMeasurer>
      );
    },
    [filteredOrcamentos, cache, ano, ente, apelido, comarca]
  );

  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <div className="w-12 h-12">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
            <motion.div
              className="container dark:bg-neutral-900"
              style={{ width: '100%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ToastContainer />
              <DeleteConfirmationModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onConfirm={() => confirmDelete(selectedBudgetId)}
              />
              <EditBudgetModal
                isOpen={editModalIsOpen}
                onRequestClose={closeEditModal}
                onSave={handleSaveEdit}
                budgetData={budgetToEdit}
              />
              <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300 pb-1">
                Mostrando {filteredOrcamentos.length} orçamentos

              </p>
              <AutoSizer>
                {({ width }) => (
                  <div ref={registerChild}>
                    <List
                      ref={listRef}
                      rowRenderer={renderRow}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      width={width}
                      autoHeight
                      height={height}
                      rowCount={filteredOrcamentos.length}
                      scrollTop={scrollTop}
                      deferredMeasurementCache={cache}
                      rowHeight={cache.rowHeight}
                    />
                  </div>
                )}
              </AutoSizer>
            </motion.div>
          )}
        </WindowScroller>
      )}
    </>
  );
}
