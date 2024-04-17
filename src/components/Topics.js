import React, { useState, useEffect } from 'react';

function Topics({ texto, data, atualizacaoJuridico }) {
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
    setTextoAtt(atualizacaoJuridico.split('-'))

    console.log(textoAtt)
  }, [])
  
  


  return (
    <>
      <div onClick={() => handleClick()} className="relative ring-1 ring-neutral-200 dark:ring-neutral-600 drop-shadow h-[78px] overflow-hidden">
        <div className='absolute top-0 left-0 right-0 px-4 py-3 flex gap-2 items-center font-semibold text-sm text-slate-900 h-full bg-slate-50/90 dark:bg-neutral-800 backdrop-blur-sm dark:text-white flex-col'>
          <span className="font-[600] text-[15px] lg:text-[16px]">{texto}</span>
          <span className='font-[500] text-[12px] lg:text-[13px] text-neutral-500'>{data}</span>
        </div>
      </div>
      <div className={show ? 'bg-white dark:bg-black fixed z-[80] left-0 top-0 w-screen h-screen opacity-80 transition-opacity' : 'fixed left-[-9999px] opacity-0 transition-opacity'} onClick={() => handleClick()}></div>
      <div className={show ? 'bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow absolute z-[90] lg:left-1/2 lg:top-1/2 lg:-translate-x-2/4 lg:-translate-y-[85%] lg:w-[400px] p-4 ' : 'hidden'}>
        <div className='max-h-[400px] overflow-y-auto'>
          {textoAtt.map((texto) => (<p className='text-black dark:text-white mb-4'>{texto}</p>))}
        </div>
      </div>
    </>

  )
}

export default Topics;