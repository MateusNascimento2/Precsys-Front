import React, { useState, useEffect } from 'react'
import CurrencyFormat from 'react-currency-format';
import Select from 'react-select';
import FileInput from './FileInput';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export function FormEditarCessao({ formDataCessao, handleCessaoInputChange }) {
  const [precatorioError, setPrecatorioError] = useState();
  const [processoError, setProcessoError] = useState();
  const [orcamentos, setOrcamentos] = useState([]);
  const [anosOrcamento, setAnosOrcamento] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [teles, setTeles] = useState([]);
  const [juridico, setJuridico] = useState([]);
  const [varas, setVaras] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [escrevente, setEscrevente] = useState([]);
  const axiosPrivate = useAxiosPrivate();



  useEffect(async () => {
    let isMounted = true; // ✅ Flag para verificar se o componente está montado

    const fetchData = async (ApiRoute, setter) => {
      try {
        const { data } = await axiosPrivate.get(ApiRoute);
        if (isMounted) {  // ✅ Só atualiza o estado se o componente ainda estiver montado
          setter(data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    await Promise.all([
      fetchData('/orcamentos', setOrcamentos),
      fetchData('/empresas', setEmpresas),
      fetchData('/nomeTele', setTeles),
      fetchData('/juridicos', setJuridico),
      fetchData('/vara', setVaras),
      fetchData('/natureza', setNatureza),
      fetchData('/escreventes', setEscrevente),
    ]);


    return () => {
      isMounted = false; // ✅ Cleanup: evita atualização após desmontar
    };
  }, []);

  const handleAnoOrcamento = async (id) => {

    if (id) {
      const { data } = await axiosPrivate.post('OrcamentosComAnos', {
        id
      })
      setAnosOrcamento(data);
    } else {
      setAnosOrcamento([]);
    }

  }

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

  const handleSelectValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.id,
        label: item[value]
      };
    });
  }  

  const handleSelectTelesValues = (array, value) => {
    return array.map(item => {
      return {
        value: item.usuario_id,
        label: item[value]
      }
    })
  }

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>

      <div className='flex flex-col gap-4'>

        {/* Precatório */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="precatorio">Precatório <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <CurrencyFormat
            className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-2 px-2 focus:outline-none placeholder:text-[14px] text-[16px] text-gray-400 h-[34px]'
            placeholder={'Número do precatório'}
            name='precatorio'
            format={'####.#####-#'}
            value={formDataCessao.precatorio}
            required={true}
            onValueChange={(values) => {
              handleCessaoInputChange(values, 'precatorio')
              setPrecatorioError(values.value.length)
            }}
          />
          {precatorioError < 10 && <p className='text-[12px] text-red-600 antialiased font-medium'>Número do precatório inválido</p>}
        </div>

        {/* Cedente */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="cedente">Cedente <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <input
            className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-2 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 h-[34px] text-[16px]'
            placeholder='Nome do cedente'
            name='cedente'
            value={formDataCessao.cedente}
            onChange={(e) => handleCessaoInputChange(e.target.value, 'cedente')}
          />
        </div>

        {/* Orçamento */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="ente_id">Orçamento <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row'>
            <Select
              options={handleSelectValues(orcamentos, 'ente')}
              isClearable={true}
              value={formDataCessao.ente_id
                ? { value: Number(formDataCessao.ente_id), label: orcamentos.find(orcamento => orcamento.id === formDataCessao.ente_id)?.ente }
                : null
              }
              onChange={(selectedValue) => {
                if (selectedValue) {
                  handleCessaoInputChange(selectedValue.value, 'ente_id');
                  handleAnoOrcamento(selectedValue.value);
                } else {
                  handleCessaoInputChange('', 'ente_id');
                  handleAnoOrcamento('');
                }
              }}
              name="ente_id"
              placeholder="Selecionar ente"
              noOptionsMessage={() => "Nenhum ente encontrado"}
              unstyled
              classNames={{
                container: () =>
                  "border-l border-t border-b border-r rounded-l dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 w-full lg:w-[70%] text-[15px] h-[34px]",
                control: () => "px-2 mt-[6px] flex items-center",
                input: () => "text-gray-400",
                menu: () =>
                  "mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28",
                menuList: () => "flex flex-col gap-2 px-2 py-1 text-[13px] h-28",
                option: () => "hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1",
              }}
              styles={customStyles}
            />

            <Select
              options={handleSelectValues(anosOrcamento, 'ano')}
              isClearable={true}
              value={formDataCessao.ano
                ? {
                  value: anosOrcamento.find(ano => ano.ano === formDataCessao.ano)?.id || '',
                  label: formDataCessao.ano
                }
                : null
              }
              onChange={(selectedValue) => {
                handleCessaoInputChange(selectedValue ? selectedValue.label : '', 'ano');
              }}
              placeholder={'Ano'}
              name='ano'
              isDisabled={anosOrcamento.length === 0}
              noOptionsMessage={() => 'Selecione um orçamento'}
              unstyled
              classNames={{
                container: () => ('dark:bg-neutral-800 border-l lg:border-l-0 border-r border-t border-b rounded-r dark:border-neutral-600 w-full lg:w-[30%] text-[15px] text-gray-400'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-28'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>
        </div>

        {/* Empresa */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="empresa_id">Empresa</label>
          <Select
            options={handleSelectValues(empresas, 'nome')}
            isClearable={true}
            value={
              formDataCessao.empresa_id
                ? empresas.find(emp => emp.id === formDataCessao.empresa_id)
                  ? { value: formDataCessao.empresa_id, label: empresas.find(emp => emp.id === formDataCessao.empresa_id).nome }
                  : null
                : null
            }
            onChange={(selectedValue) => {
              handleCessaoInputChange(selectedValue ? selectedValue.value : '', 'empresa_id');
            }}
            name="empresa_id"
            placeholder="Selecionar empresa"
            noOptionsMessage={() => "Nenhuma empresa encontrada"}
            unstyled
            classNames={{
              container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
              control: () => ('px-2 mt-[6px] flex items-center'),
              input: () => ('text-gray-400'),
              menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28'),
              menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-28'),
              option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
            }}
            styles={customStyles}
          />
        </div>

        {/* Rep. Comercial */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="tele_id">Rep. Comercial</label>
          <Select
            options={handleSelectTelesValues(teles, 'usuario_nome')}
            isClearable={true}
            value={
              formDataCessao.tele_id
                ? teles.find(tele => tele.usuario_id === formDataCessao.tele_id)
                  ? { value: formDataCessao.tele_id, label: teles.find(tele => tele.usuario_id === formDataCessao.tele_id).usuario_nome }
                  : null
                : null
            }
            onChange={(selectedValue) => {
              handleCessaoInputChange(selectedValue ? selectedValue.value : '', 'tele_id');
            }}
            name='tele_id'
            placeholder={'Selecionar rep. comercial'}
            noOptionsMessage={() => 'Nenhum rep. comercial encontrado'}
            unstyled
            classNames={{
              container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
              control: () => ('px-2 mt-[6px] flex items-center'),
              input: () => ('text-gray-400'),
              menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28'),
              menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-28'),
              option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
            }}
            styles={customStyles}
          />
        </div>

        {/* Jurídicos */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="juridico_id">Jurídicos <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <Select
            options={handleSelectValues(juridico, 'nome')}
            isClearable={true}
            value={
              formDataCessao.juridico_id
                ? juridico.find(jur => jur.id === formDataCessao.juridico_id)
                  ? { value: formDataCessao.juridico_id, label: juridico.find(jur => jur.id === formDataCessao.juridico_id).nome }
                  : null
                : null
            }
            onChange={(selectedValue) => {
              handleCessaoInputChange(selectedValue ? selectedValue.value : '', 'juridico_id');
            }}
            name="juridico_id"
            placeholder={"Selecionar jurídico"}
            noOptionsMessage={() => 'Nenhum jurídico encontrado'}
            unstyled
            classNames={{
              container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
              control: () => ('px-2 mt-[6px] flex items-center'),
              input: () => ('text-gray-400'),
              menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28'),
              menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-28'),
              option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
            }}
            styles={customStyles}
          />
        </div>

        {/* Escritura */}
        <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-1 w-full'>

          <FileInput label={'Escritura'} name={'escritura'} formDataCessao={formDataCessao.escritura} handleCessaoInputChange={handleCessaoInputChange} />

        </div>


      </div>

      <div className='flex flex-col gap-4'>
        {/* Processo */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="processo">Processo <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <CurrencyFormat
            className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-2 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 h-[34px] text-[16px]'
            placeholder={'Número do processo'}
            format={'#######-##.####.#.##.####'}
            name={'processo'}
            value={formDataCessao.processo}
            onValueChange={(values) => {
              handleCessaoInputChange(values, 'processo');
              setProcessoError(values.value.length);
            }}
          />
          {processoError < 20 && <p className='text-[12px] text-red-600 antialiased font-medium'>Número do processo inválido</p>}
        </div>

        {/* Vara */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="vara_processo">Vara <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <Select
            placeholder={'Selecionar vara'}
            options={handleSelectValues(varas, 'nome')}
            isClearable={true}
            value={
              formDataCessao.vara_processo
                ? varas.find(vara => vara.id === formDataCessao.vara_processo)
                  ? { value: formDataCessao.vara_processo, label: varas.find(vara => vara.id === formDataCessao.vara_processo).nome }
                  : null
                : null
            }
            onChange={(selectedValue) => {
              handleCessaoInputChange(selectedValue ? selectedValue.value : '', 'vara_processo');
            }}
            name='vara_processo'
            noOptionsMessage={() => 'Nenhuma vara encontrada'}
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

        {/* Natureza */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="natureza">Natureza <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <Select
            options={handleSelectValues(natureza, 'nome')}
            isClearable={true}
            value={
              formDataCessao.natureza
                ? natureza.find(nat => nat.id === formDataCessao.natureza)
                  ? { value: formDataCessao.natureza, label: natureza.find(nat => nat.id === formDataCessao.natureza).nome }
                  : null
                : null
            }
            onChange={(selectedValue) => {
              handleCessaoInputChange(selectedValue ? selectedValue.value : '', 'natureza');
            }}
            name='natureza'
            placeholder={"Selecionar natureza"}
            noOptionsMessage={() => 'Nenhuma natureza encontrada'}
            unstyled
            classNames={{
              container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
              control: () => ('px-2 mt-[6px] flex items-center'),
              input: () => ('text-gray-400'),
              menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
              menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-full'),
              option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
            }}
            styles={customStyles}
          />
        </div>

        {/* Data da Cessão */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="data_cessao">Data da Cessão <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <input
            type='date'
            name='data_cessao'
            id='data_cessao'
            className='dark:bg-neutral-800 border rounded dark:[color-scheme:dark] dark:border-neutral-600 h-[34px] py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[16px]'
            placeholder='Selecionar data da cessão'
            value={formDataCessao.data_cessao}
            onChange={(e) => handleCessaoInputChange(e.target.value, 'data_cessao')}
          />
        </div>

        {/* Escrevente */}
        <div className='dark:text-white text-black flex flex-col gap-1'>
          <label className='text-[14px] font-medium' htmlFor="escrevente_id">Escrevente <span className='text-sm text-red-600 antialiased font-medium'>*</span></label>
          <Select
            options={handleSelectValues(escrevente, 'nome')}
            isClearable={true}
            value={
              formDataCessao.escrevente_id
                ? escrevente.find(esc => esc.id === formDataCessao.escrevente_id)
                  ? { value: formDataCessao.escrevente_id, label: escrevente.find(esc => esc.id === formDataCessao.escrevente_id).nome }
                  : null
                : null
            }
            onChange={(selectedValue) => {
              handleCessaoInputChange(selectedValue ? selectedValue.value : '', 'escrevente_id');
            }}
            name='escrevente_id'
            placeholder={'Selecionar escrevente'}
            noOptionsMessage={() => 'Nenhum escrevente encontrado'}
            unstyled
            classNames={{
              container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
              control: () => ('px-2 mt-[6px] flex items-center'),
              input: () => ('text-gray-400'),
              menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-28'),
              menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-28'),
              option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
            }}
            styles={customStyles}
          />
        </div>

        {/* Requisitório */}
        <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-1 w-full'>
          <FileInput label={'Requisitório'} name={'requisitorio'} formDataCessao={formDataCessao.requisitorio} handleCessaoInputChange={handleCessaoInputChange} />
        </div>
      </div>
    </div>
  )
}