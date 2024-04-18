import React, { useState, useEffect } from 'react'
import Topics from '../components/Topics';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import ListaCessionarios from './ListaCessionarios';
import Select from 'react-select';

export default function InfoPrec({ precInfo, status, cessionario, cessoes, varas, orcamentos, naturezas, empresas, users, teles, escreventes }) {
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    console.log(from);

    function navigation() {
        window.history.back();
    }

    function handleInputDisabled() {
        setIsDisabled(prevState => !prevState)
    }

    const handleSelectValues = (array, value) => {
        return array.map(item => {
            return {
                ...item,
                value: item.id,
                label: item[value]
            };
        });
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

    console.log(cessionario)

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 21
        })
    };


    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <div className='flex flex-col mb-[16px] max-[700px]:mb-16px'>
                <span className='text-gray-400 text-[10px]'><a className='hover:underline cursor-pointer' href="">Dashboard</a> &gt; <a className='hover:underline cursor-pointer' onClick={navigation}>Cessões</a> &gt; <span>{precInfo.precatorio}</span></span>
            </div>
            <div className='flex flex-col mb-[60px] max-[700px]:mb-60px'>
                <div className='grid max-[700px]:grid-cols-1 grid-cols-2' id='info-gerais'>
                    <div className='flex flex-col '>
                        <div className='flex items-center gap-5 mb-[16px]'>
                            <span className="font-[700] dark:text-white" >Informações Gerais</span>
                            <button onClick={() => handleInputDisabled()} className='hover:bg-neutral-100 flex items-center justify-center dark:hover:bg-neutral-800 rounded p-[1px]'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
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
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>{precInfo.vara_processo ? precInfo.vara_processo : '-'}</span>
                                    : <Select
                                        defaultValue={precInfo.vara_processo}
                                        options={handleSelectValues(varas, 'nome')}
                                        isClearable={true}
                                        name='vara'
                                        placeholder={precInfo.vara_processo}
                                        noOptionsMessage={() => 'Nenhuma vara encontrada'}
                                        unstyled // Remove all non-essential styles
                                        classNames={{
                                            container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-[#666] dark:text-neutral-400 w-full text-[14px] h-[21px] min-h-[21px]'),
                                            control: () => ('px-2 flex items-center h-[21px] min-h-[21px]'),
                                            indicatorsContainer: () => ('h-[21px]'),
                                            input: () => ('text-[#666] dark:text-neutral-400'),
                                            menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                                            menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                                            option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                                        }}
                                        styles={customStyles}
                                    />
                                }
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Orçamento: </span>
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>{precInfo.ente_id ? precInfo.ente_id : '-'}</span>
                                    : <div className='flex w-full'>
                                        <Select
                                            options={handleSelectValues(orcamentos, 'ente')}
                                            isClearable={true}
                                            name='ente'
                                            placeholder={precInfo.ente_id}
                                            noOptionsMessage={() => 'Nenhum ente encontrado'}
                                            unstyled // Remove all non-essential styles
                                            classNames={{
                                                container: () => ('border-l border-t border-b rounded-l dark:bg-neutral-800 dark:border-neutral-600 text-[#666] dark:text-neutral-400 w-full text-[14px] h-[21px] w-[70%] min-h-[21px]'),
                                                control: () => ('px-2 flex items-center h-[21px] min-h-[21px]'),
                                                indicatorsContainer: () => ('h-[21px]'),
                                                input: () => ('text-[#666] dark:text-neutral-400'),
                                                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                                                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                                                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                                            }}
                                            styles={customStyles}
                                        />
                                        <input type='text' name='ano' id='ano' disabled={isDisabled} className='dark:bg-neutral-800 border-t border-b border-r border-l rounded-r flex-none  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] w-[30%] text-[#666] dark:text-neutral-400 enabled:h-[21px] placeholder:text-[#666] placeholder:dark:text-neutral-400' placeholder='Ano'></input>
                                    </div>
                                }
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Natureza: </span>
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>{precInfo.natureza ? precInfo.natureza : '-'}</span>
                                    : <Select
                                        options={handleSelectValues(naturezas, 'nome')}
                                        isClearable={true}
                                        name='natureza'
                                        placeholder={precInfo.natureza}
                                        noOptionsMessage={() => 'Nenhuma natureza encontrada'}
                                        unstyled  // Remove all non-essential styles
                                        classNames={{
                                            container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-[#666] dark:text-neutral-400 w-full text-[14px] h-[21px] min-h-[21px]'),
                                            control: () => ('px-2 flex items-center h-[21px] min-h-[21px]'),
                                            indicatorsContainer: () => ('h-[21px]'),
                                            input: () => ('text-[#666] dark:text-neutral-400'),
                                            menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                                            menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                                            option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                                        }}
                                        styles={customStyles}
                                    />
                                }
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Empresa: </span>
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>{precInfo.empresa_id ? precInfo.empresa_id : '-'}</span>
                                    : <Select
                                        options={handleSelectValues(empresas, 'nome')}
                                        isClearable={true}
                                        name='empresa'
                                        placeholder={precInfo.empresa_id}
                                        noOptionsMessage={() => 'Nenhuma empresa encontrada'}
                                        unstyled // Remove all non-essential styles
                                        classNames={{
                                            container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-[#666] dark:text-neutral-400 w-full text-[14px] h-[21px] min-h-[21px]'),
                                            control: () => ('px-2 flex items-center h-[21px] min-h-[21px]'),
                                            indicatorsContainer: () => ('h-[21px]'),
                                            input: () => ('text-[#666] dark:text-neutral-400'),
                                            menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                                            menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                                            option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                                        }}
                                        styles={customStyles}
                                    />
                                }
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
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>{precInfo.tele_id ? precInfo.tele_id : '-'}</span>
                                    : <Select options={teles}
                                        isClearable={true}
                                        name='rep_comercial'
                                        placeholder={precInfo.tele_id}
                                        noOptionsMessage={() => 'Nenhum Rep. Comercial encontrado'} unstyled// Remove all non-essential styles
                                        classNames={{
                                            container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-[#666] dark:text-neutral-400 w-full text-[14px] h-[21px] min-h-[21px]'),
                                            control: () => ('px-2 flex items-center h-[21px] min-h-[21px]'),
                                            indicatorsContainer: () => ('h-[21px]'),
                                            input: () => ('text-[#666] dark:text-neutral-400'),
                                            menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                                            menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                                            option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                                        }}
                                        styles={customStyles}
                                    />
                                }
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Escrevente: </span>
                                {isDisabled
                                    ? <span className='text-[#666] dark:text-neutral-400'>{precInfo.escrevente_id ? precInfo.escrevente_id : '-'}</span>
                                    : <Select
                                        options={handleSelectValues(escreventes, 'nome')}
                                        isClearable={true}
                                        name='escrevente'
                                        placeholder={precInfo.escrevente_id}
                                        noOptionsMessage={() => 'Nenhum escrevente encontrado'} menuPosition='absolute'
                                        unstyled// Remove all non-essential styles
                                        classNames={{
                                            container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-[#666] dark:text-neutral-400 w-full text-[14px] h-[21px] min-h-[21px]'),
                                            control: () => ('px-2 flex items-center h-[21px] min-h-[21px]'),
                                            indicatorsContainer: () => ('h-[21px]'),
                                            input: () => ('text-[#666] dark:text-neutral-400'),
                                            menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800   w-full'),
                                            menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-[120px]'),
                                            option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                                        }}
                                        styles={customStyles}
                                    />
                                }
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
            <ListaCessionarios cessionario={cessionario} precInfo={precInfo} />
            <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                <span className="font-[700] dark:text-white mb-[16px]" id='juridico'>Jurídico</span>
                <p className='text-[12px] text-neutral-600 dark:text-neutral-400 font-medium'>Data de Atualização: {precInfo.juridico_feito_data.split('/')[1]}/{precInfo.juridico_feito_data.split('/')[0]}/{precInfo.juridico_feito_data.split('/')[2]}</p>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>

                    <Topics texto={'Jurídico Feito'} atualizacaoJuridico={precInfo.juridico_feito} />
                    <Topics texto={'Jurídico a Fazer'} atualizacaoJuridico={precInfo.juridico_afazer} />
                    <Topics texto={'Andamento Jurídico'} atualizacaoJuridico={precInfo.juridico_andamentoatual} />
                    <Topics texto={'Obs Jurídico'} atualizacaoJuridico={precInfo.juridico_obs} />
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