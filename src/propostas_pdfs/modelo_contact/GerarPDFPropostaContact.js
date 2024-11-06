import React from 'react';
import html2pdf from 'html2pdf.js'; // Importa a biblioteca html2pdf
import background from './assets/images/background.png'
import logo from './assets/images/logo.png'

const GerarPDFPropostaContact = ({ beneficiario, cpfcnpj, precatorio, processo, proposta, nome, site, cnpj, onPDFGenerated  }) => {

  const propostaRef = React.useRef(); // Cria uma referência para o conteúdo do PDF

  // Função para gerar o PDF
  React.useEffect(() => {
    const handleGeneratePDF = () => {
      const element = propostaRef.current; // Pega o conteúdo do PDF pela ref
      const options = {
        margin: 0,
        filename: 'Proposta_Contact.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Gera o PDF
      html2pdf().from(element).set(options).save();
      onPDFGenerated()
    };

    handleGeneratePDF(); // Gera o PDF assim que o componente for montado
  }, []);

  const propostaDetails = {
    beneficiario: beneficiario,
    cpfcnpj: cpfcnpj,
    precatorio: precatorio,
    processo: processo,
    proposta: proposta,
    site:site,
    nome: nome,
    cnpj: cnpj
  };

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const monthsArray = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div style={{display: 'nome'}}>
      <div ref={propostaRef} className="bg-white w-[803px] h-[1035px]">
        {/* Cabeçalho */}
        <div className="bg-center bg-cover h-[180px] flex items-center" style={{ backgroundImage: `url(${background})` }}>
          <img className="w-[210px] ml-6 float-left" src={logo} alt="Logo" />
        </div>

        {/* Seção 1: Informações da Proposta */}
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#041b36]">Prezado Sr(a). {propostaDetails.beneficiario}</h1>
            <h2 className="text-2xl font-bold text-[#041b36]">Segue abaixo as informações de nossa proposta:</h2>
          </div>

          <div className="w-full text-[14px]">
            {/* Beneficiário */}
            <div className="flex bg-[#041b36] text-white">
              <div className="pl-2 pb-2 w-[180px]">BENEFICIÁRIO</div>
              <div className="pl-2 pb-2 text-[13px] bg-gray-100 text-gray-600 flex-1">{propostaDetails.beneficiario}</div>
            </div>

            {/* CPF/CNPJ */}
            <div className="flex bg-[#041b36] text-white">
              <div className="pl-2 pb-2 w-[180px]">CPF/CNPJ</div>
              <div className="pl-2 pb-2 text-[13px] bg-gray-100 text-gray-600 flex-1">{propostaDetails.cpfcnpj}</div>
            </div>

            {/* Precatório */}
            <div className="flex bg-[#041b36] text-white">
              <div className="pl-2 pb-2 w-[180px]">PRECATÓRIO</div>
              <div className="pl-2 pb-2 text-[13px] bg-gray-100 text-gray-600 flex-1">{propostaDetails.precatorio}</div>
            </div>

            {/* Processo */}
            <div className="flex bg-[#041b36] text-white">
              <div className="pl-2 pb-2 w-[180px]">PROCESSO</div>
              <div className="pl-2 pb-2 text-[13px] bg-gray-100 text-gray-600 flex-1">{propostaDetails.processo}</div>
            </div>

            {/* Proposta */}
            <div className="flex bg-[#041b36] text-white">
              <div className="pl-2 pb-3 w-[180px]">PROPOSTA</div>
              <div className="pl-2 pb-3 text-[13px] bg-gray-100 text-gray-600 flex-1">{propostaDetails.proposta}</div>
            </div>
          </div>

          <p className="text-gray-600 text-[12px]">
            Observação: O valor oferecido é líquido e o pagamento à vista. Estamos à disposição para quaisquer esclarecimentos e para contraproposta.
          </p>
        </div>

        {/* Seção 2: Passo a Passo */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#041b36] mb-2">Passo a Passo</h2>
          <table className="w-full text-xl">
            <tbody >
              <tr className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <td className="text-2xl font-bold text-[#041b36]">01.</td>
                  <td className=" text-[#45647a] font-bold">Contato com o Cliente</td>
                </div>

                <div className='flex flex-col gap-1'>
                  <td className="text-2xl font-bold text-[#041b36]">02.</td>
                  <td className=" text-[#45647a] font-bold">Envio de Documentos</td>
                </div>

                <div className='flex flex-col gap-1'>
                  <td className="text-2xl font-bold text-[#041b36]">03.</td>
                  <td className=" text-[#45647a] font-bold">Análise do Processo</td>
                </div>

                <div className='flex flex-col gap-1'>
                  <td className="text-2xl font-bold text-[#041b36]">04.</td>
                  <td className=" text-[#45647a] font-bold">Assinatura e Pagamento</td>
                </div>

              </tr>
            </tbody>
          </table>
        </div>

        {/* Seção 3: Documentação Necessária */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#041b36] mb-2">Documentação Necessária</h2>
          <div className="w-full">
            <div className='text-[13px] font-bold text-gray-400 flex'>
              <div className='flex-1'>
                <div className="border-r border-gray-300 p-2 flex items-center">
                  <p className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></p>
                  <p className=''>Documento de Identidade </p>
                </div>

                <div className="border-r border-gray-300 p-2 flex items-center">
                  <p className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></p>
                  <p>CPF/CNPJ</p>
                </div>

                <div className="border-r border-gray-300 p-2 flex items-center">
                  <p className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></p>
                  <p>Comprovante de Residência</p>
                </div>

                <div className="border-r border-gray-300 p-2 flex items-center">
                  <p className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></p>
                  <p>Estado Civil</p>
                </div>



              </div>

              <div className='flex-1'>
                <div className="p-2 flex items-center">
                  <span className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></span>
                  <span className=''>Certidão de Casamento / Nascimento</span>
                </div>



                <div className="p-2 flex items-center">
                  <span className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></span>
                  <span>Profissão</span>
                </div>




                <div className="p-2 flex items-center">
                  <span className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></span>
                  <span>Conta Bancária para pagamento</span>
                </div>



                <div className="p-2 flex items-center">
                  <span className="inline-block bg-[#45647a] w-3 h-3 rounded-full mr-2 mt-3"></span>
                  <span>E-mail</span>
                </div>


              </div>

            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-6">
          <div className="w-full">
            <div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className="font-bold text-[#041b36] text-[24px]">{propostaDetails.nome}</p>
                  <p className="text-gray-400 text-[16px]">Rio de Janeiro, {day} de {monthsArray[month]} de {year}</p>
                </div>
                <div>
                  <p className="text-right text-gray-400 text-[12px]">{propostaDetails.site}</p>
                  <p className="text-right text-gray-400 text-[12px]">{propostaDetails.cnpj}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default GerarPDFPropostaContact;
