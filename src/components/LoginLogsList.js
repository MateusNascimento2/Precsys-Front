import React, { useMemo, useCallback, useRef } from 'react';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';

const LoginLogsList = ({ searchQuery, logs, users, isLoading, filters }) => {
  const listRef = useRef();

  const cache = useMemo(() => new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  }), []);

  const updatedLogs = useMemo(() => {
    if (users.length > 0 && logs.length > 0) {
      return logs.map(log => {
        const user = users.find(user => parseInt(log.usuario) === parseInt(user.id));
        return user ? {
          ...log,
          userName: user.nome,
          userCpfCnpj: user.cpfcnpj,
        } : log;
      });
    }
    return logs;
  }, [users, logs]);

  const filterLogs = useCallback(() => {
    const userFilters = Object.values(filters.users).some(Boolean);
    return updatedLogs.filter((log) => {
      const userMatch = !userFilters || filters.users[log.userName];
      const dateMatch =
        (!filters.dates.startDate || new Date(log.data) >= new Date(filters.dates.startDate)) &&
        (!filters.dates.endDate || new Date(log.data) <= new Date(filters.dates.endDate));

      return userMatch && dateMatch;
    });
  }, [updatedLogs, filters]);

  const filteredLogs = useMemo(() => filterLogs().filter(log =>
    Object.entries(log).some(([key, value]) =>
      value && typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ), [filterLogs, searchQuery]);

  const renderRow = useCallback(({ index, parent, key, style }) => {
    const log = filteredLogs[index];
    if (!log) {
      return null;
    }

    const data = log.data.split('T')[0];
    const dataFormatada = data.split('-');
    const hora = log.data.split('T')[1];
    const horaFormatada = hora.replace('.000Z', '');

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <div style={style} className="dark:bg-neutral-900">
          <div className="mb-5 dark:bg-neutral-900">
            <div className="grid lg:grid-cols-2 border dark:border-neutral-700 dark:bg-neutral-900 rounded items-center">
              <div className="flex flex-none items-center divide-x mb-2 lg:mb-0 dark:divide-neutral-600 dark:border-b-neutral-600 border-b lg:border-b-0 px-2 py-2">
                <span className="font-[700] dark:text-white pr-2 text-[14px] lg:text-[16px]">{log.id}</span>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/usuario/${String(log.usuario)}`}>
                    <span className="font-bold dark:text-white hover:underline">{log.userName}</span>
                  </Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{log.userCpfCnpj}</span>
                </div>
              </div>
              <div className='flex justify-around px-2 pb-2 lg:px-0 lg:pb-0'>
                <span
                  data-tooltip-id="Ip do usuário"
                  data-tooltip-content="Ip do usuário"
                  data-tooltip-place="bottom" className='text-[12px] lg:text-[14px] text-center dark:text-white'
                >
                  {log.ip}
                </span>
                <span data-tooltip-id="Data do acesso"
                  data-tooltip-content="Data do acesso"
                  data-tooltip-place="bottom" className='text-[12px] lg:text-[14px] text-center dark:text-white'>
                  {dataFormatada[2]}/{dataFormatada[1]}/{dataFormatada[0]}
                </span>
                <span data-tooltip-id="Hora do acesso"
                  data-tooltip-content="Hora do acesso"
                  data-tooltip-place="bottom" className='text-[12px] lg:text-[14px] text-center dark:text-white'>
                  {horaFormatada}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Tooltip id="Ip do usuário" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        <Tooltip id="Data do acesso" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        <Tooltip id="Hora do acesso" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
      </CellMeasurer>
    );
  }, [filteredLogs, cache]);

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
            <section className="container dark:bg-neutral-900" style={{ width: "100%" }}>
              <div className="dark:bg-neutral-900 relative h-full">
                <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
                  Mostrando {filteredLogs.length} de {logs.length} logs
                </p>
                <AutoSizer style={{ width: '100%', height: '100%' }}>
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
                        rowCount={filteredLogs.length}
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
  );
};

export default React.memo(LoginLogsList);
