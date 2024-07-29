import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';

export default function PropostasLogsList({ searchQuery, logs, users, empresas, isLoading, filters }) {
  const listRef = useRef();
  const [isLoadingName, setIsLoadingName] = useState(false);
  const [isLoading2, setIsLoading2] = useState(true);

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
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Checa inicialmente o tema
    checkDarkMode();

    // Limpa o observador quando o componente é desmontado
    return () => observer.disconnect();
  }, []);

  const cache = useMemo(() => new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
  }), []);

  const updatedLogs = useMemo(() => {
    setIsLoadingName(true);

    if (users.length > 0 && logs.length > 0 && empresas.length > 0) {
      const mappedLogs = logs.map(log => {
        const user = users.find(user => parseInt(log.usuario) === parseInt(user.id));
        const empresa = empresas.find(empresa => parseInt(log.empresa) === parseInt(empresa.id));
        return user ? {
          ...log,
          userName: user.nome,
          userCpfCnpj: user.cpfcnpj,
          empresaName: empresa ? empresa.nome : 'Empresa não encontrada'
        } : log;
      });
      setIsLoadingName(false);
      return mappedLogs;
    }

    setIsLoadingName(false);
    return logs;
  }, [users, logs, empresas]);

  const filterLogs = useCallback(() => {
    const userFilters = Object.values(filters.users).some(Boolean);
    const empresaFilters = Object.values(filters.empresas).some(Boolean);
    return updatedLogs.filter((log) => {
      const userMatch = !userFilters || filters.users[log.userName];
      const empresaMatch = !empresaFilters || filters.empresas[log.empresaName];
      const dateMatch =
        (!filters.dates.startDate || new Date(log.data) >= new Date(filters.dates.startDate)) &&
        (!filters.dates.endDate || new Date(log.data) <= new Date(filters.dates.endDate));

      return userMatch && empresaMatch && dateMatch;
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

    const data = log.date.split(' ')[0];
    const dataFormatada = data.split('-');
    const hora = log.date.split(' ')[1];

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <motion.div 
          style={{ ...style }} 
          className="dark:bg-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-4 dark:bg-neutral-900">
            <div className="flex flex-col border dark:border-neutral-700 dark:bg-neutral-900 rounded">
              <div className="flex items-center divide-x mb-0 lg:mb-0 dark:divide-neutral-600 dark:border-b-neutral-600 border-b px-2 py-2">
                <span className="font-[700] dark:text-white pr-2 text-[14px] lg:text-[16px]">{log.id}</span>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/usuario/${String(log.usuario)}`}>
                    <span className="font-bold dark:text-white hover:underline">{log.userName || 'Nome do usuário'}</span>
                  </Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{log.userCpfCnpj || 'CPF/CNPJ do usuário'}</span>
                </div>
              </div>
              <div className='flex flex-wrap gap-2 px-2 py-2'>
                <span
                  data-tooltip-id="empresa"
                  data-tooltip-content="Nome da empresa"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {log.empresaName || 'Nome empresa'}
                </span>
                <span
                  data-tooltip-id="beneficiario"
                  data-tooltip-content="Nome do beneficiário"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {log.beneficiario}
                </span>
                <span
                  data-tooltip-id="precatorio"
                  data-tooltip-content="Precatório"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {log.precatorio}
                </span>
                <span
                  data-tooltip-id="processo"
                  data-tooltip-content="Processo"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {log.processo}
                </span>
                <span
                  data-tooltip-id="proposta"
                  data-tooltip-content="Proposta"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {log.proposta}
                </span>
                <span
                  data-tooltip-id="data-proposta"
                  data-tooltip-content="Data da proposta"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {`${dataFormatada[2]}/${dataFormatada[1]}/${dataFormatada[0]}`}
                </span>
                <span
                  data-tooltip-id="hora-proposta"
                  data-tooltip-content="Hora da proposta"
                  data-tooltip-place="right"
                  className='text-[10px] font-bold px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 '
                >
                  {hora}
                </span>
              </div>
            </div>
          </div>
          <Tooltip id="empresa" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
          <Tooltip id="beneficiario" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
          <Tooltip id="precatorio" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
          <Tooltip id="processo" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
          <Tooltip id="proposta" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
          <Tooltip id="data-proposta" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
          <Tooltip id="hora-proposta" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="right" />
        </motion.div>
      </CellMeasurer>
    );
  }, [filteredLogs, cache, isDarkTheme]);

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
            <motion.section
              className="container dark:bg-neutral-900"
              style={{ width: "100%" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
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
            </motion.section>
          )}
        </WindowScroller>
      )}
    </>
  );
}
