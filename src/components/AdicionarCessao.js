import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';


export default function AdicionarCessao({ varas, orcamentos, naturezas, empresas, users, teles, escreventes, juridicos, enviarValores }) {
  const [precatorio, setPrecatorio] = useState('');
  const [processo, setProcesso] = useState('');
  const [cedente, setCedente] = useState('');
  const [vara, setVara] = useState(null);
  const [ente, setEnte] = useState(null);
  const [ano, setAno] = useState('');
  const [natureza, setNatureza] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [dataCessao, setDataCessao] = useState('');
  const [repComercial, setRepComercial] = useState(null);
  const [escrevente, setEscrevente] = useState(null);
  const [juridico, setJuridico] = useState(null);

  const [precatorioError, setPrecatorioError] = useState(false);
  const [processoError, setProcessoError] = useState(false);


  console.log(juridicos)

  useEffect(() => {
    // Envia os valores dos estados para o componente pai sempre que eles forem alterados
    const timer = setTimeout(() => {
      enviarValores({ precatorio, processo, cedente, vara, ente, ano, natureza, empresa, dataCessao, repComercial, escrevente, juridico });
    }, 100)

    return () => clearTimeout(timer)

  }, [precatorio, processo, cedente, vara, ente, ano, natureza, empresa, dataCessao, repComercial, escrevente, juridico]);


  teles.forEach(tele => {
    users.forEach(user => {
      if (String(tele.usuario_id) === String(user.id)) {
        tele.value = parseInt(user.id)
        tele.label = user.nome
      }
    })
  })

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


  return (


    <form className='mt-[20px]'>
      <div className='px-3 '>
        <div className='grid grid-cols-1 md:grid-cols-2'>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="precatorio">
              Precatório
            </label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 '
              placeholder={'Número do precatório'}
              name={'precatorio'}
              format={'####.#####-#'}
              value={precatorio}
              required={true}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setPrecatorio(formattedValue)

                value.length < 10 ? setPrecatorioError(true) : setPrecatorioError(false)
              }}>
            </CurrencyFormat>
            {precatorioError && <p className='text-red-600 text-[11px]'>Número do precatório inválido</p>}
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="processo">
              Processo
            </label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 '
              placeholder={'Número do processo'}
              format={'#######-##.####.#.##.####'}
              name={'processo'}
              value={processo}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                console.log(formattedValue)
                setProcesso(formattedValue)
                console.log(value.length)

                value.length < 20 ? setProcessoError(true) : setProcessoError(false)
              }}>

            </CurrencyFormat>
            {processoError && <p className='text-red-600 text-[11px]'>Número do processo inválido</p>}
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="cedente">
              Cedente
            </label>
            <input
              className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 '
              placeholder='Nome do cedente'
              name='cedente'
              value={cedente}
              onChange={(e) => setCedente(e.target.value)}>
            </input>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="vara">Vara</label>
            <Select
              placeholder={'Selecionar vara'}
              options={handleSelectValues(varas, 'nome')}
              isClearable={true}
              onChange={(selectedValue) => !selectedValue ? setVara('') : setVara(selectedValue.value)}
              name='vara'
              noOptionsMessage={() => 'Nenhuma vara encontrada'}
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
            <label className='text-[14px] font-medium' htmlFor="orcamento">Orçamento</label>
            <div className='flex'>
              <Select
                options={handleSelectValues(orcamentos, 'ente')}
                isClearable={true}
                onChange={(selectedValue) => !selectedValue ? setEnte('') : setEnte(selectedValue.value)}
                name='ente'
                placeholder={'Selecionar ente'}
                noOptionsMessage={() => 'Nenhum ente encontrado'}
                unstyled // Remove all non-essential styles
                classNames={{
                  container: () => ('border-l border-t border-b border-r rounded-l dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 w-[70%] text-[15px] h-[34px]'),
                  control: () => ('px-2 mt-[6px] flex items-center'),
                  input: () => ('text-gray-400'),
                  menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                  menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                  option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                }}
                styles={customStyles}
              />

              <input type='text' name='ano' id='ano' placeholder='Ano' className='dark:bg-neutral-800 border-r border-t border-b rounded-r  dark:border-neutral-600 py-1 px-2 w-[30%] focus:outline-none placeholder:text-[14px] text-gray-400 ' value={ano} onChange={(e) => setAno(e.target.value)}></input>
            </div>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="natureza">Natureza</label>
            <Select
              options={handleSelectValues(naturezas, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setNatureza('') : setNatureza(selectedValue.value)}
              isClearable={true}
              name='natureza'
              placeholder={"Selecionar natureza"}
              noOptionsMessage={() => 'Nenhuma natureza encontrada'}
              unstyled  // Remove all non-essential styles
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-full'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="empresa">Empresa</label>
            <Select
              menuPlacement='top'
              options={handleSelectValues(empresas, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setEmpresa('') : setEmpresa(selectedValue.value)}
              isClearable={true}
              name='empresa'
              placeholder={'Selecionar empresa'}
              noOptionsMessage={() => 'Nenhuma empresa encontrada'}
              unstyled // Remove all non-essential styles
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="dataCessao">Data da Cessão</label>
            <input
              type='date'
              name='dataCessao'
              id='dataCessao'
              className='dark:bg-neutral-800 border rounded dark:[color-scheme:dark]  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 '
              placeholder='Selecionar data da cessão'
              value={dataCessao}
              onChange={(e) => setDataCessao(e.target.value)}>
            </input>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="repComercial">Rep. Comercial</label>
            <Select
              menuPlacement='top'
              options={teles}
              onChange={(selectedValue) => !selectedValue ? setRepComercial('') : setRepComercial(selectedValue.value)}
              isClearable={true}
              name='repComercial'
              placeholder={'Selecionar rep. comercial'}
              noOptionsMessage={() => 'Nenhum rep. comercial encontrado'}
              unstyled// Remove all non-essential styles
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="escrevente">Escrevente</label>
            <Select
              menuPlacement='top'
              options={handleSelectValues(escreventes, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setEscrevente('') : setEscrevente(selectedValue.value)}
              isClearable={true}
              name='escrevente'
              placeholder={'Selecionar escrevente'}
              noOptionsMessage={() => 'Nenhum escrevente encontrado'} menuPosition='absolute'
              unstyled// Remove all non-essential styles
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="juridico">Jurídicos</label>
            <Select
              options={handleSelectValues(juridicos, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setJuridico('') : setJuridico(selectedValue.value)}
              isClearable={true}
              name='juridico'
              placeholder={"Selecionar jurídico"}
              noOptionsMessage={() => 'Nenhum jurídico encontrado'}
              unstyled  // Remove all non-essential styles
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => (' flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2'>
            <span className='text-[14px] font-medium mb-1'>Requisitório</span>
            <label htmlFor="requisitorio">

              <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
              <input
                name='requisitorio'
                id='requisitorio'
                type='file'
                className='hidden'>
              </input>

            </label>


          </div>

          <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2'>
            <span className='text-[14px] font-medium mb-1'>Escritura</span>
            <label htmlFor="escritura">

              <span className='text-[14px] font-medium border rounded dark:border-neutral-600 p-2 h-[34px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'>Selecione um arquivo</span>
              <input
                name='escritura'
                id='escritura'
                type='file'
                className='hidden'>
              </input>

            </label>


          </div>
        </div>

      </div>

    </form>



  )
}