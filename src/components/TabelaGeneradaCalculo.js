import React, { useState } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';


export default function TabelaGeneradaCalculo() {
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
    e.preventDefault();

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
  };

  return (

    <main className="container max-w-[1024px] mx-auto px-2 py-[20px]">
      <div className="w-full mb-[60px] flex flex-col gap-5">
        <form
          action=""
          className="flex flex-col gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="text"
            placeholder="Precatório"
            value={precatorio}
            onChange={(e) => setPrecatorio(e.target.value)}
          />
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="text"
            placeholder="Orçamento"
            value={orcamento}
            onChange={(e) => setOrcamento(e.target.value)}
          />
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="text"
            placeholder="Valor Principal"
            value={valorPrincipal}
            onChange={(e) => setValorPrincipal(e.target.value)}
          />
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="text"
            placeholder="Valor Juros"
            value={valorJuros}
            onChange={(e) => setValorJuros(e.target.value)}
          />
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="text"
            placeholder="Rioprêvidencia"
            value={rioPrevidencia}
            onChange={(e) => setRioPrevidencia(e.target.value)}
          />
          <label>Data Base</label>
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="date"
            placeholder="Data Base"
            value={dataBase}
            onChange={(e) => handleDate(e.target.value, setDataBase)}
          />
          <label>Data de Atualização</label>
          <input
            className="p-1 border bg-neutral-100 rounded"
            type="date"
            placeholder="Data de Atualização"
            value={dataAtualizacao}
            onChange={(e) => handleDate(e.target.value, setDataAtualizacao)}
          />
          <input
            type="submit"
            className="bg-neutral-200 rounded p-1 font-medium cursor-pointer"
          ></input>
        </form>
        {calculoInicialDataBase !== "" ? (
          // Calculo Inicial
          <div className="overflow-x-auto w-full">
            <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111]">
              <div className="min-w-[250px] w-[24%]">Calculo Inicial</div>
            </div>
            <div className="grid grid-cols-3">
              <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px]">
                <div className="min-w-[250px] p-2 font-bold">Data</div>
                <div className="min-w-[120px] p-2 font-bold">
                  Valor Principal
                </div>
                <div className="min-w-[60px] p-2 font-bold">Valor Juros</div>
                <div className="min-w-[120px] p-2 font-bold">Valor Total</div>
              </div>

              <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300">
                <div className="min-w-[250px] p-2 w-[24%]">
                  {calculoInicialDataBase}
                </div>
                <div className="min-w-[120px] p-2">
                  {calculoIncialPrincipal}
                </div>
                <div className="min-w-[60px] p-2">{calculoIncialJuros}</div>
                <div className="min-w-[120px] p-2">{calculoIncialTotal}</div>
              </div>

              <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300">
                <div className="min-w-[250px] p-2 w-[24%]">-</div>
                <div className="min-w-[120px] p-2">-</div>
                <div className="min-w-[120px] p-2">-</div>
                <div className="min-w-[60px] p-2">-</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {
          // Parte até a IO
          verfDBToIO == 0 ? (
            <div className="overflow-x-auto w-full">
              <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111]">
                <div className="min-w-[250px] w-[24%]">
                  Início do Período da Graça
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] border-gray-300">
                  <div className="min-w-[250px] p-2 font-bold">Data</div>
                  <div className="min-w-[120px] p-2 font-bold">
                    Correção Monetária
                  </div>
                  <div className="min-w-[60px] p-2 pl-6 ">Fator</div>
                  <div className="min-w-[120px] p-2 pl-6 ">
                    Valor Principal Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 pl-6 ">
                    Valor Juros Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 pl-6 ">
                    Valor Total Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 font-bold ">Juros</div>
                  <div className="min-w-[60px] p-2 pl-6 ">Número Dias</div>
                  <div className="min-w-[120px] p-2 pl-6 ">Taxa de Juros</div>
                  <div className="min-w-[120px] p-2 pl-6 ">Valor Juros</div>
                  <div className="min-w-[120px] p-2 font-bold ">
                    Valor Atualizado
                  </div>
                  <div className="min-w-[60px] p-2 pl-6   ">
                    Valor Principal Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 pl-6  ">
                    Valor Juros Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 pl-6  ">Valor Total</div>
                </div>

                <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300">
                  <div className="min-w-[250px] p-2 w-[24%] ">
                    {segundoQuadranteIPCAE1}
                  </div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">
                    {segundoQuadranteIPCAE2}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE3}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE4}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE5}
                  </div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">
                    {segundoQuadranteIPCAE6}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE7}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE8}
                  </div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">
                    {segundoQuadranteIPCAE3}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE9}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {segundoQuadranteIPCAE10}
                  </div>
                </div>

                <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300">
                  <div className="min-w-[250px] p-2 w-[24%]  ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2 ">
                    Correção Monetária do Valor Principal * Taxa de Juros
                  </div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">-</div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        }
        {
          // Até o Final do Período da Graça
          terceiroQuadranteIPCAE1 != "" ? (
            <div className="overflow-x-auto w-full">
              <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111]">
                <div className="min-w-[250px] w-[24%]">
                  Final do Período da Graça
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px]  border-gray-300">
                  <div className="min-w-[250px] p-2 font-bold ">Data</div>
                  <div className="min-w-[120px] p-2 font-bold ">
                    Correção Monetária
                  </div>
                  <div className="min-w-[60px] p-2 pl-6 ">Fator</div>
                  <div className="min-w-[120px] p-2 pl-6 ">
                    Valor Principal Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 pl-6 ">
                    Valor Juros Corrigido
                  </div>
                  <div className="min-w-[120px] p-2 pl-6 ">
                    Valor Total Corrigido
                  </div>
                </div>
                <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300">
                  <div className="min-w-[250px] p-2 w-[24%] ">
                    {terceiroQuadranteIPCAE1}
                  </div>
                  <div className="min-w-[120px] p-2  ">-</div>
                  <div className="min-w-[60px] p-2  ">
                    {terceiroQuadranteIPCAE2}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {terceiroQuadranteIPCAE3}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {terceiroQuadranteIPCAE4}
                  </div>
                  <div className="min-w-[120px] p-2  ">
                    {terceiroQuadranteIPCAE5}
                  </div>
                </div>
                <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 ">
                  <div className="min-w-[250px] p-2 w-[24%]  ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2  ">
                    Entre as datas 01/07/2019 e 31/12/2020
                  </div>
                  <div className="min-w-[60px] p-2  ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                  <div className="min-w-[120px] p-2 ">-</div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        }
        {
          // Até Selic e depois Cálculo Final
          verfVOToCF == 0 ? (
            <>
              <div>
                <div className="overflow-x-auto w-full">
                  <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111]">
                    <div className="min-w-[250px] w-[24%]">
                      Início Taxa Selic
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] border-gray-300">
                      <div className="min-w-[250px] p-2 font-bold ">Data</div>
                      <div className="min-w-[120px] p-2 font-bold ">
                        Correção Monetária
                      </div>
                      <div className="min-w-[60px] p-2 pl-6 ">Fator</div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Valor Principal Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Valor Juros Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Valor Total Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 font-bold ">Juros</div>
                      <div className="min-w-[60px] p-2 pl-6 ">Número Dias</div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Taxa de Juros
                      </div>
                      <div className="min-w-[120px] p-2 pl-6 ">Valor Juros</div>
                      <div className="min-w-[120px] p-2 font-bold ">
                        Valor Atualizado
                      </div>
                      <div className="min-w-[60px] p-2 pl-6   ">
                        Valor Principal Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 pl-6  ">
                        Valor Juros Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 pl-6  ">
                        Valor Total
                      </div>
                    </div>

                    <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300">
                      <div className="min-w-[250px] p-2 w-[24%] ">
                        {quartoQuadranteIPCAE1}
                      </div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">
                        {quartoQuadranteIPCAE2}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE3}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE4}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE5}
                      </div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">
                        {quartoQuadranteIPCAE6}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE7}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE8}
                      </div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">
                        {quartoQuadranteIPCAE3}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE9}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteIPCAE10}
                      </div>
                    </div>

                    <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 ">
                      <div className="min-w-[250px] p-2 w-[24%]  ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2  ">
                        Entre as datas 05/05/2015 e 01/07/2019
                      </div>
                      <div className="min-w-[60px] p-2  ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">-</div>
                      <div className="min-w-[120px] p-2 ">
                        Entre as datas 05/05/2015 e 01/07/2019
                      </div>
                      <div className="min-w-[120px] p-2 ">
                        Correção Monetária do Valor Principal * Taxa de Juros
                      </div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">-</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111]">
                    <div className="min-w-[250px] w-[24%]">Cálculo Final</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] border-gray-300">
                      <div className="min-w-[250px] p-2 font-bold ">Data</div>
                      <div className="min-w-[120px] p-2 font-bold ">
                        Valor Base para Correção (01/12/2021)
                      </div>
                      <div className="min-w-[60px] p-2 pl-6 ">
                        Valor Principal
                      </div>
                      <div className="min-w-[120px] p-2 pl-6 ">Valor Juros</div>
                      <div className="min-w-[120px] p-2 pl-6 ">Valor Total</div>
                      <div className="min-w-[120px] p-2 font-bold ">
                        Correção Monetária
                      </div>
                      <div className="min-w-[60px] p-2 pl-6 ">Fator</div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Valor Principal Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Valor Juros Corrigido
                      </div>
                      <div className="min-w-[120px] p-2 pl-6 ">
                        Valor Total Corrigido
                      </div>
                    </div>

                    <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300 ">
                      <div className="min-w-[250px] p-2 w-[24%] ">
                        {quartoQuadranteSELIC1}
                      </div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">
                        {quartoQuadranteSELIC2}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteSELIC3}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteSELIC4}
                      </div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">
                        {quartoQuadranteSELIC5}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteSELIC6}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteSELIC7}
                      </div>
                      <div className="min-w-[120px] p-2  ">
                        {quartoQuadranteSELIC8}
                      </div>
                    </div>

                    <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300">
                      <div className="min-w-[250px] p-2 w-[24%]  ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2  ">-</div>
                      <div className="min-w-[60px] p-2  ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2  ">
                        Entre as datas 01/12/2021 e 12/12/2023
                      </div>
                      <div className="min-w-[60px] p-2  ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                      <div className="min-w-[120px] p-2 ">-</div>
                    </div>
                  </div>
                </div>
              </div>
              ;
            </>
          ) : (
            ""
          )
        }
      </div>
    </main>



  )
}
