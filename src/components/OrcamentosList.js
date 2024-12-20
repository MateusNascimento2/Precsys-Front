import React, { useState, useMemo, useCallback, useRef } from 'react';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { motion } from 'framer-motion';
import DotsButton from "./DotsButton";
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from './Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosPrivate } from '../api/axios';


export default function OrcamentosList({ orcamentos, isLoading }) {
  const listRef = useRef();
  const [ano, setAno] = useState('');

  // Agrupar os orçamentos por `ente`
  const groupedOrcamentos = useMemo(() => {
    const groups = {};
    orcamentos.forEach((orcamento) => {
      if (!groups[orcamento.ente]) {
        groups[orcamento.ente] = { budget_id: String(orcamento.id), apelido: orcamento.apelido, anos: [] };
      }
      groups[orcamento.ente].anos.push(orcamento.ano);
    });
    return Object.entries(groups);
  }, [orcamentos]);

  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100,
      }),
    []
  );

  const handleAdicionarOrcamentoAno = async (e, budget_id, ano) => {
    e.preventDefault()

    try {

      if (!ano) {
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
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
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

  console.log(ano)


  const renderRow = useCallback(
    ({ index, key, parent, style }) => {
      const [ente, data] = groupedOrcamentos[index];

      return (
        <CellMeasurer cache={cache} columnIndex={0} rowIndex={index} key={key} parent={parent}>
          <motion.div
            style={{ ...style }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='mb-4 w-full'>

              <div className="flex relative">
                <div className="flex-col items-start gap-2 flex justify-between divide-y-[1px] border dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 rounded w-full">
                  <div className="flex flex-col p-2">
                    <span className="font-bold dark:text-white text-[14px]">{ente}</span>
                    <span className="text-neutral-400 dark:text-neutral-300 text-[12px]">{data.apelido}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-2 w-full">
                    {data.anos.map((ano, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 "
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
                          onClick={(e) => handleAdicionarOrcamentoAno(e, data.budget_id, ano)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          Salvar
                        </motion.button>
                      }

                    >
                      <ToastContainer />
                      <form className='flex flex-col gap-4 justify-center  items-center'>
                        <div className='w-[650px] flex flex-col gap-4'>
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


                    <button title="Editar orçamento" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900">
                      Editar
                    </button>


                    <button title="Excluir orçamento" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900">
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
    [groupedOrcamentos, cache, ano]
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
              <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
                Mostrando {groupedOrcamentos.length} orçamentos
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
                      rowCount={groupedOrcamentos.length}
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
