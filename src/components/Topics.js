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
      <div onClick={() => handleClick()} className="cursor-pointer relative ring-1 ring-neutral-200 dark:ring-neutral-600 drop-shadow h-[78px] overflow-hidden">
        <div className='hover:bg-neutral-50 dark:hover:bg-neutral-700 absolute top-0 left-0 right-0 px-4 py-3 flex gap-2 items-center font-semibold text-sm text-slate-900 h-full bg-slate-50/90 dark:bg-neutral-800 backdrop-blur-sm dark:text-white justify-center'>
          <span className="font-[600] text-[15px] lg:text-[16px]">{texto}</span>
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