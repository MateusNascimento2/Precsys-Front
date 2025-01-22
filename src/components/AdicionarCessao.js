import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Select from 'react-select';
import CurrencyFormat from 'react-currency-format';

const AdicionarCessao = forwardRef(({ varas, orcamentos, orcamentosAnos, naturezas, empresas, users, teles, escreventes, juridicos, enviarValores }, ref) => {
  const [precatorio, setPrecatorio] = useState('');
  const [processo, setProcesso] = useState('');
  const [cedente, setCedente] = useState('');
  const [vara, setVara] = useState(null);
  const [ente, setEnte] = useState(null);
  const [ano, setAno] = useState('');
  const [filteredAnos, setFilteredAnos] = useState([]); // Anos filtrados
  const [natureza, setNatureza] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [dataCessao, setDataCessao] = useState('');
  const [repComercial, setRepComercial] = useState(null);
  const [escrevente, setEscrevente] = useState(null);
  const [juridico, setJuridico] = useState(null);
  const [requisitorio, setRequisitorio] = useState(null);
  const [escritura, setEscritura] = useState(null);

  const [precatorioError, setPrecatorioError] = useState(false);
  const [processoError, setProcessoError] = useState(false);

  useEffect(() => {
    if (ente) {
      const anos = orcamentosAnos
        .filter((item) => parseInt(item.budget_id) === ente)
        .map((item) => ({ value: item.ano, label: item.ano }));
      setFilteredAnos(anos);
    } else {
      setFilteredAnos([]); // Limpa os anos se nenhum ente for selecionado
    }
  }, [ente]);

  useEffect(() => {
    const timer = setTimeout(() => {
      enviarValores({ precatorio, processo, cedente, vara, ente, ano, natureza, empresa, dataCessao, repComercial, escrevente, juridico, requisitorio, escritura });
    }, 100);
    return () => clearTimeout(timer);
  }, [precatorio, processo, cedente, vara, ente, ano, natureza, empresa, dataCessao, repComercial, escrevente, juridico, requisitorio, escritura]);

  teles.forEach(tele => {
    users.forEach(user => {
      if (String(tele.usuario_id) === String(user.id)) {
        tele.value = parseInt(user.id);
        tele.label = user.nome;
      }
    });
  });

  const handleSelectValues = (array, value) => {
    return array.map(item => ({
      value: item.id,
      label: item[value]
    }));
  };

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 21
    })
  };

  useImperativeHandle(ref, () => ({
    resetForm() {
      setPrecatorio('');
      setProcesso('');
      setCedente('');
      setVara(null);
      setEnte(null);
      setAno('');
      setNatureza(null);
      setEmpresa(null);
      setDataCessao('');
      setRepComercial(null);
      setEscrevente(null);
      setJuridico(null);
      setRequisitorio(null);
      setEscritura(null);
      setPrecatorioError(false);
      setProcessoError(false);
    }
  }));

  return (
    <form className='mt-[20px]'>
      <div className='px-3'>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
          {/* Precatório */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="precatorio">Precatório</label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              placeholder={'Número do precatório'}
              name={'precatorio'}
              format={'####.#####-#'}
              value={precatorio}
              required={true}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setPrecatorio(formattedValue);
                value.length < 10 ? setPrecatorioError(true) : setPrecatorioError(false);
              }}
            />
            {precatorioError && <p className='text-red-600 text-[11px]'>Número do precatório inválido</p>}
          </div>

          {/* Processo */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="processo">Processo</label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              placeholder={'Número do processo'}
              format={'#######-##.####.#.##.####'}
              name={'processo'}
              value={processo}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setProcesso(formattedValue);
                value.length < 20 ? setProcessoError(true) : setProcessoError(false);
              }}
            />
            {processoError && <p className='text-red-600 text-[11px]'>Número do processo inválido</p>}
          </div>

          {/* Cedente */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="cedente">Cedente</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              placeholder='Nome do cedente'
              name='cedente'
              value={cedente}
              onChange={(e) => setCedente(e.target.value)}
            />
          </div>

          {/* Vara */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="vara">Vara</label>
            <Select
              placeholder={'Selecionar vara'}
              options={handleSelectValues(varas, 'nome')}
              isClearable={true}
              value={vara ? { value: vara, label: varas.find(v => v.id === vara)?.nome } : null}
              onChange={(selectedValue) => setVara(selectedValue ? selectedValue.value : null)}
              name='vara'
              noOptionsMessage={() => 'Nenhuma vara encontrada'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          {/* Orçamento */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="orcamento">Orçamento</label>
            <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row'>
              <Select
                options={handleSelectValues(orcamentos, 'ente')}
                isClearable={true}
                value={ente ? { value: ente, label: orcamentos.find(o => o.id === ente)?.ente } : null}
                onChange={(selectedValue) => setEnte(selectedValue ? selectedValue.value : null)}
                name='ente'
                placeholder={'Selecionar ente'}
                noOptionsMessage={() => 'Nenhum ente encontrado'}
                unstyled
                classNames={{
                  container: () => ('border-l border-t border-b border-r rounded-l dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 w-full lg:w-[70%] text-[15px] h-[34px]'),
                  control: () => ('px-2 mt-[6px] flex items-center'),
                  input: () => ('text-gray-400'),
                  menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                  menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                  option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                }}
                styles={customStyles}
              />
              <Select
                options={filteredAnos}
                isClearable={true}
                value={ano ? { value: ano, label: ano } : null}
                onChange={(selectedValue) => setAno(selectedValue ? selectedValue.value : null)}
                placeholder={'Ano'}
                noOptionsMessage={() => 'Nenhum ano disponível'}
                unstyled
                classNames={{
                  container: () => ('dark:bg-neutral-800 border-l lg:border-l-0 border-r border-t border-b rounded-r dark:border-neutral-600 px-2 w-full lg:w-[30%] focus:outline-none text-[15px] text-gray-400'),
                  control: () => ('px-2 mt-[6px] flex items-center'),
                  input: () => ('text-gray-400'),
                  menu: () => ('mt-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                  menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                  option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
                }}
                styles={customStyles}
                isDisabled={filteredAnos.length === 0} // Desativa o Select se não houver anos disponíveis
              />
            </div>
          </div>

          {/* Natureza */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="natureza">Natureza</label>
            <Select
              options={handleSelectValues(naturezas, 'nome')}
              isClearable={true}
              value={natureza ? { value: natureza, label: naturezas.find(n => n.id === natureza)?.nome } : null}
              onChange={(selectedValue) => setNatureza(selectedValue ? selectedValue.value : null)}
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

          {/* Empresa */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="empresa">Empresa</label>
            <Select
              menuPlacement='top'
              options={handleSelectValues(empresas, 'nome')}
              isClearable={true}
              value={empresa ? { value: empresa, label: empresas.find(e => e.id === empresa)?.nome } : null}
              onChange={(selectedValue) => setEmpresa(selectedValue ? selectedValue.value : null)}
              name='empresa'
              placeholder={'Selecionar empresa'}
              noOptionsMessage={() => 'Nenhuma empresa encontrada'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          {/* Data da Cessão */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="dataCessao">Data da Cessão</label>
            <input
              type='date'
              name='dataCessao'
              id='dataCessao'
              className='dark:bg-neutral-800 border rounded dark:[color-scheme:dark] dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              placeholder='Selecionar data da cessão'
              value={dataCessao}
              onChange={(e) => setDataCessao(e.target.value)}
            />
          </div>

          {/* Rep. Comercial */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="repComercial">Rep. Comercial</label>
            <Select
              menuPlacement='top'
              options={teles}
              isClearable={true}
              value={repComercial ? { value: repComercial, label: teles.find(t => t.value === repComercial)?.label } : null}
              onChange={(selectedValue) => setRepComercial(selectedValue ? selectedValue.value : null)}
              name='repComercial'
              placeholder={'Selecionar rep. comercial'}
              noOptionsMessage={() => 'Nenhum rep. comercial encontrado'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          {/* Escrevente */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="escrevente">Escrevente</label>
            <Select
              menuPlacement='top'
              options={handleSelectValues(escreventes, 'nome')}
              isClearable={true}
              value={escrevente ? { value: escrevente, label: escreventes.find(e => e.id === escrevente)?.nome } : null}
              onChange={(selectedValue) => setEscrevente(selectedValue ? selectedValue.value : null)}
              name='escrevente'
              placeholder={'Selecionar escrevente'}
              noOptionsMessage={() => 'Nenhum escrevente encontrado'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          {/* Jurídicos */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="juridico">Jurídicos</label>
            <Select
              options={handleSelectValues(juridicos, 'nome')}
              isClearable={true}
              value={juridico ? { value: juridico, label: juridicos.find(j => j.id === juridico)?.nome } : null}
              onChange={(selectedValue) => setJuridico(selectedValue ? selectedValue.value : null)}
              name='juridico'
              placeholder={"Selecionar jurídico"}
              noOptionsMessage={() => 'Nenhum jurídico encontrado'}
              unstyled
              classNames={{
                container: () => ('border rounded dark:bg-neutral-800 dark:border-neutral-600 text-gray-400 text-[15px] h-[34px]'),
                control: () => ('px-2 mt-[6px] flex items-center'),
                input: () => ('text-gray-400'),
                menu: () => ('mb-1 bg-white border shadow rounded dark:border-neutral-600 dark:bg-neutral-800 w-full max-h-24'),
                menuList: () => ('flex flex-col gap-2 px-2 py-1 text-[13px] h-24'),
                option: () => ('hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-1')
              }}
              styles={customStyles}
            />
          </div>

          {/* Requisitório */}
          <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2 w-full'>
            <span className='text-[14px] font-medium'>Requisitório</span>
            <label htmlFor="requisitorio" className='w-full'>
              <span className='text-[15px] p-2 border rounded dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400 block'>Selecione um arquivo</span>
              <input
                name='requisitorio'
                id='requisitorio'
                type='file'
                className='hidden'
                onChange={(e) => setRequisitorio(e.target.files[0])}
              />
              {requisitorio ? <p className='text-[12px] italic text-neutral-600 mt-2'>Arquivo selecionado: {requisitorio.name}</p> : null}
            </label>
          </div>

          {/* Escritura */}
          <div className='dark:text-white text-black flex flex-col justify-center md:items-start gap-2 py-2 px-2 w-full'>
            <span className='text-[14px] font-medium'>Escritura</span>
            <label htmlFor="escritura" className='w-full'>
              <span className='text-[15px] p-2 border rounded dark:border-neutral-600 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400 block'>Selecione um arquivo</span>
              <input
                name='escritura'
                id='escritura'
                type='file'
                className='hidden'
                onChange={(e) => setEscritura(e.target.files[0])}
              />
              {escritura ? <p className='text-[12px] italic text-neutral-600 mt-2'>Arquivo selecionado: {escritura.name}</p> : null}
            </label>
          </div>
        </div>
      </div>
    </form>
  );
});

export default AdicionarCessao;
