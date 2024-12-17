import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';
import OrcamentosList from '../components/OrcamentosList';
import Modal from '../components/Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Orcamentos() {
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orcamentos, setOrcamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ente, setEnte] = useState('');
  const [apelido, setApelido] = useState('');
  const [comarca, setComarca] = useState("0"); // Inicializa como "0"

  const handleComarcaChange = (e) => {
    setComarca(e.target.checked ? "1" : "0"); // Se marcado, define "1"; senão, "0"
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });
        console.log(data);
        if (isMounted) setState(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData('OrcamentosComAnos', setOrcamentos)


    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  console.log(orcamentos)

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  const handleAdicionarOrcamento = async (e) => {
    e.preventDefault();

    if (!ente) {
      toast.error("Mencione um ente antes de criar um novo orçamento.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!apelido) {
      toast.error("Mencione um apelido para o ente antes de criar um novo orçamento.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      setIsLoading(true)
      await axiosPrivate.post(
        '/orcamentos',
        {
          ente, apelido, comarca
        },
      );

      toast.success("Orçamento criado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false)

    } catch (e) {
      toast.error(`Error ao criar orçamento: ${e}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });

    }


  };

  return (
    <>
      <Header />
      <motion.main className="container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='flex items-center justify-between mx-5'>
          <motion.h2 className="font-[700] text-[32px] md:mt-[16px] dark:text-white" id="orcamento" initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>Orçamentos
          </motion.h2>
          <Modal
            botaoAbrirModal={
              <motion.button
                title='Adicionar novo orçamento'
                className='hover:bg-neutral-100 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 rounded text-[20px] lg:mb-0 md:text-[25px] w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>

              </motion.button>
            }
            tituloModal={

              <div className='flex gap-2 items-center'>
                <span>Adicionar novo orçamento</span>
              </div>

            }
            botaoSalvar={
              <motion.button
                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'
                onClick={(e) => handleAdicionarOrcamento(e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Salvar
              </motion.button>
            }

          >
            <ToastContainer />
            <form className='flex flex-col gap-4 justify-center  items-center'>
              <div className='w-[650px] flex flex-col gap-4'>
                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='ente'>Ente</label>
                  <input name='ente' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={ente} onChange={(e) => setEnte(e.target.value)}></input>
                </div>

                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='apelido'>Apelido</label>
                  <input name='apelido' className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400' value={apelido} onChange={(e) => setApelido(e.target.value)}></input>
                </div>

                <div className='flex flex-col gap-1 dark:text-white'>
                  <label htmlFor='comarca'>Comarca:</label>
                  <div className='flex gap-1 items-center'>
                    <div className='relative'>
                      <input type="checkbox" name="persist" id="persist" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={comarca === "1"} onChange={handleComarcaChange} />
                      <span
                        className="absolute right-[1px] top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[2px] mt-[1px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                    </div>

                  </div>
                </div>
              </div>


            </form>

          </Modal>
        </div>

        <div className="mt-[24px] px-5 dark:bg-neutral-900">
          <div className="flex gap-3 items-center mb-4 w-full">
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>


            <div className="w-full h-full max-h-full">
              <OrcamentosList searchQuery={searchQuery} orcamentos={orcamentos} isLoading={isLoading} />
            </div>
          </div>
        </div>
        <ScrollToTopButton />


      </motion.main>
    </>
  );
}