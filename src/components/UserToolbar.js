import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import ProfileImage from './ProfileImage';
import LogoutButton from './LogoutButton';
import ThemeSwitcher from "./ThemeSwitcher";
import { Link, useNavigate } from 'react-router-dom';

function UserToolbar({ show, updateLogo, darkMode, onDarkModeChange }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const goToConfigurations = () => {
    navigate('/perfil?section=configuracoes'); // Certifique-se de que a rota corresponde à esperada
  };

  const goToActivities = () => {
    navigate('/perfil?section=atividades');
  }

  const goToResume = () => {
    navigate('/perfil?section=resumo');
  }

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.section
            className="cursor-auto shadow rounded right-0 absolute flex flex-col px-4 items-start bg-[#FFF] dark:bg-neutral-900 dark:text-white dark:border-neutral-600 border w-[300px] lg:w-[320px] z-50 top-[calc(0vh+40px)] lg:top-[calc(0vh+45px)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center border-b dark:border-neutral-600 gap-5 py-3 w-full">
              <div className="w-[60px] h-[60px] bg-gray-100 rounded shrink-0">
                <ProfileImage userImage={auth?.userImage} />
              </div>
              <div className="w-[200px]">
                <span className="font-semibold flex justify-between items-center break-words">
                  {auth?.user.nome}
                  <span className={auth?.user.admin ? 'bg-[#181c32] dark:bg-white dark:text-[#181c32] text-white text-[11px] font-bold rounded py-[1px] px-[4px]' : 'hidden'}>
                    ADM
                  </span>
                </span>
                <span className="text-sm text-[#555] dark:text-neutral-500 break-words leading-normal" >{auth?.user.email}</span>
              </div>
            </div>
            <ul className='flex w-full px-2 py-2 flex-col items-center gap-1 text-[13px] border-b dark:border-neutral-700'>
              <div onClick={() => goToResume()} className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Meu Perfil
                <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Ver o seu Perfil</p>
              </div>
              <div onClick={() => goToActivities()} className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Minha Atividade
                <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Ver minha Atividade</p>
              </div>
              <div onClick={() => goToConfigurations()} className='cursor-pointer rounded w-full px-2 py-1 font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800'>Configurações
                <p className='font-[500] text-[#666666] dark:text-neutral-500 text-[12px]'>Configurações de Perfil</p>
              </div>
            </ul>
            <div className="w-full py-2 pl-2 gap-2 flex justify-between ">
              <LogoutButton />
              <ThemeSwitcher updateLogo={updateLogo} darkMode={darkMode} onDarkModeChange={onDarkModeChange} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

export default UserToolbar;
