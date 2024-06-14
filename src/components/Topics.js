import React, { useState, useEffect } from 'react';

function Topics({ texto, data, atualizacaoJuridico, textoExplicativo }) {
  const [show, setShow] = useState(false);
  const [textoAtt, setTextoAtt] = useState([])

  const handleClick = () => {
    setShow(prevState => !prevState);
    console.log(show)

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

  useEffect(() => {
    setTextoAtt(atualizacaoJuridico ? atualizacaoJuridico.split('-') : [])

    console.log(textoAtt)
  }, [])




  return (
    <>
      <div onClick={() => handleClick()}>
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
      <div className={show ? 'fixed z-[100] w-dvw h-lvh left-0 top-0' : 'hidden'}>
        <div className={show ? 'bg-white dark:bg-black fixed z-[80] left-0 top-0 w-screen h-screen opacity-80 transition-opacity' : 'fixed left-[-9999px] opacity-0 transition-opacity'} onClick={() => handleClick()}></div>
        <div className={show ? 'bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow absolute z-[90] left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 w-[85%] lg:w-[400px] p-4 ' : 'hidden'}>
          <div className='max-h-[400px] overflow-y-auto'>
            {textoAtt.length === 1 ? (<p className='text-black dark:text-white'>{textoAtt[0]}</p>) : textoAtt.map((textoAtt) => (<p className='text-black dark:text-white mb-4'>{textoAtt}</p>))}
          </div>
        </div>
      </div>
    </>

  )
}

export default Topics;