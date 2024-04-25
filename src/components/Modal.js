import React, { useState } from 'react';


export default function Modal({botaoAbrirModal, children, tituloModal }) {
  const [show, setShow] = useState(false);

  function handleModalShow() {
    setShow(prevState => !prevState);

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }


  return (

    <>
      {botaoAbrirModal && React.cloneElement(botaoAbrirModal, {onClick: handleModalShow})}
      <div className={show ? 'fixed z-[100] w-dvw h-lvh left-0 top-0' : 'hidden'}>
        <div className={show ? 'bg-white dark:bg-black absolute z-[80] left-0 top-0 w-full h-full opacity-80 transition-opacity' : 'opacity-0 transition-opacity'} onClick={() => handleModalShow()}></div>
        <div className={show ? 'bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow absolute z-[90] left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] w-[85%] lg:w-[800px] py-2 md:pb-[30px] md:w-[600px]' : 'hidden'}>
          <div className='pt-[10px] md:py-[30px] md:px-[15px]'>
            <div className='flex px-4 items-center justify-between'>
              <p className='dark:text-white text-black font-medium py-2 text-[18px]'>{tituloModal}</p>
              <button onClick={() => handleModalShow()} className='rounded hover:bg-neutral-100 dark:hover:bg-neutral-800'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              </button>
            </div>
            {children}
          </div>

        </div>

      </div>



    </>


  )
}