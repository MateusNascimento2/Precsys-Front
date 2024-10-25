import React from 'react'
import CurrencyFormat from 'react-currency-format';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import placeholder from "../../public/assets/no-logo.png";
import GerarPDFPropostaContact from '../propostas_pdfs/modelo_contact/GerarPDFPropostaContact';


function GerarProposta() {
  const [empresas, setEmpresas] = React.useState()
  const [empresa, setEmpresa] = React.useState()
  const [beneficiario, setBeneficiario] = React.useState()
  const [cpfcnpj, setCpfCnpj] = React.useState()
  const [precatorio, setPrecatorio] = React.useState()
  const [processo, setProcesso] = React.useState()
  const [proposta, setProposta] = React.useState()
  const [obs, setObs] = React.useState()
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [gerarPDF, setGerarPDF] = React.useState(false);


  React.useEffect(() => {
    async function fetchEmpresas() {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get('/empresas')
        console.log(data)
        setEmpresas(data)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmpresas()

  }, [])

  const handleShow = () => {
    setShow((prevShow) => !prevShow)
  }

  const handleCpfCnpjChange = (event) => {
    let data = event.target.value.replace(/\D/g, "");
    if (data.length > 11) {
      let cnpj = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/`;
      if (data.length > 12) {
        cnpj += `${data.substr(8, 4)}-${data.substr(12, 2)}`;
      } else {
        cnpj += data.substr(8);
      }
      data = cnpj;
    } else {
      let cpf = "";
      let parts = Math.ceil(data.length / 3);
      for (let i = 0; i < parts; i++) {
        if (i === 3) {
          cpf += `-${data.substr(i * 3)}`;
          break;
        }
        cpf += `${i !== 0 ? "." : ""}${data.substr(i * 3, 3)}`;
      }
      data = cpf;
    }
    setCpfCnpj(data);
  };

  const handleGerarProposta = () => {
    setGerarPDF(true); // Dispara a geração do PDF
  };

  return (
    <form className='mt-[20px] mx-[100px]'>
      <div className='px-3'>
        <div className='grid grid-cols-1 w-full'>
          {/* Empresa */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="nome">Empresa</label>
            <div onClick={handleShow} className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 text-gray-400 relative'>
              <div className='flex items-center justify-between'>
                <span>Selecione uma empresa</span>
                <span className='text-[12px] dark:text-neutral-300'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className='w-3 h-3 inline-block'>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </div>
              <div className={show ? 'absolute block dark:bg-neutral-800 w-full h-[160px] z-50 left-0 top-[35px] overflow-scroll rounded' : 'hidden'}>
                {empresas && !isLoading ? (
                  <ul className='flex flex-col gap-2'>
                    {empresas.map((empresa) => (
                      <li key={empresa.id} className='dark:text-white'>
                        <div className="flex w-full hover:dark:bg-neutral-700 hover:cursor-pointer">
                          <div className="border-r dark:border-neutral-700 pr-2 my-3 flex items-center justify-center w-[100px] sm:w-[140px] lg:w-[180px]">
                            <img src={empresa.photoUrl ? empresa.photoUrl : placeholder} className='h-[40px]'></img>
                          </div>
                          <div className="flex grow flex-col justify-center text-[12px] pl-2">

                            <span className="font-bold dark:text-white">{empresa.nome}</span>

                            <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{empresa.cnpj}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}


              </div>

            </div>
          </div>

          {/* Beneficiário */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="beneficiario">Beneficiário</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              name={'beneficiario'}
              placeholder='Nome do Beneficiário'
              value={beneficiario}
              onChange={(e) => {
                setBeneficiario(e.target.value);
              }}
            />
          </div>

          {/* CPF/CNPJ */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="cpfcnpj">CPF/CNPJ</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              name='cpfcnpj'
              value={cpfcnpj}
              onChange={(value) => handleCpfCnpjChange(value)}
            />
          </div>

          {/* Precatório */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="precatorio">Precatório</label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              placeholder={'Número do Precatório'}
              name={'precatorio'}
              format={'####.#####-#'}
              value={precatorio}
              required={true}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setPrecatorio(formattedValue);
              }}
            />
          </div>

          {/* Processo */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="processo">Processo</label>
            <CurrencyFormat
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              placeholder={'Número do Processo'}
              format={'#######-##.####.#.##.####'}
              name={'processo'}
              value={processo}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setProcesso(formattedValue);
              }}
            />
          </div>

          {/* Proposta */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="proposta">Proposta</label>
            <CurrencyFormat
              name={'proposta'}
              placeholder={'Valor da Proposta'}
              value={proposta}
              thousandSeparator={'.'}
              decimalSeparator={','}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'R$ '}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px]'
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setProposta(formattedValue)
              }}
            />
          </div>

          {/* Obs */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2'>
            <label className='text-[14px] font-medium' htmlFor="obs">Obs</label>
            <textarea
              rows={12}
              cols={6}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] h-[110px]'
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              name='obs'
            />
          </div>

          <button onClick={handleGerarProposta} type="submit" className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>Gerar Proposta</button>
        </div>
      </div>
      {/* Renderiza o componente GerarPDFPropostaContact apenas quando gerarPDF for true */}
      {gerarPDF && (
        <GerarPDFPropostaContact
          beneficiario="João da Silva"
          cpfcnpj="123.456.789-10"
          precatorio="0000.00000-0"
          processo="1234567-89.2024.1.10.0000"
          proposta="R$ 100.000,00"
          nome="Contact Negócios"
          data="22 de Outubro de 2024"
          cnpj="29.945.934/0001-88"
          logo="/assets/images/logo.png"
          onPDFGenerated={() => setGerarPDF(false)} // Oculta o componente após o PDF ser gerado
        />
      )}
    </form>
  )
}

export default GerarProposta