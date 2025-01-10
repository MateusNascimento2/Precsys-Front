import React, { useEffect, useState, useMemo } from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import CountUp from 'react-countup';  // Importando React CountUp

function PieChart() {
  const [endAngle, setEndAngle] = useState(360);
  const [cessoes, setCessoes] = useState([]);
  const [cessionarios, setCessionarios] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [myCessions, setMyCessions] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const userID = String(auth.user.id);

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

  function changeStringFloat(a) {
    const virgulaParaBarra = a.replace(',', '/');
    const valorSemPonto = virgulaParaBarra.replace(/\./g, '');
    const semMoeda = valorSemPonto.replace('R$ ', '');
    const barraParaPonto = semMoeda.replace('/', '.');
    const valorFloat = Number(barraParaPonto);
    return valorFloat;
  }

  function localeTwoDecimals(a) {
    if (Number.isInteger(a)) {
      return a.toLocaleString() + ",00";
    } else {
      return a.toLocaleString();
    }
  }

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchData('/cessoes', setCessoes);
    fetchData('/status', setStatus);
    fetchData('/cessionarios', setCessionarios);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  useEffect(() => {
    const cessionariosPorIDdoUsuarios = cessionarios.filter(cessionario => cessionario.user_id === userID);

    const minhasCessoes = cessionariosPorIDdoUsuarios
      .map(cessionario => {
        const cessao = cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id));
        if (cessao) {
          cessao.exp_recebimento = changeStringFloat(cessionario.exp_recebimento);
        }
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

    setMyCessions(minhasCessoes);
  }, [cessionarios, cessoes, status, userID]);

  const minhasCessoesData = useMemo(() => {
    const statusQtd = [
      { x: 'Em Andamento', y: 0, color: '#d2c7b3', expRecebimentoTotal: 0 },
      { x: 'Em Andamento Com Depósito', y: 0, color: '#bdb4a9', expRecebimentoTotal: 0 },
      { x: 'Em Andamento Com Pendência', y: 0, color: '#aaa59e', expRecebimentoTotal: 0 },
      { x: 'Homologado', y: 0, color: '#9eabaf', expRecebimentoTotal: 0 },
      { x: 'Homologado Com Depósito', y: 0, color: '#aabcb5', expRecebimentoTotal: 0 },
      { x: 'Homologado Com Pendência', y: 0, color: '#9299a8', expRecebimentoTotal: 0 },
      { x: 'Ofício de Transferência Expedido', y: 0, color: '#b2c8b7', expRecebimentoTotal: 0 },
      { x: 'Recebido', y: 0, color: '#bad3b9', expRecebimentoTotal: 0 }
    ];

    myCessions.forEach(cessao => {
      const statusIndex = statusQtd.findIndex(status => status.x === cessao.x);
      if (statusIndex !== -1) {
        statusQtd[statusIndex].y += 1;
        statusQtd[statusIndex].expRecebimentoTotal += parseFloat(cessao.exp_recebimento);
      }
    });

    return statusQtd;
  }, [myCessions]);

  const allZero = minhasCessoesData.every(data => data.y === 0);

  const total = minhasCessoesData.reduce((sum, status) => sum + status.y, 0);

  const handlePieClick = (datum) => {
    setSelectedStatus(datum.x);
  };

  useEffect(() => {
    if (endAngle > 0) {
      const interval = setInterval(() => {
        setEndAngle(prevEndAngle => (prevEndAngle > 0 ? prevEndAngle - 2 : 0));
      }, 15);

      return () => clearInterval(interval);
    }
  }, [endAngle]);

  const filteredCessoes = useMemo(() => {
    const cessoesFiltradas = cessionarios
      .filter(cessionario => cessionario.user_id === userID)
      .map(cessionario => cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id)))
      .filter(cessao => cessao && (
        cessao.precatorio.toLowerCase().includes(filterText.toLowerCase()) ||
        cessao.cedente.toLowerCase().includes(filterText.toLowerCase()) ||
        cessao.processo.toLowerCase().includes(filterText.toLowerCase())
      ));

    setIsLoading(false);

    if (!selectedStatus) return cessoesFiltradas;
    return cessoesFiltradas.filter(cessao => cessao.x === selectedStatus);
  }, [cessionarios, cessoes, selectedStatus, userID, filterText]);

  // Conjunto de dados alternativo para quando todos os valores de y são 0
  const emptyData = [
    { x: 'Sem Cessões', y: 1, color: '#d3d3d3' }
  ];

  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <div className="w-12 h-12">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <Tooltip
              id="my-tooltip"
              style={{
                position: 'absolute',
                zIndex: 60,
                backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF',
                color: isDarkTheme ? '#FFF':'#000',
                fontSize: '12px',
                fontWeight: '500'
              }}
              border={isDarkTheme ? '1px solid rgb(82 82 82)' : "1px solid #d4d4d4"}
              opacity={100}
              place="top"
            />
            <ul className="flex flex-col dark:divide-neutral-600 md:grid md:grid-cols-4 text-[14px]">
              {minhasCessoesData.map((s, index) => (
                <li key={index} className="flex flex-col gap-[2px] py-3 px-2 dark:border-neutral-600 border-b md:border-b md:border-r [&:nth-child(4)]:border-b [&:nth-child(5)]:border-b [&:nth-child(6)]:border-b [&:nth-child(7)]:border-b [&:nth-child(8)]:border-b-0 [&:nth-child(8)]:border-r-0 md:[&:nth-child(4)]:border-r-0 md:[&:nth-child(5)]:border-b-0 md:[&:nth-child(6)]:border-b-0 md:[&:nth-child(7)]:border-b-0 md:[&:nth-child(8)]:border-b-0 md:[&:nth-child(8)]:border-r-0">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{s.x}:</span>
                  {/* Usando React CountUp */}
                  <span>
                    <span data-tooltip-id="my-tooltip" data-tooltip-content={'Valor da expectativa'} data-tooltip-place="right" className="text-sm font-bold text-neutral-900 dark:text-white">
                      <span className='mr-1'>R$</span>
                      <CountUp
                        end={s.expRecebimentoTotal}
                        decimals={2}
                        separator="."
                        decimal=","
                        preserveValue
                      />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 w-full items-center">
            <div className='flex-1 px-2 w-full'>
              <div className="border dark:border-neutral-600 rounded flex items-center gap-2 px-2 py-1 w-full bg-white dark:bg-neutral-800">
                <div className="text-neutral-400">
                  <svg data-tooltip-id="my-tooltip2" data-tooltip-content={'Os valores apresentados são estimativas sujeitas a mudanças, com os totais dependendo da atualização dos status dos precatórios.*'} data-tooltip-place="right" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  disabled={allZero}
                  className={`px-2 py-1 border-none w-full focus:outline-none ${allZero ? 'dark:bg-neutral-800 cursor-not-allowed' : 'bg-white text-black dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400'}`}
                />
              </div>
              <div className="mt-4 h-[260px] overflow-y-auto">
                {selectedStatus ? (
                  <ul className="">
                    {filteredCessoes.map((cessao, index) => (
                      <li key={index} className="flex p-2 items-center border dark:border-neutral-600 rounded  mb-2">
                        <div className='border-r dark:border-neutral-600 pr-2'>
                          <span className="font-bold dark:text-white">
                            {cessao.id}
                          </span>
                        </div>
                        <div className='flex flex-col gap-1 pl-2'>
                          <span className="font-bold dark:text-white hover:underline text-sm"><Link to={`/cessao/${String(cessao.id)}`}>{cessao.precatorio}</Link></span>
                          <span className="text-xs text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cessao.cedente}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="">
                    {myCessions.filter(cessao =>
                      cessao.precatorio.toLowerCase().includes(filterText.toLowerCase()) ||
                      cessao.cedente.toLowerCase().includes(filterText.toLowerCase()) ||
                      cessao.processo.toLowerCase().includes(filterText.toLowerCase())
                    ).map((cessao, index) => (
                      <li key={index} className="flex p-2 items-center border dark:border-neutral-600 rounded  mb-2">
                        <div className='border-r dark:border-neutral-600 pr-2'>
                          <span className="font-bold dark:text-white">
                            {cessao.id}
                          </span>
                        </div>
                        <div className='flex flex-col gap-1 pl-2'>
                          <span className="font-bold dark:text-white hover:underline text-sm"><Link to={`/cessao/${String(cessao.id)}`}>{cessao.precatorio}</Link></span>
                          <span className="text-xs text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cessao.cedente}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-center w-[350px] md:w-[400px]">
              <VictoryPie
                data={allZero ? emptyData : minhasCessoesData}
                startAngle={360}
                width={350}
                height={350}
                innerRadius={85}
                endAngle={endAngle}
                animate={{ duration: 0 }}
                labels={({ datum }) => {
                  if (allZero) {
                    return `${datum.x}`;
                  } else {
                    const percentage = ((datum.y / total) * 100).toFixed(2);
                    return `${datum.x}: ${percentage}%`;
                  }
                }}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: '11px', fill: isDarkTheme ? '#FFF' : '#000' }}
                    flyoutStyle={{ strokeWidth: 0.5, stroke: 'rgb(82 82 82)', fill: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: '#FFF' }}
                    cornerRadius={2}
                    flyoutHeight={22}
                    flyoutPadding={({ text }) =>
                      text.length > 1
                        ? { top: 30, bottom: 30, left: 18, right: 18 }
                        : 40
                    }
                    constrainToVisibleArea
                  />
                }
                colorScale={allZero ? ['#d3d3d3'] : minhasCessoesData.map(cessao => cessao.color)}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onMouseOver: () => {
                        return [
                          {
                            target: "data",
                            mutation: (props) => {
                              const { color } = props.datum;
                              return { style: { fill: color, opacity: 0.8, filter: 'blur(1px)', cursor: 'pointer' } };
                            }
                          },
                          {
                            target: "labels",
                            mutation: () => ({ active: true })
                          }
                        ];
                      },
                      onMouseOut: () => {
                        return [
                          {
                            target: "data",
                            mutation: (props) => {
                              const originalColor = minhasCessoesData.find(cessao => cessao.x === props.datum.x)?.color || '#d3d3d3';
                              return { style: { fill: originalColor, opacity: 1, filter: 'none' } };
                            }
                          },
                          {
                            target: "labels",
                            mutation: () => ({ active: false })
                          }
                        ];
                      },
                      onClick: () => {
                        return [
                          {
                            target: "data",
                            mutation: (props) => {
                              handlePieClick(props.datum);
                              return null;
                            }
                          }
                        ];
                      }
                    }
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PieChart;
