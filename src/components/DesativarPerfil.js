import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesativarPerfil() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <section className='mt-12'>
      <div className='mb-4 mt-4 lg:mt-0'>
        <span className='font-semibold dark:text-white'>Desativar Conta</span>
      </div>

      <div className="mb-4 flex items-center gap-4 p-4 bg-yellow-100 border border-dashed border-yellow-300 rounded">
        <div className="flex-shrink-0 text-yellow-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>

        </div>
        <div>
          <h3 className="text-sm font-semibold text-yellow-800">
            Você está desativando sua conta
          </h3>
          <p className="text-sm text-yellow-700">
            Você está desativando sua conta, para acessar sua conta novamente,
            deverá entrar em contato através do <a href="#" className="font-semibold underline">Fale Conosco</a>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name={"desativar"}
          id={"desativar"}
          className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
          onChange={handleCheckboxChange}
        />
        <span
          className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
            stroke="currentColor" strokeWidth="1">
            <path fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"></path>
          </svg>
        </span>
        <label htmlFor={'desativar'} key={'desativar'} className='dark:text-white text-sm font-medium'>Confirmo que quero desativar minha conta.</label>
      </div>

      <AnimatePresence>
        {isChecked && (
          <motion.button
            key="confirmButton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className='mt-4 px-4 py-2 bg-red-500 text-white rounded'
            onClick={() => alert('Conta desativada')}
          >
            Confirmar desativação da conta
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}