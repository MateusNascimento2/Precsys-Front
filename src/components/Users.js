import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const {data} = await axiosPrivate.get('/users', {
          signal: controller.signal
        });
        console.log(data);
        if (isMounted) setUsers(data);
      } catch (err) {
        console.log(err);
        navigate('/', {state: { from: location }, replace: true});
      }
    }

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  return (
    <article>
      <h2>Lista de Usuários</h2>
      {users?.length
        ? (
          <ul>
            {users.map((user, index) => <li key={index}>{user?.nome}</li>)}
          </ul>
        ) : <p>Nenhum usuário encontrado.</p>
      } 
    </article>
  )

}

export default Users;