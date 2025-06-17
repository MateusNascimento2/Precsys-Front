import React, { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { ModalTab } from './ModalTab'
import FormAdicionarUsuario from './FormAdicionarUsuario';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export function Modal({ status, usuarioFormData, setUsuarioFormData, handleSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalElement = useRef();

  // Atualiza a referência do status sempre que ele mudar
  /*   useEffect(() => {
  
      if (status.status === 'success') {
        const isDarkMode = localStorage.getItem('darkMode');
        toast.success(status.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
          theme: isDarkMode === 'true' ? 'dark' : 'light',
          transition: Bounce,
        });
      } else if (status.status === 'error') {
        const isDarkMode = localStorage.getItem('darkMode');
        toast.error(status.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
          theme: isDarkMode === 'true' ? 'dark' : 'light',
          transition: Bounce,
        });
      }
  
    }, [status]);
   */
  //As coisas que estão nesse useEffect só funcionam quando eu clico no modal
  useEffect(() => {
    const handler = (event) => {

      if (!modalElement.current) {
        return;
      }
      // Se status for 'sending', não fechar o modal ao clicar fora
      if (status === 'sending') {
        return
      }

      if (!modalElement.current.contains(event.target)) {
        if (document.body.style.overflow == "hidden") {
          document.body.style.overflow = "scroll";
        }
        setIsModalOpen(false);
      }

    }



    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
    }
  }, []);

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
        title='Adicionar novo usuário'
        className='dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm p-2 rounded'
        onClick={() => {
          setIsModalOpen(true)
          if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = 'scroll';
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>

      </button>

    ) : (
      <div className='fixed w-[100vw] h-[100vh] left-0 top-0 z-[100] bg-black bg-opacity-40'>
        <ToastContainer />

        <div ref={modalElement} className='bg-white dark:bg-neutral-900 w-[85%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded shadow-sm fixed'>

          <ModalTab status={status} handleModalShow={handleModalShow} />

          {status.status === 'sending' ? (
            <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>

              <div className='w-full h-full absolute z-[100] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-20 flex justify-center items-center'>
                <div className='w-10 h-10'>
                  <LoadingSpinner />
                </div>
              </div>

              <div>
                <div>
                  {/* Mantém os formulários montados, mas esconde um deles dinamicamente */}
                  <div>
                    <FormAdicionarUsuario
                      usuarioFormData={usuarioFormData}
                      setUsuarioFormData={setUsuarioFormData}
                      handleSubmit={handleSubmit}
                    />
                  </div>
                </div>

              </div>

              <div>
                <button className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700' onClick={handleSubmit}>Salvar</button>
              </div>

            </div>) :
            <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>

              {/* Mantém os formulários montados, mas esconde um deles dinamicamente */}
              <div>
                <FormAdicionarUsuario
                  usuarioFormData={usuarioFormData}
                  setUsuarioFormData={setUsuarioFormData}
                  handleSubmit={handleSubmit}
                />
              </div>

              <div>
                <button className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700' onClick={handleSubmit}>Salvar</button>
              </div>
            </div>
          }

        </div>
      </div>
    )
  )
}