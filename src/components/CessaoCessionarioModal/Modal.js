import React, { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { ModalTab } from './ModalTab'
import { FormAdicionarCessionario } from './FormAdicionarCessionario'
import { FormAdicionarCessao } from './FormAdicionarCessao'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion' // <-- IMPORTADO AQUI

export function Modal({ onAddCessionario, onDeleteCessionarioForm, handleCessionarioInputChange, cessionariosQtd, formCessionario, setFormDataCessionario, handleSubmit, status, handleNomeTab, formDataCessao, handleCessaoInputChange }) {
  const axiosPrivate = useAxiosPrivate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTabSelected, setIsTabSelected] = useState(null)
  const [nomeTab, setNomeTab] = useState('')
  const modalElement = useRef()
  const statusRef = useRef(status)
  const [orcamentos, setOrcamentos] = useState([])
  const [anosOrcamento, setAnosOrcamento] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [teles, setTeles] = useState([])
  const [juridico, setJuridico] = useState([])
  const [varas, setVaras] = useState([])
  const [natureza, setNatureza] = useState([])
  const [escrevente, setEscrevente] = useState([])
  const [users, setUsers] = useState([])

  useEffect(async () => {
    let isMounted = true; // ✅ Flag para verificar se o componente está montado

    const fetchData = async (ApiRoute, setter) => {
      try {
        const { data } = await axiosPrivate.get(ApiRoute);
        if (isMounted) {  // ✅ Só atualiza o estado se o componente ainda estiver montado
          setter(data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    await Promise.all([
      fetchData('/orcamentos', setOrcamentos),
      fetchData('/empresas', setEmpresas),
      fetchData('/nomeTele', setTeles),
      fetchData('/juridicos', setJuridico),
      fetchData('/vara', setVaras),
      fetchData('/natureza', setNatureza),
      fetchData('/escreventes', setEscrevente),
      fetchData('/users', setUsers)
    ]);


    return () => {
      isMounted = false; // ✅ Cleanup: evita atualização após desmontar
    };
  }, []);


  useEffect(() => {
    statusRef.current = status

    const isDarkMode = localStorage.getItem('darkMode')
    const toastOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: false,
      theme: isDarkMode === 'true' ? 'dark' : 'light',
      transition: Bounce
    }

    if (statusRef.current.status === 'success') {
      toast.success(statusRef.current.message, toastOptions)
    } else if (statusRef.current.status === 'error') {
      toast.error(statusRef.current.message, toastOptions)
    }
  }, [status])

  useEffect(() => {
    const handler = (event) => {
      if (!modalElement.current) return
      if (statusRef.current.status === 'sending') return

      if (!modalElement.current.contains(event.target)) {
        setIsModalOpen(false)
        document.body.style.overflow = 'scroll'
      }
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler)
  }, [])

  const handleShowForm = (index, action) => {
    if (action === 'selecionar') {
      setIsTabSelected(index)
    } else if (action === 'excluir') {
      if (isTabSelected === index) {
        setIsTabSelected(index > 0 ? index - 1 : null)
      } else if (isTabSelected > index) {
        setIsTabSelected((prev) => prev - 1)
      }
    } else {
      setIsTabSelected(index)
    }
  }

  const handleModalShow = () => {
    setIsModalOpen((prev) => !prev)
    document.body.style.overflow = isModalOpen ? 'scroll' : 'hidden'
  }

  const handleAnoOrcamento = async (id) => {
    if (id) {
      const { data } = await axiosPrivate.post('OrcamentosComAnos', { id })
      setAnosOrcamento(data)
    } else {
      setAnosOrcamento([])
    }
  }

  return (
    <>
      <ToastContainer />

      <button
        title='Adicionar nova cessão'
        className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[20px] p-1 lg:mb-0 lg:p-2 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
        onClick={handleModalShow}
      >
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' />
        </svg>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key='modal-backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed w-dvw h-lvh left-0 top-0 z-[100] bg-black bg-opacity-40'
          >
            <motion.div
              ref={modalElement}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='bg-white border dark:border-neutral-600 dark:bg-neutral-900 w-[85%] h-[80%] top-[10%] left-[7%] rounded shadow-sm absolute'
            >
              <ModalTab
                status={status}
                nomeTab={nomeTab}
                cessionariosQtd={cessionariosQtd}
                onAddCessionario={onAddCessionario}
                onDeleteCessionarioForm={onDeleteCessionarioForm}
                isTabSelected={isTabSelected}
                handleShowForm={handleShowForm}
                handleModalShow={handleModalShow}
              />

              <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>
                {status.status === 'sending' && (
                  <div className='w-full h-full absolute z-[100] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-20 flex justify-center items-center'>
                    <div className='w-10 h-10'>
                      <LoadingSpinner />
                    </div>
                  </div>
                )}

                <form>
                  <div>
                    <div style={{ display: isTabSelected !== null ? 'none' : 'block' }}>
                      <FormAdicionarCessao
                        formDataCessao={formDataCessao}
                        handleCessaoInputChange={handleCessaoInputChange}
                        orcamentos={orcamentos}
                        anosOrcamento={anosOrcamento}
                        handleAnoOrcamento={handleAnoOrcamento}
                        empresas={empresas}
                        teles={teles}
                        juridico={juridico}
                        varas={varas}
                        natureza={natureza}
                        escrevente={escrevente}
                      />
                    </div>

                    {cessionariosQtd.map((cessionario, index) => (
                      <div key={cessionario.id} style={{ display: isTabSelected === index ? 'block' : 'none' }}>
                        <FormAdicionarCessionario
                          cessionario={cessionario}
                          formCessionario={formCessionario}
                          setFormDataCessionario={setFormDataCessionario}
                          index={index}
                          isTabSelected={isTabSelected}
                          handleSubmit={handleSubmit}
                          handleCessionarioInputChange={handleCessionarioInputChange}
                          handleNomeTab={handleNomeTab}
                          users={users}
                        />
                      </div>
                    ))}
                  </div>
                </form>

                <div>
                  <button
                    className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700'
                    onClick={handleSubmit}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
