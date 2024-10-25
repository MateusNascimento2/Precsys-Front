import React from 'react'
import Header from '../components/Header'
import { motion, AnimatePresence } from 'framer-motion';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import SearchInput from '../components/SearchInput';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import DotsButton from "../components/DotsButton";
import placeholder from "../../public/assets/no-logo.png";
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';


export default function Empresas() {
  const [empresas, setEmpresas] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const axiosPrivate = useAxiosPrivate();

  React.useEffect(() => {
    async function fetchEmpresas() {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get('/empresas')
        console.log(data)
        setEmpresas(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmpresas()

  }, [])

  return (
    <>
      <Header />
      <motion.main
        className='container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='flex justify-between items-center'>
          <motion.h2
            className='font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white'
            id='empresas'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empresas
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mt-[24px] px-5 dark:bg-neutral-900'
        >
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput p={'py-3'} />
          </div>

          <div className={`lg:flex lg:flex-col lg:gap-4 lg:items-start mb-10`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
            </div>
            {empresas ?
              empresas.map(empresa =>
                <div className='w-full h-full max-h-full mb-4 lg:mb-0'>
                  <motion.div
                    className="dark:bg-neutral-900"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className=" dark:bg-neutral-900 ">
                      <div className="flex border dark:border-neutral-700 dark:bg-neutral-900 px-2 py-1 rounded-t items-center">
                        <div className="flex w-full">
                          <div className="border-r dark:border-neutral-700 pr-2 my-3 flex items-center justify-center w-[100px] sm:w-[140px] lg:w-[250px]">
                            <img src={empresa.photoUrl ? empresa.photoUrl : placeholder} className='h-[40px]'></img>
                          </div>
                          <div className="flex grow flex-col justify-center text-[12px] pl-2">

                            <span className="font-bold dark:text-white hover:underline"><Link to={`/cessao/${String(empresa.id)}`}>{empresa.nome}</Link></span>

                            <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{empresa.cnpj}</span>
                          </div>
                        </div>
                        <DotsButton>
                          {/* <span className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>

                            <a target="_blank" rel="noopener noreferrer" href={`https://www4.tjrj.jus.br/ejud/processarprecatorio.aspx?N=${cessao.precatorio}&T=%27N%27`}>Ver no TJ</a>
                          </span>

                          <button title="Baixar requisitório" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900" onClick={() => downloadFile(cessao.requisitorio)} disabled={!cessao.requisitorio}>
                            {loadingFiles[cessao.requisitorio] ? (
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4"><LoadingSpinner /></div>

                                <span>Requisitório</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span>Requisitório</span>

                              </div>


                            )}
                          </button> */}


                          {/* <button title="Baixar escritura" className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 w-full text-left disabled:opacity-75 disabled:hover:bg-white disabled:dark:hover:bg-neutral-900 disabled:cursor-not-allowed  disabled:dark:bg-neutral-900" onClick={() => downloadFile(cessao.escritura)} disabled={!cessao.escritura}>
                            {loadingFiles[cessao.escritura] ? (
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4"><LoadingSpinner /></div>
                                <span>Escritura</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span>Escritura</span>

                              </div>
                            )}
                          </button> */}

                        </DotsButton>
                      </div>

                      <div className="text-[10px] rounded-b border-b border-r border-l dark:border-neutral-700 py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900">
                        <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100`}>
                          <span className="text-black font-bold dark:text-neutral-100">{empresa.site}</span>
                        </span>

                        {/*                         <span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}>
                          <span className="text-black font-bold dark:text-neutral-100">b</span>
                        </span> */}

                        {/* {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null} */}

                        {/* {cessao.empresa_id ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.empresa_id}</span></span>) : null}

                        {cessao.adv ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.adv}</span></span>) : null}

                        {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.falecido}</span></span>) : null} */}
                      </div>
                    </div>
                    {/* <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: isDarkTheme ? 'rgb(38 38 38)' : '#FFF', color: isDarkTheme ? '#FFF' : '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border={isDarkTheme ? "1px solid rgb(82 82 82)" : "1px solid #d4d4d4"} opacity={100} place="top" /> */}
                  </motion.div>
                </div>
              )
              : <div className="w-full flex justify-center">
                <div className="w-12 h-12">
                  <LoadingSpinner />
                </div>
              </div>}

          </div>
        </motion.div>
      </motion.main>

    </>
  )
}