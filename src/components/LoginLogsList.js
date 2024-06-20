import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Link } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import { Tooltip } from 'react-tooltip';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

export default function LoginLogsList({ searchQuery }) {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });
        console.log(data);
        if (isMounted) setState(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData('/loginLogs', setLogs);
    fetchData('/users', setUsers);



    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  const cache = useMemo(() => new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  }), []);


  logs.forEach((log) => {
    const user = users.find(user => parseInt(log.usuario) === parseInt(user.id))
    if (user) {
      log.userName = user.nome
      log.userCpfCnpj = user.cpfcnpj
    }
  })

  console.log(logs)



  const renderRow = useCallback(({ index, parent, key, style }) => {
    const log = logs[index];

    const data = log.data.split('T')[0]
    log.data_formatada = data.split('-')

    const hora = log.data.split('T')[1]
    const hora_formatada = hora.replace('.000Z', '')

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <div style={style} className="dark:bg-neutral-900">
          <div className="mb-4 dark:bg-neutral-900">
            <div className="grid grid-cols-4 border dark:border-neutral-700 dark:bg-neutral-900 px-2 py-1 rounded-t items-center">
              <div className="flex flex-none items-center divide-x my-2 dark:divide-neutral-600">
                <span className="font-[700] dark:text-white pr-2">{log.id}</span>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/usuario/${String(log.usuario)}`}>
                    <span className="font-bold dark:text-white hover:underline">{log.userName}</span>
                  </Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{log.userCpfCnpj}</span>
                </div>
              </div>


              <span
                data-tooltip-id="Ip do usuário"
                data-tooltip-content="Ip do usuário"
                data-tooltip-place="bottom" className='text-[14px] text-center dark:text-white'
              >
                {log.ip}
              </span>

              <span data-tooltip-id="Data do acesso"
                data-tooltip-content="Data do acesso"
                data-tooltip-place="bottom" className='text-[14px] text-center dark:text-white'>
                {log.data_formatada[2]}/{log.data_formatada[1]}/{log.data_formatada[0]}
              </span>

              <span data-tooltip-id="Hora do acesso"
                data-tooltip-content="Hora do acesso"
                data-tooltip-place="bottom" className='text-[14px] text-center dark:text-white'>
                {hora_formatada}
              </span>


            </div>
          </div>
        </div>
        <Tooltip id="Ip do usuário" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        <Tooltip id="Data do acesso" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        <Tooltip id="Hora do acesso" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
      </CellMeasurer>
    );
  }, [logs, cache]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
            <section className="container dark:bg-neutral-900" style={{ width: "100%" }}>
              <div className="dark:bg-neutral-900 relative h-full">
                <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
                  Mostrando {logs.length} logs.
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
                        rowCount={logs.length}
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
    </>
  )
} 