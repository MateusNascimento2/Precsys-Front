import React, { useState } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';

export default function AdicionarCessionario({ users }) {
  const [cessionario, setCessionario] = useState(null);
  const [valorPago, setValorPago] = useState('');
  const [comissao, setComissao] = useState('');
  const [percentual, setPercentual] = useState('');
  const [expectativa, setExpectativa] = useState('');
  const [obs, setObs] = useState('');
  const [assinatura, setAssinatura] = useState(null);
  const [expedido, setExpedido] = useState(null);
  const [recebido, setRecebido] = useState(null);
  console.log(users)

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  }


  console.log(handleSelectValues(users, 'nome'))

  const handleAddCessionario = (e) => {
    e.preventDefault();
    console.log('submitado')
    console.log(cessionario)
    console.log(valorPago)
    console.log(comissao)
    console.log(percentual)
    console.log(expectativa)
    console.log(obs)
    console.log(assinatura)
    console.log(expedido)
    console.log(recebido)
  }

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
                onChange={(selectedValue) => !selectedValue ? setCessionario('') : setCessionario(selectedValue.label)}
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
                value={valorPago}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$ '}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
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
                placeholder={'Comissão'}
                value={comissao}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$ '}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setComissao(formattedValue)
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
                value={percentual}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                suffix={'%'}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setPercentual(formattedValue)
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
                value={expectativa}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$ '}
                className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
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
                  htmlFor="comissao">
                  Assinatura
                </label>
                <div className="flex items-center gap-2 relative">
                  <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={assinatura} onChange={() => setAssinatura(!assinatura)} />
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

              <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2'>
                <span className='text-[14px] font-medium mb-1'>Nota</span>
                <label htmlFor="nota">

                  <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
                  <input
                    name='nota'
                    id='nota'
                    type='file'
                    className='hidden'>
                  </input>

                </label>


              </div>

              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <label
                  className='text-[14px] font-medium'
                  htmlFor="comissao">
                  Ofício Expedido
                </label>
                <div className="flex items-center  gap-2 relative">
                  <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={expedido} onChange={() => setExpedido(!expedido)} />
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

              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <span className='text-[14px] font-medium mb-1'>Ofício de Transferência</span>
                <label htmlFor="nota">

                  <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
                  <input
                    name='nota'
                    id='nota'
                    type='file'
                    className='hidden'>
                  </input>

                </label>


              </div>

              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <label
                  className='text-[14px] font-medium'
                  htmlFor="comissao">
                  Recebido
                </label>
                <div className="flex items-center gap-2 relative">
                  <input type="checkbox" className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" checked={recebido} onChange={() => setRecebido(!recebido)} />
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

              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <span className='text-[14px] font-medium mb-1'>Comprovante de Pagamento</span>
                <label htmlFor="nota">

                  <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
                  <input
                    name='nota'
                    id='nota'
                    type='file'
                    className='hidden'>
                  </input>

                </label>


              </div>

              <div className='dark:text-white text-black flex flex-col md:items-start gap-2 py-2 px-2'>
                <span className='text-[14px] font-medium mb-1'>Comprovante Cedente</span>
                <label htmlFor="nota">

                  <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
                  <input
                    name='nota'
                    id='nota'
                    type='file'
                    className='hidden'>
                  </input>

                </label>


              </div>
            </div>



          </div>





        </div>


      </form>
    </>

  )
}