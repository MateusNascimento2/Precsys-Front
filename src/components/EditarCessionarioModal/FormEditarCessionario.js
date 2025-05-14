import React, { useState } from 'react'
import Select from 'react-select';
import FileInput from './FileInput';

export function FormEditarCessionario({ formCessionario, setFormDataCessionario, users, fileCessionario, setFileCessionario }) {

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  }

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

  const formatCurrency = (value) => {
    // Remove tudo que não seja número
    let numericValue = value.replace(/\D/g, "");

    // Se o valor for vazio ou apenas "0", define como "0,00"
    if (!numericValue) return "R$ 0,00";

    // Garante que sempre teremos pelo menos 3 dígitos para facilitar a formatação
    while (numericValue.length < 3) {
      numericValue = "0" + numericValue;
    }

    // Captura os últimos 2 dígitos como centavos
    const centavos = numericValue.slice(-2);

    // Captura o restante como parte inteira
    let inteiros = numericValue.slice(0, -2);

    inteiros = parseInt(inteiros, 10).toString();

    // Formata os inteiros com separador de milhar
    const inteirosFormatados = inteiros
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Retorna o valor formatado corretamente
    return `R$ ${inteirosFormatados},${centavos}`;
  };

  const formatCurrencyPercentual = (e, value) => {
    // Remove tudo que não seja número
    let numericValue = value.replace(/\D/g, "");

    // Se o valor for vazio ou apenas "0", define como "0,00"
    if (!numericValue) return "0,00%";

    // Garante que sempre teremos pelo menos 3 dígitos para facilitar a formatação
    while (numericValue.length < 3) {
      numericValue = "0" + numericValue;
    }

    // Captura os últimos 2 dígitos como centavos
    const centavos = numericValue.slice(-2);

    // Captura o restante como parte inteira
    let inteiros = numericValue.slice(0, -2);

    inteiros = parseInt(inteiros, 10).toString();

    // Formata os inteiros com separador de milhar
    const inteirosFormatados = inteiros
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Garante que o cursor esteja no lugar certo

    const formattedValue = `${inteirosFormatados},${centavos}%`

    setTimeout(() => {
      const input = e.target;
      input.setSelectionRange(formattedValue.length - 1, formattedValue.length - 1);
    }, 0);

    // Retorna o valor formatado corretamente
    return formattedValue;
  };


  return (
    <div className={'block w-full'}>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>

        <div className='flex flex-col gap-4'>
          {/* Cessionário */}
          <div className='dark:text-white text-black flex flex-col gap-1'>
            <label className='text-[14px] font-medium' htmlFor="user_id">Cessionário <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
            <Select
              placeholder={'Selecionar cessionário'}
              options={handleSelectValues(users, 'nome')}
              isClearable={true}
              value={
                formCessionario.user_id
                  ? users.find(user => user.id === Number(formCessionario.user_id))
                    ? { value: Number(formCessionario.user_id), label: users.find(user => user.id === Number(formCessionario.user_id)).nome }
                    : null
                  : null
              }
              onChange={(selectedValue) => {
                setFormDataCessionario({...formCessionario, user_id: selectedValue.value})
              }}
              name='user_id'
              noOptionsMessage={() => 'Nenhum usuário encontrado'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-28'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          {/*Comissão*/}
          <div className='dark:text-white text-black flex flex-col gap-1'>
            <label
              className='text-[14px] font-medium'
              htmlFor="comissao">
              Comissão <span className='text-sm text-red-600 antialiased font-medium'>*</span>
            </label>
            <input
              id="comissao"
              name="comissao"
              type="text"
              value={formCessionario.comissao}
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(/^R\$\s?/, "");
                const formattedValue = formatCurrency(valueWithoutPrefix);
                setFormDataCessionario({ ...formCessionario, comissao: formattedValue });
              }}
              placeholder="Digite o valor"
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] w-full"
            />
          </div>

          {/*Expectativa*/}
          <div className='dark:text-white text-black flex flex-col gap-1'>
            <label
              className='text-[14px] font-medium'
              htmlFor="exp_recebimento">
              Expectativa <span className='text-sm text-red-600 antialiased font-medium'>*</span>
            </label>
            <input
              id="exp_recebimento"
              name="exp_recebimento"
              type="text"
              value={formCessionario.exp_recebimento}
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(/^R\$\s?/, "");
                const formattedValue = formatCurrency(valueWithoutPrefix);
                setFormDataCessionario({ ...formCessionario, exp_recebimento: formattedValue });
              }}
              placeholder="Digite o valor"
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] w-full"
            />
          </div>

          {/* Assinatura */}
          <div className='dark:text-white text-black flex flex-col md:items-start gap-1'>
            <label className='text-[14px] font-medium' htmlFor="assinatura">
              Assinatura
            </label>
            <div className="flex items-center gap-2 relative">
              <input
                type="checkbox"
                name='assinatura'
                checked={formCessionario.assinatura === '1'}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormDataCessionario({
                    ...formCessionario,
                    assinatura: checked ? '1' : '0'
                  });
                }}
                className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
              />
              <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                  stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </span>
            </div>
          </div>

          {/* Ofício Expedido */}
          <div className='dark:text-white text-black flex flex-col md:items-start gap-1'>
            <label className='text-[14px] font-medium' htmlFor="expedido">
              Ofício Expedido
            </label>
            <div className="flex items-center gap-2 relative">
              <input
                type="checkbox"
                name='expedido'
                checked={formCessionario.expedido === '1'}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormDataCessionario({
                    ...formCessionario,
                    expedido: checked ? '1' : '0'
                  });
                }}
                className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
              />
              <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                  stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </span>
            </div>
          </div>

          {/* Recebido */}
          <div className='dark:text-white text-black flex flex-col md:items-start gap-1'>
            <label className='text-[14px] font-medium' htmlFor="recebido">
              Recebido
            </label>
            <div className="flex items-center gap-2 relative">
              <input
                type="checkbox"
                name='recebido'
                checked={formCessionario.recebido === '1'}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormDataCessionario({
                    ...formCessionario,
                    recebido: checked ? '1' : '0'
                  });
                }}
                className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
              />
              <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                  stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          {/*Valor Pago*/}
          <div className='dark:text-white text-black flex flex-col gap-1'>
            <label
              className='text-[14px] font-medium'
              htmlFor="valor_pago">
              Valor Pago <span className='text-sm text-red-600 antialiased font-medium'>*</span>
            </label>
            <div className="relative">
              <input
                id="valor_pago"
                name="valor_pago"
                type="text"
                value={formCessionario.valor_pago}
                onChange={(e) => {
                  const valueWithoutPrefix = e.target.value.replace(/^R\$\s?/, "");
                  const formattedValue = formatCurrency(valueWithoutPrefix);
                  setFormDataCessionario({ ...formCessionario, valor_pago: formattedValue });
                }}
                placeholder="Digite o valor"
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] w-full"
              />
            </div>
          </div>

          {/*Porcentagem*/}
          <div className='dark:text-white text-black flex flex-col gap-1'>
            <label
              className='text-[14px] font-medium'
              htmlFor="percentual">
              Porcentagem <span className='text-sm text-red-600 antialiased font-medium'>*</span>
            </label>
            <input
              id="percentual"
              name="percentual"
              type="text"
              value={formCessionario.percentual} // Armazena o valor com o % */
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(/^R\$\s?/, "");
                const formattedValue = formatCurrencyPercentual(e, valueWithoutPrefix);
                setFormDataCessionario({ ...formCessionario, percentual: formattedValue });
              }}
              placeholder="Digite o percentual"
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] w-full"
            />
          </div>

          {/*Obs*/}
          <div className='dark:text-white text-black flex flex-col gap-1 col-span-1'>
            <label
              className='text-[14px] font-medium'
              htmlFor="obs">
              Obs
            </label>
            <textarea
              name='obs'
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] h-[60px]'
              value={formCessionario.obs}
              rows={12}
              cols={6}
              onChange={(e) => setFormDataCessionario({ ...formCessionario, obs: e.target.value })}
            >
            </textarea>
          </div>

          {/*Nota*/}
          <div className='dark:text-white text-black flex flex-col md:items-start gap-1 w-full'>
            <FileInput label={'Nota'} name={'nota'} formCessionario={formCessionario} inputFileName={formCessionario.nota} setFormDataCessionario={setFormDataCessionario} fileCessionario={fileCessionario} setFileCessionario={setFileCessionario} />
          </div>

          {/*Ofício de Transferência*/}
          <div className='dark:text-white text-black flex flex-col md:items-start gap-1 w-full'>
            <FileInput label={'Ofício de Transferência'} name={'mandado'} formCessionario={formCessionario} inputFileName={formCessionario.mandado} setFormDataCessionario={setFormDataCessionario} fileCessionario={fileCessionario} setFileCessionario={setFileCessionario} />
          </div>

          {/*Comprovante de Pagamento*/}
          <div className='dark:text-white text-black flex flex-col md:items-start gap-1 w-full'>
            <FileInput label={'Comprovante de Pagamento'} name={'comprovante'} formCessionario={formCessionario} inputFileName={formCessionario.comprovante} setFormDataCessionario={setFormDataCessionario} fileCessionario={fileCessionario} setFileCessionario={setFileCessionario} />
          </div>
        </div>

      </div>
    </div >


  )
}