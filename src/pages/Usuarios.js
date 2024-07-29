import React, { useState, useRef } from 'react';
import Users from '../components/Users';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import UserFilter from '../components/UserFilter';
import Modal from '../components/Modal';
import AdicionarUsuario from '../components/AdicionarUsuario';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { motion } from 'framer-motion';

function Usuarios() {
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const formRef = useRef(null); // Create a ref for the form
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    const isDarkMode = localStorage.getItem('darkMode');
    console.log(formData);

    if (
      formData.nome.length < 3 ||
      (formData.cpfcnpj.length !== 14 && formData.cpfcnpj.length !== 18) ||
      formData.email.length === 0 ||
      formData.password.length < 0 ||
      !formData.admin
    ) {
      toast.error('Os campos de nome, cpf/cnpj, email, senha e cargo precisam ser preenchidos!', {
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
      console.log('caiu no if')
    } else {
      try {
        setIsLoading(true)
        await axiosPrivate.post('/users', formData);
      } catch (err) {
        console.log(err.response.data.error)
        toast.error(`Erro ao cadastrar usuário: ${err.response.data.error}`, {
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
        setIsLoading(false);
        return;
      }
    }

    toast.success(`Usuário cadastrado com sucesso!`, {
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

    setIsLoading(false)
  };

  const initialFilters = {
    status: {
      Ativo: false,
      Desativado: false,
    },
    tipo: {
      Usuário: false,
      Administrador: false,
    },
  };

  const [filters, setFilters] = useState(initialFilters);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  const handleShow = () => {
    setShow((prevState) => !prevState);
    document.body.style.overflow = show ? 'scroll' : 'hidden';
  };

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <motion.main
        className='container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='flex justify-between items-center'>
          <motion.h2 
            className='font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white' 
            id='usuarios'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Usuários
          </motion.h2>
          <Modal
            botaoAbrirModal={
              <motion.button 
                title='Adicionar novo usuário' 
                className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[20px] p-1 lg:mb-0 lg:p-2 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px] mr-2'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </motion.button>
            }
            tituloModal={'Adicionar Usuário'}
            botaoSalvar={
              <motion.button
                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'
                onClick={handleSaveClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Salvar
              </motion.button>
            }
          >
            <div className='h-[450px] overflow-auto relative'>
              {isLoading && (
                <div className='absolute bg-neutral-800 w-full h-full opacity-85 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                  <div className='absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8'>
                    <LoadingSpinner />
                  </div>
                </div>
              )}
              <AdicionarUsuario ref={formRef} onSubmit={handleSubmit} />
            </div>
          </Modal>
        </div>

        <div className='mt-[24px] px-5 dark:bg-neutral-900'>
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
              <UserFilter show={true} onSetShow={handleShow} filters={filters} onSelectedCheckboxesChange={updateFilters} resetFilters={resetFilters} />
            </div>
            <div className='w-full h-full max-h-full'>
              <Users searchQuery={searchQuery} selectedFilters={filters} />
            </div>
          </div>
        </div>
        {show && (
          <UserFilter show={show} onSetShow={handleShow} filters={filters} onSelectedCheckboxesChange={updateFilters} resetFilters={resetFilters} />
        )}
      </motion.main>
    </>
  );
}

export default Usuarios;
