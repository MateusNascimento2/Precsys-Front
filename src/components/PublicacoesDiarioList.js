import React, { useState, useEffect } from "react";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';


export default function PublicacoesDiarioList({ publicacoesFiltradas, publicacoesQtd, updateHomologado, fetchPublicacoes }) {
  const { pathname } = useLocation();
  const [showTextoPublicacao, setShowTextoPublicacao] = useState({});

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

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
  });

  function adicionarDiasUteis(data, diasUteis) {
    const novaData = new Date(data);

    let adicionados = 0;
    while (adicionados < diasUteis) {
      novaData.setDate(novaData.getDate() + 1);
      const diaSemana = novaData.getDay(); // 0 = domingo, 6 = sábado

      if (diaSemana !== 0 && diaSemana !== 6) {
        adicionados++;
      }
    }

    return novaData;
  }

  function contarDiasUteis(dataFinal) {
    const fim = new Date(dataFinal);
    const hoje = new Date();

    // Zerar horas para comparar só datas
    fim.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    let diasUteis = 0;

    // Se a data final for anterior a hoje, retorna 0
    if (fim <= hoje) return 0;

    // Contar dias úteis
    let dataAtual = new Date(hoje);

    while (dataAtual < fim) {
      const diaSemana = dataAtual.getDay(); // 0 = dom, 6 = sáb
      if (diaSemana !== 0 && diaSemana !== 6) {
        diasUteis++;
      }
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return diasUteis;
  }

  const handleHomologar = async (precatorio, novoValor) => {
    await updateHomologado(precatorio, novoValor);
    fetchPublicacoes();
  };


  const toggle = (id) => {
    setShowTextoPublicacao((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderRow = ({ index, parent, key, style }) => {
    const publicacao = publicacoesFiltradas[index];

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <motion.div
          style={{ ...style, paddingBottom: '20px' }}
          className="dark:bg-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="rounded border dark:border-neutral-700 w-full mx-auto mb-4">
            {/* Header */}
            <div className="border-b dark:border-neutral-700">
              <div className="border-b dark:border-neutral-700 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center">
                    <h2 className="text-black dark:text-white text-[16px] font-bold inline">
                      {publicacao.precatorio}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2">
                    {pathname === '/publicacoes-intimadas' ?
                      <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`dias úteis restantes`}
                        data-tooltip-place="top"
                        className={`flex items-center justify-center py-2 px-4 border rounded dark:border-neutral-600`}>
                        <span className="text-black dark:text-white font-bold">{contarDiasUteis(adicionarDiasUteis(new Date(publicacao.data_diario), 5))}</span>
                      </a>

                      :
                      null
                    }

                    {pathname === '/publicacoes-intimadas'
                      ?
                      <div className="text-[9px] flex items-center justify-end">

                        <div onClick={() => {
                          handleHomologar(publicacao.precatorio, !publicacao.ja_homologado ? 1 : 0)
                        }}
                          title="Já Homologado ?" className={`size-5 border rounded dark:border-neutral-600 cursor-pointer  hover:bg-neutral-200 ${publicacao.ja_homologado ? 'dark:bg-white dark:text-black bg-black text-white dark:hover:bg-neutral-200 hover:bg-neutral-700' : 'dark:hover:bg-neutral-800'}`}>
                          {publicacao.ja_homologado ? <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-[2px] mt-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> : null}
                        </div>

                      </div>
                      :
                      null
                    }
                  </div>


                </div>

              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                  <a
                    data-tooltip-id="data-publicacao"
                    data-tooltip-content={`Data da publicação`}
                    data-tooltip-place="top" className="text-[9px] py-2 flex items-center">
                    <span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">
                      {new Intl.DateTimeFormat('pt-BR').format(new Date(publicacao.data_diario))}
                    </span>
                  </a>

                  {pathname === '/publicacoes-intimadas' ?
                    <a
                      data-tooltip-id="data-util"
                      data-tooltip-content={`Último dia para se manifestar`}
                      data-tooltip-place="top" className="text-[9px] py-2 pl-2 pr-2 flex items-center">
                      <span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">
                        {new Intl.DateTimeFormat('pt-BR').format(
                          adicionarDiasUteis(new Date(publicacao.data_diario), 5)
                        )}
                      </span>
                    </a>
                    : null}
                </div>


                {pathname === '/publicacoes-intimadas' ?
                  <button title="Mostrar texto da publicação" onClick={() => toggle(index)}>
                    <span class="text-[14px] dark:text-neutral-300 dark:hover:bg-neutral-800 rounded hover:bg-neutral-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-4 h-4 inline-block ${showTextoPublicacao[index] && "rotate-180"}`}><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path>
                      </svg>
                    </span>
                  </button> :
                  null
                }
              </div>

            </div>

            {/* Advogados */}
            {publicacao.advogados ? <div className="px-4 py-2">
              <div className="flex w-full">
                <table className="font-medium text-sm w-full">
                  <tbody>
                    <tr>
                      <td className=" dark:text-white p-1">
                        {publicacao.advogados}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> : null}

            {/* Texto da publicação */}
            {publicacao.texto_publicacao && showTextoPublicacao[index] && pathname === '/publicacoes-intimadas' ? (
              <div className={`px-4 pb-2 ${!publicacao.advogados ? 'py-2' : ''}`}>
                <p className="text-neutral-400 dark:text-neutral-200 text-sm p-1">
                  {publicacao.texto_publicacao}
                </p>
              </div>
            ) :
              null
            }

            {pathname != '/publicacoes-intimadas' ? <div className={`px-4 pb-2 ${!publicacao.advogados ? 'py-2' : ''}`}>
              <p className="text-neutral-400 dark:text-neutral-200 text-sm p-1">
                {publicacao.texto_publicacao}
              </p>
            </div> : null}
          </div>


          <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="top" />
          <Tooltip id="data-publicacao" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="top" />
          <Tooltip id="data-util" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
        </motion.div>
      </CellMeasurer>
    );
  };


  return (

    <div>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
          <section className="container dark:bg-neutral-900" style={{ width: "100%" }}>
            <ToastContainer />
            <div className="dark:bg-neutral-900 relative h-full">
              <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
                Mostrando {publicacoesFiltradas.length} de {publicacoesQtd} publicações
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
                      rowCount={publicacoesFiltradas.length}
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
    </div>

  );
}
