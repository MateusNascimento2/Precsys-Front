import React, { useState, useEffect } from 'react';
import Select from 'react-select';



export default function Modal({ varas, orcamentos, naturezas, empresas, users, teles, escreventes }, props) {
  const [show, setShow] = useState(false);

  console.log(varas)
  console.log(users)
  console.log(teles)

  teles.forEach(tele => {
    users.forEach(user => {
      if (String(tele.usuario_id) === String(user.id)) {
        tele.value = parseInt(user.id)
        tele.label = user.nome
      }
    })
  })

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        ...item,
        value: item.id,
        label: item[value]
      };
    });
  }

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
      <div className={show ? 'bg-white dark:bg-black fixed z-[80] left-0 top-0 w-screen h-screen opacity-80 transition-opacity' : 'opacity-0 transition-opacity'} onClick={() => handleModalShow()}>
      </div>
      <div className={show ? 'bg-white dark:bg-neutral-900 dark:border-neutral-600 border rounded shadow absolute z-[90] left-0 right-0 lg:mx-auto mx-[20px] my-[40px] lg:w-[800px] py-2 md:pb-[30px]' : 'hidden'}>
        <div className='pt-[10px] md:py-[30px] md:px-[15px]'>
          <div className='flex px-2 items-center justify-between'>
            <p className='dark:text-white text-black py-2'>Editar Cessão</p>
            <button onClick={() => handleModalShow()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </button>
          </div>

          <form action="" className='mt-[20px]'>
            <div className='px-3 '>
              <div className='h-[400px] overflow-y-auto grid grid-cols-1 md:grid-cols-2'>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="precatorio">Precatório</label>
                  <input type='text' name='precatorio' id='precatorio' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2  focus:outline-neutral-600 placeholder:text-[14px]' placeholder='Número do precatório'></input>
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="processo">Processo</label>
                  <input type='text' name='processo' id='processo' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2 focus:outline-neutral-600 placeholder:text-[14px]' placeholder='Número do processo'></input>
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="cedente">Cedente</label>
                  <input type='text' name='cedente' id='cedente' className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2 focus:outline-neutral-600 placeholder:text-[14px]' placeholder='Nome do cedente'></input>
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="vara">Vara</label>
                  <Select options={handleSelectValues(varas, 'nome')} isClearable={true} name='vara' placeholder='Selecionar vara'
                    noOptionsMessage={() => 'Nenhuma vara encontrada'} unstyled // Remove all non-essential styles
                    classNames={{
                      container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                      control: () => ('px-2 flex items-center'),
                      input: () => ('text-gray-400 mb-1'),
                      menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                      menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                      option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                    }}
                  />
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="orcamento">Orçamento</label>
                  <div className='flex'>
                    <Select options={handleSelectValues(orcamentos, 'ente')} isClearable={true} name='ente' placeholder='Selecionar ente'
                      noOptionsMessage={() => 'Nenhum ente encontrado'} unstyled // Remove all non-essential styles
                      classNames={{
                        container: () => ('border-t border-l border-b rounded-l dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px] w-[70%]'),
                        control: () => ('px-2 flex items-center'),
                        input: () => ('text-gray-400 mb-1'),
                        menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                        menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                        option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                      }}
                    />
                    <input type='text' name='ano' id='ano' className='dark:bg-neutral-800 border rounded-r flex-none  dark:border-neutral-600 py-1 px-2 focus:outline-neutral-600 placeholder:text-[14px] w-[30%]' placeholder='Ano'></input>
                  </div>
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="natureza">Natureza</label>
                  <Select options={handleSelectValues(naturezas, 'nome')} isClearable={true} name='natureza' placeholder='Selecionar natureza'
                    noOptionsMessage={() => 'Nenhuma natureza encontrada'} unstyled  // Remove all non-essential styles
                    classNames={{
                      container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                      control: () => ('px-2 flex items-center'),
                      input: () => ('text-gray-400 mb-1'),
                      menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full'),
                      menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[72px]'),
                      option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                    }}
                  />
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="empresa">Empresa</label>
                  <Select options={handleSelectValues(empresas, 'nome')} isClearable={true} name='empresa' placeholder='Selecionar empresa'
                    noOptionsMessage={() => 'Nenhuma empresa encontrada'} unstyled // Remove all non-essential styles
                    classNames={{
                      container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                      control: () => ('px-2 flex items-center'),
                      input: () => ('text-gray-400 mb-1'),
                      menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full'),
                      menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                      option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                    }}
                  />
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="data_cessao">Data da Cessão</label>
                  <input type='date' name='data_cessao' id='data_cessao' className='dark:bg-neutral-800 border rounded dark:text-gray-400  dark:border-neutral-600 py-1 px-2 focus:outline-neutral-600 text-[14px]' placeholder='Selecionar data da cessão'></input>
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="rep_comercial">Rep. Comercial</label>
                  <Select options={teles} isClearable={true} name='rep_comercial' placeholder='Selecionar rep. comercial'
                    noOptionsMessage={() => 'Nenhum Rep. Comercial encontrado'} unstyled// Remove all non-essential styles
                    classNames={{
                      container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px] relative'),
                      control: () => ('px-2 flex items-center'),
                      input: () => ('text-gray-400 mb-1'),
                      menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full'),
                      menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                      option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                    }}
                  />
                </div>
                <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
                  <label className='text-[14px] font-medium' htmlFor="escrevente">Escrevente</label>
                  <Select options={handleSelectValues(escreventes, 'nome')} isClearable={true} name='escrevente' placeholder='Selecionar escrevente'
                    noOptionsMessage={() => 'Nenhum escrevente encontrado'} menuPosition='absolute' unstyled// Remove all non-essential styles
                    classNames={{
                      container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                      control: () => ('px-2 flex items-center'),
                      input: () => ('text-gray-400 mb-1'),
                      menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full z-[100] '),
                      menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                      option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1'),
                      
                    }}
                  />
                </div>
              </div>

            </div>


            <button type="submit" className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>Enviar</button>


          </form>


        </div>
      </div>
    </>


  )
}