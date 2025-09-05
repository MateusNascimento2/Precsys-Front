import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import CurrencyFormat from "react-currency-format";

export default function TabelaCalculoLiquido() {
  const pdfContentRef = React.useRef(null); // Referência para o conteúdo do PDF

  const [precatorio, setPrecatorio] = useState("");
  const [valorPagoCedente, setValorPagoCedente] = useState({
    valorFormatado: "R$ 0,00",
    valorSemFormatacao: 0.0,
  });
  const [valorRequisitorio, setValorRequisitorio] = useState({
    valorFormatado: "R$ 0,00",
    valorSemFormatacao: 0.0,
  });
  const [valorAtualizado, setValorAtualizado] = useState({
    valorFormatado: "R$ 0,00",
    valorSemFormatacao: 0.0,
  });
  const [percentual, setPercentual] = useState({
    valorFormatado: "0,00 %",
    valorSemFormatacao: 0.0,
  });
  const [comissao, setComissao] = useState({
    valorFormatado: "R$ 0,00",
    valorSemFormatacao: 0.0,
  });

  const [custoEscritura, setCustoEscritura] = useState(0);
  const [custoGRERJ, setCustoGRERJ] = useState(0);
  const [custoConsultor, setCustoConsultor] = useState(0);
  const [imposto, setImposto] = useState(0);
  const [custoAdministrativo, setCustoAdministrativo] = useState(0);
  const [valorLiquido, setValorLiquido] = useState(0);
  const [isConsultar, setIsConsultar] = useState(false);
  const [showTabelaCalculoLiquido, setShowTabelaCalculoLiquido] = useState(false)

  // Função para exportar para PDF usando useRef
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Configuração inicial
    const pageHeight = doc.internal.pageSize.height; // Altura da página do PDF
    let currentY = 20; // Posição inicial no eixo Y

    // Função para adicionar uma tabela
    const addTable = (columns, rows) => {
      doc.autoTable({
        startY: currentY,
        head: [columns],
        body: rows,
        margin: { top: 10 },
        theme: "grid",
        headStyles: {
          fillColor: null, // Fundo transparente
          textColor: [0, 0, 0],
          // Remove todas as bordas padrão
        },
        columnStyles: {
          0: { cellWidth: 90 }, // Define largura para a 1ª coluna
          1: { cellWidth: 90 }, // Define largura para a 2ª coluna
        },

        tableWidth: "wrap", // Ajusta a tabela para o conteúdo
      });
      currentY = doc.lastAutoTable.finalY + 20; // Atualizar posição Y
    };

    // Seção 1: Cálculo Inicial
    addTable(
      ["", ""],
      [
        ["Precatório", precatorio || "-"],
        ["Valor Pago ao Cedente", valorPagoCedente.valorFormatado || "-"],
        ["Valor do Requisitório", valorRequisitorio.valorFormatado || "-"],
        ["Valor Atualizado", valorAtualizado.valorFormatado || "-"],
        ["Percentual de Compra", percentual.valorFormatado || "-"],
        ["Comissão", comissao.valorFormatado || "-"],
      ]
    );

    // Seção 2: Início do Período da Graça
    addTable(
      ["Calculo Líquido", ""],
      [
        ["Comissão", comissao.valorFormatado || "-"],
        ["Custo da Escritura", `- ${custoEscritura}` || "-"],
        ["Custo da GRERJ", `- ${custoGRERJ}` || "-"],
        ["Custo do Consultor", `- ${custoConsultor}` || "-"],
        ["Imposto (16% sobre comissão)", `- ${imposto}` || "-"],
        ["Custo administrativo fixo", `- ${custoAdministrativo}` || "-"],
        ["Valor Líquido", valorLiquido || "-"],
      ]
    );

    // Salvando o PDF
    doc.save(`calculo_liquido-${precatorio}.pdf`);
  };

  const formatCurrency = (value) => {
    // Remove tudo que não seja número
    let numericValue = value.replace(/\D/g, "");

    // Se o valor for vazio ou apenas "0", define como "0,00"
    if (!numericValue)
      return { valorFormatado: "R$ 0,00", valorSemFormatacao: "0.00" };

    // Garante que sempre teremos pelo menos 3 dígitos
    while (numericValue.length < 3) {
      numericValue = "0" + numericValue;
    }

    // Centavos: últimos 2 dígitos
    const centavos = numericValue.slice(-2);

    // Inteiros: o restante
    let inteiros = numericValue.slice(0, -2);
    inteiros = parseInt(inteiros, 10).toString(); // remove zeros à esquerda

    // Formata com pontos de milhar
    const inteirosFormatados = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Valor formatado para exibição
    const valorFormatado = `R$ ${inteirosFormatados},${centavos}`;

    // Valor sem formatação, com ponto decimal
    const valorSemFormatacao = Number(
      `${inteiros}${centavos}`
        .replace(/^0+/, "")
        .replace(/(\d+)(\d{2})$/, "$1.$2")
    );

    return {
      valorFormatado,
      valorSemFormatacao,
    };
  };

  const formatCurrencyPercentual = (e, value) => {
    // Remove tudo que não seja número
    let numericValue = (value ?? "").replace(/\D/g, "");

    // Se vazio, já padroniza
    if (!numericValue) {
      const formattedValue = "0,00%";
      // Posiciona o cursor antes do '%'
      setTimeout(() => {
        const input = e.target;
        input.setSelectionRange(
          formattedValue.length - 1,
          formattedValue.length - 1
        );
      }, 0);
      return { valorFormatado: formattedValue, valorSemFormatacao: 0 };
    }

    // Garante pelo menos 3 dígitos
    while (numericValue.length < 3) {
      numericValue = "0" + numericValue;
    }

    const centavos = numericValue.slice(-2);
    let inteiros = numericValue.slice(0, -2);
    inteiros = parseInt(inteiros, 10).toString();

    const inteirosFormatados = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const formattedValue = `${inteirosFormatados},${centavos}%`;

    // Ajusta o cursor (antes do '%')
    setTimeout(() => {
      const input = e.target;
      input.setSelectionRange(
        formattedValue.length - 1,
        formattedValue.length - 1
      );
    }, 0);

    // Converte para número com ponto decimal
    const valorSemFormatacao = Number(
      `${inteiros}${centavos}`
        .replace(/^0+/, "")
        .replace(/(\d+)(\d{2})$/, "$1.$2")
    );

    return { valorFormatado: formattedValue, valorSemFormatacao };
  };

  const fazerCalculoLiquido = (e) => {
    e.preventDefault();

    const calcularCustoEscritura = () => {
      const valorPercentual = percentual.valorSemFormatacao / 100

      if (valorPagoCedente.valorSemFormatacao > valorRequisitorio.valorSemFormatacao * valorPercentual) {

        if (valorPagoCedente.valorSemFormatacao <= 49903.08) {
          return 1390.19
        } else if (valorPagoCedente.valorSemFormatacao <= 66537.45) {
          return 1577.26
        } else if (valorPagoCedente.valorSemFormatacao <= 88716.59) {
          return 2360.09
        } else if (valorPagoCedente.valorSemFormatacao <= 110895.75) {
          return 2684.40
        } else if (valorPagoCedente.valorSemFormatacao <= 221791.51) {
          return 3432.82
        } else if (valorPagoCedente.valorSemFormatacao <= 443583.03) {
          return 3642.32
        } else if (valorPagoCedente.valorSemFormatacao <= 554478.78) {
          return 3914.98
        } else if (valorPagoCedente.valorSemFormatacao <= 665374.53) {
          return 4187.64
        } else if (valorPagoCedente.valorSemFormatacao <= 776270.28) {
          return 4460.27
        } else if (valorPagoCedente.valorSemFormatacao <= 887166.03) {
          return 4732.93
        } else if (valorPagoCedente.valorSemFormatacao <= 998061.78) {
          return 5005.60
        } else if (valorPagoCedente.valorSemFormatacao <= 1108957.53) {
          return 5278.25
        } else if (valorPagoCedente.valorSemFormatacao <= 1219853.28) {
          return 5550.89
        } else if (valorPagoCedente.valorSemFormatacao <= 1330749.03) {
          return 5823.54
        } else if (valorPagoCedente.valorSemFormatacao <= 1441644.78) {
          return 6096.20
        } else if (valorPagoCedente.valorSemFormatacao <= 1552540.53) {
          return 6368.85
        } else if (valorPagoCedente.valorSemFormatacao <= 1663436.28) {
          return 6641.49
        } else if (valorPagoCedente.valorSemFormatacao <= 1774332.03) {
          return 6914.15
        } else if (valorPagoCedente.valorSemFormatacao <= 1885227.78) {
          return 7186.80
        } else if (valorPagoCedente.valorSemFormatacao <= 1996123.53) {
          return 7459.45
        } else if (valorPagoCedente.valorSemFormatacao <= 2107019.28) {
          return 7732.11
        } else {
          return 'A consultar'
        }

      } else {
        const valorRequisitorio = valorRequisitorio.valorSemFormatacao * valorPercentual

        if (valorRequisitorio <= 49903.08) {
          return 1390.19
        } else if (valorRequisitorio <= 66537.45) {
          return 1577.26
        } else if (valorRequisitorio <= 88716.59) {
          return 2360.09
        } else if (valorRequisitorio <= 110895.75) {
          return 2684.40
        } else if (valorRequisitorio <= 221791.51) {
          return 3432.82
        } else if (valorRequisitorio <= 443583.03) {
          return 3642.32
        } else if (valorRequisitorio <= 554478.78) {
          return 3914.98
        } else if (valorRequisitorio <= 665374.53) {
          return 4187.64
        } else if (valorRequisitorio <= 776270.28) {
          return 4460.27
        } else if (valorRequisitorio <= 887166.03) {
          return 4732.93
        } else if (valorRequisitorio <= 998061.78) {
          return 5005.60
        } else if (valorRequisitorio <= 1108957.53) {
          return 5278.25
        } else if (valorRequisitorio <= 1219853.28) {
          return 5550.89
        } else if (valorRequisitorio <= 1330749.03) {
          return 5823.54
        } else if (valorRequisitorio <= 1441644.78) {
          return 6096.20
        } else if (valorRequisitorio <= 1552540.53) {
          return 6368.85
        } else if (valorRequisitorio <= 1663436.28) {
          return 6641.49
        } else if (valorRequisitorio <= 1774332.03) {
          return 6914.15
        } else if (valorRequisitorio <= 1885227.78) {
          return 7186.80
        } else if (valorRequisitorio <= 1996123.53) {
          return 7459.45
        } else if (valorRequisitorio <= 2107019.28) {
          return 7732.11
        } else {
          return 'A consultar'
        }
      }
    }

    const calcularCustoGRERJ = () => {
      if (valorAtualizado.valorSemFormatacao <= 50000) {
        return 365.55
      } else if (valorAtualizado.valorSemFormatacao <= 150000) {
        return 1462.24
      } else if (valorAtualizado.valorSemFormatacao <= 500000) {
        return 2558.92
      } else {
        return 3655.65
      }
    }

    const calcularCustoConsultor = () => {
      if (comissao.valorSemFormatacao < 6000) {
        return 500
      } else if (comissao.valorSemFormatacao <= 6999) {
        return 750
      } else if (comissao.valorSemFormatacao <= 7999) {
        return 1000
      } else if (comissao.valorSemFormatacao < 20000) {
        return 1500
      } else if (comissao.valorSemFormatacao <= 29999) {
        return 2000
      } else if (comissao.valorSemFormatacao <= 39999) {
        return 2500
      } else if (comissao.valorSemFormatacao <= 49999) {
        return 3000
      } else if (comissao.valorSemFormatacao <= 69999) {
        return 3500
      } else if (comissao.valorSemFormatacao <= 79999) {
        return 4000
      } else if (comissao.valorSemFormatacao <= 99999) {
        return 4500
      } else {
        return 6000
      }
    }

    if (calcularCustoEscritura() === 'A consultar') {
      setIsConsultar(true)
      return
    }

    const custoEscritura = calcularCustoEscritura()
    setCustoEscritura(custoEscritura.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
    const custoGRERJ = calcularCustoGRERJ()
    setCustoGRERJ(custoGRERJ.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
    const custoConsultor = calcularCustoConsultor()
    setCustoConsultor(custoConsultor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

    const impostoSobreComissao = 0.16 * comissao.valorSemFormatacao
    const custoAdministrativo = 580
    setImposto(impostoSobreComissao.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
    setCustoAdministrativo(custoAdministrativo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

    const valorLiquido = comissao.valorSemFormatacao - (custoEscritura + custoGRERJ + custoConsultor + impostoSobreComissao + custoAdministrativo)
    console.log(valorLiquido)
    setValorLiquido(valorLiquido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
    setShowTabelaCalculoLiquido(true)

  };

  return (
    <div className="w-full mb-[60px] flex flex-col lg:grid lg:grid-cols-[250px_1fr] xl:lg:grid-cols-[380px_1fr] divide-x-[1px] dark:divide-neutral-600 gap-4 lg:relative">
      <form className=" lg:relative" onSubmit={(e) => fazerCalculoLiquido(e)}>
        <div className="flex flex-col gap-2 lg:gap-2 xl:fixed xl:top-[7%] xl:w-[380px]  border-neutral-600 pb-4 mb-[1px]">
          <div className="flex flex-col gap-1 relative">
            <button
              onClick={handleExportPDF}
              title="Exportar para PDF"
              className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded absolute right-0 top-[0px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-5  dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </button>

            <label
              className="text-[14px] font-medium dark:text-white"
              htmlFor="precatorio"
            >
              Precatório
            </label>
            <CurrencyFormat
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
              placeholder={"Número do precatório"}
              name="precatorio"
              format={"####.#####-#"}
              value={precatorio}
              required={true}
              onValueChange={(values) => {
                setPrecatorio(values.formattedValue);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[14px] font-medium dark:text-white"
              htmlFor="valor-pago-cedente"
            >
              Valor Pago ao Cedente
            </label>
            <input
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
              type="text"
              placeholder="Valor Pago ao Cedente"
              name="valor-pago-cedente"
              value={valorPagoCedente.valorFormatado}
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(
                  /^R\$\s?/,
                  ""
                );
                const formattedValue = formatCurrency(valueWithoutPrefix);
                setValorPagoCedente(formattedValue);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[14px] font-medium dark:text-white"
              htmlFor="valor-requisitorio"
            >
              Valor do requisitório
            </label>
            <input
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
              type="text"
              placeholder="Valor do requisitório"
              name="valor-requisitorio"
              value={valorRequisitorio.valorFormatado}
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(
                  /^R\$\s?/,
                  ""
                );
                const formattedValue = formatCurrency(valueWithoutPrefix);
                setValorRequisitorio(formattedValue);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[14px] font-medium dark:text-white"
              htmlFor="valorAtualizado"
            >
              Valor Atualizado
            </label>
            <input
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
              type="text"
              name="valorAtualizado"
              placeholder="Valor Atualizado"
              value={valorAtualizado.valorFormatado}
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(
                  /^R\$\s?/,
                  ""
                );
                const formattedValue = formatCurrency(valueWithoutPrefix);
                setValorAtualizado(formattedValue);
              }}
            /* onChange={(e) => setValorPrincipal(e.target.value)} */
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[14px] font-medium dark:text-white"
              htmlFor="percentual"
            >
              Percentual de Compra
            </label>
            <input
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
              type="text"
              name="percentual"
              placeholder="Valor do percentual"
              value={percentual.valorFormatado}
              onChange={(e) => {
                // Passe o evento e o valor para a função
                const novo = formatCurrencyPercentual(e, e.target.value);
                setPercentual(novo);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[14px] font-medium dark:text-white"
              htmlFor="comissao"
            >
              Comissão
            </label>
            <input
              className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
              type="text"
              name="comissao"
              placeholder="Valor da comissão"
              value={comissao.valorFormatado}
              onChange={(e) => {
                const valueWithoutPrefix = e.target.value.replace(
                  /^R\$\s?/,
                  ""
                );
                const formattedValue = formatCurrency(valueWithoutPrefix);
                setComissao(formattedValue);
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white dark:bg-white dark:text-black w-full mt-4 rounded p-1 font-medium cursor-pointer"
          >
            Fazer cálculo
          </button>
        </div>
      </form>

      <div ref={pdfContentRef} className="flex flex-col justify-center gap-4 px-4 xl:px-8">
        <div className={isConsultar ? "overflow-x-auto dark:text-white" : 'hidden'}>
          <div className="p-2 font-bold">A Consultar</div>
        </div>
        <div className={showTabelaCalculoLiquido ? "overflow-x-auto dark:text-white" : 'hidden'}>
          <div className="w-max md:w-full">
            <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
              <div className="w-full">Calculo Líquido</div>
            </div>
            <div className="grid grid-cols-3 overflow-x-auto w-full">
              <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600 dark:divide-neutral-600">
                <div className="p-2 font-bold">Comissão</div>
                <div className="p-2 font-bold">Custo da escritura</div>
                <div className="p-2 font-bold text-nowrap">
                  Custo da GRERJ
                </div>
                <div className="p-2 font-bold text-nowrap">Custo do Consultor</div>
                <div className="p-2 font-bold text-nowrap">Imposto (16% sobre comissão)</div>
                <div className="p-2 font-bold text-nowrap">Custo administrativo fixo</div>
                <div className="p-2 font-bold text-nowrap">Valor Líquido</div>


              </div>

              <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                <div className="p-2">
                  {comissao.valorFormatado}
                </div>
                <div className="p-2">
                  - {custoEscritura}
                </div>
                <div className="p-2">- {custoGRERJ}</div>
                <div className="p-2">- {custoConsultor}</div>
                <div className="p-2">- {imposto}</div>

                <div className="p-2">- {custoAdministrativo}</div>
                <div className="p-2">{valorLiquido}</div>


              </div>

              <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600">
                <div className="p-2">-</div>
                <div className="p-2">-</div>
                <div className="p-2">-</div>
                <div className="p-2">-</div>
                <div className="p-2">-</div>
                <div className="p-2">-</div>
                <div className="p-2">-</div>

              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
