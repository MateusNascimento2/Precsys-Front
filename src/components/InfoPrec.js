import React, { useState, useEffect } from 'react'
import Topics from '../components/Topics';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import ListaCessionarios from './ListaCessionarios';
import EditarPrec from './EditarPrec';
import { Tooltip } from 'react-tooltip';

export default function InfoPrec({ precInfo, status, cessionario, cessoes, varas, orcamentos, naturezas, empresas, users, teles, escreventes }) {
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    console.log(from);

    function navigation() {
        window.history.back();
    }


    teles.forEach(tele => {
        users.forEach(user => {
            if (String(tele.usuario_id) === String(user.id)) {
                tele.value = parseInt(user.id)
                tele.label = user.nome
            }
        })
    })

    console.log(precInfo)

    console.log(cessoes)

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 21
        })
    };

    const handleReceberValores = (valores) => {
        console.log(valores)
    }


    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <div className='flex flex-col mb-[16px] max-[700px]:mb-16px'>
                <span className='text-gray-400 text-[10px]'><Link className='hover:underline cursor-pointer' to={'/dashboard'}>Dashboard</Link> &gt; <a className='hover:underline cursor-pointer' onClick={navigation}>Cessões</a> &gt; <span>{precInfo.precatorio}</span></span>
            </div>
            <div className='flex flex-col mb-[60px] max-[700px]:mb-60px'>
                <div className='grid max-[700px]:grid-cols-1 grid-cols-2' id='info-gerais'>
                    <div className='flex flex-col '>
                        <div className='flex items-center justify-between mb-[16px]'>
                            <span className="font-[700] dark:text-white" >Informações Gerais</span>
                            <Modal
                                botaoAbrirModal={
                                    <button title='Editar precatório' className='hover:bg-neutral-100 flex items-center justify-center dark:hover:bg-neutral-800 rounded p-[1px] mr-4'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>}
                                tituloModal={'Editar cessão'}
                                botaoSalvar={
                                    <button
                                        className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-1 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                                        Salvar
                                    </button>
                                }
                            >
                                <div className='h-[450px] overflow-auto'>
                                    <EditarPrec precInfo={precInfo} varas={varas} orcamentos={orcamentos} naturezas={naturezas} empresas={empresas} users={users} teles={teles} escreventes={escreventes} enviarValores={(valores) => handleReceberValores(valores)} />
                                </div>

                            </Modal>
                        </div>

                        <div className='grid grid-cols-1 gap-3 mb-[20px]'>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Precatório: </span>
                                <input className='text-[#666] dark:text-neutral-400 w-full  focus:outline-none enabled:h-[21px] enabled:border enabled:rounded enabled:px-2 disabled:bg-transparent' disabled={isDisabled} defaultValue={precInfo.precatorio ? precInfo.precatorio : '-'}></input>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Processo: </span>
                                <input className='text-[#666] dark:text-neutral-400 w-full focus:outline-none enabled:h-[21px] enabled:border enabled:rounded enabled:px-2 disabled:bg-transparent ' disabled={isDisabled} defaultValue={precInfo.processo ? precInfo.processo : '-'}></input>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Cedente: </span>
                                <input className='text-[#666] dark:text-neutral-400 w-full focus:outline-none enabled:border enabled:h-[21px] enabled:rounded enabled:px-2 disabled:bg-transparent' disabled={isDisabled} defaultValue={precInfo.cedente ? precInfo.cedente : '-'}></input>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Vara: </span>

                                <span className='text-[#666] dark:text-neutral-400'>{precInfo.nome_vara ? precInfo.nome_vara : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Orçamento: </span>

                                <span className='text-[#666] dark:text-neutral-400'>{precInfo.orcamento ? precInfo.orcamento : '-'}</span>


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Natureza: </span>

                                <span className='text-[#666] dark:text-neutral-400'>{precInfo.nome_natureza ? precInfo.nome_natureza : '-'}</span>


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Empresa: </span>

                                <span className='text-[#666] dark:text-neutral-400'>{precInfo.nome_empresa ? precInfo.nome_empresa : '-'}</span>


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Data da Cessão: </span>
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>
                                        {precInfo.data_cessao ?
                                            `${precInfo.data_cessao.split('-')[2]}/${precInfo.data_cessao.split('-')[1]}/${precInfo.data_cessao.split('-')[0]}`
                                            : '-'}
                                    </span>
                                    : <input type='date' name='data_cessao' id='data_cessao' className='dark:bg-neutral-800 border rounded text-[#666] dark:text-neutral-400  dark:border-neutral-600 py-1 h-[21px] px-2 focus:outline-none text-[14px] w-full' placeholder='Selecionar data da cessão' defaultValue={precInfo.data_cessao}></input>
                                }
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Rep. Comercial: </span>

                                <span className='text-[#666] dark:text-neutral-400'>{precInfo.nome_tele ? precInfo.nome_tele : '-'}</span>


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Escrevente: </span>

                                <span className='text-[#666] dark:text-neutral-400'>{precInfo.nome_escrevente ? precInfo.nome_escrevente : '-'}</span>


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Óbito: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.falecido ? precInfo.falecido : '-'}</span></div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Anuência: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.adv ? precInfo.adv : '-'}</span></div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Requisitório: </span><a className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer'>Ver Requisitório</a></div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Escritura: </span><a className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer'>Ver Escritura</a></div>
                        </div>
                    </div>
                    <div className='flex flex-col max-[700px]:mb-20px'>
                        <span className="font-[700] dark:text-white mb-[16px]">Status</span>
                        <div className='border-l dark:border-neutral-600 py-[10px] ml-[10px]'>
                            {
                                status.map(s => (
                                    <div className='py-[10px] flex items-center' key={s.id}>
                                        <div style={{ backgroundColor: s.nome === precInfo.status && s.extra, borderColor: s.nome === precInfo.status && s.extra }} className={s.nome === precInfo.status ? 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border border-neutral-400 dark:border-neutral-600 brightness-110' : 'min-w-[12px] min-h-[12px] rounded-full  relative left-[-6px] border border-neutral-200 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-600'}></div>
                                        <div className="flex flex-col justify-center text-[12px]">
                                            <span className={s.nome === precInfo.status ? "font-bold dark:text-white " : "font-bold dark:text-neutral-700 text-gray-300"}>{s.nome}</span>
                                            <span className="text-neutral-600 dark:text-neutral-400 font-medium mr-[15px]">{s.nome === precInfo.status ? precInfo.substatus : null}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ListaCessionarios cessionario={cessionario} precInfo={precInfo} users={users} />
            <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                {/*                 <p className='text-[12px] text-neutral-600 dark:text-neutral-400 font-medium'>Data de Atualização: {precInfo.juridico_feito_data ? `${precInfo.juridico_feito_data.split('/')[1]}/${precInfo.juridico_feito_data.split('/')[0]}/${precInfo.juridico_feito_data.split('/')[2]}` : <span className='text-[11px] text-neutral-600 dark:text-neutral-400 font-light '>TBA</span>}</p> */}
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 dark:bg-neutral-900 xl:divide-x-[1px] dark:divide-neutral-600 mt-2 lg:mt-0'>
                    <div className='cursor-pointer lg:px-4 lg:py-2 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 lg:border-r lg:border-b xl:border-r-0 xl:border-b-0 dark:border-neutral-600' id='juridico'>
                        <Topics texto={'Jurídico Feito'} atualizacaoJuridico={precInfo.juridico_feito} textoExplicativo={'A etapa "Jurídico Feito" representa a conclusão bem-sucedida de todos os procedimentos legais necessários na gestão e transferência de precatórios.'} />
                    </div>
                    <div className='cursor-pointer  pt-4 lg:px-4 lg:py-2 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 lg:border-b xl:border-b-0 dark:border-neutral-600'>
                        <Topics texto={'Jurídico a Fazer'} atualizacaoJuridico={precInfo.juridico_afazer} textoExplicativo={'A etapa "Jurídico a Fazer" engloba todas as ações jurídicas necessárias que ainda precisam ser completadas para assegurar a legalidade e eficácia da cessão de precatórios.'} />
                    </div>
                    <div className='cursor-pointer  pt-4 lg:py-2 lg:px-4 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 lg:border-r xl:border-r-0 dark:border-neutral-600'>
                        <Topics texto={'Andamento Jurídico'} atualizacaoJuridico={precInfo.juridico_andamentoatual} textoExplicativo={'A etapa "Andamento Jurídico" é uma fase crítica na gestão de precatórios, onde o progresso dos procedimentos legais é monitorado e revisado continuamente.'} />
                    </div>
                    <div className='cursor-pointer  pt-4 lg:py-2 lg:px-4 lg:my-0 xl:my-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:border-neutral-600'>
                        <Topics texto={'Obs Jurídico'} atualizacaoJuridico={precInfo.juridico_obs} textoExplicativo={'A etapa "Obs Jurídico" envolve a coleta e o registro de observações e recomendações da equipe jurídica, essenciais para orientar e gerenciar o processo de cessão de precatórios de forma eficaz.'} />
                    </div>

                </div>
            </div>
            {
                cessoes.length != 0 ? (
                    <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                        <>
                            <span className="font-[700] dark:text-white mb-[16px]" id='relacionados'>Relacionados</span>
                            <div className="mb-4 dark:bg-neutral-900">
                                {cessoes.map(cessao => (
                                    <div className="flex flex-col mb-4 border dark:border-neutral-600 dark:bg-neutral-900 px-2 py-1 rounded" key={cessao.id}>

                                        <>
                                            <div className="flex border-b dark:border-neutral-600">
                                                <div className="border-r dark:border-neutral-600  pr-2 my-3 flex items-center justify-center">
                                                    <span className="font-[700] dark:text-white">{cessao.id}</span>
                                                </div>
                                                <div className="flex flex-col justify-center text-[12px] pl-2">
                                                    <Link to={`/precatorio/${String(cessao.id)}`}><span className="font-bold dark:text-white hover:underline">{cessao.precatorio}</span></Link>
                                                    <span className="text-neutral-400 font-medium line-clamp-1">{cessao.cedente}</span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] dark:border-neutral-700  py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900 ">
                                                <a
                                                    style={{ backgroundColor: `${cessao.statusColor}` }}
                                                    data-tooltip-id="status"
                                                    data-tooltip-content={`${cessao.substatus ? cessao.substatus : ''}`}
                                                    data-tooltip-place="top"
                                                    className={`px-2 py-1 rounded brightness-110`}>
                                                    <span className="text-black font-bold">{cessao.status}</span>
                                                </a>

                                                <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 `}>
                                                    <span className="text-black font-bold dark:text-neutral-100">{cessao.ente_id}</span>
                                                </span>

                                                <span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}>
                                                    <span className="text-black font-bold dark:text-neutral-100">{cessao.natureza}</span>
                                                </span>

                                                {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100 ">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}

                                                {cessao.empresa_id ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}><span className="text-black font-bold dark:text-neutral-100">{cessao.empresa_id}</span></span>) : null}

                                                {cessao.adv ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}><span className="text-black font-bold dark:text-neutral-100">{cessao.adv}</span></span>) : null}

                                                {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 `}><span className="text-black font-bold dark:text-neutral-100">{cessao.falecido}</span></span>) : null}
                                            </div>
                                            <Tooltip id="status" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500', maxWidth:'220px' }} border="1px solid #d4d4d4" opacity={100} place="top" />
                                        </>



                                    </div>
                                ))}
                            </div>
                        </>


                    </div>
                ) : null
            }
        </div >
    )
}