import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Tooltip } from 'react-tooltip';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../hooks/useAuth";
import { motion } from 'framer-motion';
import "../teste.css";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


export default function Lista({ cessoes, searchQuery, selectedFilters, setData, isPerfilCessoes, onFilteredCessoes, user }) {
  const { minhascessoes } = useParams();
  const { auth } = useAuth();
  const userID = user ? String(user.id) : String(auth.user.id);
  const [cessionarios, setCessionarios] = useState([]);
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState({});
  const [datas, setDatas] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [myCessions, setMyCessions] = useState([])

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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal,
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err);
        if (err.name === 'AbortError') {
          console.log('Fetch aborted due to route change or unmount:', err);
        } else if (isMounted) {
          console.error('Error fetching data:', err);
        }
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchData('/cessionarios', setCessionarios),
          fetchData('/status', setStatus),
          fetchData('/orcamentos', setOrcamentos),
          fetchData('/natureza', setNatureza),
          fetchData('/empresas', setEmpresas),
        ]);

      } catch (err) {
        console.error('Error with fetching data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

  useEffect(() => {

    if (minhascessoes) {
      const cessionariosPorIDdoUsuarios = cessionarios.filter(cessionario => cessionario.user_id === userID);

      const minhasCessoes = cessionariosPorIDdoUsuarios
        .map(cessionario => {
          const cessao = cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id));
          return cessao;
        })
        .filter(cessao => cessao !== undefined);

      status.forEach(statusItem => {
        minhasCessoes.forEach(cessao => {
          if (cessao.status === String(statusItem.id)) {
            cessao.x = statusItem.nome;
          }
        });
      });


      setMyCessions(minhasCessoes)
    }

    if (isPerfilCessoes) {
      const cessionariosPorIDdoUsuarios = cessionarios.filter(cessionario => cessionario.user_id === userID);

      const minhasCessoes = cessionariosPorIDdoUsuarios
        .map(cessionario => {
          const cessao = cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id));
          return cessao;
        })
        .filter(cessao => cessao !== undefined);

      status.forEach(statusItem => {
        minhasCessoes.forEach(cessao => {
          if (cessao.status === String(statusItem.id)) {
            cessao.x = statusItem.nome;
          }
        });
      });

      setMyCessions(minhasCessoes)
    }




  }, [minhascessoes, cessionarios, cessoes, userID, isPerfilCessoes]);
  

  /* function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].id !== arr2[i].id) {
        return false;
      }
    }
    return true;
  } */

  useEffect(() => {
    let dataCessoes = [];

    cessoes.forEach(cessao => {
      dataCessoes.push(cessao.data_cessao);
    });

    setData(dataCessoes);
    setDatas(dataCessoes);
  }, [cessoes]);

  const anuenciaValores = {
    "0": "Sem anuência",
    "1": "Honorários",
    "2": "Com anuência",
    "3": "Quitação",
  };

  const falecidoValores = {
    "0": "Vivo",
    "1": "Não deixou bens",
    "2": "Deixou bens",
    "3": "Solicitada habilitação",
    "4": "Herdeiros habilitados",
  };

  cessoes.forEach(cessao => {
    const statusAtualizado = status.find(s => parseInt(cessao.status) === parseInt(s.id));
    if (statusAtualizado) {
      cessao.status = statusAtualizado.nome;
      cessao.statusColor = statusAtualizado.extra;
    }

    const orcamentoAtualizado = orcamentos.find(o => parseInt(cessao.ente_id) === parseInt(o.id));
    if (orcamentoAtualizado && cessao.ano) {
      cessao.ente_id = orcamentoAtualizado.apelido + " - " + cessao.ano;
    } else if (orcamentoAtualizado) {
      cessao.ente_id = orcamentoAtualizado.apelido;
    }

    const naturezaAtualizada = natureza.find(n => parseInt(cessao.natureza) === parseInt(n.id));
    if (naturezaAtualizada) {
      cessao.natureza = naturezaAtualizada.nome;
    }

    const empresaAtualizada = empresas.find(e => parseInt(cessao.empresa_id) === parseInt(e.id));
    if (empresaAtualizada) {
      cessao.empresa_id = empresaAtualizada.nome;
    }

    const anuencia = anuenciaValores[cessao.adv];
    if (anuencia) {
      cessao.adv = anuencia;
    }

    const falecido = falecidoValores[cessao.falecido];
    if (falecido) {
      cessao.falecido = falecido;
    }

    cessao.id = String(cessao.id);
  });

  /*   cessoes.forEach(cessao => {
      delete cessao.ano;
    });
   */
  function aplicarFiltros(dados, filtros) {


    const filtroObj = filtros.reduce((acc, filtro) => {
      const chave = Object.keys(filtro)[0];
      acc[chave] = acc[chave] || [];
      acc[chave].push(filtro[chave]);
      return acc;
    }, {});



    const verificarFiltrosChave = (chave, valor) => {
      if (!filtroObj[chave]) return true;
      return filtroObj[chave].includes(valor);
    };

    const verificarData = (data, inicio, fim) => {
      if (inicio && fim) {
        return data >= inicio && data <= fim;
      } else if (inicio) {
        return data >= inicio;
      } else {
        return true;
      }
    };

    return Object.entries(dados).every(([chave, valor]) => {
      if (chave === 'data_cessao' && (filtroObj.dataInicio || filtroObj.dataFim)) {
        const dataInicio = filtroObj.dataInicio ? filtroObj.dataInicio : datas[0];
        const dataFim = filtroObj.dataFim ? filtroObj.dataFim : datas[datas.length - 1];
        return verificarData(valor, dataInicio, dataFim);
      }
      return verificarFiltrosChave(chave, valor);
    });
  }


  let resultadoFiltrado;

  if (minhascessoes || user) {
    // Se o usuário não for admin e myCessions estiver vazio, retornar null
    if (myCessions.length === 0) {
      resultadoFiltrado = [];
    } else {
      // Filtra as cessões do usuário
      resultadoFiltrado = myCessions.filter(objeto => aplicarFiltros(objeto, selectedFilters));
    }
  } else {
    // Se o usuário for admin, aplica a lógica anterior
    resultadoFiltrado = myCessions.length >= 1
      ? myCessions.filter(objeto => aplicarFiltros(objeto, selectedFilters))
      : cessoes.filter(objeto => aplicarFiltros(objeto, selectedFilters));
  }

  const filteredCessoes = resultadoFiltrado.filter(cessao =>
    Object.entries(cessao).some(([key, value]) =>
      (key === 'id' ? value.toString() : value) &&
      key !== 'substatus' &&
      key !== 'escritura' &&
      key !== 'operacao_tele' &&
      key !== 'financeiro_tele' &&
      key !== 'financeiro_escrevente' &&
      key !== 'financeiro_juridico' &&
      key !== 'juridico_feito' &&
      key !== 'juridico_feito_data' &&
      key !== 'juridico_afazer' &&
      key !== 'juridico_afazer_data' &&
      key !== 'juridico_andamentoatual' &&
      key !== 'juridico_andamentoatual_data' &&
      key !== 'juridico_andamentoantigo' &&
      key !== 'juridico_andamentoantigo_data' &&
      key !== 'juridico_obs' &&
      key !== 'juridico_obs_data' &&
      key !== 'obs' &&
      value && typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    if (onFilteredCessoes) {
      onFilteredCessoes((prevFilteredCessoes) => {
        if (JSON.stringify(prevFilteredCessoes) !== JSON.stringify(filteredCessoes)) {
          return filteredCessoes;
        }
        return prevFilteredCessoes;
      });
    }
  }, [filteredCessoes, onFilteredCessoes]);

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
                <span className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>

                  <a target="_blank" rel="noopener noreferrer" href={`https://www4.tjrj.jus.br/ejud/processarprecatorio.aspx?N=${cessao.precatorio}&T=%27N%27`}>Ver no TJ</a>
                </span>

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
                style={{ backgroundColor: `${cessao.statusColor}` }}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={`${cessao.substatus ? cessao.substatus : ''}`}
                data-tooltip-place="top"
                className={`px-2 py-1 rounded brightness-110`}>
                <span className="text-black font-bold">{cessao.status}</span>
              </a>

              <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100`}>
                <span className="text-black font-bold dark:text-neutral-100">{cessao.ente_id}</span>
              </span>

              <span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}>
                <span className="text-black font-bold dark:text-neutral-100">{cessao.natureza}</span>
              </span>

              {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}

              {cessao.empresa_id ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.empresa_id}</span></span>) : null}

              {cessao.adv ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.adv}</span></span>) : null}

              {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.falecido}</span></span>) : null}
            </div>
          </div>
          <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="top" />
        </motion.div>
      </CellMeasurer>
    );
  };


  return (
    <>
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
                    Mostrando {filteredCessoes.length} de {minhascessoes || user ? myCessions.length  : myCessions.length >= 1 ? myCessions.length : cessoes.length} cessões
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
    </>
  );
}
