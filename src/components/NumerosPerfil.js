import React, { useState, useEffect, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
import { axiosPrivate } from '../api/axios';
import useAuth from "../hooks/useAuth";

const useAnimatedNumber = (value) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 100,
    config: { mass: 1, tension: 150, friction: 30 },
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL'
    }).format(num);
  };

  return <animated.span>{number.to(n => formatNumber(n))}</animated.span>;
};

const useAnimatedNumberCessao = (value) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 100,
    config: { mass: 1, tension: 150, friction: 30 },
  });

  return <animated.span>{number.to(n => Math.round(n))}</animated.span>;
};

export default function NumerosPerfil({ user }) {
  const { auth } = useAuth();
  const currentUser = user || auth.user; // Usar o usuário passado ou auth.user
  const [cessoes, setCessoes] = useState([]);
  const [cessionarios, setCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [myCessions, setMyCessions] = useState([]);

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

    fetchData('/cessoes', setCessoes);
    fetchData('/cessionarios', setCessionarios);
    fetchData('/status', setStatus);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const cessionariosPorIDdoUsuarios = cessionarios.filter(cessionario => String(cessionario.user_id) === String(currentUser.id));

    const minhasCessoes = cessionariosPorIDdoUsuarios
      .map(cessionario => {
        const cessao = cessoes.find(cessao => cessao && String(cessao.id) === String(cessionario.cessao_id));
        if (cessao) {
          cessao.exp_recebimento = changeStringFloat(cessionario.exp_recebimento);
        }
        return cessao;
      })
      .filter(cessao => cessao !== undefined);

    setQtdCessao(minhasCessoes.length);

    status.forEach(statusItem => {
      minhasCessoes.forEach(cessao => {
        if (cessao.status === String(statusItem.id)) {
          cessao.x = statusItem.nome;
        }
      });
    });

    setMyCessions(minhasCessoes);

    const totalExpAReceber = minhasCessoes
      .filter(cessao => cessao.x !== 'Recebido')
      .reduce((total, cessao) => total + parseFloat(cessao.exp_recebimento), 0);

    const totalExpRecebida = minhasCessoes
      .filter(cessao => cessao.x === 'Recebido')
      .reduce((total, cessao) => total + parseFloat(cessao.exp_recebimento), 0);

    const totalValorGasto = cessionariosPorIDdoUsuarios
      .reduce((total, cessionario) => total + parseFloat(changeStringFloat(cessionario.valor_pago)), 0);

    const totalComissao = cessionariosPorIDdoUsuarios
      .reduce((total, cessionario) => total + parseFloat(changeStringFloat(cessionario.comissao)), 0);

    setExpAReceber(totalExpAReceber);
    setExpRecebida(totalExpRecebida);
    setValorGasto(totalValorGasto);
    setComissao(totalComissao);
  }, [cessionarios, cessoes, status, currentUser.id]);

  const minhasCessoesData = useMemo(() => {
    const statusQtd = [
      { x: 'Em Andamento', y: 0, color: '#d2c7b3', expRecebimentoTotal: 0 },
      { x: 'Em Andamento Com Depósito', y: 0, color: '#bdb4a9', expRecebimentoTotal: 0 },
      { x: 'Em Andamento Com Pendência', y: 0, color: '#aaa59e', expRecebimentoTotal: 0 },
      { x: 'Homologado', y: 0, color: '#9eabaf', expRecebimentoTotal: 0 },
      { x: 'Homologado Com Depósito', y: 0, color: '#aabcb5', expRecebimentoTotal: 0 },
      { x: 'Homologado Com Pendência', y: 0, color: '#9299a8', expRecebimentoTotal: 0 },
      { x: 'Ofício de Transferência Expedido', y: 0, color: '#b2c8b7', expRecebimentoTotal: 0 },
      { x: 'Recebido', y: 0, color: '#bad3b9', expRecebimentoTotal: 0 }
    ];

    myCessions.forEach(cessao => {
      const statusIndex = statusQtd.findIndex(status => status.x === cessao.x);
      if (statusIndex !== -1) {
        statusQtd[statusIndex].y += 1;
        statusQtd[statusIndex].expRecebimentoTotal += parseFloat(cessao.exp_recebimento);
      }
    });

    return statusQtd;
  }, [myCessions]);

  const animatedExpAReceber = useAnimatedNumber(expAReceber);
  const animatedExpRecebida = useAnimatedNumber(expRecebida);
  const animatedValorGasto = useAnimatedNumber(valorGasto);
  const animatedComissao = useAnimatedNumber(comissao);
  const animatedCessao = useAnimatedNumberCessao(qtdCessao);

  return (
    <>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Exp. A Receber</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedExpAReceber}</span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Exp. Recebida</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-600 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedExpRecebida}</span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Valor Gasto</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedValorGasto}</span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Comissão</p>
        <div className='flex gap-2 items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>

          <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedComissao}</span>
        </div>
      </div>
      <div className=' px-4 rounded min-w-[125px] w-full max-w-[225px] lg:max-w-[210px]'>
        <p className='text-neutral-400 text-[13px]'>Cessões</p>
        <div className='flex'>
          <span className='text-sm font-bold text-neutral-900 dark:text-white'>{animatedCessao}</span>
        </div>
      </div>
    </>
  );
}
