import React from 'react';
import seta from './assets/images/3-1.png';
import bg from './assets/images/bg.jpg';
import comentarios from './assets/images/comentarios.png';
import logo_prc_amarelo from './assets/images/logo-prc-amarelo.png';
import logo_prc from './assets/images/logo-prc.png';
import pesquisar from './assets/images/pesquisar-alt.png';
import quadro_branco from './assets/images/quadro-branco.png';
import saco_de_dolar from './assets/images/saco-de-dolar.png';
import texto from './assets/images/texto.png';
import html2pdf from 'html2pdf.js'; // Importa a biblioteca html2pdf

const GerarPDFPropostaPRC = ({ beneficiario, cpfcnpj, precatorio, processo, proposta, nome, data, cnpj, onPDFGenerated }) => {
  const propostaRef = React.useRef(); // Cria uma referência para o conteúdo do PDF

  // Função para gerar o PDF
  React.useEffect(() => {
    const handleGeneratePDF = () => {
      const element = propostaRef.current; // Pega o conteúdo do PDF pela ref
      const options = {
        margin: 0,
        filename: 'Proposta_PRC.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
    <div style={{display:'none'}}>
      <div ref={propostaRef}>
        <div className="w-[820px] h-[1035px] bg-white">
          {/* Header */}
          <div className="header w-full relative h-[200px] bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bg})`, backgroundPosition: '0px -150px' }}>
            <img className="w-[120px] ml-9 pt-5" src={logo_prc} alt="Logo" />
            <img className="w-[200px] right-32 top-10 absolute z-10" src={quadro_branco} alt="Quadro Branco" />
            <img className="w-[40px] absolute right-[292px] top-9 z-20" src={seta} alt="Seta" />
            <img className="w-[160px] right-[140px] top-[50px]  absolute z-20" src={texto} alt="Texto Quadro" />
          </div>

          {/* Section 1 */}
          <div className="w-full mt-4 py-[20px]">
            <div className="flex mx-[30px] items-start">
              <div className="text-left flex-1">
                <p className="text-[13px] font-light text-gray-500 mb-4">PROPOSTA</p>
                <div className="text-[14px] font-bold text-gray-900">BENEFICIÁRIO</div>
                <div className="text-[13px] text-gray-500">{propostaDetails.beneficiario}</div>
                <div className="text-[14px] font-bold text-gray-900">CPF/CNPJ</div>
                <div className="text-[13px] text-gray-500">{propostaDetails.cpfcnpj}</div>
                <div className="text-[14px] font-bold text-gray-900">PRECATÓRIO</div>
                <div className="text-[13px] text-gray-500">{propostaDetails.precatorio}</div>
                <div className="text-[14px] font-bold text-gray-900">PROCESSO</div>
                <div className="text-[13px] text-gray-500">{propostaDetails.processo}</div>
                <div className="text-[14px] font-bold text-gray-900">PROPOSTA</div>
                <div className="text-[13px] text-gray-500">{propostaDetails.proposta}</div>
              </div>



              <div className="text-left flex-1">
                <p className="text-[13px] font-light text-gray-500 mb-4">A EMPRESA</p>
                <div className="text-[15px] font-bold text-gray-900">UM POUCO SOBRE NÓS?</div>
                <p className="text-[12px] font-light text-gray-500 mt-4">Fundada com o objetivo de realizar uma negociação rápida, transparente e segura para os clientes, a PRC Invest, após enfrentar alguns obstáculos, finalmente conseguiu o melhor planejamento operacional e eficiente do mercado.</p>
              </div>

            </div>
          </div>

          {/* Section 2 */}
          <div className="section2 bg-gray-100 py-[20px]">
            <div className="mx-[30px]">
              <p className="text-[13px] font-light text-gray-500 mb-4">A EMPRESA</p>
              <div className="text-[15px] font-bold text-gray-900">COMO NEGOCIAR?</div>
              <div className="flex justify-between mt-6">
                <div className="text-center">
                  <img className="opacity-60 w-[30px] mx-auto" src={comentarios} alt="Negociação" />
                  <p className="text-[14px] font-bold text-gray-900 mt-4">Negociação de Valores</p>
                </div>
                <div className="text-center">
                  <img className="opacity-60 w-[30px] mx-auto" src={pesquisar} alt="Análise" />
                  <p className="text-[14px] font-bold text-gray-900 mt-4">Análise da Documentação</p>
                </div>
                <div className="text-center">
                  <img className="opacity-60 w-[30px] mx-auto" src={saco_de_dolar} alt="Cessão" />
                  <p className="text-[14px] font-bold text-gray-900 mt-4">Cessão do Precatório</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="section3 py-[20px]">
            <div className="mx-[30px]">
              <p className="text-[13px] font-light text-gray-500 mb-4">A DOCUMENTAÇÃO</p>
              <div className="text-[14px] font-bold text-gray-900">QUAIS DOCUMENTOS PRECISO?</div>
              <div className="flex flex-wrap mt-4">
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">Documento de Identidade</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">Estado Civil</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">CPF</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">Profissão</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">Comprovante de Residência</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">Conta Bancária para pagamento</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">Certidão de Casamento / Nascimento</span>
                </div>
                <div className="w-1/2 p-1">
                  <img className="inline-block w-[15px] mt-4" src={seta} alt="Ícone" />
                  <span className="text-[14px] font-bold text-gray-900 ml-4">E-mail</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-[20px] mx-[30px]">
            <div className="flex justify-between items-center">
              <div className="">
                <div className="text-left">
                  <p className="text-[18px] font-bold text-gray-900">{nome}</p>
                  <p className="text-[14px] text-gray-500">Rio de Janeiro, {day} de {monthsArray[month]} de {year}</p>
                </div>
              </div>

              <div className="">
                <div className="text-right">
                  <p className="text-[12px] text-gray-500">www.prcinvest.com.br</p>
                  <p className="text-[12px] text-gray-500">43.067.184/0001-10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default GerarPDFPropostaPRC;
