import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function GestorPerfil({ user }) {
  const [users, setUsers] = useState([]);
  const [gestoresSelecionados, setGestoresSelecionados] = useState([]);
  const [selectedGestores, setSelectedGestores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

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

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchData('/users', setUsers),
          fetchData(`/cliente/${user.id}`, setGestoresSelecionados),
        ]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, user.id]);

  useEffect(() => {
    const mappedGestores = gestoresSelecionados.map(gestorSelecionado => {
      const user = users.find(u => u.id === parseInt(gestorSelecionado.id_gestor));
      if (user) {
        return {
          value: gestorSelecionado.id_gestor,
          label: user.nome
        };
      } else {
        return null;
      }
    }).filter(g => g !== null); // Remove gestores que foram mapeados como `null`

    setSelectedGestores(mappedGestores);
  }, [gestoresSelecionados, users]);

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  };

  const handleChange = (selectedOptions) => {
    setSelectedGestores(selectedOptions || []);
  };

  const handleSaveGestores = async () => {
    const isDarkMode = localStorage.getItem('darkMode');
    try {
      setIsLoading(true);
      const currentGestores = selectedGestores.map(g => g.value);

      // Adicionar novos gestores
      const newGestores = selectedGestores.filter(g => !gestoresSelecionados.some(gg => gg.id_gestor === g.value));
      for (const gestor of newGestores) {
        await axiosPrivate.post('/cliente', { id_cliente: user.id, id_gestor: gestor.value });
      }

      // Remover gestores que foram desmarcados
      const gestoresToRemove = gestoresSelecionados.filter(gg => !currentGestores.includes(gg.id_gestor));
      for (const gestor of gestoresToRemove) {
        await axiosPrivate.delete(`/cliente/${user.id}/${gestor.id_gestor}`);
      }

      // Recarregar os dados após salvar
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
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });

    } catch (err) {
      console.log(err);
      toast.error('Error ao salvar gestor(es): ' + err, {
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

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchData('/users', setUsers),
        fetchData(`/cliente/${user.id}`, setGestoresSelecionados),
      ]);
    } catch (err) {
      console.log(err);
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
