import React, { useState, useEffect } from 'react';
import Topics from '../components/Topics';
import { Link, useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import ListaCessionarios from './ListaCessionarios';
import { useNavigate, useLocation } from 'react-router-dom';
import DotsButton from './DotsButton';
import EditarPrec from './EditarPrec';
import { Tooltip } from 'react-tooltip';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm }) {
    if (!isOpen) return null;

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onRequestClose();
        }
    };

    return (
        <div onClick={handleOverlayClick} className="fixed inset-0 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex justify-center items-center z-50 p-2">
            <div onClick={(e) => e.stopPropagation()} className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md">
                <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir a cessão?</h2>
                <div className="flex justify-between mt-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                        onClick={onRequestClose}
                    >
                        Cancelar
                    </button>
                </div>
                <button
                    className="absolute top-3 right-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={onRequestClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function InfoPrec({ precInfo, status, cessionario, cessoes, varas, orcamentos, naturezas, empresas, users, teles, escreventes, juridico, handleUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [precatorioEditado, setPrecatorioEditado] = useState('');
    const [processoEditado, setProcessoEditado] = useState('');
    const [cedenteEditado, setCedenteEditado] = useState('');
    const [varaEditado, setVaraEditado] = useState(null);
    const [enteEditado, setEnteEditado] = useState(null);
    const [anoEditado, setAnoEditado] = useState(null);
    const [naturezaEditado, setNaturezaEditado] = useState(null);
    const [empresaEditado, setEmpresaEditado] = useState(null);
    const [dataCessaoEditado, setDataCessaoEditado] = useState(null);
    const [repComercialEditado, setRepComercialEditado] = useState(null);
    const [escreventeEditado, setEscreventeEditado] = useState(null);
    const [juridicoEditado, setJuridicoEditado] = useState(null);
    const [requisitorioEditado, setRequisitorioEditado] = useState('');
    const [escrituraEditado, setEscrituraEditado] = useState('');
    const [requisitorioEditadoFile, setRequisitorioEditadoFile] = useState('');
    const [escrituraEditadoFile, setEscrituraEditadoFile] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [key, setKey] = useState(0); // Add key state here
    const [loadingFiles, setLoadingFiles] = useState({});

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode');
        if (localStorage.getItem('cessaoEditada')) {
            toast.success('Cessão editada com sucesso!', {
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
            localStorage.removeItem('cessaoEditada');
        }
    }, []);

    function navigation() {
        window.history.back();
    }

    const confirmDelete = async () => {
        const isDarkMode = localStorage.getItem('darkMode');

        try {
            setIsLoading(true);
            const response = await axiosPrivate.delete(`/cessoes/${precID}`);
            toast.success('Cessão excluída com sucesso!', {
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
            navigation()
        } catch (err) {
            toast.error(`Erro ao deletar cessão: ${err}`, {
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
            setIsLoading(false);
            return;
        }
        closeModal();
    };

    const { precID } = useParams();
    const axiosPrivate = useAxiosPrivate();

    const handleReceberValores = (valores) => {
        setPrecatorioEditado(valores.precatorioEditado);
        setProcessoEditado(valores.processoEditado);
        setCedenteEditado(valores.cedenteEditado);
        setVaraEditado(valores.varaEditado);
        setEnteEditado(valores.enteEditado);
        setAnoEditado(valores.anoEditado);
        setNaturezaEditado(valores.naturezaEditado);
        setEmpresaEditado(valores.empresaEditado);
        setDataCessaoEditado(valores.dataCessaoEditado);
        setRepComercialEditado(valores.repComercialEditado);
        setEscreventeEditado(valores.escreventeEditado);
        setJuridicoEditado(valores.juridicoEditado);
        setRequisitorioEditado(valores.requisitorioEditado);
        setEscrituraEditado(valores.escrituraEditado)
        setRequisitorioEditadoFile(valores.requisitorioEditadoFile);
        setEscrituraEditadoFile(valores.escrituraEditadoFile);

    };

    const handleEditarCessao = async (e) => {
        e.preventDefault();
        const isDarkMode = localStorage.getItem('darkMode');

        if (precatorioEditado.length < 12 || processoEditado.length < 12 || !cedenteEditado || !varaEditado || !enteEditado || !anoEditado || !naturezaEditado || !empresaEditado || !dataCessaoEditado || !repComercialEditado || !escreventeEditado || !juridicoEditado) {
            toast.error('Todos os campos da cessão precisam ser preenchidos!', {
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

            return;
        }

        const cessaoEditada = {
            precatorioEditado, processoEditado, cedenteEditado, varaEditado, enteEditado, anoEditado, naturezaEditado, empresaEditado, dataCessaoEditado, repComercialEditado, escreventeEditado, juridicoEditado,
            requisitorioEditado: requisitorioEditadoFile ? `cessoes_requisitorios/${requisitorioEditadoFile.name}` : requisitorioEditado ? `${requisitorioEditado}` : null,
            escrituraEditado: escrituraEditadoFile ? `cessoes_escrituras/${escrituraEditadoFile.name}` : escrituraEditado ? `${escrituraEditado}` : null,
        };

        try {
            setIsLoading(true);
            console.log(`cessaoEditada: ${JSON.stringify(cessaoEditada)}`);
            console.log(requisitorioEditadoFile)
            const response = await axiosPrivate.put(`/cessoes/${precID}`, cessaoEditada);

            const uploadFiles = async (files) => {
                const formData = new FormData();
                files.forEach((file) => {
                    console.log('file:' + file)
                    formData.append(file.name, file.file);
                });

                try {
                    const response = await axiosPrivate.post('/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                } catch (err) {
                    toast.error(`Erro ao enviar arquivos: ${err}`, {
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
                    setIsLoading(false);
                }
            };

            if (requisitorioEditadoFile || escrituraEditadoFile) {
                await uploadFiles([
                    { name: 'requisitorio', file: requisitorioEditadoFile },
                    { name: 'escritura', file: escrituraEditadoFile },
                ]);
            }
        } catch (err) {
            toast.error(`Erro ao editar cessão: ${err}`, {
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
            setIsLoading(false);
            return;
        }

        setIsLoading(false);

        // Set flag in local storage and reload the page
        localStorage.setItem('cessaoEditada', 'true');
        window.location.reload();
    };

    const downloadFile = async (filename) => {
        const isDarkMode = localStorage.getItem('darkMode');
        console.log(filename);
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

    console.log(precInfo)

    return (
        <div className='max-w-full flex flex-col mb-[60px]'>
            <ToastContainer />
            <div className='flex flex-col mb-[16px] max-[700px]:mb-16px'>
                <span className='text-gray-400 text-[10px]'><Link className='hover:underline cursor-pointer' to={'/dashboard'}>Dashboard</Link> &gt; <a className='hover:underline cursor-pointer' onClick={navigation}>Cessões</a> &gt; <span>{precInfo.precatorio}</span></span>
            </div>
            <div className='flex flex-col mb-[60px] max-[700px]:mb-60px'>
                <div className='grid max-[700px]:grid-cols-1 grid-cols-2' id='info-gerais'>
                    <div className='flex flex-col '>
                        <div className='flex items-center justify-between mb-[16px]'>
                            <span className="font-[700] dark:text-white" >Informações Gerais</span>
                            <div className='mr-2'>
                                <DotsButton>
                                    <Modal
                                        botaoAbrirModal={
                                            <button title='Editar precatório' className='hover:bg-neutral-100  dark:hover:bg-neutral-800 dark:text-white text-sm px-4 py-2 rounded'>
                                                Editar
                                            </button>}
                                        tituloModal={'Editar cessão'}
                                        botaoSalvar={
                                            <button onClick={(e) => handleEditarCessao(e)}
                                                className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-1 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                                                Salvar
                                            </button>
                                        }
                                    >
                                        <div className='h-[450px] overflow-auto'>
                                            {isLoading && (<div className='absolute bg-neutral-800 w-full h-full opacity-85  left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                                                <div className='absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30 w-8 h-8'>
                                                    <LoadingSpinner />
                                                </div>
                                            </div>)}
                                            <EditarPrec precInfo={precInfo} varas={varas} orcamentos={orcamentos} naturezas={naturezas} empresas={empresas} users={users} teles={teles} escreventes={escreventes} juridico={juridico} enviarValores={(valores) => handleReceberValores(valores)} />
                                        </div>

                                    </Modal>

                                    <button onClick={openModal} className='hover:bg-red-800  bg-red-600 text-white text-sm px-4 py-2 rounded'>
                                        Excluir
                                    </button>
                                </DotsButton>
                                <DeleteConfirmationModal
                                    isOpen={modalIsOpen}
                                    onRequestClose={closeModal}
                                    onConfirm={confirmDelete}
                                />
                            </div>



                        </div>

                        <div className='grid grid-cols-1 gap-3 mb-[20px]'>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200 shrink-0'>Precatório: </span>
                                <span className='text-[#666] dark:text-neutral-400 w-full  focus:outline-none enabled:h-[21px] enabled:border enabled:rounded enabled:px-2 disabled:bg-transparent'>{precInfo.precatorio ? precInfo.precatorio : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Processo: </span>
                                <span className='text-[#666] dark:text-neutral-400 w-full focus:outline-none enabled:h-[21px] enabled:border enabled:rounded enabled:px-2 disabled:bg-transparent '>{precInfo.processo ? precInfo.processo : '-'}</span>
                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Cedente: </span>
                                <span className='text-[#666] dark:text-neutral-400 w-full focus:outline-none enabled:border enabled:h-[21px] enabled:rounded enabled:px-2 disabled:bg-transparent'>{precInfo.cedente ? precInfo.cedente : '-'}</span>
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

                                <span className='text-[#666] dark:text-neutral-400'>
                                    {precInfo.data_cessao ?
                                        `${precInfo.data_cessao.split('-')[2]}/${precInfo.data_cessao.split('-')[1]}/${precInfo.data_cessao.split('-')[0]}`
                                        : '-'}
                                </span>


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
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Requisitório:</span>
                                {loadingFiles[precInfo.requisitorio] ? (
                                    <div className="flex items-center gap-1">

                                        <button onClick={() => downloadFile(precInfo.requisitorio)} disabled={!precInfo.requisitorio} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Requisitório</button>
                                        <div className="w-5 h-5"><LoadingSpinner /></div>
                                    </div>
                                ) : (

                                    <button onClick={() => downloadFile(precInfo.requisitorio)} disabled={!precInfo.requisitorio} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Requisitório</button>

                                )}


                            </div>
                            <div className='text-[14px] flex gap-1 items-center max-[700px]:col-span-2'>
                                <span className='font-[500] dark:text-neutral-200'>Escritura: </span>
                                {loadingFiles[precInfo.escritura] ? (
                                    <div className="flex items-center gap-1">

                                        <button onClick={() => downloadFile(precInfo.escritura)} disabled={!precInfo.escritura} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Requisitório</button>
                                        <div className="w-5 h-5"><LoadingSpinner /></div>
                                    </div>
                                ) : (

                                    <button onClick={() => downloadFile(precInfo.escritura)} disabled={!precInfo.escritura} className='text-[#666] dark:text-neutral-400 hover:text-black hover:underline cursor-pointer disabled:hover:no-underline disabled:opacity-75 disabled:hover:text-[#666] disabled:cursor-not-allowed disabled:dark:hover:text-neutral-400'>Ver Requisitório</button>

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
                                        <div style={{ backgroundColor: s.nome === precInfo.status && s.extra, borderColor: s.nome === precInfo.status && s.extra }} className={s.nome === precInfo.status ? 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border border-neutral-400 dark:border-neutral-600 brightness-110' : 'min-w-[12px] min-h-[12px] rounded-full relative left-[-6px] border border-neutral-200 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-600'}></div>
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
            <ListaCessionarios key={key} cessionario={cessionario} precInfo={precInfo} users={users} precID={precID} />
            <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
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
                cessoes.length !== 0 ? (
                    <div className='w-full mb-[60px] flex flex-col max-[700px]:mb-60px'>
                        <span className="font-[700] dark:text-white mb-[16px]" id='relacionados'>Relacionados</span>
                        <div className="mb-4 dark:bg-neutral-900">
                            {cessoes.map(cessao => (
                                <div className="flex flex-col mb-4 border dark:border-neutral-600 dark:bg-neutral-900 px-2 py-1 rounded" key={cessao.id}>
                                    <div className="flex border-b dark:border-neutral-600">
                                        <div className="border-r dark:border-neutral-600 pr-2 my-3 flex items-center justify-center">
                                            <span className="font-[700] dark:text-white">{cessao.id}</span>
                                        </div>
                                        <div className="flex flex-col justify-center text-[12px] pl-2">
                                            <Link to={`/precatorio/${String(cessao.id)}`}><span className="font-bold dark:text-white hover:underline">{cessao.precatorio}</span></Link>
                                            <span className="text-neutral-400 font-medium line-clamp-1">{cessao.cedente}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] dark:border-neutral-700 py-3 px-2 flex gap-2 flex-wrap items-center dark:bg-neutral-900">
                                        <a
                                            style={{ backgroundColor: `${cessao.statusColor}` }}
                                            data-tooltip-id="status"
                                            data-tooltip-content={`${cessao.substatus ? cessao.substatus : ''}`}
                                            data-tooltip-place="top"
                                            className={`px-2 py-1 rounded brightness-110`}>
                                            <span className="text-black font-bold">{cessao.status}</span>
                                        </a>
                                        <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100`}>
                                            <span className="text-black font-bold dark:text-neutral-100">{cessao.ente_id}</span>
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
