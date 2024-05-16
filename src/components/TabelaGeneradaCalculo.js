import React from 'react';

export default function TabelaGeneradaCalculo() {

  async function acharCorrecaoIPCA(data) {
    const mes = data[3] + data[4] + data[5];
    const ano = data[8] + data[9];
    const dataFim = mes + ano;

    const response = await fetch('./json/ipca.json')
    const result = await response.json();

    const valor = result.find((item) => {
      return item.Data === dataFim
    })

    //const value = valor.Valor
    return parseFloat(valor.Valor.replace(',', '.'));
  }

  async function acharJurosPoupanca(data1, data2) {
    const mes = data1[3] + data1[4] + data1[5];
    console.log(mes);
    const ano = data1[6] + data1[7] + data1[8] + data1[9];
    console.log(ano)
    const dataFim = mes + ano;

    const response = await fetch('./json/jurosPoupanca.json');
    const result = await response.json();

    let valor1 = result.findIndex((item) => {
      return item.Data === dataFim
    })

    let valor2 = result.findIndex((item) => {
      return item.Data === data2
    })

    let juros = 0;

    for (valor1; valor1 <= valor2; valor1++) {
      juros += parseFloat(result[valor1].RemuneracaoBasicaAcumulada)
    }


    console.log(juros);
  }


  async function acharSelic(data1, data2) {
    const response = await fetch('./json/selic.json');
    const result = await response.json();

    const valor1 = result.find((item) => {
      return item.Data === data1
    })

    const valor2 = result.find((item) => {
      return item.Data === data2
    })

    const selic = parseFloat(valor1.Valor.replace(',', '.')) - parseFloat(valor2.Valor.replace(',', '.'))

    console.log(selic);
  }

  function pegarDataVencimento(dataOrcamento) {
    if (dataOrcamento === '2017') {
      return '31/12/2017';
    } else if (dataOrcamento === '2018') {
      return '31/12/2018';
    } else if (dataOrcamento === '2019') {
      return '31/12/2019';
    } else if (dataOrcamento === '2020') {
      return '31/12/2020'
    } else if (dataOrcamento === '2021') {
      return '31/12/2021';
    } else if (dataOrcamento === '2022') {
      return '31/12/2022';
    } else if (dataOrcamento === '2023') {
      return '31/12/2023';
    } else if (dataOrcamento === '2024') {
      return '31/12/2024';
    }
  }

  function pegarDataInscricao(dataOrcamento) {
    if (dataOrcamento === '2017') {
      return '01/07/2017';
    } else if (dataOrcamento === '2018') {
      return '01/07/2018'
    } else if (dataOrcamento === '2019') {
      return '01/07/2019'
    } else if (dataOrcamento === '2020') {
      return '01/07/2019';
    } else if (dataOrcamento === '2021') {
      return '01/07/2020';
    } else if (dataOrcamento === '2022') {
      return '01/07/2021';
    } else if (dataOrcamento === '2023') {
      return '02/04/2022';
    } else if (dataOrcamento === '2024') {
      return '02/04/2023';
    }
  }

  return (
    <div className="dark:bg-neutral-900 w-full mb-[60px] flex flex-col gap-5">
      <form action="" className='flex flex-col gap-2'>
        <input type="text" placeholder='Precatório' />
        <input type="text" placeholder='Orçamento' />
        <input type="text" placeholder='Valor Principal' />
        <input type="text" placeholder='Valor Juros' />
        <input type="text" placeholder='Rioprêvidencia' />
        <input type="text" placeholder='Data Base' />
        <input type="date" placeholder='Data de Atualização' />
      </form>
 
      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-white">
          <div className="min-w-[250px] w-[24%] dark:text-white">Calculo Inicial</div>
        </div>
        <div className='grid grid-cols-3'>
          <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 font-bold dark:text-neutral-200">
              Data
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Valor Principal
            </div>
            <div className="min-w-[60px] p-2 font-bold   dark:text-neutral-200">
              Valor Juros
            </div>
            <div className="min-w-[120px] p-2 font-bold  dark:text-neutral-200">
              Valor Total
            </div>
          </div>

          <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200">
              05/05/2015
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 153.582,50
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              R$ 73.174,48
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 226.756,98
            </div>
          </div>

          <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200 ">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
          </div>

        </div>

      </div>

      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-white">
          <div className="min-w-[250px] w-[24%] dark:text-white">Início do Período da Graça</div>
        </div>
        <div className='grid grid-cols-3'>
          <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 font-bold dark:text-neutral-200">
              Data
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Correção Monetária
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Fator
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Principal Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Total Corrigido
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Juros
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Número Dias
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Taxa de Juros
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Valor Atualizado
            </div>
            <div className="min-w-[60px] p-2 pl-6   dark:text-neutral-200">
              Valor Principal Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6  dark:text-neutral-200">
              Valor Juros Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6  dark:text-neutral-200">
              Valor Total
            </div>
          </div>

          <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200">
              01/07/2019
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              1,23404742
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 189.528,09
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 90.300,78
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 279.828,87
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              1518
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              22,823400
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 43.256,75
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              R$ 189.528,09
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 133.557,53
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 323.085,62
            </div>
          </div>

          <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200 ">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              Entre as datas 05/05/2015 e 01/07/2019
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              Entre as datas 05/05/2015 e 01/07/2019
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              Correção Monetária do Valor Principal * Taxa de Juros
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
          </div>

        </div>

      </div>

      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-white">
          <div className="min-w-[250px] w-[24%] dark:text-white">Final do Período da Graça</div>
        </div>
        <div className='grid grid-cols-3'>
          <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 font-bold dark:text-neutral-200">
              Data
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Correção Monetária
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Fator
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Principal Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Total Corrigido
            </div>
          </div>

          <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200">
              31/12/2020
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              1,04728800
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 198.490,49
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 139.873,20
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 338.363,69
            </div>
          </div>

          <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200 ">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              Entre as datas 01/07/2019 e 31/12/2020
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
          </div>
        </div>

      </div>

      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-white">
          <div className="min-w-[250px] w-[24%] dark:text-white">Início Taxa Selic</div>
        </div>
        <div className='grid grid-cols-3'>
          <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 font-bold dark:text-neutral-200">
              Data
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Correção Monetária
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Fator
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Principal Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Total Corrigido
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Juros
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Número Dias
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Taxa de Juros
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Valor Atualizado
            </div>
            <div className="min-w-[60px] p-2 pl-6   dark:text-neutral-200">
              Valor Principal Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6  dark:text-neutral-200">
              Valor Juros Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6  dark:text-neutral-200">
              Valor Total
            </div>
          </div>

          <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200">
              01/12/2021
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              1,10730446
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 219.789,41
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 154.882,22
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 374.671,63
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              329
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              2,480000
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 5.450,78
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              R$ 219.789,41
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 160.333,00
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 380.122,40
            </div>
          </div>

          <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200 ">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              Entre as datas 05/05/2015 e 01/07/2019
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              Entre as datas 05/05/2015 e 01/07/2019
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              Correção Monetária do Valor Principal * Taxa de Juros
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
          </div>

        </div>

      </div>

      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-white">
          <div className="min-w-[250px] w-[24%] dark:text-white">Cálculo Final</div>
        </div>
        <div className='grid grid-cols-3'>
          <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 font-bold dark:text-neutral-200">
              Data
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Valor Base para Correção (01/12/2021)
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Valor Principal
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Total
            </div>
            <div className="min-w-[120px] p-2 font-bold dark:text-neutral-200">
              Correção Monetária
            </div>
            <div className="min-w-[60px] p-2 pl-6 dark:text-neutral-200">
              Fator
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Principal Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Juros Corrigido
            </div>
            <div className="min-w-[120px] p-2 pl-6 dark:text-neutral-200">
              Valor Total Corrigido
            </div>
          </div>

          <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200">
              12/12/2023
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              R$ 219.789,41
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 160.333,00
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 380.122,40
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              1,23920000
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 272.363,03
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 198.684,65
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 471.047,68
            </div>
          </div>

          <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300 dark:border-neutral-600 dark:divide-neutral-600">
            <div className="min-w-[250px] p-2 w-[24%] dark:text-neutral-200 ">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
            Entre as datas 01/12/2021 e 12/12/2023
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              -
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}