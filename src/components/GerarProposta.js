import React from 'react';
import CurrencyFormat from 'react-currency-format';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import placeholder from "../../public/assets/no-logo.png";
import GerarPDFPropostaContact from '../propostas_pdfs/modelo_contact/GerarPDFPropostaContact';
import GerarPDFPropostaMultiprec from '../propostas_pdfs/modelo_multiprec/GerarPDFPropostaMultiprec';
import GerarPDFPropostaPRC from '../propostas_pdfs/modelo_prc/GerarPDFPropostaPRC';
import useAuth from "../hooks/useAuth";
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GerarProposta() {
  const [empresas, setEmpresas] = React.useState([]);
  const [empresa, setEmpresa] = React.useState('');
  const [beneficiario, setBeneficiario] = React.useState('');
  const [cpfcnpj, setCpfCnpj] = React.useState('');
  const [precatorio, setPrecatorio] = React.useState('');
  const [processo, setProcesso] = React.useState('');
  const [proposta, setProposta] = React.useState('');
  const [obs, setObs] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const ulRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [handleGeneratePDF, setHandleGeneratePDF] = React.useState(null);
  // Referência para o componente de PDF
  const pdfRef = React.useRef();
  console.log(auth)

  React.useEffect(() => {
    async function fetchEmpresas() {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get('/empresas');
        setEmpresas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmpresas();
  }, [axiosPrivate]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ulRef.current && !ulRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShow = () => {
    setShow((prevShow) => !prevShow);
  };



  const handleCpfCnpjChange = (event) => {
    let data = event.target.value.replace(/\D/g, "");
    if (data.length > 11) {
      let cnpj = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/` +
        `${data.substr(8, 4)}-${data.substr(12, 2)}`;
      data = cnpj;
    } else {
      let cpf = data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      data = cpf;
    }
    setCpfCnpj(data);
  };

  const handleGerarProposta = async (e) => {
    e.preventDefault();

    if (!empresa) {
      toast.error("Selecione uma empresa antes de gerar a proposta.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    console.log(auth.user.id)
    console.log(empresa.id)
    console.log(beneficiario)
    console.log(cpfcnpj)
    console.log(precatorio)
    console.log(processo)
    console.log(proposta)

    try {
      await axiosPrivate.post(
        '/propostasLogs',
        { usuario_id: String(auth.user.id),
          empresa_id: String(empresa.id),
          beneficiario: beneficiario,
          cpfcnpj: cpfcnpj,
          precatorio: precatorio,
          processo: processo,
          proposta: proposta 
         },
      );

      if (handleGeneratePDF) {
        handleGeneratePDF(); // Chama a função recebida do componente filho
      }

      toast.success("Proposta gerada com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });

    } catch (e) {
      toast.error(`Error ao gerar proposta: ${e}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });

    }


  };


  const renderEmpresaComponent = () => {
    if (!empresa) return <p className="text-gray-400">Selecione uma empresa para visualizar a proposta.</p>;
    console.log(empresa)
    switch (empresa.id) {
      case 1:
        return (
          <GerarPDFPropostaContact
            beneficiario={beneficiario}
            cpfcnpj={cpfcnpj}
            precatorio={precatorio}
            processo={processo}
            proposta={proposta}
            nome={auth.user.nome}
            site={empresa.site}
            cnpj={empresa.cnpj}
            setHandleGeneratePDF={setHandleGeneratePDF}
          />
        );
      case 2:
        return (
          <GerarPDFPropostaPRC
            beneficiario={beneficiario}
            cpfcnpj={cpfcnpj}
            precatorio={precatorio}
            processo={processo}
            proposta={proposta}
            nome={auth.user.nome}
            site={empresa.site}
            cnpj={empresa.cnpj}
            setHandleGeneratePDF={setHandleGeneratePDF}
          />
        );
      case 3:
        return (
          <GerarPDFPropostaMultiprec
            beneficiario={beneficiario}
            cpfcnpj={cpfcnpj}
            precatorio={precatorio}
            processo={processo}
            proposta={proposta}
            cnpj={empresa.cnpj}
            site={empresa.site}
            setHandleGeneratePDF={setHandleGeneratePDF}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] lg:justify-center  container mx-auto lg:relative">
      {/* Formulário à esquerda */}
      <form className='w-full'>
        {isLoading ? (
          <div className='w-full flex h-[550px] justify-center items-center'>
            <div className='w-10 h-10'>
              <LoadingSpinner />
            </div>
          </div>) : (
          <div className=''>
            <ToastContainer />
            <div className='flex flex-col gap-2 lg:gap-2 xl:px-4 lg:fixed lg:top-[7%] lg:w-[350px] border-r-[1px] border-neutral-600 px-3 '>
              <div className='dark:text-white text-black flex flex-col gap-1'>
                <label className='text-[14px] font-medium' htmlFor="nome">Empresa</label>
                <div ref={ulRef} onClick={handleShow} className='dark:bg-neutral-800 border rounded dark:border-neutral-600 text-gray-400 relative'>
                  <div className='flex items-center justify-between'>
                    {empresa ? (
                      <div className="flex w-full hover:dark:bg-neutral-700 hover:cursor-pointer">
                        <div className="border-r dark:border-neutral-700 pr-2 my-3 flex items-center justify-center w-[100px] sm:w-[140px] lg:w-[180px]">
                          <img src={empresa.photoUrl ? empresa.photoUrl : placeholder} className='h-[40px]'></img>
                        </div>
                        <div className="flex grow justify-between items-center text-[12px] pl-2">
                          <div className="flex grow flex-col justify-center text-[12px] pl-2">
                            <span className="font-bold dark:text-white">{empresa.nome}</span>
                            <span className="text-neutral-400 font-medium line-clamp-1 dark:text-neutral-300">{empresa.cnpj}</span>
                          </div>
                          <button onClick={() => setEmpresa('')} className='mr-4 hover:text-blue-400'>X</button>
                        </div>
                      </div>
                    ) : (
                      <div className='text-[14px] lg:text-[16px] px-2 py-1 flex justify-between items-center w-full cursor-pointer'>
                        <span>Selecione uma empresa</span>
                        <span className='text-[12px] dark:text-neutral-300'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className='w-3 h-3 inline-block'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={show ? 'absolute block dark:bg-neutral-800 bg-white shadow w-full h-[160px] z-50 left-0 mt-1 overflow-scroll rounded' : 'hidden'}>
                    {empresas && !isLoading ? (
                      <ul className='flex flex-col gap-2'>
                        {empresas.slice(0, 3).map((empresa) => (
                          <li key={empresa.id} onClick={() => setEmpresa(empresa)} className='dark:text-white'>
                            <div className="flex w-full hover:dark:bg-neutral-700 hover:bg-neutral-100 hover:cursor-pointer">
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
              <div className='dark:text-white text-black flex flex-col gap-1'>
                <label className='text-[14px] font-medium' htmlFor="beneficiario">Beneficiário</label>
                <input
                  className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[14px] lg:text-[16px]'
                  name={'beneficiario'}
                  placeholder='Nome do Beneficiário'
                  value={beneficiario}
                  onChange={(e) => setBeneficiario(e.target.value)}
                />
              </div>

              {/* CPF/CNPJ */}
              <div className='dark:text-white text-black flex flex-col gap-1'>
                <label className='text-[14px] font-medium' htmlFor="cpfcnpj">CPF/CNPJ</label>
                <input
                  className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[14px] lg:text-[16px]'
                  name='cpfcnpj'
                  value={cpfcnpj}
                  onChange={(value) => handleCpfCnpjChange(value)}
                />
              </div>

              {/* Precatório */}
              <div className='dark:text-white text-black flex flex-col gap-1'>
                <label className='text-[14px] font-medium' htmlFor="precatorio">Precatório</label>
                <CurrencyFormat
                  className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[14px] lg:text-[16px]'
                  placeholder={'Número do Precatório'}
                  name={'precatorio'}
                  format={'####.#####-#'}
                  value={precatorio}
                  required={true}
                  onValueChange={(values) => setPrecatorio(values.formattedValue)}
                />
              </div>

              {/* Processo */}
              <div className='dark:text-white text-black flex flex-col gap-1'>
                <label className='text-[14px] font-medium' htmlFor="processo">Processo</label>
                <CurrencyFormat
                  className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[14px] lg:text-[16px]'
                  placeholder={'Número do Processo'}
                  format={'#######-##.####.#.##.####'}
                  name={'processo'}
                  value={processo}
                  onValueChange={(values) => setProcesso(values.formattedValue)}
                />
              </div>

              {/* Proposta */}
              <div className='dark:text-white text-black flex flex-col gap-1'>
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
                  className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 h-[34px] focus:outline-none placeholder:text-[14px] text-gray-400 text-[14px] lg:text-[16px] '
                  onValueChange={(values) => setProposta(values.formattedValue)}
                />
              </div>

              <button onClick={(e) => handleGerarProposta(e)} type="submit" className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>Gerar Proposta</button>
            </div>
          </div>
        )}


      </form>

      {/* Componente relacionado à empresa à direita */}
      <div className="w-full flex justify-center px-4">
        {renderEmpresaComponent()}
      </div>
    </div>
  );
}

export default GerarProposta;
