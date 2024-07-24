import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';

function FileInput({ label, onFileChange, name }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  return (
    <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2 w-full'>
      <span className='text-[14px] font-medium'>{label}</span>
      <label className='w-full'>
        <span className='text-[15px] p-2 border rounded dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400 block'>
          Selecione um arquivo
        </span>
        <input
          name={name}
          type='file'
          className='hidden'
          onChange={handleFileChange}
        />
      </label>
      {file && <p className='text-[12px] italic text-neutral-600 mt-2'>Arquivo selecionado: {file.name}</p>}
    </div>
  );
}


export default function AdicionarCessionario({ users, enviarValores, valorPago, setValorPago, comissao, setComissao, percentual, setPercentual, expectativa, setExpectativa, index }) {
  const [cessionario, setCessionario] = useState(null);
  const [obs, setObs] = useState('');
  const [assinatura, setAssinatura] = useState(false);
  const [expedido, setExpedido] = useState(false);
  const [recebido, setRecebido] = useState(false);
  const [nota, setNota] = useState(null); // Change to null
  const [oficioTransferencia, setOficioTransferencia] = useState(null); // Change to null
  const [comprovantePagamento, setComprovantePagamento] = useState(null); // Change to null

  const [localValorPago, setLocalValorPago] = useState(valorPago ? valorPago : '');
  const [localComissao, setLocalComissao] = useState(comissao ? comissao : '');
  const [localPercentual, setLocalPercentual] = useState(percentual ? percentual : '');
  const [localExpectativa, setLocalExpectativa] = useState(expectativa ? expectativa : '');

  useEffect(() => {
    console.log(localValorPago)
    // Envia os valores dos estados para o componente pai sempre que eles forem alterados
    const timer = setTimeout(() => {
      enviarValores({ index, cessionario, valorPago: localValorPago, comissao: localComissao, percentual: localPercentual, expectativa: localExpectativa, obs, assinatura, expedido, recebido, nota, oficioTransferencia, comprovantePagamento });
    }, 100)

    return () => clearTimeout(timer)

  }, [index, cessionario, localValorPago, localComissao, localPercentual, localExpectativa, obs, assinatura, expedido, recebido, nota, oficioTransferencia, comprovantePagamento]);

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  }

  console.log(handleSelectValues(users, 'nome'))

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

  return (
    <>
      <form action="" className='mt-[20px]'>
        <div className='px-3 '>
          <div className='md:grid flex flex-col md:grid-cols-2'>
            <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
              <label className='text-[14px] font-medium' htmlFor="cessionario">Cessionário</label>
              <Select
                placeholder={'Selecionar cessionário'}
                options={handleSelectValues(users, 'nome')}
                isClearable={true}
                onChange={(selectedValue) => !selectedValue ? setCessionario('') : setCessionario(selectedValue.value)}
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
                htmlFor="valorPago">
                Valor Pago
              </label>
              <CurrencyFormat
                name={'valorPago'}
                placeholder={'Valor pago'}
                value={localValorPago}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$ '}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setLocalValorPago(formattedValue)
                  setValorPago(formattedValue)
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
                name={'comissao'}
                placeholder={'Comissão'}
                value={localComissao}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$ '}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setLocalComissao(formattedValue)
                  setComissao(formattedValue)
                }}
              />
            </div>

            <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
              <label
                className='text-[14px] font-medium'
                htmlFor="percentual">
                Porcentagem
              </label>
              <CurrencyFormat
                name={'percentual'}
                placeholder={'Percentual'}
                value={localPercentual}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                suffix={'%'}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setLocalPercentual(formattedValue)
                  setPercentual(formattedValue)
                }}
              />
            </div>

            <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
              <label
                className='text-[14px] font-medium'
                htmlFor="expectativa">
                Expectativa
              </label>
              <CurrencyFormat
                name={'expectativa'}
                placeholder={'Expectativa'}
                value={localExpectativa}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$ '}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setLocalExpectativa(formattedValue)
                  setExpectativa(formattedValue)
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
                name='obs'
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] h-[60px]'
                value={obs}
                rows={12}
                cols={6}
                onChange={(e) => setObs(e.target.value)}>
              </textarea>
            </div>

            <div className='md:grid flex flex-col justify-center gap-4 md:grid-cols-2 md:col-span-2 md:justify-between md:place-items-start'>
              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <label
                  className='text-[14px] font-medium'
                  htmlFor="assinatura">
                  Assinatura
                </label>
                <div className="flex items-center gap-2 relative">
                  <input type="checkbox" name='assinatura' className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={assinatura} onChange={() => setAssinatura(!assinatura)} />
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

              <FileInput
                label="Nota"
                name={'nota'}
                onFileChange={(file) => setNota(file)}
              />





              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <label
                  className='text-[14px] font-medium'
                  htmlFor="expedido">
                  Ofício Expedido
                </label>
                <div className="flex items-center  gap-2 relative">
                  <input type="checkbox" name='expedido' className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={expedido} onChange={() => setExpedido(!expedido)} />
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

              {/* <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <span className='text-[14px] font-medium mb-1'>Ofício de Transferência</span>
                <label htmlFor="oficio_transferencia">
                  <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
                  <input
                    name='oficio_transferencia'
                    id='oficio_transferencia'
                    type='file'
                    className='hidden'
                    onChange={(e) => setOficioTransferencia(e.target.files[0])}
                  >
                  </input>
                  {oficioTransferencia ? <p className='text-[12px] italic text-neutral-600 mt-2'>Arquivo selecionado: {oficioTransferencia.name}</p> : null}
                </label>
              </div> */}

              <FileInput
                label="Ofício de Transferência"
                name={'oficio_transferencia'}
                onFileChange={(file) => setOficioTransferencia(file)}
              />

              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <label
                  className='text-[14px] font-medium'
                  htmlFor="recebido">
                  Recebido
                </label>
                <div className="flex items-center gap-2 relative">
                  <input type="checkbox" name='recebido' className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={recebido} onChange={() => setRecebido(!recebido)} />
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

              {/* <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <span className='text-[14px] font-medium mb-1'>Comprovante de Pagamento</span>
                <label htmlFor="comprovante_pagamento">
                  <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
                  <input
                    name='comprovante_pagamento'
                    id='comprovante_pagamento'
                    type='file'
                    className='hidden'
                    onChange={(e) => setComprovantePagamento(e.target.files[0])}
                  >
                  </input>
                  {comprovantePagamento ? <p className='text-[12px] italic text-neutral-600 mt-2'>Arquivo selecionado: {comprovantePagamento.name}</p> : null}
                </label>
              </div> */}


              <FileInput
                label="Comprovante de Pagamento"
                name={'comprovante_pagamento'}
                onFileChange={(file) => setComprovantePagamento(file)}
              />

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
    </>
  )
}