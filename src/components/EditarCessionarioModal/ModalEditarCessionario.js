import React, { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { ModalTab } from './ModalTab'
import { FormEditarCessionario } from './FormEditarCessionario';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export function ModalEditarCessionario({ handleCessionarioInputChange, formDataCessionario, setFormDataCessionario, status, dadosCessionario, fileCessionario, setFileCessionario, handleEditarCessionarioSubmit }) {
  const axiosPrivate = useAxiosPrivate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalElement = useRef();
  const statusRef = useRef(status); // Ref para armazenar o status
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    let isMounted = true; // Flag para verificar se o componente está montado

    const fetchData = async (ApiRoute, setter) => {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get(ApiRoute);
        if (isMounted) {  // Só atualiza o estado se o componente ainda estiver montado
          setter(data);
        }
        setIsLoading(false)
      } catch (e) {
        console.log(e);
      }
    };

    await Promise.all([
      fetchData('/users', setUsers)

    ]);

    setFormDataCessionario({ ...dadosCessionario })


    return () => {
      isMounted = false; // Cleanup: evita atualização após desmontar
    };
  }, []);

  // Atualiza a referência do status sempre que ele mudar
  useEffect(() => {
    statusRef.current = status;

    if (statusRef.current.status === 'success') {
      const isDarkMode = localStorage.getItem('darkMode');
      toast.success(statusRef.current.message, {
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
    } else if (statusRef.current.status === 'error') {
      const isDarkMode = localStorage.getItem('darkMode');
      toast.error(statusRef.current.message, {
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

  //As coisas que estão nesse useEffect só funcionam quando eu clico no modal
  useEffect(() => {
    const handler = (event) => {

      if (!modalElement.current) {
        return;
      }
      // Se status for 'sending', não fechar o modal ao clicar fora
      if (statusRef.current === 'sending') {
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
        title='Adicionar novo cessionário'
        className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[12px] p-1 lg:mb-0 lg:p-2 md:text-[14px]'
        onClick={() => {
          setIsModalOpen(true)
          if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = 'scroll';
          }
        }}
      >
        Editar

      </button>

    ) : (
      <div className='fixed w-[100vw] h-[100vh] left-0 top-0 z-[100] bg-black bg-opacity-40'>
        <ToastContainer />

        <div ref={modalElement} className='bg-white dark:bg-neutral-900 w-[85%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded shadow-sm absolute'>

          <ModalTab status={status} handleModalShow={handleModalShow} nomeCessionario={dadosCessionario.nome} />

          {status.status === 'sending' ? (
            <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>

              <div className='w-full h-full absolute z-[100] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-20 flex justify-center items-center'>
                <div className='w-10 h-10'>
                  <LoadingSpinner />
                </div>
              </div>

              <div>
                <form>


                  <div>
                    <FormEditarCessionario
                      cessionario={dadosCessionario}
                      formCessionario={formDataCessionario}
                      setFormDataCessionario={setFormDataCessionario}
                      handleCessionarioInputChange={handleCessionarioInputChange}
                      users={users}
                      fileCessionario={fileCessionario}
                      setFileCessionario={setFileCessionario}
                    />
                  </div>



                </form>
              </div>

              <div>
                <button className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200' onClick={handleEditarCessionarioSubmit}>Salvar</button>
              </div>


            </div>) :
            <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>

              {isLoading ?
                <div className='w-full h-full absolute z-[100] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-20 flex justify-center items-center'>
                  <div className='w-10 h-10'>
                    <LoadingSpinner />
                  </div>
                </div> : null}

              <div>
                <form>
                  <div>
                    <FormEditarCessionario
                      cessionario={dadosCessionario}
                      formCessionario={formDataCessionario}
                      setFormDataCessionario={setFormDataCessionario}
                      handleCessionarioInputChange={handleCessionarioInputChange}
                      users={users}
                      fileCessionario={fileCessionario}
                      setFileCessionario={setFileCessionario}
                    />
                  </div>
                </form>
              </div>

              <div>
                <button className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700' onClick={handleEditarCessionarioSubmit}>Salvar</button>
              </div>
            </div>
          }

        </div>
      </div>
    )
  )
}