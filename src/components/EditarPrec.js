import React, { useState } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';

export default function EditarPrec({ precInfo, varas, orcamentos, naturezas, empresas, users, teles, escreventes }) {
  const [precatorioEditado, setPrecatorioEditado] = useState(precInfo.precatorio ? precInfo.precatorio : null);
  const [processoEditado, setProcessoEditado] = useState(precInfo.processo ? precInfo.processo : null);
  const [cedenteEditado, setCedenteEditado] = useState(precInfo.cedente ? precInfo.cedente : null);
  const [varaEditado, setVaraEditado] = useState(precInfo.nome_vara ? precInfo.nome_vara : null);
  const [enteEditado, setEnteEditado] = useState(precInfo.nome_ente ? precInfo.nome_ente : null);
  const [anoEditado, setAnoEditado] = useState(precInfo.ano ? precInfo.ano : null);
  const [naturezaEditado, setNaturezaEditado] = useState(precInfo.nome_natureza ? precInfo.nome_natureza : null);
  const [empresaEditado, setEmpresaEditado] = useState(precInfo.nome_empresa ? precInfo.nome_empresa : null);
  const [dataCessaoEditado, setDataCessaoEditado] = useState(precInfo.data_cessao ? precInfo.data_cessao : null);
  const [repComercialEditado, setRepComercialEditado] = useState(precInfo.nome_tele ? precInfo.nome_tele : null);
  const [escreventeEditado, setEscreventeEditado] = useState(precInfo.nome_escrevente ? precInfo.nome_escrevente : null);


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

  const handleEditCessaoForm = (e) => {
    e.preventDefault();
    console.log('submitado')
    console.log(precatorioEditado)
    console.log(processoEditado)
    console.log(varaEditado)
    console.log(enteEditado)
    console.log(anoEditado)
    console.log(naturezaEditado)
    console.log(empresaEditado)
    console.log(dataCessaoEditado)
    console.log(repComercialEditado)
    console.log(escreventeEditado)
  }


  return (


    <form action="" onSubmit={(e) => handleEditCessaoForm(e)} className='mt-[20px]'>
      <div className='px-2'>
        <div className='h-[400px] overflow-y-auto grid grid-cols-1 md:grid-cols-2'>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label
              className='text-[14px] font-medium'
              htmlFor="precatorio">
              Precatório
            </label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 '
              placeholder={'Número do precatório'}
              format={'####.#####-#'}
              value={precatorioEditado}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setPrecatorioEditado(formattedValue)
              }}>
            </CurrencyFormat>
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
              value={processoEditado}
              onChange={(values) => {
                const {formattedValue, value} = values;
                setProcessoEditado(formattedValue)
              }}>

            </CurrencyFormat>
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
              value={cedenteEditado}
              onChange={(e) => setCedenteEditado(e.target.value)}>
            </input>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="vara">Vara</label>
            <Select
              defaultValue={handleSelectValues(varas, 'nome')[parseInt(precInfo.vara_processo) - 1]}
              placeholder={'Selecionar vara'}
              options={handleSelectValues(varas, 'nome')}
              isClearable={true}
              onChange={(selectedValue) => !selectedValue ? setVaraEditado('') : setVaraEditado(selectedValue.label)}
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
                defaultValue={handleSelectValues(orcamentos, 'ente')[parseInt(precInfo.ente_id) - 1]}
                options={handleSelectValues(orcamentos, 'ente')}
                isClearable={true}
                onChange={(selectedValue) => !selectedValue ? setEnteEditado('') : setEnteEditado(selectedValue.label)}
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

              <input type='text' name='ano' id='ano' placeholder='Ano' className='dark:bg-neutral-800 border-r border-t border-b rounded-r  dark:border-neutral-600 py-1 px-2 w-[30%] focus:outline-none placeholder:text-[14px] text-gray-400 ' value={anoEditado} onChange={(e) => setAnoEditado(e.target.value)}></input>
            </div>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="natureza">Natureza</label>
            <Select
              defaultValue={handleSelectValues(naturezas, 'nome')[parseInt(precInfo.natureza) - 1]}
              options={handleSelectValues(naturezas, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setNaturezaEditado('') : setNaturezaEditado(selectedValue.label)}
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
              defaultValue={handleSelectValues(empresas, 'nome')[parseInt(precInfo.empresa_id) - 1]}
              options={handleSelectValues(empresas, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setEmpresaEditado('') : setEmpresaEditado(selectedValue.label)}
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
            <label className='text-[14px] font-medium' htmlFor="data_cessao">Data da Cessão</label>
            <input
              type='date'
              name='data_cessao'
              id='data_cessao'
              className='dark:bg-neutral-800 border rounded dark:[color-scheme:dark]  dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 '
              placeholder='Selecionar data da cessão'
              value={dataCessaoEditado}
              onChange={(e) => setDataCessaoEditado(e.target.value)}>
            </input>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="rep_comercial">Rep. Comercial</label>
            <Select
              menuPlacement='top'
              options={teles}
              defaultValue={teles[parseInt(precInfo.tele_id)]}
              onChange={(selectedValue) => !selectedValue ? setRepComercialEditado('') : setRepComercialEditado(selectedValue.label)}
              isClearable={true}
              name='rep_comercial'
              placeholder={'Selecionar Rep. Comercial'}
              noOptionsMessage={() => 'Nenhum Rep. Comercial encontrado'}
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
              defaultValue={handleSelectValues(escreventes, 'nome')[parseInt(precInfo.escrevente_id) - 1]}
              options={handleSelectValues(escreventes, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setEscreventeEditado('') : setEscreventeEditado(selectedValue.label)}
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
        </div>

      </div>

    </form>



  )
}