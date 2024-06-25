import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { Link, useParams } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import useAuth from "../hooks/useAuth";



export default function Lista({ searchQuery, selectedFilters, setData }) {

  const { minhascessoes } = useParams()
  const { auth } = useAuth();
  const userID = String(auth.user.id)
  console.log(userID)

  console.log(minhascessoes);

  const [cessoes, setCessoes] = useState([]);
  const [cessionarios, setCessionarios] = useState([])
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();
  const location = useLocation();

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50
  })

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal, // Pass the abort signal to the Axios request
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err);
        // Check if the error is an abort error
        if (err.name === 'AbortError') {
          console.log('Fetch aborted due to route change or unmount:', err);
        } else if (isMounted) {
          // Handle other types of errors, log them or manage them accordingly without navigating
          console.error('Error fetching data:', err);
          // Only navigate if it's a critical error and component is still mounted
          // navigate('/', { state: { from: location }, replace: true });
        }
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchData('/cessionarios', setCessionarios),
          fetchData('/cessoes', setCessoes),
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
    if (!minhascessoes) return;

    const cessionariosPorIDdoUsuarios = cessionarios.filter(cessionario => cessionario.user_id === userID);
    const filteredCessoes = cessionariosPorIDdoUsuarios
      .map(cessionario => cessoes.find(cessao => cessao.id === cessionario.cessao_id))
      .filter(cessao => cessao !== undefined);

    if (!arraysAreEqual(filteredCessoes, cessoes)) {
      setCessoes(filteredCessoes);
    }
  }, [minhascessoes, cessionarios, cessoes, userID]);


  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].id !== arr2[i].id) {
        return false;
      }
    }
    return true;
  }


  useEffect(() => {
    let dataCessoes = [];

    cessoes.forEach(cessao => {
      dataCessoes.push(cessao.data_cessao);

      // Restante do seu código para atualizar outras propriedades...
    });

    setData(dataCessoes);
    setDatas(dataCessoes);
  }, [cessoes]);


  const anuenciaValores = {
    "0": "Sem anuência",
    "1": "Honorários",
    "2": "Com anuência",
    "3": "Quitação"
  }

  const falecidoValores = {
    "0": "Vivo",
    "1": "Não deixou bens",
    "2": "Deixou bens",
    "3": "Solicitada habilitação",
    "4": "Herdeiros habilitados",

  }

  cessoes.forEach(cessao => {

    // Atualiza propriedades de status
    const statusAtualizado = status.find(s => parseInt(cessao.status) === parseInt(s.id));
    if (statusAtualizado) {
      cessao.status = statusAtualizado.nome;
      cessao.statusColor = statusAtualizado.extra;
    }

    // Atualiza propriedades de ente_id
    const orcamentoAtualizado = orcamentos.find(o => parseInt(cessao.ente_id) === parseInt(o.id));
    if (orcamentoAtualizado && cessao.ano) {
      cessao.ente_id = orcamentoAtualizado.apelido + " - " + cessao.ano;
    } else if (orcamentoAtualizado) {
      cessao.ente_id = orcamentoAtualizado.apelido;
    }

    // Atualiza propriedades de natureza
    const naturezaAtualizada = natureza.find(n => parseInt(cessao.natureza) === parseInt(n.id));
    if (naturezaAtualizada) {
      cessao.natureza = naturezaAtualizada.nome;
    }

    // Atualiza propriedades de empresa_id
    const empresaAtualizada = empresas.find(e => parseInt(cessao.empresa_id) === parseInt(e.id));
    if (empresaAtualizada) {
      cessao.empresa_id = empresaAtualizada.nome;
    }

    // Atualiza propriedades de adv
    const anuencia = anuenciaValores[cessao.adv];
    if (anuencia) {
      cessao.adv = anuencia;
    }

    // Atualiza propriedades de falecido
    const falecido = falecidoValores[cessao.falecido];
    if (falecido) {
      cessao.falecido = falecido;
    }

    cessao.id = String(cessao.id);

  });





  cessoes.forEach(cessao => {
    delete cessao.ano;
  })

  function aplicarFiltros(dados, filtros) {
    // Mapeia as chaves e seus valores dos filtros em um objeto
    const filtroObj = filtros.reduce((acc, filtro) => {
      const chave = Object.keys(filtro)[0];
      acc[chave] = acc[chave] || [];
      acc[chave].push(filtro[chave]);
      return acc;
    }, {});

    // Função auxiliar para verificar se os dados satisfazem todos os filtros de uma chave
    const verificarFiltrosChave = (chave, valor) => {
      if (!filtroObj[chave]) return true; // Se não houver filtro para a chave, retorna verdadeiro
      return filtroObj[chave].includes(valor); // Verifica se o valor está presente nos filtros da chave
    };

    // Função para verificar se uma data está entre as datas de início e fim
    const verificarData = (data, inicio, fim) => {
      if (inicio && fim) {
        return data >= inicio && data <= fim;
      } else if (inicio) {
        return data >= inicio;
      } else {
        return true; // Retorna verdadeiro se nenhum dos dois for fornecido
      }
    };

    // Verifica se os dados satisfazem todos os filtros, incluindo as datas
    return Object.entries(dados).every(([chave, valor]) => {
      // Se a chave for 'data_cessao', verifica se está dentro do intervalo de dataInicio e dataFim
      if (chave === 'data_cessao' && (filtroObj.dataInicio || filtroObj.dataFim)) {
        const dataInicio = filtroObj.dataInicio ? filtroObj.dataInicio : datas[0]; // Data mínima como padrão
        const dataFim = filtroObj.dataFim ? filtroObj.dataFim : datas[datas.length - 1]; // Data atual como padrão
        return verificarData(valor, dataInicio, dataFim);
      }
      // Se a chave não é data_cessao, aplica os outros filtros normalmente
      return verificarFiltrosChave(chave, valor);
    });
  }

  console.log('filters', selectedFilters)


  // Aplica o filtro em cada objeto do array
  let resultadoFiltrado = cessoes.filter(objeto => aplicarFiltros(objeto, selectedFilters));

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

  console.log(cessoes)
  console.log(cessionarios)


  const renderRow = ({ index, parent, key, style }) => {
    const cessao = filteredCessoes[index];

    return (

      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key} >

        <div style={{ ...style }} className="dark:bg-neutral-900">
          <div className="mb-4 dark:bg-neutral-900">
            <div className="flex border dark:border-neutral-700 dark:bg-neutral-900   px-2 py-1 justify-between rounded-t items-center">
              <div className="flex">
                <div className="border-r dark:border-neutral-700  pr-2 my-3 flex items-center justify-center">
                  <span className="font-[700] dark:text-white">{cessao.id}</span>
                </div>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/cessao/${String(cessao.id)}`}><span className="font-bold dark:text-white hover:underline">{cessao.precatorio}</span></Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cessao.cedente}</span>
                </div>
              </div>
              <DotsButton>
                <span className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"><a href={cessao.requisitorio} download target="_blank">Requisitório</a></span>
                <span className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"><a href={cessao.escritura} download target="_blank">Escritura</a></span>
              </DotsButton>
            </div>


            <div className="text-[10px] rounded-b border-b border-r border-l dark:border-neutral-700  py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900 ">

              <a
                style={{ backgroundColor: `${cessao.statusColor}` }}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={`${cessao.substatus ? cessao.substatus : ''}`}
                data-tooltip-place="top"
                className={`px-2 py-1 rounded brightness-110`}>
                <span className="text-black font-bold">{cessao.status}</span>
              </a>

              <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 `}>
                <span className="text-black font-bold dark:text-neutral-100">{cessao.ente_id}</span>
              </span>

              <span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}>
                <span className="text-black font-bold dark:text-neutral-100">{cessao.natureza}</span>
              </span>

              {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100 ">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}

              {cessao.empresa_id ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}><span className="text-black font-bold dark:text-neutral-100">{cessao.empresa_id}</span></span>) : null}

              {cessao.adv ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}><span className="text-black font-bold dark:text-neutral-100">{cessao.adv}</span></span>) : null}

              {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}><span className="text-black font-bold dark:text-neutral-100">{cessao.falecido}</span></span>) : null}
            </div>
          </div>
          <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500', maxWidth:'220px' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        </div>
      </CellMeasurer>


    );
  };


  return (
    <>
      {isLoading ? ( // Verifica se isLoading é verdadeiro
        <LoadingSpinner /> // Se isLoading for verdadeiro, exibe o LoadingSpinner
      ) : (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
            <section className="container dark:bg-neutral-900" style={{ width: "100%" }} >
              <div className="dark:bg-neutral-900 relative h-full">

                <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">Mostrando {filteredCessoes.length} de {cessoes.length} cessões</p>

                <AutoSizer style={{ width: '100%', height: '100%' }}>
                  {({ width }) => (
                    <div ref={registerChild}>
                      <List rowRenderer={renderRow} isScrolling={isScrolling} onScroll={onChildScroll} width={width} autoHeight height={height} rowCount={filteredCessoes.length} scrollTop={scrollTop} deferredMeasurementCache={cache} rowHeight={cache.rowHeight} />
                    </div>
                  )}
                </AutoSizer>

              </div>
            </section>
          )}
        </WindowScroller>
      )}
    </>
  );

}