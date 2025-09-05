import React, { useState, useEffect, useRef } from 'react';
import SearchInput from '../components/SearchInput';
import PublicacoesDiarioList from '../components/PublicacoesDiarioList';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Header from '../components/Header';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { motion } from 'framer-motion';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default function PublicacoesDiario() {
  const [searchQuery, setSearchQuery] = useState('');
  const [publicacoes, setPublicacoes] = useState([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const itensPorPagina = 100;
  const axiosPrivate = useAxiosPrivate();
  const abortControllerRef = useRef(null);


  const handleInputChange = (query) => {
    setSearchQuery(query);
    setPaginaAtual(1);
  };

  useEffect(() => {
    fetchPublicacoes();
  }, [searchQuery, dataInicial, paginaAtual]);

  const fetchPublicacoes = async () => {
    try {
      // cancela a requisição anterior (se existir)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      const { data } = await axiosPrivate.get('/publicacoes-diario', {
        signal: controller.signal, // <-- anexa o controller à requisição
        params: {
          search: searchQuery,
          dataInicial,
          pagina: paginaAtual,
          limite: itensPorPagina,
        },
      });

      setPublicacoes(data.dados);
      setTotalResultados(data.total);
      setIsLoading(false);

    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Requisição cancelada');
      } else {
        console.error('Erro ao buscar as publicações do diário:', error);
        setIsLoading(false);
      }
    }
  };

  const exportarParaPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;
    const margemInferior = 60;

    publicacoes.forEach((pub, index) => {
      const data = new Date(pub.data_diario).toLocaleDateString();
      const precatorio = pub.precatorio || '';
      const advogados = pub.advogados || '';
      const texto = pub.texto_publicacao || '';

      const boxX = 40;
      const boxWidth = 515;
      let alturaBox = 0;

      const advogadosLinhas = doc.splitTextToSize(advogados, boxWidth - 80);
      const textoLinhas = doc.splitTextToSize(texto, boxWidth - 20);
      alturaBox = 85 + advogadosLinhas.length * 14 + textoLinhas.length * 14;

      if (y + alturaBox + margemInferior > doc.internal.pageSize.height) {
        doc.addPage();
        y = 40;
      }

      y += 15;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(precatorio, boxX + 10, y);

      y += 20;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setFillColor(240);
      doc.rect(boxX + 10, y - 12, 60, 18, 'F');
      doc.text(data, boxX + 15, y);

      y += 25;
      doc.setFont(undefined, 'bold');
      doc.setFont(undefined, 'normal');
      doc.text(advogadosLinhas, boxX + 10, y);

      y += advogadosLinhas.length * 14;
      doc.text(textoLinhas, boxX + 10, y);

      y += textoLinhas.length * 14 + 20;
    });

    doc.save(`publicacoes_pagina_${paginaAtual}.pdf`);
  };

  const totalPaginas = Math.ceil(totalResultados / itensPorPagina);
  return (
    <>
      <Header />
      <main className={'container mx-auto pt-[120px] dark:bg-neutral-900 h-full'}>
        <div className={'px-[20px]'}>
          <div className='flex items-center md:items-end'>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='font-[700] text-[32px] md:mt-[16px] dark:text-white'
              id='cessoes'
            >
              Publicações
            </motion.h2>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={'mt-[24px] px-5 dark:bg-neutral-900'}
        >
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />

            <button className={'border dark:border-neutral-700  py-3 px-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 lg:hidden bg-white dark:bg-neutral-900'} onClick={() => setShow(!show)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>

          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>

            <div className='w-full h-full max-h-full'>


              <div className={`lg:flex lg:gap-4 lg:items-start`}>

                {/* Filtro no Desktop */}
                <div className={'hidden lg:block lg:sticky lg:top-[8%] lg:w-[320px] lg:border-r dark:border-neutral-600 lg:pr-2 lg:mt-4'}>
                  <div className='flex items-center justify-between'>

                    <span className="font-[700] dark:text-white">Filtros</span>

                    <div className='flex items-center gap-1'>
                      <button onClick={exportarParaPDF} title="Exportar para PDF" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.} stroke="currentColor" className="size-5  dark:text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </button>

                      <button onClick={() => {
                        setDataInicial('')
                      }} title='Limpar Todos os Filtros' className="cursor-pointer hover:rounded p-1 text-black hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white">
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
                      </button>
                    </div>


                  </div>


                  <div className="flex flex-col gap-2 py-3 text-neutral-600 dark:text-neutral-400">

                    <div className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
                      <label className="text-[12px] font-bold">
                        Data :
                      </label>
                      <input
                        type="date"
                        value={dataInicial}
                        onChange={(e) => {
                          setDataInicial(e.target.value);
                          setPaginaAtual(1);
                        }}
                        className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded"
                      />
                    </div>

                  </div>
                </div>

                <div className='flex flex-col gap-5 w-full'>
                  <div className='w-full h-full max-h-full'>
                    {isLoading ? (
                      <div className="w-full flex justify-center">
                        <div className="w-12 h-12">
                          <LoadingSpinner />
                        </div>
                      </div>)
                      :
                      <PublicacoesDiarioList publicacoesFiltradas={publicacoes} publicacoesQtd={totalResultados} />
                    }
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-4 my-6 text-sm text-neutral-700 dark:text-white">
                    <button
                      onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                      disabled={paginaAtual === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className='font-semibold'>Página</span>
                    <select
                      value={paginaAtual}
                      onChange={(e) => setPaginaAtual(Number(e.target.value))}
                      className="px-2 py-1 border rounded dark:bg-neutral-800 dark:text-white"
                    >
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                        <option key={pagina} value={pagina}>
                          {pagina}
                        </option>
                      ))}
                    </select>
                    <span className='font-semibold'>de {totalPaginas}</span>
                    <button
                      onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                      disabled={paginaAtual === totalPaginas}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Próxima
                    </button>
                  </div>
                </div>


                {/* Filtro no Mobile */}

                <div onClick={() => setShow(false)} className={`${show ? 'fixed h-dvh left-0 top-0 w-dvw bg-black z-[90] opacity-70' : 'opacity-0'} transition-all ease-in-out duration-[600ms] lg:hidden`} />

                <div className={`${show
                  ? 'lg:hidden bg-white dark:bg-neutral-900 fixed w-dvw bottom-0 left-0 p-4 rounded-t-md top-1/4 z-[100] overflow-y-auto lg:border-r'
                  : 'lg:hidden bg-white dark:bg-neutral-900 lg:bg-transparent top-full left-0 w-dvw fixed p-4 lg:relative lg:w-[320px] lg:mt-5 lg:border-r lg:dark:border-neutral-600 lg:p-0 lg:px-2'
                  } transition-all ease-in-out duration-[400ms]`}>
                  <div className='flex items-center justify-between'>

                    <span className="font-[700] dark:text-white">Filtros</span>

                    <button onClick={() => {
                      setDataInicial('')
                    }} title='Limpar Todos os Filtros' className="cursor-pointer hover:rounded p-1 text-black hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white">
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
                    </button>
                  </div>


                  <div className="flex flex-col gap-2 py-3 text-neutral-600 dark:text-neutral-400">

                    <div className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
                      <label className="text-[12px] font-bold">
                        Data :
                      </label>
                      <input
                        type="date"
                        value={dataInicial}
                        onChange={(e) => {
                          setDataInicial(e.target.value);
                          setPaginaAtual(1);
                        }}
                        className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded"
                      />
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>

        {/* Scroll-to-top button */}
        <ScrollToTopButton />
      </main>
    </>
  )
}
