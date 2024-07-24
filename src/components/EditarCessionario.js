import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';


export default function EditarCessionario({ cessionario, users, enviarValores }) {
  const [cessionarioEditado, setCessionarioEditado] = useState(cessionario.user_id ? cessionario.user_id : null);
  const [valorPagoEditado, setValorPagoEditado] = useState(cessionario.valor_pago ? cessionario.valor_pago : null);
  const [comissaoEditado, setComissaoEditado] = useState(cessionario.comissao ? cessionario.comissao : null);
  const [percentualEditado, setPercentualEditado] = useState(cessionario.percentual ? cessionario.percentual : null);
  const [expectativaEditado, setExpectativaEditado] = useState(cessionario.exp_recebimento ? cessionario.exp_recebimento : null);
  const [obsEditado, setObsEditado] = useState(cessionario.obs ? cessionario.obs : '');
  const [assinaturaEditado, setAssinaturaEditado] = useState(cessionario.assinatura === '1' ? true : null);
  const [expedidoEditado, setExpedidoEditado] = useState(cessionario.expedido === '1' ? true : null);
  const [recebidoEditado, setRecebidoEditado] = useState(cessionario.recebido === '1' ? true : null);
  const [notaEditado, setNotaEditado] = useState(cessionario.nota ? cessionario.nota : null);
  const [oficioTransferenciaEditado, setOficioTransferenciaEditado] = useState(cessionario.mandado ? cessionario.mandado : null);
  const [comprovantePagamentoEditado, setComprovantePagamentoEditado] = useState(cessionario.comprovante ? cessionario.comprovante : null); // Change to null
  const [notaFile, setNotaFile] = useState('');
  const [oficioTransferenciaFile, setOficioTransferenciaFile] = useState('');
  const [comprovantePagamentoFile, setComprovantePagamentoFile] = useState('');


  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  }

  useEffect(() => {
    // Envia os valores dos estados para o componente pai sempre que eles forem alterados
    const timer = setTimeout(() => {
      enviarValores({ cessionarioEditado, valorPagoEditado, comissaoEditado, percentualEditado, expectativaEditado, obsEditado, assinaturaEditado, expedidoEditado, recebidoEditado, notaEditado, oficioTransferenciaEditado, comprovantePagamentoEditado, notaFile, oficioTransferenciaFile, comprovantePagamentoFile });
    }, 100)

    return () => clearTimeout(timer)

  }, [cessionarioEditado, valorPagoEditado, comissaoEditado, percentualEditado, expectativaEditado, obsEditado, assinaturaEditado, expedidoEditado, recebidoEditado, notaEditado, oficioTransferenciaEditado, comprovantePagamentoEditado, notaFile, oficioTransferenciaFile, comprovantePagamentoFile]);



  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };


  return (
    <form className='mt-[20px]'>
      <div className='px-3 '>
        <div className='h-[400px] overflow-y-auto md:grid flex flex-col md:grid-cols-2'>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="cessionario">Cessionário</label>
            <Select
              defaultValue={{ value: parseInt(cessionario.user_id), label: cessionario.nome_user }}
              placeholder={'Selecionar cessionário'}
              options={handleSelectValues(users, 'nome')}
              isClearable={true}
              onChange={(selectedValue) => !selectedValue ? setCessionarioEditado('') : setCessionarioEditado(String(selectedValue.value))}
              name='cessionario'
              noOptionsMessage={() => 'Nenhum usuário encontrado'}
              unstyled // Remove all non-essential styles
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="valor_pago">
              Valor Pago
            </label>
            <CurrencyFormat
              placeholder={'Valor pago'}
              value={valorPagoEditado}
              thousandSeparator={'.'}
              decimalSeparator={','}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'R$ '}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setValorPagoEditado(formattedValue)
              }}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="comissao">
              Comissão
            </label>
            <CurrencyFormat
              placeholder={'Comissão'}
              value={comissaoEditado}
              thousandSeparator={'.'}
              decimalSeparator={','}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'R$ '}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setComissaoEditado(formattedValue)
              }}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="comissao">
              Porcentagem
            </label>
            <CurrencyFormat
              placeholder={'Percentual'}
              value={percentualEditado}
              thousandSeparator={'.'}
              decimalSeparator={','}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={'%'}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setPercentualEditado(formattedValue)
              }}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="comissao">
              Expectativa
            </label>
            <CurrencyFormat
              placeholder={'Comissâo'}
              value={expectativaEditado}
              thousandSeparator={'.'}
              decimalSeparator={','}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'R$ '}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setExpectativaEditado(formattedValue)
              }}
            />
          </div>






          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2 col-span-1'>
            <label
              className='text-[14px] font-medium'
              htmlFor="obs">
              Obs
            </label>
            <textarea
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] h-[60px]'
              value={obsEditado}
              rows={12}
              cols={6}
              onChange={(e) => setObsEditado(e.target.value)}>

            </textarea>
          </div>

          <div className='md:grid mt-2 flex flex-col justify-center gap-6 md:grid-cols-2 md:col-span-2 md:justify-between md:place-items-start'>
            <div className='dark:text-white text-black flex justify-between lg:flex-col lg:gap-5 py-2 px-2'>
              <label
                className='text-[14px] font-medium'
                htmlFor="assinatura">
                Assinatura
              </label>
              <div className="flex items-center gap-2 relative">
                <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={assinaturaEditado} onChange={() => setAssinaturaEditado(!assinaturaEditado)} />
                <span
                  className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                    stroke="currentColor" strokeWidth="1">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"></path>
                  </svg>
                </span>
              </div>
            </div>

            <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2 w-full'>
              <span className='text-[14px] font-medium mb-1'>Nota</span>
              <div className='flex items-center h-[34px] w-full'>
                <label htmlFor="nota" className='w-[85%] h-[34px] lg:w-[90%]'>


                  <span className='text-[15px] px-2 py-[6px] border-l border-t border-b border-r rounded-l dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400'>{notaEditado ? notaEditado.split('/')[1] : 'Selecione um arquivo'}</span>
                  <input
                    name='nota'
                    id='nota'
                    type='file'
                    className='hidden'
                    onChange={(e) => {
                      setNotaFile(e.target.files[0])
                      setNotaEditado(`cessionarios_nota/${e.target.files[0].name}`)
                    }}
                  >
                  </input>

                </label>
                <div className='w-[15%] lg:w-[10%]'>
                  <svg onClick={() => {
                    setNotaFile('')
                    setNotaEditado('')
                  }
                  } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[34px] w-full  text-[15px] p-[6px] border-r border-t border-b rounded-r dark:border-neutral-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>

                </div>


              </div>



            </div>



            <div className='dark:text-white text-black flex justify-between lg:flex-col lg:gap-5 py-2 px-2'>
              <label
                className='text-[14px] font-medium'
                htmlFor="oficioExpedido">
                Ofício Expedido
              </label>
              <div className="flex items-center  gap-2 relative">
                <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={expedidoEditado} onChange={() => setExpedidoEditado(!expedidoEditado)} />
                <span
                  className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                    stroke="currentColor" strokeWidth="1">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"></path>
                  </svg>
                </span>
              </div>
            </div>

            <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2 w-full'>
              <span className='text-[14px] font-medium mb-1'>Ofício de Transferência</span>
              <div className='flex items-center h-[34px] w-full'>
                <label htmlFor="oficio_transferencia" className='w-[85%] h-[34px] lg:w-[90%]'>


                  <span className='text-[15px] px-2 py-[6px] border-l border-t border-b border-r rounded-l dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400'>{oficioTransferenciaEditado ? oficioTransferenciaEditado : 'Selecione um arquivo'}</span>
                  <input
                    name='oficio_transferencia'
                    id='oficio_transferencia'
                    type='file'
                    className='hidden'
                    onChange={(e) => {
                      setOficioTransferenciaFile(e.target.files[0])
                      setOficioTransferenciaEditado(`cessionarios_mandado/${e.target.files[0].name}`)
                    }}
                  >
                  </input>

                </label>
                <div className='w-[15%] lg:w-[10%]'>
                  <svg onClick={() => {
                    setOficioTransferenciaFile('')
                    setOficioTransferenciaEditado('')
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[34px] w-full text-[15px] p-[6px] border-r border-t border-b rounded-r dark:border-neutral-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>

                </div>


              </div>



            </div>

            <div className='dark:text-white text-black flex justify-between lg:flex-col lg:gap-5 gap-2 py-2 px-2'>
              <label
                className='text-[14px] font-medium'
                htmlFor="recebido">
                Recebido
              </label>
              <div className="flex items-center gap-2 relative">
                <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={recebidoEditado} onChange={() => setRecebidoEditado(!recebidoEditado)} />
                <span
                  className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                    stroke="currentColor" strokeWidth="1">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"></path>
                  </svg>
                </span>
              </div>
            </div>

            <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2 w-full'>
              <span className='text-[14px] font-medium mb-1'>Comprovante de Pagamento</span>
              <div className='flex items-center h-[34px] w-full'>
                <label htmlFor="comprovante_pagamento" className='w-[85%] lg:w-[90%] h-[34px]'>


                  <span className='text-[15px] px-2 py-[6px] border-l border-t border-b border-r rounded-l dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400'>{comprovantePagamentoEditado ? comprovantePagamentoEditado : 'Selecione um arquivo'}</span>
                  <input
                    name='comprovante_pagamento'
                    id='comprovante_pagamento'
                    type='file'
                    className='hidden'
                    onChange={(e) => {
                      setComprovantePagamentoFile(e.target.files[0])
                      setComprovantePagamentoEditado(`cessionarios_comprovante/${e.target.files[0].name}`)
                    }}
                  >
                  </input>

                </label>
                <div className='w-[15%] lg:w-[10%]'>
                  <svg onClick={() => {
                    setComprovantePagamentoFile('')
                    setComprovantePagamentoEditado('')
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[34px] w-full text-[15px] p-[6px] border-r border-t border-b rounded-r dark:border-neutral-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>

                </div>


              </div>
            </div>



            <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
              <span className='text-[14px] font-medium mb-1'>Comprovante Cedente</span>
              <label htmlFor="comprovante_cedente">
                <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-not-allowed opacity-75'>Selecione um arquivo</span>
                {/* <input
                    name='comprovante_cedente'
                    id='comprovante_cedente'
                    type='file'
                    className='hidden'>
                  </input> */}
              </label>
            </div>
          </div>



        </div>

      </div>


    </form>
  )
}