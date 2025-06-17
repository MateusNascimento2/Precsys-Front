import React from 'react'
import AbaFiltro from './AbaFiltro'
import Modal from '../Modal'
import useAuth from '../../hooks/useAuth';

export default function Filtro({ onSetShow, show, dadosFiltro, selectedFilters, handleFilterChange, handleDateChange, exportPDF, exportExcel,  selectedExportFields, handleFieldSelectionChange, clearAllFilters, isInPerfilUsuario }) {

  const { auth } = useAuth();

  const fieldLabels = {
    id: "Id",
    precatorio: "Precatório",
    processo: 'Processo',
    cedente: "Cedente",
    status: "Status",
    ente: "Ente Público",
    natureza: "Natureza",
    data_cessao: "Data da Cessão",
    empresa: "Empresa",
    anuencia_advogado: "Anuência",
    falecido: "Falecido",
  };

  return (
    <>
      <div onClick={onSetShow} className={`${show ? 'fixed h-dvh left-0 top-0 w-dvw bg-black z-[90] opacity-70' : 'opacity-0'} transition-all ease-in-out duration-[600ms]`} />

      <div className={`${show
        ? 'bg-white dark:bg-neutral-900 fixed w-dvw bottom-0 left-0 p-4 rounded-t-md top-1/4 z-[100] overflow-y-auto lg:border-r'
        : 'bg-white dark:bg-neutral-900 lg:bg-transparent top-full left-0 w-dvw fixed p-4 lg:relative lg:w-[320px] lg:mt-5 lg:border-r lg:dark:border-neutral-600 lg:p-0 lg:px-2'
        } transition-all ease-in-out duration-[400ms]`}>
        <div className={'flex justify-between items-center mb-4'}>
          <span className="font-[700] dark:text-white">Filtros</span>
          <div>

            <Modal
              botaoAbrirModal={
                <button className="dark:hover:bg-neutral-800 p-1 rounded  hover:bg-neutral-100"
                  title="Exportar para Excel">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  dark:text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </button>
              }
              tituloModal="Selecione os campos para exportação"
              botaoSalvar={
                <button
                  onClick={() => exportExcel(selectedExportFields)}
                  title="Exportar para Excel"
                  className="bg-black dark:bg-neutral-800 text-white px-4 py-2 ml-4 rounded "
                >
                  Exportar
                </button>
              }
            >
              <div className="flex flex-col gap-2 p-4 lg:grid lg:grid-cols-2">
                {[
                  "id",
                  "precatorio",
                  "processo",
                  "cedente",
                  "status",
                  "ente",
                  "natureza",
                  "data_cessao",
                  "empresa",
                  "anuencia_advogado",
                  "falecido",
                ].map((field) => (
                  <div className="flex gap-2 items-center justify-start" key={field}>
                    <div className="relative mt-[6px]">
                      <input
                        type="checkbox"
                        name={field}
                        id={field}
                        onChange={() => handleFieldSelectionChange(field)}
                        checked={selectedExportFields.includes(field)}
                        className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
                      />
                      <span
                        className="absolute right-[1px] top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 ml-[2px] mt-[1px]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </div>

                    <label className="font-medium text-sm dark:text-white" htmlFor={field}>
                      {fieldLabels[field]} {/* Texto personalizado para o label */}
                    </label>
                  </div>
                ))}
              </div>
            </Modal>

            <button onClick={exportPDF} title="Exportar para PDF" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.} stroke="currentColor" className="size-5  dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </button>

            <button onClick={clearAllFilters} title='Limpar Todos os Filtros' className="cursor-pointer hover:rounded p-1 text-black hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="122.88"
                height="110.668"
                x="0"
                y="0"
                version="1.1"
                viewBox="0 0 122.88 110.668"
                xmlSpace="preserve"
                className="w-5 h-5 dark:fill-white fill-black"
              >
                <path
                  fillRule="evenodd"
                  d="M91.124 15.645c12.928 0 23.406 10.479 23.406 23.406s-10.479 23.406-23.406 23.406-23.406-10.479-23.406-23.406c0-12.926 10.479-23.406 23.406-23.406zM2.756 0h117.322a2.801 2.801 0 012.802 2.802 2.75 2.75 0 01-.996 2.139l-10.667 13.556a28.777 28.777 0 00-4.614-3.672l6.628-9.22H9.43l37.975 46.171c.59.516.958 1.254.958 2.102v49.148l21.056-9.623V57.896a28.914 28.914 0 005.642 4.996v32.133a2.735 2.735 0 01-1.586 2.506l-26.476 12.758a2.753 2.753 0 01-3.798-1.033 2.74 2.74 0 01-.368-1.4V55.02L.803 4.756a2.825 2.825 0 010-3.945A2.731 2.731 0 012.756 0zM96.93 28.282a3.388 3.388 0 014.825-.013 3.47 3.47 0 01.013 4.872l-5.829 5.914 5.836 5.919c1.317 1.338 1.299 3.506-.04 4.843-1.34 1.336-3.493 1.333-4.81-.006l-5.797-5.878-5.807 5.889a3.39 3.39 0 01-4.826.013 3.47 3.47 0 01-.013-4.872l5.83-5.913-5.836-5.919c-1.317-1.338-1.3-3.507.04-4.843a3.385 3.385 0 014.81.006l5.796 5.878 5.808-5.89z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>

          </div>
        </div>

        <div className='divide-y dark:divide-neutral-600'>

          <AbaFiltro abaNome={'Status'} dadosFiltro={dadosFiltro.status} selectedFilters={selectedFilters['status']} handleFilterChange={(value) => handleFilterChange('status', value)} />

          <AbaFiltro abaNome={'Ente'} dadosFiltro={dadosFiltro.ente} selectedFilters={selectedFilters['ente']} handleFilterChange={(value) => handleFilterChange('ente', value)} />

          {auth.user.admin || auth.user.advogado ? <AbaFiltro abaNome={'Empresa'} dadosFiltro={dadosFiltro.empresa} selectedFilters={selectedFilters['empresa']} handleFilterChange={(value) => handleFilterChange('empresa', value)} /> : null}

          <AbaFiltro abaNome={'Natureza'} dadosFiltro={dadosFiltro.natureza} selectedFilters={selectedFilters['natureza']} handleFilterChange={(value) => handleFilterChange('natureza', value)} />

          <AbaFiltro abaNome={'Anuência'} dadosFiltro={dadosFiltro.anuencia_advogado} selectedFilters={selectedFilters['anuencia_advogado']} handleFilterChange={(value) => handleFilterChange('anuencia_advogado', value)} />

          <AbaFiltro abaNome={'Óbito'} dadosFiltro={dadosFiltro.falecido} selectedFilters={selectedFilters['falecido']} handleFilterChange={(value) => handleFilterChange('falecido', value)} />

          {auth.user.admin || auth.user.advogado ? <AbaFiltro abaNome={'Rep. Comercial'} dadosFiltro={dadosFiltro.tele} selectedFilters={selectedFilters['tele']} handleFilterChange={(value) => handleFilterChange('tele', value)} /> : null}

          <AbaFiltro abaNome={'Data da Cessão'} selectedFilters={selectedFilters['data_cessao']} handleDateChange={handleDateChange} />
          
          {auth.user.admin ? <AbaFiltro abaNome={'Documentos Faltantes'} selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} /> : null}

        </div>
      </div>
    </>
  )
}
