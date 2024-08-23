import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";

export default function GestorPerfil({ user }) {
  const [users, setUsers] = useState([]);
  const [gestores, setGestores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  console.log(user)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchData('/users', setUsers),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };

  }, []);

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  }

  const handleChange = (selectedOptions) => {
    setGestores(selectedOptions ? selectedOptions : []);
  };

  const handleAddClientes = async () => {
    try {
      for (const gestor of gestores) {
        await axiosPrivate.post('/cliente', { id_cliente: user.id, id_gestor: gestor.value  });
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(gestores)

  return (
    <>
      <section className='mt-12 border-t dark:border-neutral-600 pt-12'>
        <div className='mb-4 mt-4 lg:mt-0'>
          <span className='font-semibold dark:text-white'>Gestor</span>
        </div>
        <div>
          <Select
            placeholder={'Adicionar gestor'}
            options={handleSelectValues(users, 'nome')}
            isClearable={true}
            onChange={handleChange}
            name='gestor'
            isMulti
            noOptionsMessage={() => 'Nenhum usuário encontrado'}
            unstyled // Remove all non-essential styles
            classNames={{
              container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-neutral-400 text-[15px] h-[40px]'),
              control: () => ('px-2 mt-[9px] flex items-center'),
              input: () => ('text-neutral-400'),
              menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
              menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
              option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1'),
              valueContainer: () => ('flex gap-2'),
              multiValue: () => ('bg-neutral-100 px-2 rounded dark:bg-neutral-700')
            }}
            styles={customStyles}
          />
          {gestores.length > 0 ? <button className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2' onClick={(e) => handleAddClientes(e)}>Salvar gestores</button> : null}
        </div>
      </section>
    </>
  )
}