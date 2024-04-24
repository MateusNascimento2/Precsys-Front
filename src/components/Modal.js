import React, { useState } from 'react';


export default function Modal({ children, tituloModal }) {
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
      <button className='hover:bg-neutral-100 flex items-center justify-center dark:hover:bg-neutral-800 rounded p-[1px]' onClick={() => handleModalShow()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white ">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      <div className={show ? 'fixed z-[100] w-dvw h-lvh left-0 top-0' : 'hidden'}>
        <div className={show ? 'bg-white dark:bg-black absolute z-[80] left-0 top-0 w-full h-full opacity-80 transition-opacity' : 'opacity-0 transition-opacity'} onClick={() => handleModalShow()}></div>
        <div className={show ? 'bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow absolute z-[90] left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] w-[85%] lg:w-[800px] py-2 md:pb-[30px] md:w-[600px]' : 'hidden'}>
          <div className='pt-[10px] md:py-[30px] md:px-[15px]'>
            <div className='flex px-4 items-center justify-between'>
              <p className='dark:text-white text-black py-2'>{tituloModal}</p>
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