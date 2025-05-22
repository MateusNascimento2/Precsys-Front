import React, { useState } from 'react';
import Topics from '../components/Topics';
import { Link, useParams } from 'react-router-dom';
import ListaCessionarios from './ListaCessionarios';
import { Tooltip } from 'react-tooltip';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import useAuth from "../hooks/useAuth";


export default function InfoPrec({ precInfoNew, status, fetchDataCessao }) {
    const [loadingFiles, setLoadingFiles] = useState({});
    const { auth } = useAuth();
    const { precID } = useParams();
    const axiosPrivate = useAxiosPrivate();

    function navigation() {
        window.history.back();
    }

    const downloadFile = async (filename) => {
        const isDarkMode = localStorage.getItem('darkMode');
        const path = filename.split('/')[0];
        const file = filename.split('/')[1];

        setLoadingFiles(prev => ({ ...prev, [filename]: true }));

        try {
            const response = await axiosPrivate.get(`/download/${path}/${file}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = file;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error(`Erro ao baixar arquivo: ${error}`, {
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
            console.error('Error downloading the file:', error);
        } finally {
            setLoadingFiles(prev => ({ ...prev, [filename]: false }));
        }
    };

    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <div className='flex flex-col mb-[16px] max-[700px]:mb-16px'>
                <span className='text-gray-400 text-[10px]'><Link className='hover:underline cursor-pointer' to={'/dashboard'}>Dashboard</Link> &gt; <a className='hover:underline cursor-pointer' onClick={navigation}>Cessões</a> &gt; <span>{precInfoNew.precatorio}</span></span>
            </div>
            <div className='flex flex-col mb-[60px] max-[700px]:mb-60px'>
                <div className='grid max-[700px]:grid-cols-1 grid-cols-2' id='info-gerais'>
                    <div className='flex flex-col '>
                        <div className='flex items-center justify-between mb-[16px]'>
                            <span className="font-[700] dark:text-white" >Informações Gerais</span>
                        </div>

                        <div className='grid grid-cols-1 gap-3 mb-[20px]'>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Precatório: </span>
                                <span className='text-[#666] dark:text-neutral-400 w-full  focus:outline-none enabled:h-[21px] enabled:border enabled:rounded enabled:px-2 disabled:bg-transparent'>{precInfoNew.precatorio ? precInfoNew.precatorio : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Processo: </span>
                                <span className='text-[#666] dark:text-neutral-400 w-full focus:outline-none enabled:h-[21px] enabled:border enabled:rounded enabled:px-2 disabled:bg-transparent '>{precInfoNew.processo ? precInfoNew.processo : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Cedente: </span>
                                <span className='text-[#666] dark:text-neutral-400 w-full focus:outline-none enabled:border enabled:h-[21px] enabled:rounded enabled:px-2 disabled:bg-transparent'>{precInfoNew.cedente ? precInfoNew.cedente : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Vara: </span>
                                <span className='text-[#666] dark:text-neutral-400'>{precInfoNew.vara ? precInfoNew.vara : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Orçamento: </span>
                                <span className='text-[#666] dark:text-neutral-400'>{precInfoNew.ente && precInfoNew.ano ? `${precInfoNew.ente} - ${precInfoNew.ano}` : precInfoNew.ente ? precInfoNew.ente : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Natureza: </span>
                                <span className='text-[#666] dark:text-neutral-400'>{precInfoNew.natureza ? precInfoNew.natureza : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Empresa: </span>
                                <span className='text-[#666] dark:text-neutral-400'>{precInfoNew.empresa ? precInfoNew.empresa : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Data da Cessão: </span>

                                <span className='text-[#666] dark:text-neutral-400'>
                                    {precInfoNew.data_cessao ?
                                        `${precInfoNew.data_cessao.split('-')[2]}/${precInfoNew.data_cessao.split('-')[1]}/${precInfoNew.data_cessao.split('-')[0]}`
                                        : '-'}
                                </span>


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Rep. Comercial: </span>
                                <span className='text-[#666] dark:text-neutral-400'>{precInfoNew.tele ? precInfoNew.tele : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Escrevente: </span>
                                <span className='text-[#666] dark:text-neutral-400'>{precInfoNew.escrevente ? precInfoNew.escrevente : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Óbito: </span><span className='text-[#666] dark:text-neutral-400'>{precInfoNew.falecido ? precInfoNew.falecido : '-'}</span></div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Anuência: </span><span className='text-[#666] dark:text-neutral-400'>{precInfoNew.anuencia_advogado ? precInfoNew.anuencia_advogado : '-'}</span></div>

                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Requisitório:</span>
                                {loadingFiles[precInfoNew.requisitorio] ? (
                                    <div className="flex items-center gap-1">

                                        <button onClick={() => downloadFile(precInfoNew.requisitorio)} disabled={!precInfoNew.requisitorio} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Requisitório</button>
                                        <div className="w-5 h-5"><LoadingSpinner /></div>
                                    </div>
                                ) : (

                                    <button onClick={() => downloadFile(precInfoNew.requisitorio)} disabled={!precInfoNew.requisitorio} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Requisitório</button>

                                )}


                            </div>

                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Escritura: </span>
                                {loadingFiles[precInfoNew.escritura] ? (
                                    <div className="flex items-center gap-1">

                                        <button onClick={() => downloadFile(precInfoNew.escritura)} disabled={!precInfoNew.escritura} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Escritura</button>
                                        <div className="w-5 h-5"><LoadingSpinner /></div>
                                    </div>
                                ) : (

                                    <button onClick={() => downloadFile(precInfoNew.escritura)} disabled={!precInfoNew.escritura} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Escritura</button>

                                )}
                            </div>

                        </div>
                    </div>
                    <div className='flex flex-col max-[700px]:mb-20px'>
                        <span className="font-[700] dark:text-white mb-[16px]">Status</span>
                        <div className='border-l dark:border-neutral-600 py-[10px] ml-[10px]'>
                            {
                                status.map(s => (
                                    <div className='py-[10px] flex items-center' key={s.id}>
                                        <div style={{ backgroundColor: s.nome === precInfoNew.status && s.extra, borderColor: s.nome === precInfoNew.status && s.extra }} className={s.nome === precInfoNew.status ? 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border border-neutral-400 dark:border-neutral-600 brightness-110' : 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border border-neutral-200 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-600'}></div>
                                        <div className="flex flex-col justify-center text-[12px]">
                                            <span className={s.nome === precInfoNew.status ? "font-bold dark:text-white " : "font-bold dark:text-neutral-700 text-gray-300"}>{s.nome}</span>
                                            <span className="text-neutral-600 dark:text-neutral-400 font-medium mr-[15px]">{s.nome === precInfoNew.status ? precInfoNew.substatus : null}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            <ListaCessionarios cessionario={precInfoNew.cessionarios} precID={precID} fetchDataCessao={fetchDataCessao} />

            {
                auth.user.admin ? <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 dark:bg-neutral-900 xl:divide-x-[1px] dark:divide-neutral-600 mt-2 lg:mt-0'>
                        <div className='cursor-pointer lg:px-4 lg:py-2 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 lg:border-r lg:border-b xl:border-r-0 xl:border-b-0 dark:border-neutral-600' id='juridico'>
                            <Topics data={precInfoNew.juridico_data} texto={'Jurídico Feito'} atualizacaoJuridico={precInfoNew.juridico_feito} textoExplicativo={'A etapa "Jurídico Feito" representa a conclusão bem-sucedida de todos os procedimentos legais necessários na gestão e transferência de precatórios.'} />
                        </div>
                        <div className='cursor-pointer  pt-4 lg:px-4 lg:py-2 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 lg:border-b xl:border-b-0 dark:border-neutral-600'>
                            <Topics data={precInfoNew.juridico_data} texto={'Jurídico a Fazer'} atualizacaoJuridico={precInfoNew.juridico_afazer} textoExplicativo={'A etapa "Jurídico a Fazer" engloba todas as ações jurídicas necessárias que ainda precisam ser completadas para assegurar a legalidade e eficácia da cessão de precatórios.'} />
                        </div>
                        <div className='cursor-pointer  pt-4 lg:py-2 lg:px-4 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 lg:border-r xl:border-r-0 dark:border-neutral-600'>
                            <Topics data={precInfoNew.juridico_data} texto={'Andamento Jurídico'} atualizacaoJuridico={precInfoNew.juridico_andamentoatual} textoExplicativo={'A etapa "Andamento Jurídico" é uma fase crítica na gestão de precatórios, onde o progresso dos procedimentos legais é monitorado e revisado continuamente.'} />
                        </div>
                        <div className='cursor-pointer  pt-4 lg:py-2 lg:px-4 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:border-neutral-600'>
                            <Topics texto={'Obs Jurídico'} data={precInfoNew.juridico_data} atualizacaoJuridico={precInfoNew.juridico_obs} textoExplicativo={'A etapa "Obs Jurídico" envolve a coleta e o registro de observações e recomendações da equipe jurídica, essenciais para orientar e gerenciar o processo de cessão de precatórios de forma eficaz.'} />
                        </div>
                    </div>
                </div>
                    : null
            }

            {
                precInfoNew.cessoes_relacionadas.length > 0 && auth.user.admin ? (
                    <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                        <span className="font-[700] dark:text-white mb-[16px]" id='relacionados'>Relacionados</span>
                        <div className="mb-4 dark:bg-neutral-900">
                            {precInfoNew.cessoes_relacionadas.map(cessao => (
                                <div className="flex flex-col mb-4 border dark:border-neutral-600 dark:bg-neutral-900 px-2 py-1 rounded" key={cessao.cessao_id}>
                                    <div className="flex border-b dark:border-neutral-600">
                                        <div className="border-r dark:border-neutral-600 pr-2 my-3 flex items-center justify-center">
                                            <span className="font-[700] dark:text-white">{cessao.cessao_id}</span>
                                        </div>
                                        <div className="flex flex-col justify-center text-[12px] pl-2">
                                            <Link to={`/cessao/${String(cessao.cessao_id)}`}><span className="font-bold dark:text-white hover:underline">{cessao.precatorio}</span></Link>
                                            <span className="text-neutral-400 font-medium line-clamp-1">{cessao.cedente}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] dark:border-neutral-700 py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900">
                                        <a
                                            style={{ backgroundColor: `${cessao.corStatus}` }}
                                            data-tooltip-id="status"
                                            data-tooltip-content={`${cessao.substatus ? cessao.substatus : ''}`}
                                            data-tooltip-place="top"
                                            className={`px-2 py-1 rounded brightness-110`}>
                                            <span className="text-black font-bold">{cessao.status}</span>
                                        </a>
                                        <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100`}>
                                            <span className="text-black font-bold dark:text-neutral-100">{cessao.ente} - {cessao.ano}</span>
                                        </span>
                                        <span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}>
                                            <span className="text-black font-bold dark:text-neutral-100">{cessao.natureza}</span>
                                        </span>
                                        {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}
                                        {cessao.empresa_id ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.empresa_id}</span></span>) : null}
                                        {cessao.adv ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.adv}</span></span>) : null}
                                        {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700`}><span className="text-black font-bold dark:text-neutral-100">{cessao.falecido}</span></span>) : null}
                                    </div>
                                    <Tooltip id="status" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border="1px solid #d4d4d4" opacity={100} place="top" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}
