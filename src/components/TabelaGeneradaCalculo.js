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
    <div className="dark:bg-[#111] w-full mb-[60px] flex flex-col">
      <span className="font-[700] dark:text-white mb-[16px]" id="cessionarios">
        Cessionários
      </span>
      <div className="overflow-x-auto w-full">
        <div className="w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-600">
          <div className="min-w-[250px] w-[24%] dark:text-white">Calculo Inicial 11/11/2021</div>
        </div>
        <div className='grid grid-cols-3'>
          <div className="w-max lg:w-full border-l border-b flex flex-col divide-y text-[12px] dark:border-neutral-600  border-gray-300">
            <div className="min-w-[250px] p-2 font-bold">
              Data
            </div>
            <div className="min-w-[120px] p-2 font-bold  dark:text-neutral-200">
              Regime
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

          <div className="w-max lg:w-full flex flex-col border-r border-l border-b divide-y text-[12px]  border-gray-300">
            <div className="min-w-[250px] p-2 w-[24%]">
              11/11/2021
            </div>
            <div className="min-w-[120px] p-2 dark:text-neutral-200">
              Não Tributário
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 41.476,91
            </div>
            <div className="min-w-[60px] p-2  dark:text-neutral-200">
              R$ 28.513,75
            </div>
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              R$ 69.990,66
            </div>
          </div>

          <div className="w-max lg:w-full border-r divide-y flex flex-col text-[12px] border-b   border-gray-300">
            <div className="min-w-[250px] p-2 w-[24%]">
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
            <div className="min-w-[120px] p-2  dark:text-neutral-200">
              -
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}