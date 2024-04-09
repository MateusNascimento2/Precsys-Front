import React from 'react'
import Topics from '../components/Topics';
import { Link } from 'react-router-dom';

export default function InfoPrec({ precInfo, status, cessionario, cessoes }) {

    console.log(precInfo)

    function changeStringFloat(a) {
        const virgulaParaBarra = a.replace(',', '/');
        const valorSemPonto = virgulaParaBarra.replace('.', '');
        const semMoeda = valorSemPonto.replace('R$ ', '');
        const barraParaPonto = semMoeda.replace('/', '.');
        const valorFloat = Number(barraParaPonto);
        return valorFloat;
    }

    function localeTwoDecimals(a) {

        if (Number.isInteger(a)) {
            return a.toLocaleString() + ",00";
        } else {
            return a.toLocaleString();
        }

    }

    function changePorcentagemToFloat(numero) {
        const valorSemPorcentagem = parseFloat(numero.replace(',', '.'))
        console.log(valorSemPorcentagem)
        return valorSemPorcentagem
    }


    console.log(cessoes)


    const valorPagoTotal = cessionario.reduce((previousValue, currentValue) => {
        return (previousValue) + changeStringFloat(currentValue.valor_pago)
    }, 0)

    const valorComissaoTotal = cessionario.reduce((previousValue, currentValue) => {
        return (previousValue) + changeStringFloat(currentValue.comissao)
    }, 0)

    const valorExpTotal = cessionario.reduce((previousValue, currentValue) => {
        return (previousValue) + changeStringFloat(currentValue.exp_recebimento)
    }, 0)

    const valorPorcentagemTotal = cessionario.reduce((previousValue, currentValue) => {
        return (previousValue) + changePorcentagemToFloat(currentValue.percentual);
    }, 0)



    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <div className='flex flex-col mb-[16px] max-[700px]:mb-16px'>
                <span className='text-gray-400 text-[10px]'><a className='hover:underline' href="">Dashboard</a> &gt; <a className='hover:underline' href="">Cessões</a> &gt; <a className='hover:underline' href="">0000.00000-0</a></span>
            </div>
            <div className='flex flex-col mb-[60px] max-[700px]:mb-60px'>
                <div className='grid max-[700px]:grid-cols-1 grid-cols-2'>
                    <div className='flex flex-col'>
                        <span className="font-[700] dark:text-white mb-[16px]">Informações Gerais</span>
                        <div className='grid grid-cols-1 gap-2 mb-[20px]'>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Precatório: </span><span className='text-[#666]'>{precInfo.precatorio ? precInfo.precatorio : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Processo: </span><span className='text-[#666]'>{precInfo.processo ? precInfo.processo : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Cedente: </span><span className='text-[#666]'>{precInfo.cedente ? precInfo.cedente : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Vara: </span><span className='text-[#666]'>{precInfo.vara_processo ? precInfo.vara_processo : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Orçamento: </span><span className='text-[#666]'>{precInfo.ente_id ? precInfo.ente_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Natureza: </span><span className='text-[#666]'>{precInfo.natureza ? precInfo.natureza : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Empresa: </span><span className='text-[#666]'>{precInfo.empresa_id ? precInfo.empresa_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Data da Cessão: </span>
                                <span className='text-[#666]'>
                                    {precInfo.data_cessao ?
                                        `${precInfo.data_cessao.split('-')[2]}/${precInfo.data_cessao.split('-')[1]}/${precInfo.data_cessao.split('-')[0]}`
                                        : '-'}
                                </span>
                            </div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Rep. Comercial: </span><span className='text-[#666]'>{precInfo.tele_id ? precInfo.tele_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Escrevente: </span><span className='text-[#666]'>{precInfo.escrevente_id ? precInfo.escrevente_id : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Óbito: </span><span className='text-[#666]'>{precInfo.falecido ? precInfo.falecido : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Anuência: </span><span className='text-[#666]'>{precInfo.adv ? precInfo.adv : '-'}</span></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Requisitório: </span><a className='text-[#666] hover:text-black hover:underline cursor-pointer'>Ver Requisitório</a></div>
                            <div className='text-[14px] max-[700px]:col-span-2'><span className='font-[500]'>Escritura: </span><a className='text-[#666] hover:text-black hover:underline cursor-pointer'>Ver Escritura</a></div>
                        </div>
                    </div>
                    <div className='flex flex-col max-[700px]:mb-20px'>
                        <span className="font-[700] dark:text-white mb-[16px]">Status</span>
                        <div className='border-l py-[10px] ml-[10px]'>
                            {
                                status.map(s => (
                                    <div className='py-[10px] flex items-center'>
                                        <div style={{ backgroundColor: s.nome === precInfo.status ? s.extra : '#E5E7EB' }} className={s.nome === precInfo.status ? 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border' : 'min-w-[12px] min-h-[12px] rounded-full  relative left-[-6px] border'}></div>
                                        <div className="flex flex-col justify-center text-[12px]">
                                            <span className={s.nome === precInfo.status ? "font-bold dark:text-white" : "font-bold dark:text-white text-gray-300"}>{s.nome}</span>
                                            <span className="text-neutral-600 font-medium mr-[15px]">{s.nome === precInfo.status ? precInfo.substatus : null}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {cessionario.length != 0 ? (
                <div className='w-full mb-[60px] flex flex-col'>
                    <span className="font-[700] dark:text-white mb-[16px]">Cessionários</span>
                    <div className='overflow-x-auto w-full'>
                        <div className='w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111]'>
                            <div class='min-w-[250px] w-[24%]'>Nome</div>
                            <div class='min-w-[120px] w-[15%] text-center'>valor pago</div>
                            <div class='min-w-[120px] w-[17%] text-center'>comissão</div>
                            <div class='min-w-[60px] w-[5%] text-center'>%</div>
                            <div class='min-w-[120px] w-[17%] text-center'>expectativa</div>
                            <div class='min-w-[180px] w-[18%] text-center'>nota</div>
                            <div class='min-w-[50px] w-[5%] ml-auto text-center'>.</div>
                        </div>
                        {cessionario.map(c => (
                            <div className='w-max lg:w-full flex text-[12px] items-center border-b last:border-0 py-[10px] border-gray-300'>
                                <div class='min-w-[250px] w-[24%]'>
                                    <div className="flex flex-col justify-center text-[12px]">
                                        <span className="font-bold dark:text-white">{c.user_id} </span>
                                        <span className=" text-neutral-400 font-medium">{c.cpfcnpj}</span>
                                    </div>
                                </div>
                                <div class='min-w-[120px] w-[15%] text-center'>{c.valor_pago}</div>
                                <div class='min-w-[120px] w-[17%] text-center'>{c.comissao}</div>
                                <div class='min-w-[60px] w-[5%] text-center'>{c.percentual}</div>
                                <div class='min-w-[120px] w-[17%] text-center'>{c.exp_recebimento}</div>
                                <div class='min-w-[180px] w-[18%] text-center'><a href="" className='hover:underline'>{c.nota ? c.nota.split('/')[1] : ''}</a></div>
                                <div class='min-w-[50px] w-[5%] ml-auto text-center'>.</div>
                            </div>

                        ))}
                        <div className='w-max lg:w-full flex text-[12px] items-center border-b last:border-0 py-[10px] border-gray-300'>
                            <div class='min-w-[250px] w-[24%]'>
                                <div className="flex flex-col justify-center text-[12px]">
                                    <span className="font-bold dark:text-white">TOTAL </span>
                                </div>
                            </div>
                            <div class='min-w-[120px] w-[15%] font-bold text-center'>R$ {localeTwoDecimals(valorPagoTotal)}</div>
                            <div class='min-w-[120px] w-[17%] font-bold text-center'>R$ {localeTwoDecimals(valorComissaoTotal)}</div>
                            <div class='min-w-[60px] w-[5%] font-bold text-center'>{valorPorcentagemTotal.toLocaleString()}%</div>
                            <div class='min-w-[120px] w-[17%] font-bold text-center'>R$ {localeTwoDecimals(valorExpTotal)}</div>
                            <div class='min-w-[180px] w-[18%] text-center'></div>
                            <div class='min-w-[50px] w-[5%] ml-auto text-center'></div>
                        </div>

                    </div>
                </div>
            ) : null}

            <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                <span className="font-[700] dark:text-white mb-[16px]">Jurídico</span>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                    <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                    </svg>
                    )} />
                    <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                    </svg>
                    )} />
                    <Topics texto={'Frontend cloud'} icone={(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                    </svg>
                    )} />
                </div>
            </div>
            <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                {cessoes.length != 0 ? (
                    <>
                        <span className="font-[700] dark:text-white mb-[16px]">Relacionados</span>
                        <div className="mb-4 dark:bg-neutral-900">
                            {cessoes.map(cessao => (
                                <div className="flex flex-col mb-4 border dark:border-neutral-700 dark:bg-neutral-900 px-2 py-1 rounded-t">

                                    <>
                                        <div className="flex border-b">
                                            <div className="border-r dark:border-neutral-700  pr-2 my-3 flex items-center justify-center">
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
                ) : null}

            </div>
        </div>
    )
}