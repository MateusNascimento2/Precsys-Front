import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Tooltip } from 'react-tooltip';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import "../teste.css";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


export default function Lista({ cessoes, filteredCessoes, isLoading }) {
  const [loadingFiles, setLoadingFiles] = useState({});
  const axiosPrivate = useAxiosPrivate();

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

  const downloadFile = async (filename) => {
    const isDarkMode = localStorage.getItem('darkMode');
    const path = filename.split('/')[0];
    const file = filename.split('/')[1];

    setLoadingFiles(prev => ({ ...prev, [filename]: true }));

    try {
      const response = await axiosPrivate.get(`/download/${path}/${file}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(`Erro ao baixar arquivo: ${error}`, {
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
      console.error('Error downloading the file:', error);
    } finally {
      setLoadingFiles(prev => ({ ...prev, [filename]: false }));
    }
  };

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
              <DotsButton>
                <button className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>

                  <a target="_blank" rel="noopener noreferrer" href={`https://www4.tjrj.jus.br/ejud/processarprecatorio.aspx?N=${cessao.precatorio}&T=%27N%27`}>Ver no TJ</a>
                </button>

                <button title="Baixar requisitório" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900" onClick={() => downloadFile(cessao.requisitorio)} disabled={!cessao.requisitorio}>
                  {loadingFiles[cessao.requisitorio] ? (
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4"><LoadingSpinner /></div>

                      <span>Requisitório</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span>Requisitório</span>

                    </div>
                  )}
                </button>


                <button title="Baixar escritura" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900" onClick={() => downloadFile(cessao.escritura)} disabled={!cessao.escritura}>
                  {loadingFiles[cessao.escritura] ? (
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4"><LoadingSpinner /></div>
                      <span>Escritura</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span>Escritura</span>

                    </div>
                  )}
                </button>

              </DotsButton>
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
              <ToastContainer />
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
