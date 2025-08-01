import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import ProfileImage from './ProfileImage';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';


function Users({ searchQuery, selectedFilters }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

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
        setIsLoading(true)
        const [usersData] = await Promise.all([
          axiosPrivate.get('/users', { signal: controller.signal }),
        ]);

        if (isMounted) {
          setUsers(usersData.data);
          setIsLoading(false);
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
  }, [axiosPrivate]);

  const cache = useMemo(() => new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  }), []);

  const filterUsers = useCallback(() => {
    return users.filter((user) => {
      // Filtro por Status
      const statusAtivo = selectedFilters.status.Ativo;
      const statusDesativado = selectedFilters.status.Desativado;
      const statusValido =
        (statusAtivo && user.ativo === 1) ||
        (statusDesativado && user.ativo === 0) ||
        (!statusAtivo && !statusDesativado); // Se nenhum for selecionado, ignora filtro

      // Filtro por Tipo
      const tipoAdmin = selectedFilters.tipo.Administrador;
      const tipoUsuario = selectedFilters.tipo.Usuário;
      const tipoAdvogado = selectedFilters.tipo.Advogado;
      const tipoValido =
        (tipoAdmin && user.admin === 1) ||
        (tipoUsuario && user.admin === 0) ||
        (tipoAdvogado && user.advogado === 1) ||
        (!tipoAdmin && !tipoUsuario && !tipoAdvogado); // Se nenhum for selecionado, ignora filtro

      // Filtro por Gestor
      const gestoresSelecionados = Object.entries(selectedFilters.gestores)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      const gestorValido =

        gestoresSelecionados.length === 0 || // Nenhum selecionado → passa tudo
        user.gestores.some(g => gestoresSelecionados.includes(g.nome_gestor));

      // Retorna usuário que passa por todos os filtros
      return statusValido && tipoValido && gestorValido;
    });
  }, [users, selectedFilters]);

  const resultadoFiltrado = filterUsers();

  const filteredUsers = useMemo(() => {
    return resultadoFiltrado.filter(user =>
      Object.entries(user).some(([key, value]) => {
        if (key === 'id') {
          return value.toString().includes(searchQuery);
        }
        if (typeof value === 'string' && value && ![
          'admin', 'ativo', 'email', 'password', 'endereco', 'telefone',
          'qualificacao', 'obs', 'permissao_email', 'permissao_proposta',
          'permissao_expcartorio', 'foto', 'refreshToken'
        ].includes(key)) {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
  }, [resultadoFiltrado, searchQuery]);


  const renderRow = useCallback(({ index, parent, key, style }) => {
    const user = filteredUsers[index];

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
                  <ProfileImage userImage={user.photoUrl} />
                </div>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/usuario/${String(user.id)}`}>
                    <span className="font-bold dark:text-white hover:underline">{user.nome}</span>
                  </Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{user.cpfcnpj}</span>
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
                    {user.qtdCessoes}
                  </span>
                </a>
                <a
                  data-tooltip-id='tipoUsuario'
                  data-tooltip-content='Tipo de usuário'
                  data-tooltip-place='right'
                >
                  {user.admin
                    ? <span className='bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>ADM</span>
                    : user.advogado 
                    ?  <span className='bg-amber-800 dark:bg-orange-400 dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>Jurídico</span>
                    : <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>Usuário</span>}
                </a>
                <a
                  data-tooltip-id='statusUsuario'
                  data-tooltip-content='Status do usuário'
                  data-tooltip-place='right'
                >
                  {user.ativo
                    ? <span className='bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>Ativo</span>
                    : <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>Desativado</span>}
                </a>
                {user.gestores.map((gestor) => {

                  return (
                    <a
                      key={gestor.id_gestor}
                      data-tooltip-id='gestorUsuario'
                      data-tooltip-content='Gestor do usuário'
                      data-tooltip-place='right'
                    >
                      <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>{gestor.nome_gestor}
                      </span>
                    </a>
                  );

                })}
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
  }, [filteredUsers, cache, isDarkTheme]);

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
                  Mostrando {filteredUsers.length} de {users.length} usuários
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
                        rowCount={filteredUsers.length}
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

export default Users;
