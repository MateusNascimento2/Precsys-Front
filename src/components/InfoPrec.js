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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DotsButton from './DotsButton';


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
            console.log(error)
            const blob = error.response?.data;
            const contentType = error.response?.headers['content-type'];

            if (blob && contentType === 'application/json; charset=utf-8') {
                const text = await blob.text();
                const json = JSON.parse(text);

                toast.error(`${json.error}`, {
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
            } else {
                toast.error(`Erro ao baixar arquivo.`, {
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


        } finally {
            setLoadingFiles(prev => ({ ...prev, [filename]: false }));
        }
    };

    const exportarPDF = (precInfo, cessionarios) => {
        const doc = new jsPDF();

        const margin = 15;
        let y = margin;

        // === COLUNAS ===
        const col1X = margin;
        const col2X = 110;

        const lineHeight = 7;

        const formatarData = (dataIso) => {
            const [ano, mes, dia] = dataIso.split('-');
            return `${dia}/${mes}/${ano}`;
        };

        const text = (label, value, x, yPos, maxWidth = 80) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, x, yPos);

            doc.setFont('helvetica', 'normal');
            const textLines = doc.splitTextToSize(value || '-', maxWidth);
            doc.text(textLines, x + 30, yPos);
            return textLines.length * 7; // retorna altura ocupada
        };

        // === TITULOS ===
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Informações Gerais', col1X, y);
        doc.text('Status', col2X, y);
        y += lineHeight;

        // === COLUNA 1: Informações Gerais ===
        let col1Y = y;
        text('Precatório', precInfo.precatorio, col1X, col1Y += lineHeight);
        text('Processo', precInfo.processo, col1X, col1Y += lineHeight);
        text('Cedente', precInfo.cedente, col1X, col1Y += lineHeight);
        text('Vara', precInfo.vara, col1X, col1Y += lineHeight);
        text('Orçamento', precInfo.ente && precInfo.ano ? `${precInfo.ente} - ${precInfo.ano}` : precInfo.ente || '-', col1X, col1Y += lineHeight);
        text('Natureza', precInfo.natureza, col1X, col1Y += lineHeight);
        text('Empresa', precInfo.empresa, col1X, col1Y += lineHeight);
        text('Data da Cessão', precInfo.data_cessao ? formatarData(precInfo.data_cessao) : '-', col1X, col1Y += lineHeight);
        text('Rep. Comercial', precInfo.tele, col1X, col1Y += lineHeight);
        text('Escrevente', precInfo.escrevente, col1X, col1Y += lineHeight);
        text('Óbito', precInfo.falecido, col1X, col1Y += lineHeight);
        text('Anuência', precInfo.anuencia_advogado, col1X, col1Y += lineHeight);

        // === COLUNA 2: Status ===
        let col2Y = y + lineHeight;
        let height1 = text('Status', precInfo.status, col2X, col2Y, 60);
        let height2 = text('Substatus', precInfo.substatus, col2X, col2Y + height1, 60);

        // Pula para a próxima seção
        y = Math.max(col1Y, col2Y + height1 + height2) + 20;

        // === TABELA DE CESSIONÁRIOS ===
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Cessionários', margin, y);
        y += 5;

        if (cessionarios.length === 0) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('Nenhum cessionário registrado.', margin, y + 10);
        } else {
            // Montar linhas da tabela
            const body = cessionarios.map(c => [
                `${c.nome}\n${c.cpfcnpj || ''}`,
                c.valor_pago || 'R$ 0,00',
                c.comissao || 'R$ 0,00',
                c.percentual || '0%',
                c.exp_recebimento || 'R$ 0,00',
                c.valor_oficio_pagamento || 'R$ 0,00'
            ]);

            // Calcular totais
            const total = (field) =>
                cessionarios.reduce((soma, c) => {
                    const valor = parseFloat((c[field] || '0').replace(/[^\d,-]/g, '').replace(',', '.'));
                    return soma + (isNaN(valor) ? 0 : valor);
                }, 0);

            const percentualTotal = cessionarios.reduce((soma, c) => {
                const val = parseFloat((c.percentual || '0').replace(',', '.'));
                return soma + (isNaN(val) ? 0 : val);
            }, 0);

            body.push([
                'TOTAL',
                `R$ ${total('valor_pago').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                `R$ ${total('comissao').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                `${percentualTotal.toFixed(2).replace('.', ',')}%`,
                `R$ ${total('exp_recebimento').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                `R$ ${total('valor_oficio_pagamento').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            ]);

            autoTable(doc, {
                startY: y,
                head: [['NOME', 'VALOR PAGO', 'COMISSÃO', '%', 'EXPECTATIVA', 'VALOR RECEBIDO']],
                body: body,
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    halign: 'center',
                },
                headStyles: {
                    fillColor: false,       // ❌ sem fundo no cabeçalho
                    textColor: 0,           // texto preto
                    fontStyle: 'bold',
                    lineColor: [0, 0, 0],   // borda preta
                    lineWidth: 0            // desativamos aqui para controlar via didParseCell
                },
                bodyStyles: {
                    fillColor: false,        // ❌ sem fundo nas células
                    textColor: 20,
                    lineColor: [200, 200, 200], // borda cinza mais suave
                    lineWidth: 0,
                    backgroundColor: false,             // desativamos aqui para controlar via didParseCell
                },
                alternateRowStyles: {
                    fillColor: false
                },
                columnStyles: {
                    0: { halign: 'left', cellWidth: 50 }, // NOME à esquerda
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' },
                    4: { halign: 'center' },
                    5: { halign: 'center' },
                },
                didParseCell: function (data) {
                    if (data.section === 'head') {
                        data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.4, left: 0 };
                        data.cell.styles.lineColor = [0, 0, 0]; // preto
                    }

                    if (data.section === 'body') {
                        const isLastRow = data.row.index === data.table.body.length - 1;

                        data.cell.styles.lineWidth = {
                            top: 0,
                            right: 0,
                            bottom: isLastRow ? 0 : 0.2, // ❌ sem borda na última linha
                            left: 0
                        };

                        data.cell.styles.lineColor = [200, 200, 200];
                        data.cell.styles.fontStyle = isLastRow ? 'bold' : 'normal'
                    }

                    // Alinhar apenas o cabeçalho da coluna NOME à esquerda
                    if (data.section === 'head' && data.column.index === 0) {
                        data.cell.styles.halign = 'left';
                    }
                }

            });
        }


        doc.save('informacoes-precatorio.pdf');
    };

    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <div className='mt-4' >
                <DotsButton >
                    <button
                        onClick={() => exportarPDF(precInfoNew, precInfoNew.cessionarios)}
                        className="px-2 py-1  dark:text-white text-[12px] dark:hover:bg-neutral-800 hover:bg-neutral-200"
                        title='Exportar para PDF'
                    >
                        Exportar para PDF
                    </button>

                </DotsButton>
            </div>
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
                auth.user.admin || auth.user.advogado ? <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
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
                precInfoNew.cessoes_relacionadas.length > 0 && (auth.user.admin || auth.user.advogado) ? (
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
