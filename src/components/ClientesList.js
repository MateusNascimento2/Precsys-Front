import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import ProfileImage from './ProfileImage';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';
import useAuth from "../hooks/useAuth";


function ClientesList({ searchQuery, user }) {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  console.log(clientes)

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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [clientes] = await Promise.all([
          axiosPrivate.get(`/cliente/${user ? user.id : auth.user.id}`, { signal: controller.signal })
        ]);

        if (isMounted) {
          setIsLoading(false);
          setClientes(clientes.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, auth.user.id]);

  const cache = useMemo(() => new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  }), []);

  /*   const filterUsersByGestor = (users, clientes, gestorId) => {
      // Filtra os clientes que têm o `gestorId` como gestor
      const clientesDoGestor = clientes.filter(cliente => String(cliente.id_gestor) === String(gestorId));
  
      // Pega os IDs dos usuários que têm o `gestorId` como gestor
      const usuariosIds = clientesDoGestor.map(cliente => cliente.id_usuario);
  
      // Filtra os usuários que têm IDs correspondentes aos `usuariosIds`
      return users.filter(user => usuariosIds.includes(String(user.id)));
    }; */

  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente =>
      Object.entries(cliente).some(([key, value]) => {
        if (key === 'id') {
          return value.toString().includes(searchQuery);
        }
        if (typeof value === 'string' && value && ![
          'admin', 'ativo', 'total_cessoes'
        ].includes(key)) {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
  }, [clientes, searchQuery]);


  const renderRow = useCallback(({ index, parent, key, style }) => {
    const cliente = filteredClientes[index];

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <motion.div
          style={style}
          className="dark:bg-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="mb-4 dark:bg-neutral-900">
            <div className="flex border dark:border-neutral-700 dark:bg-neutral-900 px-2 py-1 justify-between rounded-t items-center">
              <div className="flex divide-x my-2 dark:divide-neutral-600">
                <div className="w-[40px] h-[40px] mr-2 flex justify-center bg-neutral-100 rounded">
                  <ProfileImage userImage={cliente.avatarUrl} />
                </div>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/cliente/${String(cliente.id_usuario)}`}>
                    <span className="font-bold dark:text-white hover:underline">{cliente.nome_cliente}</span>
                  </Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{cliente.cpfcnpj}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] rounded-b border-b border-r border-l dark:border-neutral-700 py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900">
                <a
                  data-tooltip-id="qtdCessoes"
                  data-tooltip-content="Quantidade de cessões"
                  data-tooltip-place="top"
                >
                  <span className="bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1">
                    {/* Assumindo que você tenha `qtdCessoes` no objeto `user`, caso contrário, remova essa linha */}
                    {cliente.total_cessoes}
                  </span>
                </a>
                <a
                  data-tooltip-id='tipoUsuario'
                  data-tooltip-content='Tipo de usuário'
                  data-tooltip-place='right'
                >
                  {cliente.admin
                    ? <span className='bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>ADM</span>
                    : <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>Usuário</span>}
                </a>
                <a
                  data-tooltip-id='statusUsuario'
                  data-tooltip-content='Status do usuário'
                  data-tooltip-place='right'
                >
                  {cliente.ativo
                    ? <span className='bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>Ativo</span>
                    : <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>Desativado</span>}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        <Tooltip
          id="qtdCessoes"
          style={{
            position: 'absolute',
            zIndex: 60,
            backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF',
            color: isDarkTheme ? '#FFF' : '#000',
            fontSize: '12px',
            fontWeight: '500',
          }}
          border={isDarkTheme ? '1px solid rgb(82 82 82)' : '1px solid #d4d4d4'}
          opacity={100}
          place="top"
        />
        <Tooltip
          id="tipoUsuario"
          style={{
            position: 'absolute',
            zIndex: 60,
            backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF',
            color: isDarkTheme ? '#FFF' : '#000',
            fontSize: '12px',
            fontWeight: '500',
          }}
          border={isDarkTheme ? '1px solid rgb(82 82 82)' : '1px solid #d4d4d4'}
          opacity={100}
          place="right"
        />
        <Tooltip
          id="statusUsuario"
          style={{
            position: 'absolute',
            zIndex: 60,
            backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF',
            color: isDarkTheme ? '#FFF' : '#000',
            fontSize: '12px',
            fontWeight: '500',
          }}
          border={isDarkTheme ? '1px solid rgb(82 82 82)' : '1px solid #d4d4d4'}
          opacity={100}
          place="right"
        />
        <Tooltip
          id="gestorUsuario"
          style={{
            position: 'absolute',
            zIndex: 60,
            backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF',
            color: isDarkTheme ? '#FFF' : '#000',
            fontSize: '12px',
            fontWeight: '500',
          }}
          border={isDarkTheme ? '1px solid rgb(82 82 82)' : '1px solid #d4d4d4'}
          opacity={100}
          place="right"
        />
      </CellMeasurer>
    );
  }, [filteredClientes, cache, isDarkTheme]);

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
                  Mostrando {filteredClientes.length} de {clientes.length} usuários
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
                        rowCount={filteredClientes.length}
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
}

export default ClientesList;
