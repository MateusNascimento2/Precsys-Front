import React, { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import { ModalTab } from './ModalTab'

export function NewModal({ onAddCessionario, onDeleteCessionarioForm, handleInputChange, cessionariosQtd, formCessionario, handleSubmit, status, children }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isTabSelected, setIsTabSelected] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modalElement = useRef();
  const menuElement = useRef();
  const addCessionarioButtonElement = useRef();
  const statusRef = useRef(status); // Ref para armazenar o status
  console.log(cessionariosQtd)

  // Atualiza a referência do status sempre que ele mudar
  useEffect(() => {
    statusRef.current = status;
  }, [status]);


  useEffect(() => {
    const handler = (event) => {
      if (!modalElement.current) {
        return;
      }

      // Se status for 'sending', não fechar o modal ao clicar fora
      if (statusRef.current === 'sending') return;

      if (!modalElement.current.contains(event.target)) {
        setIsModalOpen(false);
      }

    }

    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
    }
  }, []);

  const handleShowForm = (index) => {
    console.log('index:', index);
    setIsTabSelected(index);
  };

  const handleModalShow = () => {
    setIsModalOpen(prevState => !prevState) 
  }

  console.log(isTabSelected)

  return (
    !isModalOpen ? (
      <>
        <button onClick={() => setIsModalOpen(true)}>Abrir Modal</button>
      </>

    ) : (
      <div className='relative w-[100vw] h-[100vh] bg-black bg-opacity-40'>
        <div ref={modalElement} className='bg-white w-[85%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded shadow-sm absolute'>

          {/*ModalTab*/}

          <ModalTab status={status} cessionariosQtd={cessionariosQtd} onAddCessionario={onAddCessionario} onDeleteCessionarioForm={onDeleteCessionarioForm} isTabSelected={isTabSelected} handleShowForm={handleShowForm} handleModalShow={handleModalShow} />

          {status === 'sending' ? (
            <div className='px-4 py-2'>

              <div className='w-full h-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-20 flex justify-center items-center'>
                <div className='w-10 h-10'>
                  <LoadingSpinner />
                </div>
              </div>

              <div>
                <form>
                  {isTabSelected !== null ? (
                    cessionariosQtd.map((cessionario, index) => (
                      <div key={cessionario.id} className={isTabSelected === index ? 'bg-white block w-full' : 'hidden'}>
                        <div className="flex flex-col">
                          <label htmlFor="cessionario">Cessionário {cessionario.id}</label>
                          <input
                            className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                            placeholder="Cessionário"
                            type="text"
                            name="cessionario"
                            value={cessionario.formDataCessionario?.cessionario || ''}
                            onChange={(e) => handleInputChange(cessionario.id, e)}
                          />
                        </div>
                        <button className="border rounded p-2" onClick={handleSubmit}>
                          Salvar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div>
                      {children}

                      <button className='border rounded p-2' onClick={handleSubmit}>Salvar</button>
                    </div>
                  )}



                </form>
              </div>
              
            </div>) :
            <div className='px-4 py-2'>
              <div>
                <form>
                  {isTabSelected !== null ? (
                    cessionariosQtd.map((cessionario, index) => (
                      <div key={cessionario.id} className={isTabSelected === index ? 'bg-white block w-full' : 'hidden'}>
                        <div className="flex flex-col">
                          <label htmlFor="cessionario">Cessionário {cessionario.id}</label>
                          <input
                            className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                            placeholder="Cessionário"
                            type="text"
                            name="cessionario"
                            value={cessionario.formDataCessionario?.cessionario || ''}
                            onChange={(e) => handleInputChange(cessionario.id, e)}
                          />
                        </div>
                        <button className="border rounded p-2" onClick={handleSubmit}>
                          Salvar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div>
                      {children}

                      <button className='border rounded p-2' onClick={handleSubmit}>Salvar</button>
                    </div>
                  )}

                </form>
              </div>
            </div>
          }
        </div>
      </div>
    )
  )
}