import React, { useState } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


export default function TabelaGeneradaCalculo() {
  const pdfContentRef = React.useRef(null); // Referência para o conteúdo do PDF

  const [precatorio, setPrecatorio] = useState("2019.02877-2");
  const [orcamento, setOrcamento] = useState("2020");
  const [valorPrincipal, setValorPrincipal] = useState(30759.41);
  const [valorJuros, setValorJuros] = useState(18962.09);
  const [rioPrevidencia, setRioPrevidencia] = useState("0");
  const [dataBase, setDataBase] = useState("2017-08-23");
  const [dataAtualizacao, setDataAtualizacao] = useState("2023-12-14");

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();
  const location = useLocation();

  //Impressão de Estados (Inicial)
  const [calculoInicialDataBase, setCalculoInicialDataBase] = useState("");
  const [calculoIncialPrincipal, setCalculoIncialPrincipal] = useState("");
  const [calculoIncialJuros, setCalculoIncialJuros] = useState("");
  const [calculoIncialTotal, setCalculoIncialTotal] = useState("");

  //Impressão de Estados (Segundo Quadrante / IPCAE)
  const [segundoQuadranteIPCAE1, setSegundoQuadranteIPCAE1] = useState("");
  const [segundoQuadranteIPCAE2, setSegundoQuadranteIPCAE2] = useState("");
  const [segundoQuadranteIPCAE3, setSegundoQuadranteIPCAE3] = useState("");
  const [segundoQuadranteIPCAE4, setSegundoQuadranteIPCAE4] = useState("");
  const [segundoQuadranteIPCAE5, setSegundoQuadranteIPCAE5] = useState("");
  const [segundoQuadranteIPCAE6, setSegundoQuadranteIPCAE6] = useState("");
  const [segundoQuadranteIPCAE7, setSegundoQuadranteIPCAE7] = useState("");
  const [segundoQuadranteIPCAE8, setSegundoQuadranteIPCAE8] = useState("");
  const [segundoQuadranteIPCAE9, setSegundoQuadranteIPCAE9] = useState("");
  const [segundoQuadranteIPCAE10, setSegundoQuadranteIPCAE10] = useState("");

  //Impressão de Estados (Terceiro Quadrante / IPCAE)
  const [terceiroQuadranteIPCAE1, setTerceiroQuadranteIPCAE1] = useState("");
  const [terceiroQuadranteIPCAE2, setTerceiroQuadranteIPCAE2] = useState("");
  const [terceiroQuadranteIPCAE3, setTerceiroQuadranteIPCAE3] = useState("");
  const [terceiroQuadranteIPCAE4, setTerceiroQuadranteIPCAE4] = useState("");
  const [terceiroQuadranteIPCAE5, setTerceiroQuadranteIPCAE5] = useState("");

  //Impressão de Estados (Quarto Quadrante / IPCA-E)
  const [quartoQuadranteIPCAE1, setQuartoQuadranteIPCAE1] = useState("");
  const [quartoQuadranteIPCAE2, setQuartoQuadranteIPCAE2] = useState("");
  const [quartoQuadranteIPCAE3, setQuartoQuadranteIPCAE3] = useState("");
  const [quartoQuadranteIPCAE4, setQuartoQuadranteIPCAE4] = useState("");
  const [quartoQuadranteIPCAE5, setQuartoQuadranteIPCAE5] = useState("");
  const [quartoQuadranteIPCAE6, setQuartoQuadranteIPCAE6] = useState("");
  const [quartoQuadranteIPCAE7, setQuartoQuadranteIPCAE7] = useState("");
  const [quartoQuadranteIPCAE8, setQuartoQuadranteIPCAE8] = useState("");
  const [quartoQuadranteIPCAE9, setQuartoQuadranteIPCAE9] = useState("");
  const [quartoQuadranteIPCAE10, setQuartoQuadranteIPCAE10] = useState("");

  //Impressão de Estados (Quarto Quadrante / Selic / Calculo Final)
  const [quartoQuadranteSELIC1, setQuartoQuadranteSELIC1] = useState("");
  const [quartoQuadranteSELIC2, setQuartoQuadranteSELIC2] = useState("");
  const [quartoQuadranteSELIC3, setQuartoQuadranteSELIC3] = useState("");
  const [quartoQuadranteSELIC4, setQuartoQuadranteSELIC4] = useState("");
  const [quartoQuadranteSELIC5, setQuartoQuadranteSELIC5] = useState("");
  const [quartoQuadranteSELIC6, setQuartoQuadranteSELIC6] = useState("");
  const [quartoQuadranteSELIC7, setQuartoQuadranteSELIC7] = useState("");
  const [quartoQuadranteSELIC8, setQuartoQuadranteSELIC8] = useState("");

  // States de Verificação de Campos
  const [verfDBToIO, setVerfDBToIO] = useState(4);
  const [verfVOToCF, setVerfVOToCF] = useState(4);

  function pegarDiasData(date1, date2) {
    // Verificar se as datas são válidas
    if (isNaN(date1) || isNaN(date2)) {
      throw new Error("Data inválida");
    }

    // Calcular a diferença em milissegundos
    const differenceInMilliseconds = date2 - date1;

    // Converter a diferença de milissegundos para dias
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    // Retornar a diferença em dias (arredondada)
    return Math.round(differenceInDays);
  }

  // Exemplo de uso:
  /*   const date1 = '2024-05-01';
  const date2 = '2024-05-23';
  const daysBetween = getDaysBetweenDates(date1, date2);
  console.log(daysBetween); // 22 */

  const handleDate = (date, setter) => {
    setter(date);
  };

  const getDataFromJSON = async (path) => {
    const controller = new AbortController();
    try {
      const { data } = await axiosPrivate.get(path, {
        signal: controller.signal
      })

      return data
    } catch (err) {
      console.error(err)
    }
    /*     const response = await fetch(path);
        const data = await response.json();
        return data; */
  };

  const fetchData = async (url, setter) => {
    try {
      const { data } = await axiosPrivate.get(url, {
        signal: controller.signal
      });
      if (isMounted) setter(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      navigate('/', { state: { from: location }, replace: true });
    }
  };

  const dateToPTBRFormat = (date) => {
    const dateInPTBR = date.split("-");
    return `${dateInPTBR[1]}/${dateInPTBR[2]}/${dateInPTBR[0]}`;
  };

  //Função usada para buscar por data nos arquivos JSON
  const dateToSearchInJSONFiles = (date) => {
    const dateFormated = date.split("/");
    if (parseInt(dateFormated[0]) < 10) {
      console.log("true");
      return `0${dateFormated[0]}/01/${dateFormated[2]}`;
    } else {
      return `${dateFormated[0]}/01/${dateFormated[2]}`;
    }
  };

  const procurarPorAlgumaCoisa = (x, arr) => {
    const objAchado = arr.filter((obj) => {
      for (const key in obj) {
        if (x === obj[key]) {
          return true;
        }
      }
      return false;
    });

    return objAchado;
  };

  const acharFator = (data, fator) => {
    const database = dateToSearchInJSONFiles(data.toLocaleDateString("en-US"));
    console.log(database);
    const resultadoDaBuscaNoFatorNT = fator.filter(
      (fator) => fator.Data.trim() === database.trim(),
    );
    return resultadoDaBuscaNoFatorNT[0].fatorNT;
  };

  const arrendondarTJ = (number, precision) => {
    // Multiplica o número pela potência de 10 e arredonda para o inteiro mais próximo
    const multiplier = Math.pow(10, precision);
    const roundedNumber = Math.round(number * multiplier) / multiplier;
    return roundedNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //Definindo Variaveis Mutaveis
      let valorPAt = parseFloat(valorPrincipal);
      let valorJAt = parseFloat(valorJuros);
      let valorTAt = 0;
      let valorNJ = 0;

      // Definindo Data Selic
      const dataSelic = new Date("12-01-2021");

      console.log("Data Selic:" + dataSelic);

      // Definindo Data Base
      const dataBSplit = dataBase.split("-");
      const dataB = new Date(
        dataBSplit[1] + "-" + dataBSplit[2] + "-" + dataBSplit[0],
      );
      const dataATSplit = dataAtualizacao.split("-");
      const dataAT = new Date(
        dataATSplit[1] + "-" + dataATSplit[2] + "-" + dataATSplit[0],
      );

      console.log("Data Atuaização:" + dataAT);

      // Definindo Datas Orçamento
      let dataIO = new Date("");
      let dataVO = new Date("");

      // Criando orçamentos
      if (orcamento === "2019") {
        dataIO = new Date("07-01-2018");
        dataVO = new Date("12-31-2019");
      } else if (orcamento === "2020") {
        dataIO = new Date("07-01-2019");
        dataVO = new Date("12-31-2020");
      } else if (orcamento === "2021") {
        dataIO = new Date("07-01-2020");
        dataVO = new Date("12-31-2021");
      } else if (orcamento === "2022") {
        dataIO = new Date("07-01-2021");
        dataVO = new Date("12-31-2022");
      } else if (orcamento === "2023") {
        dataIO = new Date("04-02-2022");
        dataVO = new Date("12-31-2023");
      } else if (orcamento === "2024") {
        dataIO = new Date("04-02-2023");
        dataVO = new Date("12-31-2024");
      } else if (orcamento === "2025") {
        dataIO = new Date("04-02-024");
        dataVO = new Date("12-31-2025");
      }

      console.log("Data Insc: " + dataIO);
      console.log("Data Venc: " + dataVO);

      // Iniciando Tabela Cálculo Inicial
      setCalculoInicialDataBase(dataB.toLocaleDateString("PT-BR"));
      setCalculoIncialPrincipal(
        valorPAt.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      );
      setCalculoIncialJuros(
        valorJAt.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      );
      setCalculoIncialTotal(
        (valorPAt + valorJAt).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );
      // Verificações

      //Pegando todas as informações do arquivo FatorNT.json
      const fatorNT = await getDataFromJSON("/fatorNT");
      console.log(fatorNT);

      //Pegando todas as informações do arquivo jurosPoupancaNovo.json
      const jurosPoupanca = await getDataFromJSON(
        "/jurosPoupanca",
      );
      console.log(jurosPoupanca);

      //Pegando todas as informações do arquivo selicAcumuladoJF.json
      const selicAcumuladoJF = await getDataFromJSON(
        "/selicAcumuladoJF",
      );

      // Da database até o período da graça
      if (dataB <= dataSelic && dataIO <= dataSelic) {
        console.log("corrigir pela IPCA/JP. (0)");
        setVerfDBToIO(0);

        // Correção(IPCA-E)! Juros Poupança!
        setSegundoQuadranteIPCAE1(dataIO.toLocaleDateString("PT-BR"));

        let varDataBtoDataVO =
          acharFator(dataB, fatorNT) / acharFator(dataIO, fatorNT);
        varDataBtoDataVO = arrendondarTJ(varDataBtoDataVO, 14);
        valorPAt = valorPAt * varDataBtoDataVO;
        valorJAt = valorJAt * varDataBtoDataVO;
        valorTAt = valorPAt + valorJAt;

        setSegundoQuadranteIPCAE2(arrendondarTJ(varDataBtoDataVO, 8));
        setSegundoQuadranteIPCAE3(
          valorPAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setSegundoQuadranteIPCAE4(
          valorJAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setSegundoQuadranteIPCAE5(
          valorTAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );

        let jurosPDataBtoDataVO =
          (acharFator(dataB, jurosPoupanca) - acharFator(dataIO, jurosPoupanca)) *
          100;
        valorNJ = (valorPAt * jurosPDataBtoDataVO) / 100;
        valorJAt = valorJAt + valorNJ;

        setSegundoQuadranteIPCAE6(pegarDiasData(dataB, dataIO));
        setSegundoQuadranteIPCAE7(arrendondarTJ(jurosPDataBtoDataVO, 6));
        setSegundoQuadranteIPCAE8(
          valorNJ.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setSegundoQuadranteIPCAE9(
          valorJAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setSegundoQuadranteIPCAE10(
          (valorPAt + valorJAt).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
      } else if (dataB <= dataSelic && dataIO >= dataSelic) {
        console.log(
          "Vai corrigir pelo IPCA/JP até a selic e depois corrigir até a IO",
        );
      } else if (dataB >= dataSelic) {
        console.log("Corrigir pela Selic até a IO");
      }

      // Da IO até o Final do Periodo da graça
      let varDataIOtoVO =
        acharFator(dataIO, fatorNT) / acharFator(dataVO, fatorNT);
      varDataIOtoVO = arrendondarTJ(varDataIOtoVO, 14);

      valorPAt = valorPAt * varDataIOtoVO;
      valorJAt = valorJAt * varDataIOtoVO;

      setTerceiroQuadranteIPCAE1(dataVO.toLocaleDateString("PT-BR"));
      setTerceiroQuadranteIPCAE2(arrendondarTJ(varDataIOtoVO, 8));
      setTerceiroQuadranteIPCAE3(
        valorPAt.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );
      setTerceiroQuadranteIPCAE4(
        valorJAt.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );
      setTerceiroQuadranteIPCAE5(
        (valorPAt + valorJAt).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );

      //Do final do período da graça até a Selic se tiver e depois até o pagamento.
      if (dataVO >= dataSelic) {
        console.log("Corrigir só pela Selic (Cálculo Final)");
      } else if (dataVO < dataSelic) {
        console.log(
          "Corrigir até o início da taxa selic e depois para a data de hoje! (Fazer Inicio taxa selic e depois até Calculo Final)",
        );

        setVerfVOToCF(0);

        // Correção(IPCA-E)! Juros Poupança!
        setQuartoQuadranteIPCAE1(dataSelic.toLocaleDateString("PT-BR"));

        let varDataVOtoDataSelic =
          acharFator(dataVO, fatorNT) / acharFator(dataSelic, fatorNT);
        varDataVOtoDataSelic = arrendondarTJ(varDataVOtoDataSelic, 14);
        valorPAt = valorPAt * varDataVOtoDataSelic;
        valorJAt = valorJAt * varDataVOtoDataSelic;
        valorTAt = valorPAt + valorJAt;

        setQuartoQuadranteIPCAE2(arrendondarTJ(varDataVOtoDataSelic, 8));
        setQuartoQuadranteIPCAE3(
          valorPAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteIPCAE4(
          valorJAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteIPCAE5(
          valorTAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );

        let jurosPDataVOtoDataSelic =
          (acharFator(dataVO, jurosPoupanca) -
            acharFator(dataSelic, jurosPoupanca)) *
          100;
        valorNJ = (valorPAt * jurosPDataVOtoDataSelic) / 100;
        valorJAt = valorJAt + valorNJ;

        setQuartoQuadranteIPCAE6(pegarDiasData(dataVO, dataSelic));
        setQuartoQuadranteIPCAE7(arrendondarTJ(jurosPDataVOtoDataSelic, 6));
        setQuartoQuadranteIPCAE8(
          valorNJ.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteIPCAE9(
          valorJAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteIPCAE10(
          (valorPAt + valorJAt).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );

        // Correção Calculo Final (Selic)!
        setQuartoQuadranteSELIC1(dataAT.toLocaleDateString("PT-BR"));

        setQuartoQuadranteSELIC2(
          valorPAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteSELIC3(
          valorJAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteSELIC4(
          (valorPAt + valorJAt).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );

        let varDataSelictoDataAT =
          acharFator(dataSelic, selicAcumuladoJF) -
          acharFator(dataAT, selicAcumuladoJF) +
          1;
        varDataSelictoDataAT = arrendondarTJ(varDataSelictoDataAT, 14);
        setQuartoQuadranteSELIC5(arrendondarTJ(varDataSelictoDataAT, 6));

        valorPAt = valorPAt * varDataSelictoDataAT;
        valorJAt = valorJAt * varDataSelictoDataAT;
        valorTAt = valorPAt + valorJAt;

        setQuartoQuadranteSELIC6(
          valorPAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteSELIC7(
          valorJAt.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
        setQuartoQuadranteSELIC8(
          (valorPAt + valorJAt).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        );
      }

      console.log("Testar a formatação!");

      const dataBaseInPTBR = dateToPTBRFormat(dataBase);
      const dataAtualizacaoInPTBR = dateToPTBRFormat(dataAtualizacao);
      console.log("Arriba: " + calculoInicialDataBase);

    } catch (e) {
      console.log(e)
    }


  };

  /*   React.useEffect(() => {
      handleSubmit();
    }, [precatorio, rioPrevidencia, valorPrincipal, valorJuros, dataBase, dataAtualizacao, orcamento]); */

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

  return (

    <main className="px-2 lg:px-[30px]">
      <div className="w-full mb-[60px] flex flex-col lg:grid lg:grid-cols-[380px_1fr] divide-x-[1px] dark:divide-neutral-600 gap-4 lg:relative">

        <form
          className=" lg:relative"

          onSubmit={(e) => handleSubmit(e)}
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
                value={dataBase}
                onChange={(e) => handleDate(e.target.value, setDataBase)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="text-[14px] font-medium dark:text-white" htmlFor="dataAtualizacao">Data de Atualização</label>
              <input
                className="dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400"
                type="date"
                name="dataAtualizacao"
                placeholder="Data de Atualização"
                value={dataAtualizacao}
                onChange={(e) => handleDate(e.target.value, setDataAtualizacao)}
              />
            </div>


            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black w-full mt-4 rounded p-1 font-medium cursor-pointer"
            >Fazer cálculo</button>

          </div>


        </form>
        <div ref={pdfContentRef} className="flex flex-col justify-center gap-4 px-4 xl:px-8">
          {/* Calculo Inicial */}
          <div className="overflow-x-auto dark:text-white">
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
                    {calculoInicialDataBase}
                  </div>
                  <div className="p-2">
                    {calculoIncialPrincipal}
                  </div>
                  <div className="p-2">{calculoIncialJuros}</div>
                  <div className="p-2">{calculoIncialTotal}</div>
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

          <div className="overflow-x-auto dark:text-white">
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
                    {segundoQuadranteIPCAE1}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE2}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE3}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE4}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE5}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE6}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE7}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE8}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE3}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE9}
                  </div>
                  <div className="p-2">
                    {segundoQuadranteIPCAE10}
                  </div>
                </div>

                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600 border-gray-300 dark:divide-neutral-600">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
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

          {/* Até o Final do Período da Graça */}
          <div className="overflow-x-auto w-full dark:text-white">
            <div className="w-max md:w-full">
              <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                <div className="w-full">
                  Final do Período da Graça
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
                    {terceiroQuadranteIPCAE1}
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    {terceiroQuadranteIPCAE2}
                  </div>
                  <div className="p-2">
                    {terceiroQuadranteIPCAE3}
                  </div>
                  <div className="p-2">
                    {terceiroQuadranteIPCAE4}
                  </div>
                  <div className="p-2">
                    {terceiroQuadranteIPCAE5}
                  </div>
                </div>
                <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600 ">
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">
                    Entre as datas 01/07/2019 e 31/12/2020
                  </div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                  <div className="p-2">-</div>
                </div>
              </div>
            </div>

          </div>

          <>

            <div>
              {/*Até Selic e depois Cálculo Final */}
              <div className="overflow-x-auto w-full dark:text-white">
                <div className="w-max md:w-full">
                  <div className="w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                    <div className="w-full">
                      Início Taxa Selic
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
                        {quartoQuadranteIPCAE1}
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE2}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE3}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE4}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE5}
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE6}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE7}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE8}
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE3}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE9}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteIPCAE10}
                      </div>
                    </div>

                    <div className="w-full border-r divide-y flex flex-col text-[12px] border-b  dark:border-neutral-600  border-gray-300 dark:divide-neutral-600 ">
                      <div className="p-2">-</div>
                      <div className="p-2 ">-</div>
                      <div className="p-2">
                        Entre as datas 05/05/2015 e 01/07/2019
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2 ">-</div>
                      <div className="p-2 ">-</div>
                      <div className="p-2  ">-</div>
                      <div className="p-2  ">-</div>
                      <div className="p-2 ">
                        Entre as datas 05/05/2015 e 01/07/2019
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

              <div className="overflow-x-auto w-full dark:text-white">
                <div className="w-max md:w-full">
                  <div className="w-full flex text-[12px] mt-4 font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-700">
                    <div className="w-full">Cálculo Final</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600 border-gray-300 dark:divide-neutral-600">
                      <div className="p-2 font-bold ">Data</div>
                      <div className="p-2 font-bold ">
                        Valor Base para Correção (01/12/2021)
                      </div>
                      <div className="p-2 pl-6 ">
                        Valor Principal
                      </div>
                      <div className="p-2 pl-6 ">Valor Juros</div>
                      <div className="p-2 pl-6 ">Valor Total</div>
                      <div className="p-2 font-bold ">
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
                    </div>

                    <div className="w-full flex flex-col border-r border-l border-b divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600 ">
                      <div className="p-2">
                        {quartoQuadranteSELIC1}
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2">
                        {quartoQuadranteSELIC2}
                      </div>
                      <div className="p-2 ">
                        {quartoQuadranteSELIC3}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteSELIC4}
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2">
                        {quartoQuadranteSELIC5}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteSELIC6}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteSELIC7}
                      </div>
                      <div className="p-2">
                        {quartoQuadranteSELIC8}
                      </div>
                    </div>

                    <div className="w-full border-r divide-y flex flex-col text-[12px] border-b dark:border-neutral-600   border-gray-300 dark:divide-neutral-600">
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                      <div className="p-2">
                        Entre as datas 01/12/2021 e 12/12/2023
                      </div>
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                      <div className="p-2">-</div>
                    </div>
                  </div>
                </div>

              </div>



            </div>
          </>
        </div>

      </div>
    </main>



  )
}
