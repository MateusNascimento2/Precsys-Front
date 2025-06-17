import React, { useState, useRef } from "react"


export function ModalTab({ status, cessionariosQtd, onAddCessionario, onDeleteCessionarioForm, isTabSelected, handleShowForm, handleModalShow }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const addCessionarioButtonElement = useRef();
  const menuElement = useRef();

  const handleShowMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    } else {
      setIsMenuOpen(true)
    }
  }


  return (
    <div className="border-b dark:border-neutral-600 pt-1 px-1 rounded-t w-full">
      <div className='flex gap-1 items-center justify-between lg:w-full'>
        <div className='flex w-full justify-between'>

          {/*Aba Cessão */}
          <div className="flex w-full max-w-[1760px] overflow-hidden">
            <div onClick={() => handleShowForm(null)} className={
              isTabSelected === null
              ? "flex items-center flex-none justify-between rounded-t py-1 border-t border-l border-r bg-neutral-200 dark:bg-neutral-800 cursor-pointer w-[120px] lg:w-[150px] dark:text-white px-2 dark:border-neutral-400"
              : "flex flex-none justify-between items-center bg-white rounded-t py-1 border-t border-l border-r cursor-pointer w-[120px] lg:w-[150px] hover:rounded-t dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:text-white dark:bg-neutral-900 px-2"}>

              <div className='text-sm'>
                <span>Cessão</span>
              </div>

              {/*Botão de adicionar cessionário*/}
              <button title="Adicionar novo cessionário" ref={addCessionarioButtonElement} onClick={(e) => {
                e.stopPropagation();
                onAddCessionario();
                setIsMenuOpen(true);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[24px] lg:size-[26px] hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full p-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </button>

            </div>

            {/* Aba Cessionário */}
            <div className="hidden lg:flex lg:flex-grow lg:overflow-hidden">
              {cessionariosQtd.map((cessionario, index) => (
                <div
                  onClick={() => {handleShowForm(index, 'selecionar')}}
                  key={cessionario.id}
                  className={
                    isTabSelected === index
                      ? "text-sm flex gap-[38px] flex-shrink-0 items-center justify-between rounded-t py-1 px-2 border-t border-l border-r bg-neutral-200 cursor-pointer w-max dark:bg-neutral-800 dark:border-neutral-400"
                      : "text-sm flex flex-grow items-center justify-between bg-white dark:bg-neutral-900 rounded-t py-1 px-2 border-t border-l border-r dark:border-neutral-600 cursor-pointer hover:rounded-t hover:bg-neutral-200 dark:hover:bg-neutral-800 min-w-[10px] max-w-[150px] overflow-hidden truncate"
                  }
                >
                  <p className="truncate dark:text-white">{cessionario.nomeTab ? ` Cessionário  - ${cessionario.nomeTab}` : 'Cessionário'}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowForm(index, 'excluir');
                      onDeleteCessionarioForm(cessionario.id);
                    }}
                    className="text-sm rounded-full hover:bg-neutral-300 dark:text-white hover:dark:bg-neutral-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>




          <div className='flex items-center gap-2 py-1 px-2 text-black'>
            {cessionariosQtd.length > 0 && (
              <div className='block lg:hidden'>
                <button className='relative flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1 rounded-full' onClick={(e) => {
                  e.stopPropagation();
                  handleShowMenu();
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[16px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div ref={menuElement} className='grid grid-cols-2 gap-1 absolute z-10 top-[45px] right-0 rounded border shadow-sm bg-white dark:bg-neutral-900 p-2'>
                    {cessionariosQtd.map((cessionario, index) => (
                      <div
                        onClick={() => handleShowForm(index, 'selecionar')}
                        key={cessionario.id}
                        className={
                          isTabSelected === index
                            ? 'rounded bg-neutral-200 cursor-pointer'
                            : 'bg-white  cursor-pointer'
                        }
                      >
                        <div className='text-sm flex gap-4 items-center hover:rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 border-r border-l py-1 px-2'>
                          <p className='truncate'>{cessionario.nomeTab ? ` Cessionário  - ${cessionario.nomeTab}` : 'Cessionário'}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowForm(index, 'excluir');
                              onDeleteCessionarioForm(cessionario.id);
                            }}
                            className="text-sm rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button className="hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-white rounded-full p-1" disabled={status === 'sending'} onClick={handleModalShow}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

      </div>



    </div>

  )
}