import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function GestorPerfil({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedGestores, setSelectedGestores] = useState([]);
  const [originalGestores, setOriginalGestores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

  // Formata todos os usuários para o Select
  const handleSelectValues = (array, value) => {
    return array.map(item => ({
      value: item.id,
      label: item[value]
    }));
  };

  const handleChange = (selectedOptions) => {
    setSelectedGestores(selectedOptions || []);
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, gestoresRes] = await Promise.all([
        axiosPrivate.get('/users'),
        axiosPrivate.get(`/gestores/${user.id}`)
      ]);

      setUsers(usersRes.data);

      setSelectedGestores(gestoresRes.data);
      setOriginalGestores(gestoresRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, user.id]);

  const handleSaveGestores = async () => {
    const isDarkMode = localStorage.getItem('darkMode');

    try {
      setIsLoading(true);
      const currentGestores = selectedGestores.map(g => g.value);
      const originalIds = originalGestores.map(g => g.value);

      // Gestores adicionados
      const newGestores = selectedGestores.filter(g => !originalIds.includes(g.value));
      for (const gestor of newGestores) {
        await axiosPrivate.post('/cliente', { id_cliente: user.id, id_gestor: gestor.value });
      }

      // Gestores removidos
      const gestoresToRemove = originalGestores.filter(g => !currentGestores.includes(g.value));
      for (const gestor of gestoresToRemove) {
        await axiosPrivate.delete(`/cliente/${user.id}/${gestor.value}`);
      }

      await fetchAllData();

      toast.success('Gestor(es) salvo(s) com sucesso!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
    } catch (err) {
      console.log(err);
      toast.error('Erro ao salvar gestor(es): ' + err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='w-full h-[190px] lg:h-[177px] flex justify-center items-center'>
          <div className='w-8 h-8'>
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <section className='mt-12 border-t dark:border-neutral-600 pt-12'>
          <ToastContainer />
          <div className='mb-4 mt-4 lg:mt-0'>
            <span className='font-semibold dark:text-white'>Gestor</span>
          </div>
          <div>
            <Select
              placeholder={'Adicionar gestor'}
              options={handleSelectValues(users, 'nome')}
              value={selectedGestores}
              isClearable={true}
              onChange={handleChange}
              name='gestor'
              isMulti
              noOptionsMessage={() => 'Nenhum usuário encontrado'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-neutral-400 text-[15px] py-1 lg:py-2'),
                control: () => ('px-2 flex items-center'),
                input: () => ('text-neutral-400'),
                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1'),
                valueContainer: () => ('flex gap-2'),
                multiValue: () => ('bg-neutral-100 px-2 rounded dark:bg-neutral-700')
              }}
              styles={customStyles}
            />

            <button
              className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-4'
              onClick={handleSaveGestores}
            >
              Salvar gestores
            </button>
          </div>
        </section>
      )}
    </>
  );
}