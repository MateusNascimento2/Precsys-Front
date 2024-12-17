import React, { useMemo, useCallback, useRef } from 'react';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { motion } from 'framer-motion';
import DotsButton from "./DotsButton";
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';


export default function OrcamentosList({ orcamentos, isLoading }) {
  const listRef = useRef();

  // Agrupar os orçamentos por `ente`
  const groupedOrcamentos = useMemo(() => {
    const groups = {};
    orcamentos.forEach((orcamento) => {
      if (!groups[orcamento.ente]) {
        groups[orcamento.ente] = { apelido: orcamento.apelido, anos: [] };
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
                  <DotsButton>

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
    [groupedOrcamentos, cache]
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
