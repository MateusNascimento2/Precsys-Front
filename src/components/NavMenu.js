import React, {useState} from 'react'

export default function NavMenu() {
  const [show, setShow] = useState(true);

  const handleShow = () => {
    setShow((prevState) => !prevState)
  }

  return (
    <>
      <div onClick={handleShow} className={show ? "bg-neutral-800 opacity-60 w-screen h-screen fixed top-0 z-[51] transition-opacity duration-300 left-0 lg:hidden" : 'h-screen top-[9999px] bg-neutral-800 opacity-0 w-screen fixed transition-opacity duration-[700] left-0'}>
      </div>
      <div className={show ? "bg-white dark:bg-neutral-900 h-full w-screen fixed z-[60] top-[15%] transition-all ease-in-out duration-[0.3s] shadow rounded-t-[20px] lg:bg-transparent lg:border-r dark:border-neutral-700 lg:transition-none lg:rounded-none lg:w-[300px] lg:relative lg:shadow-none lg:mt-5 lg:h-full lg:z-0 left-0" : 'top-[100%] transition-all ease-in-out duration-[0.3s] w-screen fixed bg-white dark:bg-neutral-900 h-full left-0'}>
        <div className="p-4 lg:p-0 lg:px-2">
          <div className="">
            <span className="font-[700] dark:text-white">Navegação</span>
              <ul className='flex flex-col mt-4 divide-y justify-center'>
                <li className='py-2 px-1'><a className='text-[14px] text-gray-600 cursor-pointer hover:underline'>Informações Gerais</a></li>
                <li className='py-2 px-1'><a className='text-[14px] text-gray-600 cursor-pointer hover:underline'>Cessionários</a></li>
                <li className='py-2 px-1'><a className='text-[14px] text-gray-600 cursor-pointer hover:underline'>Jurídico</a></li>
                <li className='py-2 px-1'><a className='text-[14px] text-gray-600 cursor-pointer hover:underline'>Relacionados</a></li>
              </ul>

          </div>
        </div >
      </div>
    </>

  )
}