import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Topics({ texto, data, atualizacaoJuridico, textoExplicativo }) {
  const [show, setShow] = useState(false);

  const handleClick = (textoAtt) => {
    if (textoAtt) {
      setShow(prevState => !prevState);

      if (document.body.style.overflow !== "hidden") {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = 'scroll';
      }
    }
  }

  return (
    <>
      <div onClick={() => handleClick(atualizacaoJuridico)}>
        <div className='font-semibold lg:pt-2 xl:pt-0 text-sm text-slate-900 h-full dark:text-white justify-between'>
          <div className='mb-2'>
            <span className="font-[700] dark:text-white">{texto}</span>
          </div>
          <div className='flex items-center mb-2'>
            <span className="font-[500] text-[12px] lg:text-[12px] h-[100px]">{textoExplicativo}</span>
          </div>
          <div className='flex justify-end'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              className='fixed z-[100] w-dvw h-lvh left-0 top-0 flex items-center justify-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className='bg-black absolute z-[80] left-0 top-0 w-full h-full opacity-80'
                onClick={() => handleClick(atualizacaoJuridico)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className='bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow z-[90] relative w-[85%] lg:w-[400px] p-4'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className='max-h-[400px] overflow-y-auto'>
                  <p className='text-black dark:text-white mb-4'>{atualizacaoJuridico}</p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Topics;
