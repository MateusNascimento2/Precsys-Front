import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { Link } from "react-router-dom";


export default function Lista({ searchQuery, selectedFilters }) {
  const [cessoes, setCessoes] = useState([]);
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cessoesFiltradas, setCessoesFiltradas] = useState([]) // Estado para controlar o carregamento
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
          signal: controller.signal
        });
        if (isMounted) setter(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    };

    fetchData('/cessoes', setCessoes);
    fetchData('/status', setStatus);
    fetchData('/orcamentos', setOrcamentos);
    fetchData('/natureza', setNatureza);
    fetchData('/empresas', setEmpresas);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

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
  });

  cessoes.forEach(cessao => {
    delete cessao.ano;
  })

  console.log(cessoes)

  console.log('selected in filter', selectedFilters)

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

    // Verifica se os dados satisfazem todos os filtros
    return Object.entries(dados).every(([chave, valor]) => verificarFiltrosChave(chave, valor));
  }


  // Aplica o filtro em cada objeto do array
  let resultadoFiltrado = cessoes.filter(objeto => aplicarFiltros(objeto, selectedFilters));

  console.log(resultadoFiltrado)

  const filteredCessoes = resultadoFiltrado.filter(cessao =>
    Object.entries(cessao).some(([key, value]) =>
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



  const renderRow = ({ index, parent, key, style }) => {
    const cessao = filteredCessoes[index];
    const listLength = filteredCessoes.length;


    return (
      <CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>

        <div style={{ ...style }} className="dark:bg-neutral-900">
          <div className="mb-4 dark:bg-neutral-900">
            <div className="flex border dark:border-neutral-700 dark:bg-neutral-900   px-2 py-1 justify-between rounded-t items-center">
              <div className="flex">
                <div className="border-r dark:border-neutral-700  pr-2 my-3 flex items-center justify-center">
                  <span className="font-[700] dark:text-white">{cessao.id}</span>
                </div>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/precatorio/${String(cessao.id)}`}><span className="font-bold dark:text-white hover:underline">{cessao.precatorio}</span></Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cessao.cedente}</span>
                </div>
              </div>
              <DotsButton listLength={listLength} cessaoID={cessao.id} requisitorioFile={cessao.requisitorio} escrituraFile={cessao.escritura} />
            </div>
            <div className="text-[10px] rounded-b border-b border-r border-l dark:border-neutral-700  py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900 ">
              <span style={{ backgroundColor: `${cessao.statusColor}` }} className={`px-2 py-1 rounded brightness-110`}><span className="text-black font-bold">{cessao.status}</span></span>

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

        </div>
      </CellMeasurer>
    );
  };

  return (
    <>
      {isLoading ? ( // Verifica se isLoading é verdadeiro
        <LoadingSpinner /> // Se isLoading for verdadeiro, exibe o LoadingSpinner
      ) : (
        <section className="container dark:bg-neutral-900" style={{ width: "100%" }} >
          <div className="dark:bg-neutral-900">
            <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">Mostrando {filteredCessoes.length} de {cessoes.length} cessões</p>
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer>
                  {({ width }) => (
                    <List rowRenderer={renderRow} isScrolling={isScrolling} onScroll={onChildScroll} width={width} autoHeight height={height} rowCount={filteredCessoes.length} scrollTop={scrollTop} deferredMeasurementCache={cache} rowHeight={cache.rowHeight}
                    />
                  )}
                </AutoSizer>)}
            </WindowScroller>
          </div>
        </section>
      )}
    </>
  );
}