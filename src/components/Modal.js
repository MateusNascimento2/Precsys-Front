import React, { useState } from 'react';

export default function Modal() {
  const [show, setShow] = useState(false);

  function handleModalShow() {
    setShow(prevState => !prevState);
    console.log(show)
  }


  return (

    <>
      <button className='hover:bg-neutral-100 flex items-center justify-center dark:hover:bg-neutral-800 rounded p-[1px]' onClick={() => handleModalShow()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white ">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      <div className={show ? 'bg-white dark:bg-black fixed z-[80] left-0 top-0 w-screen h-screen opacity-80 transition-opacity' : 'opacity-0 transition-opacity'} onClick={() => handleModalShow()}>
      </div>
      <div className={show ? 'bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow fixed z-[90] left-0 right-0 top-0 bottom-0 lg:mx-auto mx-[20px] my-[40px] lg:w-[600px]' : 'hidden'}>
        <div className='pt-[10px] h-full'>
          <div className='flex px-2 items-center justify-between'>
            <p className='dark:text-white text-black py-2'>Inserir Cessão</p>
            <button onClick={() => handleModalShow()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </button>
          </div>

          <div className='h-[85%] overflow-y-auto px-3'>
            <form action="" className='mt-[20px] flex flex-col gap-4'>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="precatorio">Precatório</label>
                <input type='text' name='precatorio' id='precatorio' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Número do precatório'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="processo">Processo</label>
                <input type='text' name='processo' id='processo' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Número do processo'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="cedente">Cedente</label>
                <input type='text' name='cedente' id='cedente' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Nome do cedente'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="vara">Vara</label>
                <input type='text' name='vara' id='vara' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar vara'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="orcamento">Orçamento</label>
                <input type='text' name='orcamento' id='orcamento' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar orçamento'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="natureza">Natureza</label>
                <input type='text' name='natureza' id='natureza' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar natureza'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="empresa">Empresa</label>
                <input type='text' name='empresa' id='empresa' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar empresa'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="data_cessao">Data da Cessão</label>
                <input type='text' name='data_cessao' id='data_cessao' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar data da cessão'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="rep_comercial">Rep. Comercial</label>
                <input type='text' name='rep_comercial' id='rep_comercial' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar Representante Comercial'></input>
              </div>
              <div className='dark:text-white text-black flex flex-col gap-2'>
                <label htmlFor="escrevente">Escrevente</label>
                <input type='text' name='escrevente' id='escrevente' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2' placeholder='Selecionar escrevente'></input>
              </div>

              <button type="submit" className='dark:bg-neutral-700 dark:text-white border rounded dark:border-neutral-600'>Enviar</button>


            </form>

          </div>
        </div>
      </div>
    </>


  )
}