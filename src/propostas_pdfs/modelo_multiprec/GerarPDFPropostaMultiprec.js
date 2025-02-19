import React from 'react';
import logo_multiprec from './assets/images/Logo-Multiprec-White.png'
import bullets from './assets/images/bullets.png'
import html2pdf from 'html2pdf.js'; // Importa a biblioteca html2pdf


const GerarPDFPropostaMultiprec = ({ beneficiario, cpfcnpj, precatorio, processo, proposta, site, cnpj, setHandleGeneratePDF }) => {
  const propostaRef = React.useRef(); // Cria uma referência para o conteúdo do PDF

  // Função para gerar o PDF
  // Função para gerar o PDF
  const handleGeneratePDF = () => {
    const element = propostaRef.current;
    const options = {
      margin: 0,
      filename: 'Proposta_Multiprec.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
  };

  // Passa a função interna para o componente pai
  React.useEffect(() => {
    setHandleGeneratePDF(() => handleGeneratePDF);
  }, [setHandleGeneratePDF]);

  const propostaDetails = {
    beneficiario: beneficiario,
    cpfcnpj: cpfcnpj,
    precatorio: precatorio,
    processo: processo,
    proposta: proposta,
    site: site,
    cnpj: cnpj
  };


  return (
    <div>
      <div ref={propostaRef}>
        <div className="w-[820px] h-[1025px] bg-white relative">
          {/* Header */}
          <div className="w-full px-[40px] pt-[12px] relative h-[80px] bg-[#041f30]">
            <img className="w-[190px]" src={logo_multiprec} alt="Logo Multiprec" />
          </div>

          {/* Section 1 */}
          <div className="mx-[40px] py-[50px]">
            <div className="flex gap-20">
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-[#67A3C8] text-[12px] font-bold">SOBRE A EMPRESA</h2>
                  <div className="flex items-center mt-2">
                    <div className="text-[22px] bg-[#EEEEEE] px-3 py-1 font-bold text-center rounded-md text-[#456E87]">
                      A
                    </div>
                    <div className="ml-2 text-[#041F30] text-[22px] font-bold">Empresa</div>
                  </div>
                  <p className="text-[#999999] text-[13px] font-medium mt-4">Fundada com o objetivo de realizar uma negociação rápida, transparente e segura para os clientes, a Multiprec após enfrentar alguns obstáculos finalmente conseguiu o melhor planejamento operacional e eficiente do mercado.</p>
                </div>
              </div>

              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-[#67A3C8] text-[13px] font-bold">PROPOSTA</h2>
                  <div className="mt-2 w-full">
                    <div className="flex">
                      <div className="w-[110px] bg-[#67A3C8] text-[#EEEEEE] text-[13px] font-bold text-center rounded-tl-md pl-2 pb-2 pt-1">BENEFICIÁRIO</div>
                      <div className="flex-1 bg-[#EEEEEE] text-[#555555] text-[12px] font-bold rounded-tr-md pl-2 pb-2 pt-1">{propostaDetails.beneficiario}</div>
                    </div>
                    <div className="flex">
                      <div className="w-[110px] bg-[#67A3C8] text-[#EEEEEE] text-[13px] font-bold text-center pl-2 pb-2">CPF/CNPJ</div>
                      <div className="flex-1 bg-[#EEEEEE] text-[#555555] text-[12px] font-bold pl-2 pb-2">{propostaDetails.cpfcnpj}</div>
                    </div>
                    <div className="flex">
                      <div className="w-[110px] bg-[#67A3C8] text-[#EEEEEE] text-[13px] font-bold text-center pl-2 pb-2">PRECATÓRIO</div>
                      <div className="flex-1 bg-[#EEEEEE] text-[#555555] text-[12px] font-bold pl-2 pb-2">{propostaDetails.precatorio}</div>
                    </div>
                    <div className="flex">
                      <div className="w-[110px] bg-[#67A3C8] text-[#EEEEEE] text-[13px] font-bold text-center pl-2 pb-2">PROCESSO</div>
                      <div className="flex-1 bg-[#EEEEEE] text-[#555555] text-[12px] font-bold pl-2 pb-2">{propostaDetails.processo}</div>
                    </div>
                    <div className="flex">
                      <div className="w-[110px] bg-[#67A3C8] text-[#EEEEEE] text-[13px] font-bold text-center rounded-bl-md pl-2 pb-1">PROPOSTA</div>
                      <div className=" flex-1 bg-[#EEEEEE] text-[#555555] text-[12px] font-bold rounded-br-md pl-2 pb-1">{propostaDetails.proposta}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="section2 px-[40px] py-[40px] bg-[#F9F9F9] relative">
            <div className="absolute h-[50px] w-[120px] top-[-25px] bg-cover left-[330px] opacity-35 z-0" style={{ backgroundImage: `url(${bullets})` }}></div>
            <div className="absolute w-[110px] h-[10px] top-[155px] left-0 bg-[#daeced]"></div>
            <div className="absolute w-[250px] h-[10px] top-[155px] left-[147px] bg-[#daeced]"></div>
            <div className="absolute w-[250px] h-[10px] top-[155px] left-[430px] bg-[#daeced]"></div>
            <div className="absolute w-[107px] h-[10px] top-[155px] left-[713px] bg-[#daeced]"></div>
            <div className="">
              <h2 className="text-[#67A3C8] text-[12px] font-bold">A NEGOCIAÇÃO NA PRÁTICA</h2>
              <div className="flex items-center mt-2">
                <div className="text-[22px] font-bold text-center rounded-md text-[#456E87] bg-[#EEEEEE] px-3 py-1">Como</div>
                <div className="ml-2 text-[#041F30] text-[22px] font-bold">Funciona?</div>
              </div>
              <div className="flex justify-between mt-10 text-center text-[#041b36]">
                <div>
                  <span className="relative text-[20px] font-bold bg-[#daeced] px-[20px] py-[8px] rounded-full text-[#456E87] "><span className='absolute left-[8.5px] top-[5px]'>01</span></span>
                  <p className="text-[16px] font-bold mt-2">Negociação de Valores</p>
                </div>
                <div>
                  <span className="relative text-[20px] font-bold bg-[#daeced] px-[20px] py-[8px] rounded-full text-[#456E87] "><span className='absolute left-[7px] top-[5px]'>02</span></span>
                  <p className="text-[16px] font-bold mt-2">Análise de Documentação</p>
                </div>
                <div>
                  <span className="relative text-[20px] font-bold bg-[#daeced] px-[20px] py-[8px] rounded-full text-[#456E87] "><span className='absolute left-[7.5px] top-[5px]'>03</span></span>
                  <p className="text-[16px] font-bold mt-2">Cessão do Precatório</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="section3 py-[50px] px-[40px]">
            <div className="">
              <h2 className="text-[#67A3C8] text-[12px] font-bold">A DOCUMENTAÇÃO</h2>
              <div className="flex items-center mt-2">
                <div className="text-[22px] font-bold text-center text-[#456E87] bg-[#EEEEEE] rounded-md px-3 py-1">Qual</div>
                <div className="ml-2 text-[#041F30] text-[22px] font-bold">a documentação?</div>
              </div>
              <div className="grid grid-cols-2 gap-x-16 gap-y-2 mt-4 text-[#041b36]">
                <div className="flex items-center">
                  <div className="bg-[#456E87] w-[8px] h-[3px] mr-2"></div>
                  <span className='text-[15px] text-[#041F30] font-bold'>Documento de Identidade</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>Estado Civil</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>CPF</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>Profissão</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>Comprovante de Residência</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>Conta Bancária para pagamento</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>Certidão de Casamento / Nascimento</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#456E87] w-[8px] h-[3px] mr-2"></span>
                  <span className='text-[15px] text-[#041F30] font-bold'>E-mail</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer bg-[#041f30] flex flex-col justify-center text-center text-[#456E87] py-4 absolute bottom-0 w-full">
            <p className="text-[12px] font-bold">{site}</p>
            <p className="text-[12px] font-bold">{cnpj}</p>
          </div>
        </div>
      </div>
    </div>


  );
};

export default GerarPDFPropostaMultiprec;
