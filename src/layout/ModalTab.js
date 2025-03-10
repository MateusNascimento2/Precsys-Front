import React, { useState, useRef, useEffect } from "react"


export function ModalTab({ status, cessionariosQtd, onAddCessionario, onDeleteCessionarioForm, isTabSelected, handleShowForm, handleModalShow }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const addCessionarioButtonElement = useRef();
  const menuElement = useRef();

  const handleShowMenu = () => {
    console.log('aqui')
    if (isMenuOpen) {
      setIsMenuOpen(false)
    } else {
      setIsMenuOpen(true)
    }
  }

/*   useEffect(() => {
    const handler = (event) => {
      if (!menuElement.current) {
        return;
      }

      // Se status for 'sending', não fechar o modal ao clicar fora

      if (!menuElement.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

    }

    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
    }
  }, []); */

  return (
    <div className="flex justify-between border-b pt-1 px-1 rounded-t w-full">
      <div className='flex gap-1'>
        <div className='hidden lg:flex lg:flex-wrap lg:gap-1'>
          <div onClick={() => handleShowForm(null)} className={isTabSelected === null ? "rounded-t cursor-default flex items-center justify-center bg-neutral-200 py-1 w-[140px] min-w-[70px] max-w-[150px]" : "bg-white rounded-t cursor-pointer py-1 flex items-center justify-center text-sm "}>
            <div className='text-sm flex items-center hover:rounded hover:bg-neutral-200 border-r border-l py-1 px-2 w-[140px] min-w-[70px] max-w-[150px] '>
              <span>Cessão</span>
            </div>

          </div>
          {cessionariosQtd.map((cessionario, index) => (
            <div
              onClick={() => handleShowForm(index)}
              key={cessionario.id}
              className={
                isTabSelected === index
                  ? 'flex items-center justify-center rounded-t py-1 bg-neutral-200 cursor-pointer min-w-[70px] max-w-[150px]'
                  : 'flex items-center justify-center bg-white rounded-t py-1  cursor-pointer min-w-[70px] max-w-[150px]'
              }
            >
              <div className='text-sm flex gap-4 items-center hover:rounded hover:bg-neutral-200 border-r border-l py-1 px-2'>
                <p className='truncate'>Cessionário {cessionario.id}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowForm(index > 0 ? index - 1 : null);
                    onDeleteCessionarioForm(cessionario.id);
                  }}
                  className="text-sm rounded-full hover:bg-neutral-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>

                </button>
              </div>




            </div>
          ))}
          <button ref={addCessionarioButtonElement} onClick={() => {
            onAddCessionario()
            setIsMenuOpen(true)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-white size-[24px] lg:size-[28px] hover:bg-neutral-200 rounded-full p-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </button>
        </div>

        <div className='flex items-center gap-1 lg:hidden'>
          <div onClick={() => handleShowForm(null)} className={isTabSelected === null ? "rounded-t cursor-default flex items-center justify-center bg-neutral-200" : "bg-white rounded-t cursor-pointer flex items-center justify-center text-sm"}>
            <div className='text-sm flex gap-4 items-center hover:rounded hover:bg-neutral-200 border-r border-l py-1 px-2'>
              <span className="px-4">Cessão</span>
            </div>

          </div>

          <button ref={addCessionarioButtonElement} onClick={() => {
            onAddCessionario()
            setIsMenuOpen(true)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-white size-[24px] lg:size-[28px] hover:bg-neutral-200 rounded-full p-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </button>
        </div>

      </div>


      <div className='flex items-center gap-2 py-1 px-2 text-black'>
        {cessionariosQtd.length > 0 && (
          <div className='block lg:hidden'>
            <button className='relative flex items-center justify-center hover:bg-neutral-200 p-1 rounded-full' onClick={(e) => {
              e.stopPropagation();
              handleShowMenu();
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[16px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {isMenuOpen && (
              <div ref={menuElement} className='grid grid-cols-2 gap-1 absolute top-[45px] right-0 rounded border shadow-sm bg-white p-2'>
                {cessionariosQtd.map((cessionario, index) => (
                  <div
                    onClick={() => handleShowForm(index)}
                    key={cessionario.id}
                    className={
                      isTabSelected === index
                        ? 'rounded bg-neutral-200 cursor-pointer'
                        : 'bg-white  cursor-pointer'
                    }
                  >
                    <div className='text-sm flex gap-4 items-center hover:rounded hover:bg-neutral-200 border-r border-l py-1 px-2'>
                      <p className='truncate'>Cessionário {cessionario.id}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowForm(index > 0 ? index - 1 : null);
                          onDeleteCessionarioForm(cessionario.id);
                        }}
                        className="text-sm rounded-full hover:bg-neutral-300"
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
        <button disabled={status === 'sending'} onClick={handleModalShow}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg></button>
      </div>
    </div>

  )
}