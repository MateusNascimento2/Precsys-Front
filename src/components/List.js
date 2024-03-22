import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

export default function List() {
  const [cessoes, setCessoes] = useState([])
  const [status, setStatus] = useState([])
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCessoes = async () => {
      try {
        const { data } = await axiosPrivate.get('/cessions', {
          signal: controller.signal
        })
        if (isMounted) setCessoes(data);
        console.log(data);
      } catch (err) {
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    }

    const getStatus = async () => {
      try {
        const { data } = await axiosPrivate.get('/status', {
          signal: controller.signal
        })
        if (isMounted) setStatus(data);
        console.log(data);
      } catch (err) {
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    }

    getCessoes();
    getStatus();

    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [])

  
  //ente + ano
  //natureza
  //data da cessao
  //empresa
  //tags
  let statusNome;

  return (
    <section className="mx-5 mt-4">
      {
      !cessoes ? (<p className="font-medium uppercase text-gray-400 text-[10px]">Nenhuma cessão encontrada.</p>)
      : cessoes?.length
        ? (
          <ul className="w-full flex flex-col gap-2">
            {Object.entries(cessoes).map(([key, cessao], index) => (
              <li className="shadow-sm border rounded px-2 py-1">
                <div className="flex border-b">
                  <div className="border-r pr-2 my-3 flex items-center justify-center">
                    <span className="font-[700]">{cessao.id}</span>
                  </div>
                  <div className="flex flex-col justify-center text-[12px] pl-2">
                    <span className="font-bold">{cessao.precatorio}</span>
                    <span className="text-neutral-400 font-medium line-clamp-1">{cessao.cedente}</span>
                  </div>
                </div>
                <div className="text-[10px] py-3 flex gap-2 items-center">
                {Object.entries(status).map(([key, status], index) => {
                    if (parseInt(cessao.status) === parseInt(status.id)) {
                      return <span style={{backgroundColor: `${status.extra}`}} className={`px-2 py-1 rounded brightness-110`}><span className="text-black font-bold">{status.nome}</span></span>
                    } else {
                      return null
                    }
                  })}

                  {cessao.ano ? <span className="bg-neutral-200 px-2 py-1 rounded text-gray-700 font-bold">{cessao.ano}</span> : null}


                </div>
              </li>
            ))}
          </ul>
        ) : <div className="mt-10 flex justify-center items-center"><LoadingSpinner /></div>
      }
    </section>
  )
}