import React from 'react';
import Modal from './Modal';
import EditarCessionario from './EditarCessionario';

export default function ListaCessionarios({ cessionario, precInfo, users }) {
  function changeStringFloat(a) {
    const virgulaParaBarra = a.replace(',', '/');
    const valorSemPonto = virgulaParaBarra.replace(/\./g, '');
    const semMoeda = valorSemPonto.replace('R$ ', '');
    const barraParaPonto = semMoeda.replace('/', '.');
    const valorFloat = Number(barraParaPonto);
    return valorFloat;
  }

  function localeTwoDecimals(a) {

    if (Number.isInteger(a)) {
      return a.toLocaleString() + ",00";
    } else {
      return a.toLocaleString();
    }

  }

  function changePorcentagemToFloat(numero) {
    const valorSemPorcentagem = parseFloat(numero.replace(',', '.'))
    return valorSemPorcentagem
  }


  const valorPagoTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changeStringFloat(currentValue.valor_pago)
  }, 0)

  const valorComissaoTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changeStringFloat(currentValue.comissao)
  }, 0)

  const valorExpTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changeStringFloat(currentValue.exp_recebimento)
  }, 0)

  const valorPorcentagemTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changePorcentagemToFloat(currentValue.percentual);
  }, 0)

  console.log(cessionario)

  return (
    cessionario.length !== 0 ? (
      <div className='w-full mb-[60px] flex flex-col'>
        <div className='mb-[16px] flex items-center gap-5'>
          <span className="font-[700] dark:text-white " id='cessionarios'>Cessionários</span>

        </div>
        <div className='overflow-x-auto w-full'>
          <div className='w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-600'>
            <div className='min-w-[250px] w-[24%] dark:text-white'>Nome</div>
            <div className='min-w-[120px] w-[15%] text-center dark:text-white'>valor pago</div>
            <div className='min-w-[120px] w-[17%] text-center dark:text-white'>comissão</div>
            <div className='min-w-[60px] w-[5%] text-center dark:text-white'>%</div>
            <div className='min-w-[120px] w-[17%] text-center dark:text-white'>expectativa</div>
            <div className='min-w-[180px] w-[18%] text-center dark:text-white'>nota</div>
            <div className='min-w-[50px] w-[5%] ml-auto text-center dark:text-white'>.</div>
          </div>
          {cessionario.map(c => (
            <div className='w-max lg:w-full flex text-[12px] items-center border-b dark:border-neutral-600 last:border-0 py-[10px] border-gray-300' key={c.id}>
              <div className='min-w-[250px] w-[24%]'>
                <div className="flex flex-col justify-center text-[12px]">
                  <span className="font-bold dark:text-neutral-200">{c.nome_user} </span>
                  <span className=" text-neutral-400 font-medium">{c.cpfcnpj}</span>
                </div>
              </div>
              <div className='min-w-[120px] w-[15%] text-center dark:text-neutral-200'>{c.valor_pago}</div>
              <div className='min-w-[120px] w-[17%] text-center dark:text-neutral-200'>{c.comissao}</div>
              <div className='min-w-[60px] w-[5%] text-center dark:text-neutral-200'>{c.percentual}</div>
              <div className='min-w-[120px] w-[17%] text-center dark:text-neutral-200'>{c.exp_recebimento}</div>
              <div className='min-w-[180px] w-[18%] text-center'><a href="" className='hover:underline dark:text-neutral-200'>{c.nota ? c.nota.split('/')[1] : ''}</a></div>
              <div className='min-w-[50px] w-[5%] ml-auto flex justify-center dark:text-neutral-200'>
                <Modal
                  botaoAbrirModal={
                    <button className='hover:bg-neutral-100 flex items-center text-center justify-center dark:hover:bg-neutral-800 rounded p-[1px]'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                  }
                  tituloModal={`Editar cessionário #${c.id}`}>
                  <EditarCessionario cessionario={c} users={users}/>
                </Modal>
              </div>
            </div>

          ))}
          <div className='w-max lg:w-full flex text-[12px] items-center border-b last:border-0 py-[10px] border-gray-300'>
            <div className='min-w-[250px] w-[24%]'>
              <div className="flex flex-col justify-center text-[12px]">
                <span className="font-bold dark:text-white">TOTAL </span>
              </div>
            </div>
            <div className='min-w-[120px] w-[15%] font-bold text-center dark:text-neutral-200'>R$ {localeTwoDecimals(valorPagoTotal)}</div>
            <div className='min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200'>R$ {localeTwoDecimals(valorComissaoTotal)}</div>
            <div className='min-w-[60px] w-[5%] font-bold text-center dark:text-neutral-200'>{valorPorcentagemTotal.toLocaleString()}%</div>
            <div className='min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200'>R$ {localeTwoDecimals(valorExpTotal)}</div>
            <div className='min-w-[180px] w-[18%] text-center dark:text-neutral-200'></div>
            <div className='min-w-[50px] w-[5%] ml-auto text-center dark:text-neutral-200'></div>
          </div>

        </div>
      </div>
    ) : null
  )
}