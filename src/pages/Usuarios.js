import React, { useState, useRef, useEffect } from 'react';
import Users from '../components/Users';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import UserFilter from '../components/UserFilter';
/* import Modal from '../components/Modal';
import AdicionarUsuario from '../components/AdicionarUsuario'; */
import { Modal } from '../components/AdicionarUsuarioModal/Modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';

function Usuarios() {
  const [usuarioFormData, setUsuarioFormData] = useState({
    nome: '',
    password: '',
    cpfcnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    qualificacao: '',
    admin: '',
    advogado: '',
    ativo: 1,
    permissao_email: 0,
    permissao_proposta: 0,
    permissao_expcartorio: 0
  })
  const [status, setStatus] = useState('typing');
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [users, setUsers] = useState([]); // Estado para armazenar os gestores
  const axiosPrivate = useAxiosPrivate();
  const formRef = useRef(null); // Cria uma ref para o formulário
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: {
      Ativo: false,
      Desativado: false,
    },
    tipo: {
      Usuário: false,
      Administrador: false,
      Advogado: false
    },
    gestores: {},
  });

  const fetchData = async (url, setState) => {
    try {
      setIsLoading(true);
      const { data } = await axiosPrivate.get(url);
      setState(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Primeiro useEffect: Busca os dados dos clientes e gestores ao montar o componente
  useEffect(() => {
    const controller = new AbortController();

    // Buscando dados de clientes e gestores
    fetchData('/cliente', setClientes);
    fetchData('/users', setUsers); // Supondo que os gestores estejam na mesma rota que os usuários

    return () => {
      controller.abort();
    };
  }, []);

  // Segundo useEffect: Inicializa os filtros sempre que 'clientes' ou 'gestores' forem atualizados
  useEffect(() => {
    const initializeFilters = (clientes, users) => {
      // Filtra os gestores que têm um cliente associado
      const gestoresFiltrados = users.filter(user =>
        clientes.some(cliente => String(cliente.id_gestor) === String(user.id))
      );

      // Inicializa os nomes dos gestores como false
      const gestoresNomes = gestoresFiltrados.reduce((acc, gestor) => {
        acc[gestor.nome] = false;
        return acc;
      }, {});

      setFilters((prevFilters) => ({
        ...prevFilters,
        gestores: gestoresNomes,
      }));
    };

    if (clientes.length > 0 && users.length > 0) {
      initializeFilters(clientes, users);
    }
  }, [clientes, users]);

  const handleSubmit = async () => {
    const isDarkMode = localStorage.getItem('darkMode');

    if (
      usuarioFormData.nome.length < 3 ||
      (usuarioFormData.cpfcnpj.length !== 14 && usuarioFormData.cpfcnpj.length !== 18) ||
      usuarioFormData.email.length === 0 ||
      usuarioFormData.password.length < 0 ||
      (usuarioFormData.admin === '' && usuarioFormData.advogado === '')
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
    } else {
      try {
        setStatus({ status: 'sending' })

        setIsLoading(true);
        await axiosPrivate.post('/users', usuarioFormData);
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

        setStatus({ status: 'success' })
        fetchData('/cliente', setClientes);
        fetchData('/users', setUsers);
      } catch (err) {
        setStatus({ status: 'error' })
        console.log(err.response?.data?.error || err);
        toast.error(`Erro ao cadastrar usuário: ${err.response?.data?.error || 'Erro desconhecido'}`, {
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


    setIsLoading(false);
    setStatus({ status: 'success' })

  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      status: {
        Ativo: false,
        Desativado: false,
      },
      tipo: {
        Usuário: false,
        Administrador: false,
      },
      gestores: {},
    });
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
        className='container mx-auto pt-[120px] px-5 dark:bg-neutral-900 h-full relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='flex justify-between items-center'>
          <motion.h2
            className='font-[700] text-[32px] md:mt-[16px] dark:text-white'
            id='usuarios'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Usuários
          </motion.h2>


          <Modal status={status} isLoading={isLoading} usuarioFormData={usuarioFormData} setUsuarioFormData={setUsuarioFormData} handleSubmit={handleSubmit} />
        </div>

        <div className='mt-[24px] dark:bg-neutral-900'>
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

        <ScrollToTopButton />
      </motion.main>
    </>
  );
}

export default Usuarios;
