import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ botaoAbrirModal, children, botaoSalvar, botaoAdicionarCessionario, tituloModal }) {
  const [show, setShow] = useState(false);

  function handleModalShow() {
    setShow(prevState => !prevState);

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

  const modalContent = (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className='fixed z-[200] w-dvw h-lvh left-0 top-0 flex items-center justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-black absolute z-[100] left-0 top-0 w-full h-full opacity-80'
              onClick={handleModalShow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className='bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow z-[200] relative w-[85%] lg:w-[900px] xl:w-[1100px] py-2 md:pb-[20px] md:w-[600px]'
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='pt-[10px] md:pt-[30px] md:px-[15px]'>
                <div className='flex px-4 items-center justify-between'>
                  <p className='dark:text-white text-black font-medium py-2 text-[18px]'>{tituloModal}</p>
                  <button onClick={handleModalShow} className='rounded hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {children}
                <div>
                  {botaoSalvar}
                  {botaoAdicionarCessionario}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {botaoAbrirModal && React.cloneElement(botaoAbrirModal, { onClick: handleModalShow })}
      {ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
}
