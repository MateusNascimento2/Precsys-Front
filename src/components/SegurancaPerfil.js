import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SegurancaPerfil({ setUser, user, id }) {
  const { auth, setAuth } = useAuth(); // Adiciona setAuth para atualizar o contexto
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        await axiosPrivate.put(`/users/${user.id}/email`, {
          email,
        });

        // Atualiza o estado de auth com o novo email
        if (!id) {
          setAuth(prev => ({
            ...prev,
            user: {
              ...prev.user,
              email
            }
          }));
        } else {

          const updatedUser = await axiosPrivate.get(`users/${user.id}`)
          setUser(updatedUser.data)
        }


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
        toast.error(`Erro ao editar email: ${err.response.data.error}`, {
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
        await axiosPrivate.put(`/users/${user.id}/senha`, {
          password,
        });

        // Atualiza o estado de auth, se necessário, para refletir que a senha foi alterada
        // (Geralmente, não é necessário atualizar o contexto de `auth` apenas para uma mudança de senha)

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
        console.log(err.response.data.error);
        toast.error(`Erro ao editar senha: ${err.response.data.error}`, {
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
            <div className='relative'>
              <input
                className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
                type={showPassword ? "text" : "password"} // Alterna entre texto e senha

                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600"
                onClick={() => {
                  setShowPassword(!showPassword)
                }}
              >
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                } {/* Ícones para alternar */}
              </button>
            </div>

          </div>
          <div className='w-full'>
            <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
              Confirmar nova senha <span className='text-red-500'>*</span>
            </p>
            <div className='relative'>
              <input
                className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
                type={showPassword ? "text" : "password"} // Alterna entre texto e senha

                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600"
                onClick={() => {
                  setShowPassword(!showPassword)
                }}
              >
                {showPassword
                  ?
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                }
              </button>
            </div>
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
                    <span className='text-neutral-400 font-medium w-full text-[14px]'>{user.email}</span>
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
