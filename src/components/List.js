import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import DotsButton from "./DotsButton";

export default function List() {
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

  return (
    <section className="mx-5 mt-4">
      {
        !cessoes ? (<p className="font-medium uppercase text-gray-400 text-[10px]">Nenhuma cessão encontrada.</p>)
          : cessoes?.length
            ? (
              <ul className="w-full flex flex-col gap-2">
                {Object.entries(cessoes).map(([key, cessao], index) => (
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
                      {Object.entries(status).map(([key, status], index) => {
                        if (parseInt(cessao.status) === parseInt(status.id)) {
                          return <span key={index} style={{ backgroundColor: `${status.extra}` }} className={`px-2 py-1 rounded brightness-110`}><span className="text-black font-bold">{status.nome}</span></span>
                        } else {
                          return null
                        }
                      })}

                      {Object.entries(orcamentos).map(([key, orcamento], index) => {
                        if (parseInt(cessao.ente_id) === parseInt(orcamento.id)) {
                          return <span key={index} className={`px-2 py-1 rounded flex gap-1 bg-neutral-200`}>
                            <span className="text-black font-bold">{orcamento.apelido}</span>

                            {cessao.ano ? <span className="font-bold">{cessao.ano}</span> : null}

                          </span>
                        } else {
                          return null
                        }
                      })}

                      {Object.entries(natureza).map(([key, natureza], index) => {
                        if (parseInt(cessao.natureza) === parseInt(natureza.id)) {
                          return <span key={index} className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{natureza.nome}</span></span>
                        } else {
                          return null
                        }
                      })}

                      {cessao.data_cessao ? (<span className="px-2 py-1 rounded bg-neutral-200 font-bold">{cessao.data_cessao.split('-')[2]}/{cessao.data_cessao.split('-')[1]}/{cessao.data_cessao.split('-')[0]}</span>) : null}

                      {Object.entries(empresas).map(([key, empresa], index) => {
                        if (parseInt(cessao.empresa_id) === parseInt(empresa.id)) {
                          return <span key={index} className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{empresa.nome}</span></span>
                        } else {
                          return null
                        }
                      })}


                      {Object.entries(anuenciaValores).map(([key, anuencia], index) => {
                        if (cessao.adv === key) {
                          return <span key={index} className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{anuencia}</span></span>
                        } else {
                          return null
                        }
                      })}

                      {Object.entries(falecidoValores).map(([key, falecido], index) => {
                        if (cessao.falecido === key) {
                          return <span key={index} className={`px-2 py-1 rounded bg-neutral-200`}><span className="text-black font-bold">{falecido}</span></span>
                        } else {
                          return null
                        }
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : <div className="mt-10 flex justify-center items-center"><LoadingSpinner /></div>
      }
    </section>
  )
}