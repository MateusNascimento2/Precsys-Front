import React from 'react';
import Header from './Header';
import TabelaGeneradaCalculo from './TabelaGeneradaCalculo';

export default function TabelaCalculo() {
  return (
    <>
      <Header />
      <main className='container max-w-[968px] mx-auto px-2 py-[120px]'>
        <TabelaGeneradaCalculo />
        <form class="p-2 ">
          <h2 class="text-lg font-bold mb-4 text-center">Modelo de Cálculo</h2>
          <div>
            <input class="border-b-[1px] border-gray-200 px-2 py-1 mb-4 w-full" type="text" name="numeroPrecatorio"
              id="numeroPrecatorio" placeholder="Numero do precatório" />
          </div>
          <div>
            <input class="border-b-[1px] border-gray-200 px-2 py-1 mb-4 w-full" type="text" name="database" id="database"
              placeholder="Database" maxlength="10" />
          </div>
          <div>
            <input class="border-b-[1px] border-gray-200 px-2 py-1 mb-4 w-full" type="text" name="valor-principal"
              id="valor-principal" placeholder="Valor principal" />
          </div>
          <div>
            <input class="border-b-[1px] border-gray-200 px-2 py-1 mb-4 w-full" type="text" name="valor-juros"
              id="valor-juros" placeholder="Valor dos juros" />
          </div>
          <fieldset class="mb-4">
            <legend class="mb-2">Pagamentos pleiteados:</legend>
            <div class="flex flex-col md:flex-row md:items-center">
              <label class="md:mr-2" for="data-inicio">Data de início:</label>
              <input class="border-b-[1px] border-gray-200 px-2 py-1 mt-2 mb-2 md:mr-10" type="date" name="data-inicio"
                id="data-inicio" />
              <label class="md:mr-2" for="data-final">Data final:</label>
              <input class="border-b-[1px] border-gray-200 px-2 py-1 mt-2 mb-2" type="date" name="data-final" id="data-final" />
            </div>
          </fieldset>
          <div>
            <input class="border-b-[1px] border-gray-200 px-2 py-1 mb-4 w-full" type="text" name="ano-orcamento"
              id="ano-orcamento" placeholder="Ano do orçamento" />
          </div>
          <div class="text-center">
            <input type="submit" value="Enviar" class="bg-gray-200 px-3 rounded cursor-pointer" />
          </div>
        </form>

        <div class="p-2 md:max-w-[768px] md:m-auto">
          <table class="mt-10 w-full m-auto">
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Data do cálculo</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600"><span>29/06/2016</span></td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">76.417,96</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">19.316,83</td>
            </tr>
            <tr>
              <th class="py-2 px-8 text-left font-medium text-zinc-700">Valor bruto</th>
              <td class="py-2 px-8 text-center text-zinc-600">95.734,79</td>
            </tr>
          </table>

          <table class="mt-10 w-full m-auto">
            <tr class="border-b-[1px] border-gray-200">
              <th class="py-2 px-8 font-bold" colspan="2"><span>29/06/2016</span> a <span>01/07/2018</span></th>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">IPCA-E</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">1,077588885</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">82.347,14</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros -
                atualização</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">20.815,60</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700" rowspan="2">Juros</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">11,14%</td>
            </tr>
            <tr>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">9.172,70</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">82.347,14</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">29.988,30</td>
            </tr>
            <tr>
              <th class="py-2 px-8 text-left font-medium text-zinc-700">Valor bruto</th>
              <td class="py-2 px-8 text-center text-zinc-600">112.335,45</td>
            </tr>
          </table>

          <table class="mt-10 w-full m-auto">
            <tr class="border-b-[1px] border-gray-200">
              <th class="py-2 px-8 font-bold" colspan="2"><span>01/07/2018</span> a <span>31/12/2019</span> (período da graça)
              </th>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">IPCA-E</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">1,043519498</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">85.930,85</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros -
                atualização</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">31.293,38</td>
            </tr>
            <tr>
              <th class="py-2 px-8 text-left font-medium text-zinc-700">Valor bruto</th>
              <td class="py-2 px-8 text-center text-zinc-600">117.224,23</td>
            </tr>
          </table>

          <table class="mt-10 w-full m-auto">
            <tr class="border-b-[1px] border-gray-200">
              <th class="py-2 px-8 font-bold" colspan="2"><span>31/12/2019</span> a <span>01/12/2021</span></th>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">IPCA-E</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">1,154001106</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">99.164,30</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros -
                atualização</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">36.112,60</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700" rowspan="2">Juros</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">4,55%</td>
            </tr>
            <tr>
              <td class="border-b-[1px] border-gray-200 py-2 px-8  text-left text-zinc-600">4.510,79</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">99.164,30</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">40.623,38</td>
            </tr>
            <tr>
              <th class="py-2 px-8 text-left font-medium text-zinc-700">Valor bruto</th>
              <td class="py-2 px-8 text-center text-zinc-600">139.787,68</td>
            </tr>
          </table>

          <table class="mt-10 w-full m-auto">
            <tr class="border-b-[1px] border-gray-200">
              <th class="py-2 px-8 font-bold" colspan="2"><span>01/12/2021</span> a <span>01/03/2023</span></th>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700" rowspan="2">SELIC</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">14,77%</td>
            </tr>
            <tr>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">14.646,57</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor principal</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">99.164,30</td>
            </tr>
            <tr>
              <th class="border-b-[1px] border-gray-200 py-2 px-8 text-left font-medium text-zinc-700">Valor dos juros</th>
              <td class="border-b-[1px] border-gray-200 py-2 px-8 text-center text-zinc-600">55.269,95</td>
            </tr>
            <tr>
              <th class="py-2 px-8 text-left font-medium text-zinc-700">Valor bruto</th>
              <td class="py-2 px-8 text-center text-zinc-600">154.434,24</td>
            </tr>
          </table>
        </div>
      </main>

    </>

  )
}