import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from "../hooks/useAuth";

export default function SegurancaPerfil() {
  const { auth } = useAuth();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleChangeEmail = () => {
    return (
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

              />
            </div>
            <div className='w-full'>
              <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
                Confirmar novo e-mail <span className='text-red-500'>*</span>
              </p>
              <input
                className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
                type="email"
              />
            </div>

          </div>


          <div className='flex gap-4 mt-4'>
            <button
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
  };

  const handleChangePassword = () => {
    return (
      <div>
        <form>
          <div className='flex flex-col gap-4 lg:flex-row'>
            <div className='w-full'>
              <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
                Nova senha <span className='text-red-500'>*</span>
              </p>
              <input
                className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
                type="email"

              />
            </div>
            <div className='w-full'>
              <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>
                Confirmar nova senha <span className='text-red-500'>*</span>
              </p>
              <input
                className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none'
                type="email"
              />
            </div>

          </div>


          <div className='flex gap-4 mt-4'>
            <button
              type='submit'
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
  };

  return (
    <section className='mt-12'>
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
                <span className='text-neutral-400 font-medium w-full text-[14px]'>{auth.user.email}</span>
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
  );
}
