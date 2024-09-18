import React, { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'; // Importando framer-motion

export default function AdministradorPerfil({ user, id }) {
  const { auth, setAuth } = useAuth(); // Adiciona setAuth para atualizar o contexto
  const currentUser = user || auth.user; // Usar o usuário passado ou auth.user
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [admin, setAdmin] = useState(currentUser.admin);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    setAdmin(currentUser.admin);
  }, [currentUser.admin]);

  const handleEditCargo = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    if (admin !== null) {
      try {
        setIsLoading(true);
        await axiosPrivate.put(`/users/${currentUser.id}`, {
          nome: currentUser.nome,
          cpfcnpj: currentUser.cpfcnpj,
          email: currentUser.email,
          telefone: currentUser.telefone,
          endereco: currentUser.endereco,
          obs: currentUser.obs,
          qualificacao: currentUser.qualificacao,
          foto: currentUser.foto,
          admin,
          ativo: currentUser.ativo,
          permissao_email: currentUser.permissao_email,
          permissao_proposta: currentUser.permissao_proposta,
          permissao_expcartorio: currentUser.permissao_expcartorio
        });

        // Atualiza o estado de auth com o novo cargo
        if (!id) {
          setAuth(prev => ({
            ...prev,
            user: {
              ...prev.user,
              admin
            }
          }));
        }


        setIsLoading(false);

        toast.success('Cargo alterado com sucesso!', {
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
      } catch (err) {
        toast.error(`Erro ao editar cargo: ${err}`, {
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
      }
    } else {
      toast.error('Erro ao editar cargo: Cargo não selecionado!', {
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
    }
  };

  const handleRadioChange = (value) => {
    setAdmin(value);
    setShowSaveButton(true); // Mostra o botão quando o usuário muda a seleção
  };

  return (
    <>
      {isLoading ? (
        <div className='w-full h-[320px] lg:h-[210px] flex justify-center items-center'>
          <div className='w-8 h-8'>
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <div className='mt-12 border-t dark:border-neutral-600 pt-12'>
          <p className='font-semibold dark:text-white'>Cargo</p>
          <div className='flex flex-col gap-2'>
            <div className='dark:text-white py-2 relative'>
              <input
                id="admin"
                value={1}
                onChange={() => handleRadioChange(1)}
                checked={admin === 1}
                className="cursor-pointer absolute left-0 top-[40%] w-4 h-4 appearance-none checked:bg-neutral-800 bg-neutral-200 checked:border-neutral-200 checked:border-[4px] dark:border-[4px] border-black dark:border-white rounded-full dark:bg-white dark:checked:bg-neutral-800"
                type="radio"
                name="user-type"
              />
              <label htmlFor="admin" className="ml-8 dark:text-neutral-200 text-neutral-600 font-medium text-[15px]">Administrador</label>
              <p className='text-neutral-400 font-medium w-full text-[14px] ml-8'>Acesso total a todas as funções.</p>
            </div>
            <div className='dark:text-white py-2 relative'>
              <input
                id="user"
                value={0}
                onChange={() => handleRadioChange(0)}
                checked={admin === 0}
                className="cursor-pointer absolute left-0 top-[40%] w-4 h-4 appearance-none checked:bg-neutral-800 bg-neutral-200 checked:border-neutral-200 checked:border-[4px] dark:border-[4px] border-black dark:border-white rounded-full dark:bg-white dark:checked:bg-neutral-800"
                type="radio"
                name="user-type"
              />
              <label htmlFor="user" className="ml-8 dark:text-neutral-200 text-neutral-600 font-medium text-[15px]">Usuário</label>
              <p className='text-neutral-400 font-medium w-full text-[14px] ml-8'>Acesso limitado ao sistema.</p>
            </div>
          </div>
          <AnimatePresence>
            {showSaveButton && (
              <motion.button
                onClick={handleEditCargo}
                className="bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                Salvar Alterações
              </motion.button>
            )}
          </AnimatePresence>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
