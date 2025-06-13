import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { axiosPrivate } from '../api/axios';
import useAuth from "../hooks/useAuth";

export default function NumerosPerfil({ user }) {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [cessoesUsuario, setCessoesUsuario] = useState([]);

  const [expAReceber, setExpAReceber] = useState(0);
  const [expRecebida, setExpRecebida] = useState(0);
  const [valorGasto, setValorGasto] = useState(0);
  const [comissao, setComissao] = useState(0);
  const [qtdCessao, setQtdCessao] = useState(0);

  function changeStringFloat(a) {
    const virgulaParaBarra = a.replace(',', '/');
    const valorSemPonto = virgulaParaBarra.replace(/\./g, '');
    const semMoeda = valorSemPonto.replace('R$ ', '');
    const barraParaPonto = semMoeda.replace('/', '.');
    const valorFloat = Number(barraParaPonto);
    return valorFloat;
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });
        if (isMounted) setState(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(`/dashboard/${user.id}`, setCessoesUsuario);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user.id]);


  useEffect(() => {
    if (cessoesUsuario.length > 0) {

      const totalExpAReceber = cessoesUsuario
        .filter(cessao => cessao.status !== 'Recebido')
        .reduce((total, cessao) => total + parseFloat(changeStringFloat(cessao.exp_recebimento)), 0);

      const totalExpRecebida = cessoesUsuario
        .filter(cessao => cessao.status === 'Recebido')
        .reduce((total, cessao) => total + parseFloat(changeStringFloat(cessao.exp_recebimento)), 0);

      const totalValorGasto = cessoesUsuario
        .reduce((total, cessao) => total + parseFloat(changeStringFloat(cessao.valor_pago)), 0);

      const totalComissao = cessoesUsuario
        .reduce((total, cessao) => total + parseFloat(changeStringFloat(cessao.comissao)), 0);

      setExpAReceber(totalExpAReceber);
      setExpRecebida(totalExpRecebida);
      setValorGasto(totalValorGasto);
      setComissao(totalComissao);
      setQtdCessao(cessoesUsuario.length);
    }
  }, [cessoesUsuario])



  return (
    <>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Exp. A Receber</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>
            <CountUp
              start={0}
              end={expAReceber}
              duration={2.5}
              decimals={2}
              prefix="R$ "
              separator="."
              decimal=","
            />
          </span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Exp. Recebida</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>
            <CountUp
              start={0}
              end={expRecebida}
              duration={2.5}
              decimals={2}
              prefix="R$ "
              separator="."
              decimal=","
            />
          </span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Valor Gasto</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>
            <CountUp
              start={0}
              end={valorGasto}
              duration={2.5}
              decimals={2}
              prefix="R$ "
              separator="."
              decimal=","
            />
          </span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Comissão</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>
            <CountUp
              start={0}
              end={comissao}
              duration={2.5}
              decimals={2}
              prefix="R$ "
              separator="."
              decimal=","
            />
          </span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Cessões</p>
        <div className='flex'>
          <span className='text-sm font-bold text-neutral-900 dark:text-white'>
            <CountUp
              start={0}
              end={qtdCessao}
              duration={2.5}
            />
          </span>
        </div>
      </div>
    </>
  );
}
