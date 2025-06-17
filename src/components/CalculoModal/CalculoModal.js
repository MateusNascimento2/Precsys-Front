import React, { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { ModalTab } from './ModalTab'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabelaGeneradaCalculo from './TabelaGeneradaCalculo';
import { TabsTabelaCalculo } from "./TabsTabelaCalculo";



export function CalculoModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalElement = useRef();

  const handleModalShow = () => {
    setIsModalOpen(prevState => !prevState)

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

  return (
    !isModalOpen ? (
      <button
        title='Fazer cálculo' className='w-full text-start font-[600] text-[14px] text-[#171717] dark:text-neutral-300 p-2 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800'
        onClick={() => {
          setIsModalOpen(true)
          if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = 'scroll';
          }
        }}
      >
        Cálculo
        <p className='font-[600] text-[12px] text-[#666666]'>Fazer Cálculo </p>
      </button>

    ) : (
      <div className='fixed w-[100vw] h-[100vh] left-0 top-0 z-[100] bg-black bg-opacity-40'>

        <div ref={modalElement} className='bg-white dark:bg-neutral-900 w-[85%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded shadow-sm fixed'>

          <ModalTab handleModalShow={handleModalShow} />


          <div className='px-4 h-[calc(100%-50px)] overflow-y-auto lg:overflow-y-hidden lg:flex lg:flex-col lg:justify-between'>

            <TabelaGeneradaCalculo />


          </div>


        </div>
      </div>
    )
  )
}