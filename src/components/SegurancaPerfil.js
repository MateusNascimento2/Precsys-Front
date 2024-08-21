import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SegurancaPerfil({ user }) {
  const { auth } = useAuth();
  const currentUser = user || auth.user; // Usar o usuário passado ou auth.user
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const handleEditEmail = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    if (email.length !== 0 && confirmEmail.length !== 0 && email === confirmEmail) {
      try {
        setIsLoading(true);
        await axiosPrivate.put(`/users/${currentUser.id}`, {
          ...currentUser,
          email,
        });

        setIsLoading(false);

        toast.success('E-mail alterado com sucesso!', {
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
        toast.error(`Erro ao editar email: ${err}`, {
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
      toast.error('Erro ao editar e-mail: Os e-mails digitados não são iguais!', {
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

  const handleEditPassword = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    if (password.length !== 0 && confirmPassword.length !== 0 && password === confirmPassword) {
      try {
        setIsLoading(true);
        await axiosPrivate.put(`/users/${currentUser.id}`, {
          ...currentUser,
          password,
        });

        setIsLoading(false);

        toast.success('Senha alterada com sucesso!', {
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
        console.log(err);
        toast.error(`Erro ao editar senha: ${err}`, {
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
      toast.error('Erro ao editar senha: As senhas digitadas não são iguais!', {
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

  const handleChangeEmail = () => (
    <div>
      <form>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='w-full'>
            <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
              Novo e-mail <span className='text-red-500'>*</span>
            </p>
            <input
              className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className='w-full'>
            <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
              Confirmar novo e-mail <span className='text-red-500'>*</span>
            </p>
            <input
              className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
              type="email"
              onChange={(e) => setConfirmEmail(e.target.value)}
              value={confirmEmail}
            />
          </div>
        </div>
        <div className='flex gap-4 mt-4'>
          <button
            onClick={(e) => handleEditEmail(e)}
            type='submit'
            className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black'>
            Alterar e-mail
          </button>
          <button
            type='button'
            onClick={() => setIsEditingEmail(false)}
            className='bg-neutral-200 text-neutral-800 rounded px-4 py-2 font-medium dark:bg-neutral-800 dark:text-neutral-200 text-[14px] lg:text-[16px]'>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

  const handleChangePassword = () => (
    <div>
      <form>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='w-full'>
            <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
              Nova senha <span className='text-red-500'>*</span>
            </p>
            <input
              className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className='w-full'>
            <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
              Confirmar nova senha <span className='text-red-500'>*</span>
            </p>
            <input
              className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
        </div>
        <div className='flex gap-4 mt-4'>
          <button
            type='submit'
            onClick={(e) => handleEditPassword(e)}
            className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black'>
            Alterar senha
          </button>
          <button
            type='button'
            onClick={() => setIsEditingPassword(false)}
            className='bg-neutral-200 text-neutral-800 rounded px-4 py-2 font-medium dark:bg-neutral-800 dark:text-neutral-200 text-[14px] lg:text-[16px]'>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <div className='w-full h-[320px] lg:h-[210px] flex justify-center items-center'>
          <div className='w-8 h-8'>
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <section className='mt-12 border-t dark:border-neutral-600 pt-12'>
          <div className='mb-4 mt-4 lg:mt-0'>
            <span className='font-semibold dark:text-white'>Segurança</span>
          </div>
          <div>
            <div className='flex flex-col gap-6'>
              {isEditingEmail ? (
                handleChangeEmail()
              ) : (
                <div className=' flex flex-col lg:flex-row lg:justify-between lg:items-center'>
                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px]'>E-mail</p>
                    <span className='text-neutral-400 font-medium w-full text-[14px]'>{currentUser.email}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2'>
                      Alterar e-mail
                    </button>
                  </div>
                </div>
              )}

              {isEditingPassword ? (
                handleChangePassword()
              ) : (
                <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center'>
                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Senha</p>
                    <span className='text-neutral-400 font-medium w-full text-[14px]'>********</span>
                  </div>
                  <div>
                    <button onClick={() => setIsEditingPassword(true)} className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2'>Alterar senha</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
