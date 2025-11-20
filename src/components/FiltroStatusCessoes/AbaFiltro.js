import React, { useState } from 'react'

export default function AbaFiltro({ abaNome, dadosFiltro, selectedFilters, handleFilterChange, handleDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isComarcaOpen, setIsComarcaOpen] = useState(false);
  const [entesAbertos, setEntesAbertos] = useState({});
  const [gestoresAbertos, setGestoresAbertos] = useState({});

  const handleIsOpen = () => {
    setIsOpen(prevState => !prevState);
  };


  const checkboxClass = "peer relative h-4 w-4 shrink-0 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white";

  const checkIcon = (
    <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
      <svg className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
  );

  const renderConteudo = () => {

    {/* Data da Cessão */ }
    if (abaNome === 'Data da Modificação') {
      return (
        <div className="flex flex-col gap-2 py-3 text-neutral-600 dark:text-neutral-400">
          {['data_modificacao_inicial', 'data_modificacao_final'].map((id, i) => (
            <div key={id} className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
              <label htmlFor={id} className="text-[12px] font-bold">
                {i === 0 ? 'Data Inicial:' : 'Data Final:'}
              </label>
              <input className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded" type="date" id={id} onChange={(e) => handleDateChange(id, e.target.value)} />
            </div>
          ))}
        </div>
      );
    }

    {/* Outros Filtros (Status, Empresa, Natureza, etc.) */ }
    return (
      <ul className='flex flex-col gap-[6px]'>
        {
          dadosFiltro?.map((dado, index) => (
            <li className='flex gap-2 items-center relative text-[13px]' key={index}>
              <input type="checkbox" checked={selectedFilters.includes(dado.nome)} onChange={() => handleFilterChange(dado.nome)} className={checkboxClass} />
              {checkIcon}
              <label>{dado.nome}</label>
            </li>
          ))
        }
      </ul>
    );
  };

  return (
    <div className='text-gray-600 text-[14px] dark:text-neutral-300 p-2'>
      <div onClick={handleIsOpen} className="flex justify-between items-center cursor-pointer">
        <span>{abaNome}</span>
        <span className='text-[12px]'>
          <svg className='w-3 h-3' fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </div>
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'pt-2 max-h-80 overflow-y-auto' : 'max-h-0'}`}>
        <div className='flex flex-col gap-1 border-l dark:border-neutral-600 px-2 text-sm'>
          {renderConteudo()}
        </div>
      </div>
    </div>
  );
}
