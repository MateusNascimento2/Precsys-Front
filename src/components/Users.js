import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import ProfileImage from './ProfileImage';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import DotsButton from './DotsButton';
import { Tooltip } from 'react-tooltip';

function Users({ searchQuery }) {
  const [users, setUsers] = useState([]);
  const [cessionarios, setCessionarios] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get('/users', {
          signal: controller.signal
        });
        console.log(data);
        if (isMounted) setUsers(data);
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    }

    const getCessionarios = async () => {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get('/cessionarios', {
          signal: controller.signal
        });
        console.log(data);
        if (isMounted) setCessionarios(data);
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    }

    getUsers();
    getCessionarios();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50
  })

  const filteredUsers = users
    .filter(user =>
      Object.entries(user).some(([key, value]) => {
        if (key === 'id') {
          return value.toString().includes(searchQuery);
        }
        if (key !== 'admin' &&
          key !== 'ativo' &&
          key !== 'email' &&
          key !== 'password' &&
          key !== 'endereco' &&
          key !== 'telefone' &&
          key !== 'qualificacao' &&
          key !== 'obs' &&
          key !== 'permissao_email' &&
          key !== 'permissao_proposta' &&
          key !== 'permissao_expcartorio' &&
          key !== 'foto' &&
          key !== 'refreshToken' &&
          value && typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );


  const renderRow = ({ index, parent, key, style }) => {

    const user = filteredUsers[index];

    const cessoesDoUsuario = cessionarios.filter((cessionario) => {
      return cessionario.user_id === String(user.id)
    })

    user.qtdCessoes = cessoesDoUsuario.length

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key} >

        <div style={{ ...style }} className="dark:bg-neutral-900">
          <div className="mb-4 dark:bg-neutral-900">
            <div className="flex border dark:border-neutral-700 dark:bg-neutral-900   px-2 py-1 justify-between rounded-t items-center">
              <div className="flex divide-x my-2 dark:divide-neutral-600">
                <div className="w-[40px] h-[40px] mr-2 flex justify-center bg-neutral-100 rounded">
                  <ProfileImage userImage={user.photoUrl} />
                </div>
                <div className="flex flex-col justify-center text-[12px] pl-2">
                  <Link to={`/usuario/${String(user.id)}`}><span className="font-bold dark:text-white hover:underline">{user.nome}</span></Link>
                  <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{user.cpfcnpj}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] rounded-b border-b border-r border-l dark:border-neutral-700  py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900 ">

                <a
                  data-tooltip-id="qtdCessoes"
                  data-tooltip-content={`Quantidade de cessões`}
                  data-tooltip-place="top"
                >
                  <span>
                    <span className="bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1">{user.qtdCessoes}</span>
                  </span>
                </a>


                <a
                  data-tooltip-id='tipoUsuario'
                  data-tooltip-content={'Tipo de usuário'}
                  data-tooltip-place='right'
                >


                  {user.admin
                    ?
                    <span className='bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>ADM</span>
                    :
                    <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>Usuário</span>}
                </a>

                <a
                  data-tooltip-id='statusUsuario'
                  data-tooltip-content={'Status do usuário'}
                  data-tooltip-place='right'

                >
                  {user.ativo
                    ?
                    <span className='bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white font-bold px-2 py-1 rounded flex gap-1'>Ativo</span>
                    :
                    <span className='text-black font-bold dark:text-neutral-100 px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700'>Desativado</span>}
                </a>
              </div>
            </div>
          </div>
        </div>
        <Tooltip id="qtdCessoes" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        <Tooltip id="tipoUsuario" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
        <Tooltip id="statusUsuario" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500' }} border="1px solid #d4d4d4" opacity={100} place="top" />
      </CellMeasurer >
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

                <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">Mostrando {filteredUsers.length} de {users.length} usuários</p>

                <AutoSizer style={{ width: '100%', height: '100%' }}>
                  {({ width }) => (
                    <div ref={registerChild}>
                      <List rowRenderer={renderRow} isScrolling={isScrolling} onScroll={onChildScroll} width={width} autoHeight height={height} rowCount={filteredUsers.length} scrollTop={scrollTop} deferredMeasurementCache={cache} rowHeight={cache.rowHeight} />
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