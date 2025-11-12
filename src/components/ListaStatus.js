import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Tooltip } from 'react-tooltip';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import "../teste.css";


export default function ListaStatus({ cessoes, filteredCessoes, isLoading }) {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
  });

  // Estado para gerenciar o tema
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Verifica se a classe 'dark' está presente no HTML
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      setIsDarkTheme(htmlElement.classList.contains('dark'));
    };

    // Adiciona um evento de escuta para mudanças na classe do HTML
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    // Checa inicialmente o tema
    checkDarkMode();

    // Limpa o observador quando o componente é desmontado
    return () => observer.disconnect();
  }, []);

  const renderRow = ({ index, parent, key, style }) => {
    const cessao = filteredCessoes[index];

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <motion.div
          style={{ ...style, paddingBottom: '35px' }}
          className="dark:bg-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className=" dark:bg-neutral-900 ">
            <div className="flex border dark:border-neutral-700 dark:bg-neutral-900 px-2 py-1 justify-between rounded-t items-center">
              <div className="flex">
                <div className="border-r dark:border-neutral-700 pr-2 my-3 flex items-center justify-center">
                  <span className="font-[700] dark:text-white">{cessao.id}</span>
                </div>
                <div className="flex flex-col justify-center text-[12px] pl-2">

                  <span className="font-bold dark:text-white hover:underline w-[90px]"><Link to={`/cessao/${String(cessao.id)}`}>{cessao.precatorio}</Link></span>

                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cessao.cedente}</span>
                </div>
              </div>

            </div>

            <div className="text-[10px] rounded-b border-b border-r border-l dark:border-neutral-700 py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900">
              <a
                style={{ backgroundColor: `${cessao.corStatus}` }}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={`${cessao.substatus ? cessao.substatus : ''}`}
                data-tooltip-place="top"
                className={`px-2 py-1 rounded brightness-110`}>
                <span className="text-black font-bold">{cessao.status}</span>
              </a>

              <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100`}>
                <span className="text-black font-bold dark:text-neutral-100">{cessao.ente} - {cessao.ano}</span>
              </span>

              <span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}>
                <span className="text-black font-bold dark:text-neutral-100">{cessao.natureza}</span>
              </span>

              {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}

              {cessao.empresa ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.empresa}</span></span>) : null}

              {cessao.anuencia_advogado ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.anuencia_advogado}</span></span>) : null}

              {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.falecido}</span></span>) : null}
            </div>
          </div>
          <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="top" />
        </motion.div>
      </CellMeasurer>
    );
  };


  return (

    <div>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <div className="w-12 h-12">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
            <section className="container dark:bg-neutral-900" style={{ width: "100%" }}>
              <div className="dark:bg-neutral-900 relative h-full">
                <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
                  Mostrando {filteredCessoes.length} de {cessoes.length} cessões
                </p>
                <AutoSizer style={{ width: '100%', height: '100%' }}>
                  {({ width }) => (
                    <div ref={registerChild}>
                      <List
                        rowRenderer={renderRow}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        width={width}
                        autoHeight
                        height={height}
                        rowCount={filteredCessoes.length}
                        scrollTop={scrollTop}
                        deferredMeasurementCache={cache}
                        rowHeight={cache.rowHeight}
                      />
                    </div>
                  )}
                </AutoSizer>
              </div>
            </section>
          )}
        </WindowScroller>
      )}
    </div>

  );
}
