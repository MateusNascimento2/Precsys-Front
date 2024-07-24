import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';

export default function EditarPrec({ precInfo, varas, orcamentos, naturezas, empresas, users, teles, escreventes, juridico, enviarValores }) {
  const [precatorioEditado, setPrecatorioEditado] = useState(precInfo.precatorio ? precInfo.precatorio : '');
  const [processoEditado, setProcessoEditado] = useState(precInfo.processo ? precInfo.processo : '');
  const [cedenteEditado, setCedenteEditado] = useState(precInfo.cedente ? precInfo.cedente : '');
  const [varaEditado, setVaraEditado] = useState(precInfo.vara_processo ? precInfo.vara_processo : '');
  const [enteEditado, setEnteEditado] = useState(precInfo.ente_id ? precInfo.ente_id : '');
  const [anoEditado, setAnoEditado] = useState(precInfo.ano ? precInfo.ano : '');
  const [naturezaEditado, setNaturezaEditado] = useState(precInfo.natureza ? precInfo.natureza : '');
  const [empresaEditado, setEmpresaEditado] = useState(precInfo.empresa_id ? precInfo.empresa_id : '');
  const [dataCessaoEditado, setDataCessaoEditado] = useState(precInfo.data_cessao ? precInfo.data_cessao : '');
  const [repComercialEditado, setRepComercialEditado] = useState(precInfo.tele_id ? precInfo.tele_id : '');
  const [escreventeEditado, setEscreventeEditado] = useState(precInfo.escrevente_id ? precInfo.escrevente_id : '');
  const [juridicoEditado, setJuridicoEditado] = useState(precInfo.juridico_id ? precInfo.juridico_id : '');
  const [requisitorioEditado, setRequisitorioEditado] = useState(precInfo.requisitorio ? precInfo.requisitorio : '');
  const [escrituraEditado, setEscrituraEditado] = useState(precInfo.escritura ? precInfo.escritura : '');
  const [requisitorioEditadoFile, setRequisitorioEditadoFile] = useState('');
  const [escrituraEditadoFile, setEscrituraEditadoFile] = useState('');

  console.log(teles)

  useEffect(() => {
    // Envia os valores dos estados para o componente pai sempre que eles forem alterados
    const timer = setTimeout(() => {
      enviarValores({ precatorioEditado, processoEditado, cedenteEditado, varaEditado, enteEditado, anoEditado, naturezaEditado, empresaEditado, dataCessaoEditado, repComercialEditado, escreventeEditado, juridicoEditado, requisitorioEditado, escrituraEditado, requisitorioEditadoFile, escrituraEditadoFile });
    }, 100)

    return () => clearTimeout(timer)

  }, [precatorioEditado, processoEditado, cedenteEditado, varaEditado, enteEditado, anoEditado, naturezaEditado, empresaEditado, dataCessaoEditado, repComercialEditado, escreventeEditado, juridicoEditado, requisitorioEditado, escrituraEditado, requisitorioEditadoFile, escrituraEditadoFile]);


  const handleTeleValues = (teles, users) => {
    return teles
      .map(tele => {
        const user = users.find(user => String(tele.usuario_id) === String(user.id));
        if (user) {
          return {
            value: parseInt(user.id),
            label: user.nome
          };
        }
        return null;
      })
      .filter(tele => tele !== null); // Filtra os valores que não foram transformados
  };

  // Uso da função
  const updatedTeles = handleTeleValues(teles, users);
  console.log(updatedTeles)

  const tele = updatedTeles.find(tele => String(precInfo.tele_id) === String(tele.value))

  console.log(tele)

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

  console.log(handleTeleValues(teles, users))

  return (
    <form className='mt-[20px]'>
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
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                console.log(formattedValue)
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
              onChange={(selectedValue) => !selectedValue ? setVaraEditado('') : setVaraEditado(String(selectedValue.value))}
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
                onChange={(selectedValue) => !selectedValue ? setEnteEditado('') : setEnteEditado(String(selectedValue.value))}
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

              <input type='text' name='ano' id='ano' placeholder='Ano' maxLength={4} className='dark:bg-neutral-800 border-r border-t border-b rounded-r  dark:border-neutral-600 py-1 px-2 w-[30%] focus:outline-none placeholder:text-[14px] text-gray-400 ' value={anoEditado} onChange={(e) => setAnoEditado(e.target.value)}></input>
            </div>
          </div>

          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="natureza">Natureza</label>
            <Select
              defaultValue={handleSelectValues(naturezas, 'nome')[parseInt(precInfo.natureza) - 1]}
              options={handleSelectValues(naturezas, 'nome')}
              onChange={(selectedValue) => !selectedValue ? setNaturezaEditado('') : setNaturezaEditado(String(selectedValue.value))}
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
              onChange={(selectedValue) => !selectedValue ? setEmpresaEditado('') : setEmpresaEditado(String(selectedValue.value))}
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
              options={updatedTeles}
              defaultValue={tele}
              onChange={(selectedValue) => !selectedValue ? setRepComercialEditado('') : setRepComercialEditado(String(selectedValue.value))}
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
              onChange={(selectedValue) => !selectedValue ? setEscreventeEditado('') : setEscreventeEditado(String(selectedValue.value))}
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
            <label className='text-[14px] font-medium' htmlFor="juridico">Jurídico</label>
            <Select
              options={handleSelectValues(juridico, 'nome')}
              defaultValue={handleSelectValues(juridico, 'nome')[parseInt(precInfo.juridico_id) - 1]}
              onChange={(selectedValue) => !selectedValue ? setJuridicoEditado('') : setJuridicoEditado(String(selectedValue.value))}
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
            <span className='text-[14px] font-medium'>Requisitório</span>


            <div className='flex items-center h-[34px] w-full'>
              <label htmlFor="requisitorio" className='h-[34px] w-[85%] lg:w-[90%]'>
                <span className='text-[15px] p-2 border-l border-t border-b border-r rounded-l dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400'>{requisitorioEditado ? requisitorioEditado.split('/')[1] : 'Selecione um arquivo'}</span>
                <input
                  onChange={(e) => {
                    setRequisitorioEditadoFile(e.target.files[0])
                    setRequisitorioEditado(`cessoes_requisitorios/${e.target.files[0].name}`)
                  }}
                  name='requisitorio'
                  id='requisitorio'
                  type='file'
                  className='hidden'>
                </input>
              </label>
              <div className='w-[15%] lg:w-[10%]'>
                <svg onClick={() => {
                  setRequisitorioEditadoFile('')
                  setRequisitorioEditado('')
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[34px] w-full text-[15px] p-[6px] border-r border-t border-b rounded-r dark:border-neutral-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>

              </div>



            </div>




          </div>

          <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2'>
            <span className='text-[14px] font-medium'>Escritura</span>


            <div className='flex items-center h-[34px] w-full'>
              <label htmlFor="escritura" className='w-[85%] h-[34px] lg:w-[90%]'>
                <span className='text-[15px] p-2 border-l border-t border-b border-r rounded-l dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full line-clamp-1 h-[34px] dark:bg-neutral-800 dark:text-gray-400'>{escrituraEditado ? escrituraEditado.split('/')[1] : 'Selecione um arquivo'}</span>
                <input
                  onChange={(e) => {
                    setEscrituraEditadoFile(e.target.files[0])
                    setEscrituraEditado(`cessoes_escrituras/${e.target.files[0].name}`)
                  }}
                  name='escritura'
                  id='escritura'
                  type='file'
                  className='hidden'>
                </input>
              </label>
              <div className='w-[15%] lg:w-[10%]'>
                <svg onClick={() => {
                  setEscrituraEditadoFile('')
                  setEscrituraEditado('')
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[34px] w-full p-[6px] border-r border-t border-b rounded-r dark:border-neutral-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>



            </div>


          </div>
        </div>

      </div>

    </form>



  )
}