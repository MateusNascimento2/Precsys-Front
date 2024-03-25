import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";
import { List } from 'react-virtualized'

export default function List({ searchQuery }) {
  const [cessoes, setCessoes] = useState([]);
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal
        });
        if (isMounted) setter(data);
        console.log(data);
      } catch (err) {
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    };

    fetchData('/cessoes', setCessoes);
    fetchData('/status', setStatus);
    fetchData('/orcamentos', setOrcamentos);
    fetchData('/natureza', setNatureza);
    fetchData('/empresas', setEmpresas);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const anuenciaValores = {
    "0": "Sem anuência",
    "1": "Honorários",
    "2": "Com anuência",
    "3": "Quitação"
  }

  const falecidoValores = {
    "0": "Vivo",
    "1": "Não deixou bens",
    "2": "Deixou bens",
  }

  Object.entries(cessoes).map(([key, cessao]) => {

    Object.entries(status).map(([key, status]) => {
      if (parseInt(cessao.status) === parseInt(status.id)) {
        cessao.status = status.nome
        cessao.statusColor = status.extra
      } else {
        return null
      }
    })

    Object.entries(orcamentos).map(([key, orcamento]) => {
      if (parseInt(cessao.ente_id) === parseInt(orcamento.id)) {
        cessao.ente_id = orcamento.apelido
      } else {
        return null
      }
    })

    Object.entries(natureza).map(([key, natureza]) => {
      if (parseInt(cessao.natureza) === parseInt(natureza.id)) {
        cessao.natureza = natureza.nome
      } else {
        return null
      }
    })

    Object.entries(empresas).map(([key, empresa]) => {
      if (parseInt(cessao.empresa_id) === parseInt(empresa.id)) {
        cessao.empresa_id = empresa.nome
      } else {
        return null
      }
    })

    Object.entries(anuenciaValores).map(([key, anuencia]) => {
      if (cessao.adv === key) {
        cessao.adv = anuencia
      } else {
        return null
      }
    })

    Object.entries(falecidoValores).map(([key, falecido]) => {
      if (cessao.falecido === key) {
        cessao.falecido = falecido
      } else {
        return null
      }
    })
  })

  console.log(cessoes);

  const filteredCessoes = cessoes.filter(cessao =>
    Object.entries(cessao).some(([key, value]) =>
      key !== 'substatus' &&
      key !== 'escritura' &&
      key !== 'operacao_tele' &&
      key !== 'financeiro_tele' &&
      key !== 'financeiro_escrevente' &&
      key !== 'financeiro_juridico' &&
      key !== 'juridico_feito' &&
      key !== 'juridico_feito_data' &&
      key !== 'juridico_afazer' &&
      key !== 'juridico_afazer_data' &&
      key !== 'juridico_andamentoatual' &&
      key !== 'juridico_andamentoatual_data' &&
      key !== 'juridico_andamentoantigo' &&
      key !== 'juridico_andamentoantigo_data' &&
      key !== 'juridico_obs' &&
      key !== 'juridico_obs_data' &&
      key !== 'obs' &&
      value && typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );


  return (
    <section className="mx-5 mt-4">
      {
        !filteredCessoes ? 
        (<p className="font-medium uppercase text-gray-400 text-[10px]">Nenhuma cessão encontrada.</p>)
          : filteredCessoes?.length > 0
            ? (
              <ul className="w-full flex flex-col gap-2">
                {filteredCessoes.map((cessao, index) => (
                  <li key={index} className="shadow-sm border rounded px-2 py-1">
                    <div className="flex border-b justify-between items-center">
                      <div className="flex">
                        <div className="border-r pr-2 my-3 flex items-center justify-center">
                          <span className="font-[700]">{cessao.id}</span>
                        </div>
                        <div className="flex flex-col justify-center text-[12px] pl-2">
                          <span className="font-bold">{cessao.precatorio}</span>
                          <span className="text-neutral-400 font-medium line-clamp-1">{cessao.cedente}</span>
                        </div>
                      </div>
                      <DotsButton cessaoID={cessao.id} requisitorioFile={cessao.requisitorio} escrituraFile={cessao.escritura} />
                    </div>
                    <div className="text-[10px] py-3 flex gap-2 flex-wrap items-center">

                      <span style={{ backgroundColor: `${cessao.statusColor}` }} className={`px-2 py-1 rounded brightness-110`}><span className="text-black font-bold">{cessao.status}</span></span>

                      <span className={`px-2 py-1 rounded flex gap-1 bg-neutral-200`}>
                        <span className="text-black font-bold">{cessao.ente_id}</span>
                        {cessao.ano ? <span className="font-bold">{cessao.ano}</span> : null}
                      </span>

                      <span className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{cessao.natureza}</span></span>

                      {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 font-bold">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}

                      {cessao.empresa_id ? (<span className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{cessao.empresa_id}</span></span>) : null}

                      {cessao.adv ? (<span className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{cessao.adv}</span></span>) : null}


                      {cessao.falecido ? (<span className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{cessao.falecido}</span></span>) : null}

                    </div>
                  </li>
                ))}
              </ul>
            ) : <div className="mt-10 flex justify-center items-center"><LoadingSpinner /></div>
      }
    </section>
  )
}