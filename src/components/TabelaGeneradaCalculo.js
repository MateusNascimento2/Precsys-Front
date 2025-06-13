import React, { useState } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


export default function TabelaGeneradaCalculo() {
  const pdfContentRef = React.useRef(null); // Referência para o conteúdo do PDF

  const [precatorio, setPrecatorio] = useState("2019.02877-2");
  const [orcamento, setOrcamento] = useState("2025");
  const [valorPrincipal, setValorPrincipal] = useState(238140.52);
  const [valorJuros, setValorJuros] = useState(115756.30);
  const [rioPrevidencia, setRioPrevidencia] = useState(2467.87);
  const [dataBaseStr, setDataBase] = useState("2021-04-20");
  const [dataAtualizacaoStr, setDataAtualizacao] = useState("2025-06-02");

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();
  const location = useLocation();

  const [showTabelaCalculoInicial, setShowTabelaCalculoInicial] = useState(false)
  const [showTabelaInicioPeriodoGraca, setShowTabelaInicioPeriodoGraca] = useState(false)
  const [showTabelaInicioTaxaSelic, setShowTabelaInicioTaxaSelic] = useState(false)
  const [showTabelaInicioPeriodoGraca2, setShowTabelaInicioPeriodoGraca2] = useState(false)
  const [showTabelaFinalPeriodoGraca, setShowTabelaFinalPeriodoGraca] = useState(false)
  const [showTabelaAteInicioSelic, setShowTabelaAteInicioSelic] = useState(false)
  const [showTabelaCalculoFinal, setShowTabelaCalculoFinal] = useState(false);

  //Valores da Tabela Cálculo Inicial
  const [calculoInicialData, setCalculoInicialData] = useState("");
  const [calculoInicialValorPrincipal, setCalculoInicialValorPrincipal] = useState("");
  const [calculoInicialValorJuros, setCalculoInicialValorJuros] = useState("");
  const [calculoInicialValorTotal, setCalculoInicialValorTotal] = useState("");

  //Valores da Tabela Início do Período da Graça
  {/* Correção Monetária */ }
  const [inicioPeriodoGracaData, setInicioPeriodoGracaData] = useState("");
  const [inicioPeriodoGracaFator, setInicioPeriodoGracaFator] = useState('');
  const [inicioPeriodoGracaFatorObs, setInicioPeriodoGracaFatorObs] = useState('');
  const [inicioPeriodoGracaValorPrincipalCorrigido, setInicioPeriodoGracaValorPrincipalCorrigido] = useState("");
  const [inicioPeriodoGracaValorJurosCorrigido, setInicioPeriodoGracaValorJurosCorrigido] = useState("");
  const [inicioPeriodoGracaValorTotalCorrigido, setInicioPeriodoGracaValorTotalCorrigido] = useState("");

  {/* Juros */ }
  const [inicioPeriodoGracaNumeroDias, setInicioPeriodoGracaNumeroDias] = useState("");
  const [inicioPeriodoGracaTaxaJuros, setInicioPeriodoGracaTaxaJuros] = useState("");
  const [inicioPeriodoGracaTaxaJurosObs, setInicioPeriodoGracaTaxaJurosObs] = useState('');
  const [inicioPeriodoGracaValorJuros, setInicioPeriodoGracaValorJuros] = useState("");

  {/* Valor Atualizado */ }
  const [inicioPeriodoGracaAtualizadoValorPrincipalCorrigido, setInicioPeriodoGracaAtualizadoValorPrincipalCorrigido] = useState("");
  const [inicioPeriodoGracaAtualizadoValorJurosCorrigido, setInicioPeriodoGracaAtualizadoValorJurosCorrigido] = useState("");
  const [inicioPeriodoGracaAtualizadoValorTotal, setInicioPeriodoGracaAtualizadoValorTotal] = useState("");


  //Valores da Tabela Início da Taxa Selic
  {/* Correção Monetária */ }
  const [inicioTaxaSelicData, setInicioTaxaSelicData] = useState("");
  const [inicioTaxaSelicFator, setInicioTaxaSelicFator] = useState('');
  const [inicioTaxaSelicFatorObs, setInicioTaxaSelicFatorObs] = useState('');
  const [inicioTaxaSelicValorPrincipalCorrigido, setInicioTaxaSelicValorPrincipalCorrigido] = useState("");
  const [inicioTaxaSelicValorJurosCorrigido, setInicioTaxaSelicValorJurosCorrigido] = useState("");
  const [inicioTaxaSelicValorTotalCorrigido, setInicioTaxaSelicValorTotalCorrigido] = useState("");

  {/* Juros */ }
  const [inicioTaxaSelicNumeroDias, setInicioTaxaSelicNumeroDias] = useState("");
  const [inicioTaxaSelicTaxaJuros, setInicioTaxaSelicTaxaJuros] = useState("");
  const [inicioTaxaSelicTaxaJurosObs, setInicioTaxaSelicTaxaJurosObs] = useState('');
  const [inicioTaxaSelicValorJuros, setInicioTaxaSelicValorJuros] = useState("");

  {/* Valor Atualizado */ }
  const [inicioTaxaSelicAtualizadoValorPrincipalCorrigido, setInicioTaxaSelicAtualizadoValorPrincipalCorrigido] = useState("");
  const [inicioTaxaSelicAtualizadoValorJurosCorrigido, setInicioTaxaSelicAtualizadoValorJurosCorrigido] = useState("");
  const [inicioTaxaSelicAtualizadoValorTotal, setInicioTaxaSelicAtualizadoValorTotal] = useState("");

  //Final do Período da Graça
  const [finalPeriodoGracaData, setFinalPeriodoGracaData] = useState("");

  {/* Correção Monetária */ }
  const [finalPeriodoGracaFator, setFinalPeriodoGracaFator] = useState("");
  const [finalPeriodoGracaFatorObs, setFinalPeriodoGracaFatorObs] = useState('');
  const [finalPeriodoGracaValorPrincipalCorrigido, setFinalPeriodoGracaValorPrincipalCorrigido] = useState("");
  const [finalPeriodoGracaValorJurosCorrigido, setFinalPeriodoGracaValorJurosCorrigido] = useState("");
  const [finalPeriodoGracaValorTotalCorrigido, setFinalPeriodoGracaValorTotalCorrigido] = useState("");


  //Até o Início da Selic
  const [ateInicioSelicData, setAteInicioSelicData] = useState("");

  {/* Correção Monetária */ }
  const [ateInicioSelicFator, setAteInicioSelicFator] = useState("");
  const [ateInicioSelicFatorObs, setAteInicioSelicFatorObs] = useState('');
  const [ateInicioSelicValorPrincipalCorrigido, setAteInicioSelicValorPrincipalCorrigido] = useState("");
  const [ateInicioSelicValorJurosCorrigido, setAteInicioSelicValorJurosCorrigido] = useState("");
  const [ateInicioSelicValorTotalCorrigido, setAteInicioSelicValorTotalCorrigido] = useState("");


  //Cálculo Final
  const [calculoFinalData, setCalculoFinalData] = useState("");

  {/* Correção Monetária */ }
  const [calculoFinalFator, setCalculoFinalFator] = useState("");
  const [calculoFinalFatorObs, setCalculoFinalFatorObs] = useState('');
  const [calculoFinalValorPrincipalCorrigido, setCalculoFinalValorPrincipalCorrigido] = useState("");
  const [calculoFinalValorJurosCorrigido, setCalculoFinalValorJurosCorrigido] = useState("");
  const [calculoFinalValorTotalCorrigido, setCalculoFinalValorTotalCorrigido] = useState("");


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
          fillColor: null,        // Fundo transparente
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
      ["Cálculo Inicial", ''],
      [
        ["Data", calculoInicialDataBase || "-"],
        ["Valor Principal", calculoIncialPrincipal || "-"],
        ["Valor Juros", calculoIncialJuros || "-"],
        ["Valor Total", calculoIncialTotal || "-"],
      ]
    );

    // Seção 2: Início do Período da Graça
    addTable(
      ["Início do Período da Graça", ''],
      [
        ["Data", segundoQuadranteIPCAE1 || "-"],
        ["Correção Monetária", "-"],
        ["Fator", segundoQuadranteIPCAE2 || "-"],
        ["Valor Principal Corrigido", segundoQuadranteIPCAE3 || "-"],
        ["Valor Juros Corrigido", segundoQuadranteIPCAE4 || "-"],
        ["Valor Total Corrigido", segundoQuadranteIPCAE5 || "-"],
        ["Juros", "-"],
        ["Número Dias", segundoQuadranteIPCAE6 || "-"],
        ["Taxa de Juros", segundoQuadranteIPCAE7 || "-"],
        ["Valor Juros", segundoQuadranteIPCAE8 || "-"],
        ["Valor Atualizado", "-"],
        ["Valor Principal Corrigido", segundoQuadranteIPCAE3 || "-"],
        ["Valor Juros Corrigido", segundoQuadranteIPCAE9 || "-"],
        ["Valor Total", segundoQuadranteIPCAE10 || "-"],
      ]
    );

    // Seção 3: Final do Período da Graça
    addTable(
      ["Final do Período da Graça", ''],
      [
        ["Data", terceiroQuadranteIPCAE1 || "-"],
        ["Correção Monetária", "-"],
        ["Fator", terceiroQuadranteIPCAE2 || "-"],
        ["Valor Principal Corrigido", terceiroQuadranteIPCAE3 || "-"],
        ["Valor Juros Corrigido", terceiroQuadranteIPCAE4 || "-"],
        ["Valor Total Corrigido", terceiroQuadranteIPCAE5 || "-"],
      ]
    );

    // Seção 4: Início Taxa Selic
    addTable(
      ["Início Taxa Selic", ''],
      [
        ["Data", quartoQuadranteIPCAE1 || "-"],
        ["Correção Monetária", "-"],
        ["Fator", quartoQuadranteIPCAE2 || "-"],
        ["Valor Principal Corrigido", quartoQuadranteIPCAE3 || "-"],
        ["Valor Juros Corrigido", quartoQuadranteIPCAE4 || "-"],
        ["Valor Total Corrigido", quartoQuadranteIPCAE5 || "-"],
        ["Juros", "-"],
        ["Número Dias", quartoQuadranteIPCAE6 || "-"],
        ["Taxa de Juros", quartoQuadranteIPCAE7 || "-"],
        ["Valor Juros", quartoQuadranteIPCAE8 || "-"],
        ["Valor Atualizado", "-"],
        ["Valor Principal Corrigido", quartoQuadranteIPCAE3 || "-"],
        ["Valor Juros Corrigido", quartoQuadranteIPCAE9 || "-"],
        ["Valor Total", quartoQuadranteIPCAE10 || "-"],
      ]
    );

    // Seção 5: Cálculo Final
    addTable(
      ["Cálculo Final", ''],
      [
        ["Data", quartoQuadranteSELIC1 || "-"],
        ["Valor Base para Correção (01/12/2021)", "-"],
        ["Valor Principal", quartoQuadranteSELIC2 || "-"],
        ["Valor Juros", quartoQuadranteSELIC3 || "-"],
        ["Valor Total", quartoQuadranteSELIC4 || "-"],
        ["Correção Monetária", "-"],
        ["Fator", quartoQuadranteSELIC5 || "-"],
        ["Valor Principal Corrigido", quartoQuadranteSELIC6 || "-"],
        ["Valor Juros Corrigido", quartoQuadranteSELIC7 || "-"],
        ["Valor Total Corrigido", quartoQuadranteSELIC8 || "-"],
      ]
    );

    // Salvando o PDF
    doc.save("calculo_tabelas.pdf");
  };

  function submitForm(event) {
    event.preventDefault();
    setShowTabelaCalculoInicial(false)
    setShowTabelaInicioPeriodoGraca(false)
    setShowTabelaInicioTaxaSelic(false)
    setShowTabelaInicioPeriodoGraca2(false)
    setShowTabelaFinalPeriodoGraca(false)
    setShowTabelaAteInicioSelic(false)
    setShowTabelaCalculoFinal(false);
    /*     const precatorio = document.querySelector('input[name="precatorio"]').value;
    const orcamento = document.querySelector('input[name="orcamento"]').value;
    const valorPrincipal = document.querySelector('input[name="valorPrincipal"]').value;
    const valorJuros = document.querySelector('input[name="valorJuros"]').value;
    const rioPrevidencia = document.querySelector('input[name="rioPrevidencia"]').value;
    const dataBaseStr = document.querySelector('input[name="dataBase"]').value;
    const dataAtualizacaoStr = document.querySelector('input[name="dataAtualizacao"]').value; */

    let dataInicioPeriodoDaGracaStr = "";
    let dataVencimentoPeriodoDaGracaStr = "";

    if (orcamento === "2020") {
      dataInicioPeriodoDaGracaStr = "2019-07-02";
      dataVencimentoPeriodoDaGracaStr = "2021-01-01";
    } else if (orcamento === "2021") {
      dataInicioPeriodoDaGracaStr = "2020-07-02";
      dataVencimentoPeriodoDaGracaStr = "2022-01-01";
    } else if (orcamento === "2022") {
      dataInicioPeriodoDaGracaStr = "2021-07-02";
      dataVencimentoPeriodoDaGracaStr = "2023-01-01";
    } else if (orcamento === "2023") {
      dataInicioPeriodoDaGracaStr = "2022-04-03";
      dataVencimentoPeriodoDaGracaStr = "2024-01-01";
    } else if (orcamento === "2024") {
      dataInicioPeriodoDaGracaStr = "2023-04-03";
      dataVencimentoPeriodoDaGracaStr = "2025-01-01";
    } else if (orcamento === "2025") {
      dataInicioPeriodoDaGracaStr = "2024-04-03";
      dataVencimentoPeriodoDaGracaStr = "2026-01-01";
    } else if (orcamento === "2026") {
      dataInicioPeriodoDaGracaStr = "2025-04-03";
      dataVencimentoPeriodoDaGracaStr = "2027-01-01";
    } else if (orcamento === "2027") {
      dataInicioPeriodoDaGracaStr = "2026-04-03";
      dataVencimentoPeriodoDaGracaStr = "2028-01-01";
    }

    const dataBase = new Date(dataBaseStr);
    const dataAtualizacao = new Date(dataAtualizacaoStr);
    const dataInicioPeriodoDaGraca = new Date(dataInicioPeriodoDaGracaStr);
    const dataVencimentoPeriodoDaGraca = new Date(dataVencimentoPeriodoDaGracaStr);
    const marco = new Date("2021-12-02");
    const marcoStr = `${marco.getFullYear()}-${String(marco.getMonth() + 1).padStart(2, '0')}-${String(marco.getDate()).padStart(2, '0')}`;


    async function calcularValores(dataBase, dataInicioPeriodoDaGraca, dataVencimentoPeriodoDaGraca, valorPrincipal, valorJuros, rioPrevidencia, dataAtualizacao, marco) {

      // Informações Gerais (Ver para criar logica de quando deposita o valor de prioridade)
      console.log("Precatório:");
      console.log("Orçamento:", orcamento);
      console.log("Valor Principal:", parseFloat(valorPrincipal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
      console.log("Valor Juros:", parseFloat(valorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
      console.log("Rioprevidência:", parseFloat(rioPrevidencia).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
      console.log("Data Base:", new Date(dataBaseStr).toLocaleDateString("pt-BR"));
      console.log("Data de Atualização:", new Date(dataAtualizacaoStr).toLocaleDateString("pt-BR"));


      // Primeiro Cálculo Abatendo RioPrev
      setShowTabelaCalculoInicial(true)
      console.log("Cálculo Inicial");
      console.log("Data:", new Date(dataBaseStr).toLocaleDateString("pt-BR"));
      setCalculoInicialData(new Date(dataBaseStr).toLocaleDateString("pt-BR"))

      // Conversão dos valores
      const principalNum = parseFloat(valorPrincipal);
      const jurosNum = parseFloat(valorJuros);
      const rioprevNum = parseFloat(rioPrevidencia);

      // Total bruto antes do abate
      const totalBruto = principalNum + jurosNum;

      // Proporções
      const propPrincipal = principalNum / totalBruto;
      const propJuros = jurosNum / totalBruto;

      // Abate proporcional
      const abatimentoPrincipal = propPrincipal * rioprevNum;
      const abatimentoJuros = propJuros * rioprevNum;

      // Valores finais após abatimento
      const principalFinal = principalNum - abatimentoPrincipal;
      const jurosFinal = jurosNum - abatimentoJuros;
      const totalFinal = principalFinal + jurosFinal;

      // Impressão formatada
      console.log("Valor Principal:", principalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
      setCalculoInicialValorPrincipal(principalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
      console.log("Valor Juros:", jurosFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
      setCalculoInicialValorJuros(jurosFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
      console.log("Valor Total:", totalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
      setCalculoInicialValorTotal(totalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))


      let nValorPrincipal = principalFinal;
      let nValorJuros = jurosFinal;

      // Segunda parte do Cáluclo (Primeira Correção vendo sobre o marco da Selic!)
      if (dataBase < marco) {
        if (dataInicioPeriodoDaGraca < marco) {
          // Cálculo DataBase Até o Periodo da Graça (ipca-E/jUROS)
          let FatorIPCAEDataBase = await PegarDataDoJSON(dataBaseStr, 'fatorNT');
          let FatorIPCAEInicioPG = await PegarDataDoJSON(dataInicioPeriodoDaGracaStr, 'fatorNT');
          let FatorJurosPoupancaDataBase = await PegarDataDoJSON(dataBaseStr, 'jurosPoupanca');
          let FatorJurosPoupancaInicioPG = await PegarDataDoJSON(dataInicioPeriodoDaGracaStr, 'jurosPoupanca');
          
          
          setShowTabelaInicioPeriodoGraca(true)
          console.log("Início do Período da Graça (", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), ")");
          console.log("Data:", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"));
          setInicioPeriodoGracaData(dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"));

          console.log("\nCorreção Monetária");
          console.log("Fator:", FatorIPCAEDataBase / FatorIPCAEInicioPG, "Entre as datas: ", dataBase.toLocaleDateString("pt-BR"), " e ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), "");
          setInicioPeriodoGracaFator(FatorIPCAEDataBase / FatorIPCAEInicioPG)
          setInicioPeriodoGracaFatorObs(`Entre as datas: ${dataBase.toLocaleDateString('pt-BR')} e ${dataInicioPeriodoDaGraca.toLocaleDateString('pt-BR')}`)

          nValorPrincipal = nValorPrincipal * (FatorIPCAEDataBase / FatorIPCAEInicioPG);
          console.log("Valor Principal Corrigido: ", nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          setInicioPeriodoGracaValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          nValorJuros = nValorJuros * (FatorIPCAEDataBase / FatorIPCAEInicioPG);
          console.log("Valor Juros Corrigido: ", nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          setInicioPeriodoGracaValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          console.log("Valor Total Corrigido: ", (nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          setInicioPeriodoGracaValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));

          console.log("\nJuros");
          console.log("Número de Dias:", Math.floor((dataInicioPeriodoDaGraca - dataBase) / (1000 * 60 * 60 * 24)));
          setInicioPeriodoGracaNumeroDias(Math.floor((dataInicioPeriodoDaGraca - dataBase) / (1000 * 60 * 60 * 24)))
          console.log("Taxa de Juros:", (FatorJurosPoupancaDataBase - FatorJurosPoupancaInicioPG) * 100, "Entre as datas: ", dataBase.toLocaleDateString("pt-BR"), " e ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), "");
          setInicioPeriodoGracaTaxaJuros((FatorJurosPoupancaDataBase - FatorJurosPoupancaInicioPG) * 100)
          setInicioPeriodoGracaTaxaJurosObs(`Entre as datas: ${dataBase.toLocaleDateString('pt-BR')} e ${dataInicioPeriodoDaGraca.toLocaleDateString('pt-BR')}`)
          console.log("Valor Juros: ", nValorPrincipal * (FatorJurosPoupancaDataBase - FatorJurosPoupancaInicioPG));
          setInicioPeriodoGracaValorJuros((nValorPrincipal * (FatorJurosPoupancaDataBase - FatorJurosPoupancaInicioPG)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
          nValorJuros = nValorJuros + (nValorPrincipal * (FatorJurosPoupancaDataBase - FatorJurosPoupancaInicioPG));
          console.log("Fórmula: Correção Monetária do Valor Principal * Taxa de Juros");

          console.log("\nValor Atualizado");
          console.log("Valor Principal Corrigido: ", nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          setInicioPeriodoGracaAtualizadoValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
          console.log("Valor Juros Corrigido: ", nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          setInicioPeriodoGracaAtualizadoValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          console.log("Valor Total: ", (nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
          setInicioPeriodoGracaAtualizadoValorTotal((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));

        } else if (dataInicioPeriodoDaGraca > marco) {
          // Cálculo DataBase Até o Marco (ipca-E/jUROS)
          let FatorIPCAEDataBase = await PegarDataDoJSON(dataBaseStr, 'fatorNT');
          let FatorIPCAEMarco = await PegarDataDoJSON(marcoStr, 'fatorNT');
          let FatorJurosPoupancaDataBase = await PegarDataDoJSON(dataBaseStr, 'jurosPoupanca');
          let FatorJurosPoupancaMarco = await PegarDataDoJSON(marcoStr, 'jurosPoupanca');

          setShowTabelaInicioTaxaSelic(true)
          console.log("\nInício da Taxa Selic (", marco.toLocaleDateString("pt-BR"), ")");
          console.log("Data:", marco.toLocaleDateString("pt-BR"));
          setInicioTaxaSelicData(marco.toLocaleDateString("pt-BR"))

          console.log("\nCorreção Monetária");
          console.log("Fator:", FatorIPCAEDataBase / FatorIPCAEMarco, "Entre as datas: ", dataBase.toLocaleDateString("pt-BR"), " e ", marco.toLocaleDateString("pt-BR"), "");
          setInicioTaxaSelicFator(FatorIPCAEDataBase / FatorIPCAEMarco);
          setInicioTaxaSelicFatorObs(`Entre as datas: ${dataBase.toLocaleDateString("pt-BR")} e ${marco.toLocaleDateString("pt-BR")}`)

          nValorPrincipal = nValorPrincipal * (FatorIPCAEDataBase / FatorIPCAEMarco);
          console.log("Valor Principal Corrigido: ", nValorPrincipal);
          setInicioTaxaSelicValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          nValorJuros = nValorJuros * (FatorIPCAEDataBase / FatorIPCAEMarco);
          console.log("Valor Juros Corrigido: ", nValorJuros);
          setInicioTaxaSelicValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
          setInicioTaxaSelicValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          console.log("\nJuros");
          console.log("Número de Dias:", Math.floor((marco - dataBase) / (1000 * 60 * 60 * 24)));
          setInicioTaxaSelicNumeroDias(Math.floor((marco - dataBase) / (1000 * 60 * 60 * 24)))
          console.log("Taxa de Juros:", (FatorJurosPoupancaDataBase - FatorJurosPoupancaMarco) * 100, "Entre as datas: ", marco.toLocaleDateString("pt-BR"), " e ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), "");
          setInicioTaxaSelicTaxaJuros((FatorJurosPoupancaDataBase - FatorJurosPoupancaMarco) * 100)
          setInicioTaxaSelicTaxaJurosObs(`Entre as datas: ${marco.toLocaleDateString('pt-BR')} e ${dataInicioPeriodoDaGraca.toLocaleDateString('pt-BR')}`)
          console.log("Valor Juros: ", nValorPrincipal * (FatorJurosPoupancaDataBase - FatorJurosPoupancaMarco));
          setInicioTaxaSelicValorJuros((nValorPrincipal * (FatorJurosPoupancaDataBase - FatorJurosPoupancaMarco)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
          nValorJuros = nValorJuros + (nValorPrincipal * (FatorJurosPoupancaDataBase - FatorJurosPoupancaMarco));
          console.log("Fórmula: Correção Monetária do Valor Principal * Taxa de Juros");

          console.log("\nValor Atualizado");
          console.log("Valor Principal Corrigido: ", nValorPrincipal);
          setInicioTaxaSelicAtualizadoValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
          console.log("Valor Juros Corrigido: ", nValorJuros);
          setInicioTaxaSelicAtualizadoValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
          console.log("Valor Total: ", nValorPrincipal + nValorJuros);
          setInicioTaxaSelicAtualizadoValorTotal((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          // Do Marco até o Período da Graça (Selic)
          let FatorSELICMarco = await PegarDataDoJSON(marcoStr, 'taxaSelic');
          let FatorSelicInicioPG = await PegarDataDoJSON(dataInicioPeriodoDaGracaStr, 'taxaSelic');

          setShowTabelaInicioPeriodoGraca2(true)
          console.log("\nInício do Período da Graça");
          console.log("Data: ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"));
          setInicioPeriodoGracaData(dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"))

          console.log("\nCorreção Monetária / SELIC");
          console.log("Fator:", ((FatorSELICMarco - FatorSelicInicioPG) / 100) + 1, "Entre as datas:", marco.toLocaleDateString("pt-BR"), " e ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), ")");
          setInicioPeriodoGracaFator(((FatorSELICMarco - FatorSelicInicioPG) / 100) + 1)
          setInicioPeriodoGracaFatorObs(`Entre as datas: ${marco.toLocaleDateString('pt-BR')} e ${dataInicioPeriodoDaGraca.toLocaleDateString('pt-BR')}`)

          nValorPrincipal = nValorPrincipal * (((FatorSELICMarco - FatorSelicInicioPG) / 100) + 1)
          console.log("Valor Principal Corrigido: ", nValorPrincipal);
          setInicioPeriodoGracaValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          nValorJuros = nValorJuros * (((FatorSELICMarco - FatorSelicInicioPG) / 100) + 1)
          console.log("Valor Juros Corrigido: ", nValorJuros);
          setInicioPeriodoGracaValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
          setInicioPeriodoGracaValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        }

      } else if (dataBase >= marco) {
        // Cálculo DataBase Até o Periodo da Graça (Selic)
        let FatorSELICDataBase = await PegarDataDoJSON(dataBaseStr, 'taxaSelic');
        let FatorSELICInicioPG = await PegarDataDoJSON(dataInicioPeriodoDaGracaStr, 'taxaSelic');

        setShowTabelaInicioPeriodoGraca2(true)
        console.log("\nInício do Período da Graça");
        console.log("Data: ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"));
        setInicioPeriodoGracaFator(dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"))

        console.log("\nCorreção Monetária / SELIC");
        console.log("Fator:", ((FatorSELICDataBase - FatorSELICInicioPG) / 100) + 1, "Entre as datas:", dataBase.toLocaleDateString("pt-BR"), " e ", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), ")");
        setInicioPeriodoGracaFator(((FatorSELICDataBase - FatorSELICInicioPG) / 100) + 1)
        setInicioPeriodoGracaFatorObs(`Entre as datas: ${dataBase.toLocaleDateString('pt-BR')} e ${dataInicioPeriodoDaGraca.toLocaleDateString('pt-BR')}`)

        nValorPrincipal = nValorPrincipal * (((FatorSELICDataBase - FatorSELICInicioPG) / 100) + 1)
        console.log("Valor Principal Corrigido: ", nValorPrincipal);
        setInicioPeriodoGracaValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        nValorJuros = nValorJuros * (((FatorSELICDataBase - FatorSELICInicioPG) / 100) + 1)
        console.log("Valor Juros Corrigido: ", nValorJuros);
        setInicioPeriodoGracaValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
        setInicioPeriodoGracaValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
      }

      // Terceira Parte do Cálculo (Período da Graça)
      if (dataVencimentoPeriodoDaGraca > dataAtualizacao) {
        // Corrigir IPCA-E só até a data da Atualização
        let FatorIPCAEInicioPG = await PegarDataDoJSON(dataInicioPeriodoDaGracaStr, 'fatorNT');
        let FatorIPCAEDataAtualizacao = await PegarDataDoJSON(dataAtualizacaoStr, 'fatorNT');

        setShowTabelaFinalPeriodoGraca(true)
        console.log("\nFim do Período da Graça ou Atualização");
        console.log("Data: ", dataAtualizacao.toLocaleDateString("pt-BR"));
        setFinalPeriodoGracaData(dataAtualizacao.toLocaleDateString("pt-BR"))

        console.log("\nCorreção Monetária");
        console.log("Fator:", FatorIPCAEInicioPG / FatorIPCAEDataAtualizacao, "Entre as datas:", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), " e ", dataAtualizacao.toLocaleDateString("pt-BR"), ")");
        setFinalPeriodoGracaFator(FatorIPCAEInicioPG / FatorIPCAEDataAtualizacao)
        setFinalPeriodoGracaFatorObs(`Entre as datas: ${dataInicioPeriodoDaGraca.toLocaleDateString('pt-BR')} e ${dataAtualizacao.toLocaleDateString('pt-BR')}`)

        nValorPrincipal = nValorPrincipal * (FatorIPCAEInicioPG / FatorIPCAEDataAtualizacao);
        console.log("Valor Principal Corrigido: ", nValorPrincipal);
        setFinalPeriodoGracaValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        nValorJuros = nValorJuros * (FatorIPCAEInicioPG / FatorIPCAEDataAtualizacao)
        console.log("Valor Juros Corrigido: ", nValorJuros);
        setFinalPeriodoGracaValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
        setFinalPeriodoGracaValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

      } else if (dataVencimentoPeriodoDaGraca < dataAtualizacao) {
        //Corrigir IPCA-E Período da Graça
        let FatorIPCAEInicioPG = await PegarDataDoJSON(dataInicioPeriodoDaGracaStr, 'fatorNT');
        let FatorIPCAEVencimentoPG = await PegarDataDoJSON(dataVencimentoPeriodoDaGracaStr, 'fatorNT');

        setShowTabelaFinalPeriodoGraca(true)
        console.log("\nFim do Período da Graça ou Atualização");
        console.log("Data: ", dataVencimentoPeriodoDaGraca.toLocaleDateString("pt-BR"));
        setFinalPeriodoGracaData(dataVencimentoPeriodoDaGraca.toLocaleDateString('pt-BR'));

        console.log("\nCorreção Monetária");
        console.log("Fator:", FatorIPCAEInicioPG / FatorIPCAEVencimentoPG, "Entre as datas:", dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR"), " e ", dataVencimentoPeriodoDaGraca.toLocaleDateString("pt-BR"), ")");
        setFinalPeriodoGracaFator(FatorIPCAEInicioPG / FatorIPCAEVencimentoPG)
        setFinalPeriodoGracaFatorObs(`Entre as datas: ${dataInicioPeriodoDaGraca.toLocaleDateString("pt-BR")} e ${dataVencimentoPeriodoDaGraca.toLocaleDateString("pt-BR")}`)

        nValorPrincipal = nValorPrincipal * (FatorIPCAEInicioPG / FatorIPCAEVencimentoPG);
        console.log("Valor Principal Corrigido: ", nValorPrincipal);
        setFinalPeriodoGracaValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        nValorJuros = nValorJuros * (FatorIPCAEInicioPG / FatorIPCAEVencimentoPG)
        console.log("Valor Juros Corrigido: ", nValorJuros);
        setFinalPeriodoGracaValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
        setFinalPeriodoGracaValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

        // Quarta Parte do Cálculo (Até a data da Atualização)
        if (dataVencimentoPeriodoDaGraca < dataAtualizacao) {
          if (dataVencimentoPeriodoDaGraca < marco) {
            // Corrigir IPCA-E e Juros até o marco. ???
            let FatorIPCAEVencimentoPG = await PegarDataDoJSON(dataVencimentoPeriodoDaGracaStr, 'fatorNT');
            let FatorIPCAEMarco = await PegarDataDoJSON(marcoStr, 'fatorNT');

            setShowTabelaAteInicioSelic(true)
            console.log("\nAté o Inicio da Selic");
            console.log("Data: ", marco.toLocaleDateString("pt-BR"));
            setAteInicioSelicData(marco.toLocaleDateString('pt-BR'))

            console.log("\nCorreção Monetária");
            console.log("Fator:", FatorIPCAEVencimentoPG / FatorIPCAEMarco, "Entre as datas:", dataVencimentoPeriodoDaGraca.toLocaleDateString("pt-BR"), " e ", marco.toLocaleDateString("pt-BR"), ")");
            setAteInicioSelicFator(FatorIPCAEVencimentoPG / FatorIPCAEMarco)
            setAteInicioSelicFatorObs(`Entre as datas: ${dataVencimentoPeriodoDaGraca.toLocaleDateString('pt-BR')} e ${marco.toLocaleDateString('pt-BR')}`)

            nValorPrincipal = nValorPrincipal * (FatorIPCAEVencimentoPG / FatorIPCAEMarco);
            console.log("Valor Principal Corrigido: ", nValorPrincipal);
            setAteInicioSelicValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

            nValorJuros = nValorJuros * (FatorIPCAEVencimentoPG / FatorIPCAEMarco)
            console.log("Valor Juros Corrigido: ", nValorJuros);
            setAteInicioSelicValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

            console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
            setAteInicioSelicValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))
            // Depois do marco corrigir selic até a data Atualização ???
            let FatorSELICMarco = await PegarDataDoJSON(marcoStr, 'taxaSelic');
            let FatorSELICDataAtualizacao = await PegarDataDoJSON(dataAtualizacaoStr, 'taxaSelic');

            setShowTabelaCalculoFinal(true)
            console.log("\nCálculo Final");
            console.log("Data: ", dataAtualizacao.toLocaleDateString("pt-BR"));
            setCalculoFinalData(dataAtualizacao.toLocaleDateString("pt-BR"))


            console.log("\nCorreção Monetária / SELIC");
            console.log("Fator:", ((FatorSELICMarco - FatorSELICDataAtualizacao) / 100) + 1, "Entre as datas:", marco.toLocaleDateString("pt-BR"), " e ", dataAtualizacao.toLocaleDateString("pt-BR"), ")");
            setCalculoFinalFator(((FatorSELICMarco - FatorSELICDataAtualizacao) / 100) + 1)
            setCalculoFinalFatorObs(`Entre as datas: ${marco.toLocaleDateString("pt-BR")} e ${dataAtualizacao.toLocaleDateString('pt-BR')}`)

            nValorPrincipal = nValorPrincipal * (((FatorSELICMarco - FatorSELICDataAtualizacao) / 100) + 1)
            console.log("Valor Principal Corrigido: ", nValorPrincipal);
            setCalculoFinalValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

            nValorJuros = nValorJuros * (((FatorSELICMarco - FatorSELICDataAtualizacao) / 100) + 1)
            console.log("Valor Juros Corrigido: ", nValorJuros);
            setCalculoFinalValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

            console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
            setCalculoFinalValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          } else if (dataVencimentoPeriodoDaGraca > marco) {
            // Corrigir Selic até a data Atualização
            let FatorSELICVencimentoPG = await PegarDataDoJSON(dataVencimentoPeriodoDaGracaStr, 'taxaSelic');
            let FatorSELICDataAtualizacao = await PegarDataDoJSON(dataAtualizacaoStr, 'taxaSelic');

            setShowTabelaCalculoFinal(true)
            console.log("\nCálculo Final");
            console.log("Data: ", dataAtualizacao.toLocaleDateString("pt-BR"));
            setCalculoFinalData(dataAtualizacao.toLocaleDateString('pt-BR'))

            console.log("\nCorreção Monetária / SELIC");
            console.log("Fator:", ((FatorSELICVencimentoPG - FatorSELICDataAtualizacao) / 100) + 1, "Entre as datas:", dataVencimentoPeriodoDaGraca.toLocaleDateString("pt-BR"), " e ", dataAtualizacao.toLocaleDateString("pt-BR"), ")");
            setCalculoFinalFator(((FatorSELICVencimentoPG - FatorSELICDataAtualizacao) / 100) + 1)
            setCalculoFinalFatorObs(`Entre as datas: ${dataVencimentoPeriodoDaGraca.toLocaleDateString("pt-BR")} e ${dataAtualizacao.toLocaleDateString('pt-BR')}`)

            nValorPrincipal = nValorPrincipal * (((FatorSELICVencimentoPG - FatorSELICDataAtualizacao) / 100) + 1)
            console.log("Valor Principal Corrigido: ", nValorPrincipal);
            setCalculoFinalValorPrincipalCorrigido(nValorPrincipal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))


            nValorJuros = nValorJuros * (((FatorSELICVencimentoPG - FatorSELICDataAtualizacao) / 100) + 1)
            console.log("Valor Juros Corrigido: ", nValorJuros);
            setCalculoFinalValorJurosCorrigido(nValorJuros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))


            console.log("Valor Total Corrigido: ", nValorPrincipal + nValorJuros);
            setCalculoFinalValorTotalCorrigido((nValorPrincipal + nValorJuros).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))

          }
        }
      }



    }

    calcularValores(dataBase, dataInicioPeriodoDaGraca, dataVencimentoPeriodoDaGraca, valorPrincipal, valorJuros, rioPrevidencia, dataAtualizacao, marco);

    async function PegarDataDoJSON(data, nomeArquivo) {

      if (nomeArquivo === 'taxaSelic') {
        const dataSplit = data.split('-');
        const dataFormatada = `01/${dataSplit[1]}/${dataSplit[0]}`
        const response = await fetch(`/json/${nomeArquivo}.json`);
        const dados = await response.json();
        const resultado = dados.find((dado) => dado.data === dataFormatada);

        return resultado.taxa_selic
      }

      const dataSplit = data.split('-');
      const dataFormatada = `${dataSplit[1]}/01/${dataSplit[0]}`
      const response = await fetch(`/json/${nomeArquivo}.json`);
      const dados = await response.json();
      const resultado = dados.find((dado) => dado.data === dataFormatada);

      return resultado.fator
    }


  }

  return (

    <main className="px-2 lg:px-[30px]">
      <div className="w-full mb-[60px] flex flex-col lg:grid lg:grid-cols-[380px_1fr] divide-x-[1px] dark:divide-neutral-600 gap-4 lg:relative">

        <form
          className=" lg:relative"

          onSubmit={(e) => submitForm(e)}
        >
          <div className="flex flex-col gap-2 lg:gap-2 xl:fixed xl:top-[7%] xl:w-[380px]  border-neutral-600 pb-4 mb-[1px]">
            <div className='flex flex-col gap-1 relative'>
              <button onClick={handleExportPDF} title="Exportar para PDF" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded absolute right-0 top-[0px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.} stroke="currentColor" className="size-5  dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </button>

              <label className="text-[14px] font-medium dark:text-white" htmlFor="precatorio">Precatório</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="text"
                placeholder="Numero do precatório"
                name="precatorio"
                value={precatorio}
                onChange={(e) => setPrecatorio(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="orcamento">Orçamento</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="text"
                placeholder="Orçamento"
                name="orcamento"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="valorPrincipal">Valor principal</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="text"
                name="valorPrincipal"
                placeholder="Valor Principal"
                value={valorPrincipal}
                onChange={(e) => setValorPrincipal(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="valorJuros">Valor dos Juros</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="text"
                name="valorJuros"
                placeholder="Valor dos Juros"
                value={valorJuros}
                onChange={(e) => setValorJuros(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="rioPrevidencia">Rioprêvidencia</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="text"
                name="rioPrevidencia"
                placeholder="Rioprêvidencia"
                value={rioPrevidencia}
                onChange={(e) => setRioPrevidencia(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="dataBase">Data Base</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="date"
                name="dataBase"
                placeholder="Data Base"
                value={dataBaseStr}
                onChange={(e) => setDataBase(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="dataAtualizacao">Data de Atualização</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="date"
                name="dataAtualizacao"
                placeholder="Data de Atualização"
                value={dataAtualizacaoStr}
                onChange={(e) => setDataAtualizacao(e.target.value)}
              />
            </div>


            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black w-full mt-4 rounded p-1 font-medium cursor-pointer"
            >Fazer cálculo
            </button>

          </div>

        </form>




        <div ref={pdfContentRef} className="flex flex-col justify-center gap-4 px-4 xl:px-8">
          {/* Calculo Inicial */}
          <div className={showTabelaCalculoInicial ? "overflow-x-auto dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">Calculo Inicial</div>
              </div>
              <div className="grid grid-cols-3 overflow-x-auto w-full">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold text-nowrap">
                    Valor Principal
                  </div>
                  <div className="p-2 font-bold text-nowrap">Valor Juros</div>
                  <div className="p-2 font-bold text-nowrap">Valor Total</div>
                </div>

                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {calculoInicialData}
                  </div>
                  <div className="p-2">
                    {calculoInicialValorPrincipal}
                  </div>
                  <div className="p-2">{calculoInicialValorJuros}</div>
                  <div className="p-2">{calculoInicialValorTotal}</div>
                </div>

                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>

          {/* Parte até a IO */}

          <div className={showTabelaInicioPeriodoGraca ? "overflow-x-auto dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">
                  Início do Período da Graça
                </div>
              </div>
              <div className="grid grid-cols-3 overflow-x-auto w-full">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600 border-gray-300 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold">
                    Correção Monetária
                  </div>
                  <div className="p-2 pl-6 ">Fator</div>
                  <div className="p-2 pl-6 ">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6 ">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6 ">
                    Valor Total Corrigido
                  </div>
                  <div className="p-2 font-bold ">Juros</div>
                  <div className="p-2 pl-6 ">Número Dias</div>
                  <div className="p-2 pl-6 ">Taxa de Juros</div>
                  <div className="p-2 pl-6 ">Valor Juros</div>
                  <div className="p-2 font-bold ">
                    Valor Atualizado
                  </div>
                  <div className="p-2 pl-6   ">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6  ">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6  ">Valor Total</div>
                </div>

                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {inicioPeriodoGracaData}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioPeriodoGracaFator}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorTotalCorrigido}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioPeriodoGracaNumeroDias}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaTaxaJuros}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorJuros}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioPeriodoGracaAtualizadoValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaAtualizadoValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaAtualizadoValorTotal}
                  </div>
                </div>

                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600 border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">{inicioPeriodoGracaFatorObs}</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">{inicioPeriodoGracaTaxaJurosObs}</div>
                  <div className="p-2">
                    Correção Monetária do Valor Principal * Taxa de Juros
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>

          <div className={showTabelaInicioTaxaSelic ? "overflow-x-auto w-full dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">
                  Início Taxa Selic ({inicioTaxaSelicData})
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600 border-gray-300 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold">
                    Correção Monetária
                  </div>
                  <div className="p-2 pl-6">Fator</div>
                  <div className="p-2 pl-6">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Total Corrigido
                  </div>
                  <div className="p-2 font-bold">Juros</div>
                  <div className="p-2 pl-6">Número Dias</div>
                  <div className="p-2 pl-6">
                    Taxa de Juros
                  </div>
                  <div className="p-2 pl-6">Valor Juros</div>
                  <div className="p-2 font-bold">
                    Valor Atualizado
                  </div>
                  <div className="p-2 pl-6">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Total
                  </div>
                </div>

                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {inicioTaxaSelicData}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioTaxaSelicFator}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicValorTotalCorrigido}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioTaxaSelicNumeroDias}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicTaxaJuros}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicValorJuros}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioTaxaSelicAtualizadoValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicAtualizadoValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioTaxaSelicAtualizadoValorTotal}
                  </div>
                </div>

                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b  dark:border-neutral-600  border-gray-300 dark:divide-neutral-600 ">
                  <div className="p-2">-</div>
                  <div className="p-2 ">-</div>
                  <div className="p-2">
                    {inicioTaxaSelicFatorObs}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2 ">-</div>
                  <div className="p-2 ">-</div>
                  <div className="p-2  ">-</div>
                  <div className="p-2  ">-</div>
                  <div className="p-2 ">
                    {inicioTaxaSelicTaxaJurosObs}
                  </div>
                  <div className="p-2 ">
                    Correção Monetária do Valor Principal * Taxa de Juros
                  </div>
                  <div className="p-2 ">-</div>
                  <div className="p-2 ">-</div>
                  <div className="p-2  ">-</div>
                  <div className="p-2  ">-</div>
                </div>
              </div>
            </div>
          </div>

          {/* Inicio do Período da Graça 2 */}
          <div className={showTabelaInicioPeriodoGraca2 ? "overflow-x-auto w-full dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">
                  Início do Período da Graça
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold">
                    Correção Monetária / SELIC
                  </div>
                  <div className="p-2 pl-6">Fator</div>
                  <div className="p-2 pl-6">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Total Corrigido
                  </div>
                </div>
                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {inicioPeriodoGracaData}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioPeriodoGracaFator}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {inicioPeriodoGracaValorTotalCorrigido}
                  </div>
                </div>
                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600 ">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {inicioPeriodoGracaFatorObs}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>

          {/* Até o Final do Período da Graça */}
          <div className={showTabelaFinalPeriodoGraca ? "overflow-x-auto w-full dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">
                  Fim do Período da Graça ou Atualização
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold">
                    Correção Monetária
                  </div>
                  <div className="p-2 pl-6">Fator</div>
                  <div className="p-2 pl-6">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Total Corrigido
                  </div>
                </div>
                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {finalPeriodoGracaData}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {finalPeriodoGracaFator}
                  </div>
                  <div className="p-2">
                    {finalPeriodoGracaValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {finalPeriodoGracaValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {finalPeriodoGracaValorTotalCorrigido}
                  </div>
                </div>
                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600 ">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {finalPeriodoGracaFatorObs}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>

          {/* Até o Inicio da Selic */}
          <div className={showTabelaAteInicioSelic ? "overflow-x-auto w-full dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">
                  Até o Inicio da Selic
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold">
                    Correção Monetária
                  </div>
                  <div className="p-2 pl-6">Fator</div>
                  <div className="p-2 pl-6">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Total Corrigido
                  </div>
                </div>
                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {ateInicioSelicData}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {ateInicioSelicFator}
                  </div>
                  <div className="p-2">
                    {ateInicioSelicValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {ateInicioSelicValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {ateInicioSelicValorTotalCorrigido}
                  </div>
                </div>
                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600 ">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {ateInicioSelicFatorObs}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>


          {/*Cálculo Final */}
          <div className={showTabelaCalculoFinal ? "overflow-x-auto w-full dark:text-white" : 'hidden'}>
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] mt-4 font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">Cálculo Final</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2 font-bold">Data</div>
                  <div className="p-2 font-bold">
                    Correção Monetária / SELIC
                  </div>
                  <div className="p-2 pl-6">Fator</div>
                  <div className="p-2 pl-6">
                    Valor Principal Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Juros Corrigido
                  </div>
                  <div className="p-2 pl-6">
                    Valor Total Corrigido
                  </div>
                </div>
                <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">
                    {calculoFinalData}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {calculoFinalFator}
                  </div>
                  <div className="p-2">
                    {calculoFinalValorPrincipalCorrigido}
                  </div>
                  <div className="p-2">
                    {calculoFinalValorJurosCorrigido}
                  </div>
                  <div className="p-2">
                    {calculoFinalValorTotalCorrigido}
                  </div>
                </div>
                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600 ">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {calculoFinalFatorObs}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>



  )
}


