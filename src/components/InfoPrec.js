import React, { useState, useEffect } from 'react'
import Topics from '../components/Topics';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import ListaCessionarios from './ListaCessionarios';

export default function InfoPrec({ precInfo, status, cessionario, cessoes, varas, orcamentos, naturezas, empresas, users, teles, escreventes }) {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    console.log(from);

    function navigation() {
        window.history.back();
    }

    console.log(precInfo)

    console.log(cessoes)


    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <div className='flex flex-col mb-[16px] max-[700px]:mb-16px'>
                <span className='text-gray-400 text-[10px]'><a className='hover:underline cursor-pointer' href="">Dashboard</a> &gt; <a className='hover:underline cursor-pointer' onClick={navigation}>Cessões</a> &gt; <span>{precInfo.precatorio}</span></span>
            </div>
            <div className='flex flex-col mb-[60px] max-[700px]:mb-60px'>
                <div className='grid max-[700px]:grid-cols-1 grid-cols-2' id='info-gerais'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-5 mb-[16px]'>
                            <span className="font-[700] dark:text-white" >Informações Gerais</span>
                            <Modal varas={varas} orcamentos={orcamentos} naturezas={naturezas} empresas={empresas} users={users} teles={teles} escreventes={escreventes} />
                        </div>

                        <div className='grid grid-cols-1 gap-2 mb-[20px]'>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Precatório: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.precatorio ? precInfo.precatorio : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Processo: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.processo ? precInfo.processo : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Cedente: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.cedente ? precInfo.cedente : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Vara: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.vara_processo ? precInfo.vara_processo : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Orçamento: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.ente_id ? precInfo.ente_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Natureza: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.natureza ? precInfo.natureza : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Empresa: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.empresa_id ? precInfo.empresa_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Data da Cessão: </span>
                                <span className='text-[#666] dark:text-neutral-400'>
                                    {precInfo.data_cessao ?
                                        `${precInfo.data_cessao.split('-')[2]}/${precInfo.data_cessao.split('-')[1]}/${precInfo.data_cessao.split('-')[0]}`
                                        : '-'}
                                </span>
                            </div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Rep. Comercial: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.tele_id ? precInfo.tele_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Escrevente: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.escrevente_id ? precInfo.escrevente_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Óbito: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.falecido ? precInfo.falecido : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Anuência: </span><span className='text-[#666] dark:text-neutral-400'>{precInfo.adv ? precInfo.adv : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Requisitório: </span><a className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer'>Ver Requisitório</a></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500] dark:text-neutral-200'>Escritura: </span><a className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer'>Ver Escritura</a></div>
                        </div>
                    </div>
                    <div className='flex flex-col max-[700px]:mb-20px'>
                        <span className="font-[700] dark:text-white mb-[16px]">Status</span>
                        <div className='border-l dark:border-[#808080] py-[10px] ml-[10px]'>
                            {
                                status.map(s => (
                                    <div className='py-[10px] flex items-center' key={s.id}>
                                        <div style={{ backgroundColor: s.nome === precInfo.status ? s.extra : '#808080' }} className={s.nome === precInfo.status ? 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border dark:border-[#808080] brightness-110' : 'min-w-[12px] min-h-[12px] rounded-full  relative left-[-6px] border dark:border-[#808080] opacity-90'}></div>
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
            <ListaCessionarios cessionario={cessionario} precInfo={precInfo} />
            <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                <span className="font-[700] dark:text-white mb-[16px]" id='juridico'>Jurídico</span>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                    <Topics texto={'Jurídico Feito'} data={precInfo.juridico_feito_data} atualizacaoJuridico={precInfo.juridico_feito} />
                    <Topics texto={'Jurídico a Fazer'} data={precInfo.juridico_afazer_data} atualizacaoJuridico={precInfo.juridico_afazer} />
                    <Topics texto={'Andamento Jurídico'} data={precInfo.juridico_andamentoatual_data} atualizacaoJuridico={precInfo.juridico_andamentoatual} />
                    <Topics texto={'Obs Jurídico'} data={precInfo.juridico_obs_data} atualizacaoJuridico={precInfo.juridico_obs}/>
                </div>
            </div>
            {cessoes.length != 0 ? (
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
                                            <span style={{ backgroundColor: `${cessao.statusColor}` }} className={`px-2 py-1 rounded brightness-110`}><span className="text-black font-bold">{cessao.status}</span></span>

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
                                    </>



                                </div>
                            ))}
                        </div>
                    </>


                </div>
            ) : null}
        </div>
    )
}