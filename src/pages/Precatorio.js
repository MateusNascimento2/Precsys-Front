import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';
import InfoPrec from '../components/InfoPrec';
import Tags from '../components/Tags';
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

export default function Precatorio() {
  const [show, setShow] = useState(false)
  const [precData, setPrecData] = useState({});
  const [status, setStatus] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [natureza, setNatureza] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [varas, setVaras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { precId } = useParams();
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
      } catch (err) {
        console.log(err);
        navigate('/', { state: { from: location }, replace: true });
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchData(`/cessoes/${String(precId)}`, setPrecData),
          fetchData('/status', setStatus),
          fetchData('/orcamentos', setOrcamentos),
          fetchData('/natureza', setNatureza),
          fetchData('/empresas', setEmpresas),
          fetchData('/vara', setVaras),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };

  }, []);

  const handleShow = () => {
    setShow((prevState) => !prevState)
  }

  console.log(precData)

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

  const orcamentoAtualizado = orcamentos.find(o => parseInt(precData.ente_id) === parseInt(o.id));
  const updatedPrecData = { ...precData };

  if (orcamentoAtualizado && updatedPrecData.ano) {
    updatedPrecData.ente_id = orcamentoAtualizado.apelido + " - " + updatedPrecData.ano;
  } else if (orcamentoAtualizado) {
    updatedPrecData.ente_id = orcamentoAtualizado.apelido;
  }

  const naturezaAtualizada = natureza.find(n => parseInt(updatedPrecData.natureza) === parseInt(n.id));
  const empresaAtualizada = empresas.find(e => parseInt(updatedPrecData.empresa_id) === parseInt(e.id));
  const statusAtualizado = status.find(s => parseInt(updatedPrecData.status) === parseInt(s.id));
  const varasAtualizada = varas.find(v => parseInt(updatedPrecData.vara_processo) === parseInt(v.id))

  const anuencia = anuenciaValores[precData.adv];
  if (anuencia) {
    updatedPrecData.adv = anuencia;
  }

  // Atualiza propriedades de falecido
  const falecido = falecidoValores[precData.falecido];
  if (falecido) {
    updatedPrecData.falecido = falecido;
  }

  if (naturezaAtualizada) {
    updatedPrecData.natureza = naturezaAtualizada.nome;
  }

  if (empresaAtualizada) {
    updatedPrecData.empresa_id = empresaAtualizada.nome;
  }

  if (statusAtualizado) {
    updatedPrecData.status = statusAtualizado.nome;
  }

  if (varasAtualizada) {
    updatedPrecData.vara_processo = varasAtualizada.nome
  }

  console.log(orcamentoAtualizado)
  console.log(naturezaAtualizada)
  console.log(empresaAtualizada)
  console.log(statusAtualizado)


  return (
    <>
      <Header />
      {!isLoading ?
        (<main className={show ? 'container mx-auto px-2 overflow-hidden dark:bg-neutral-900' : 'container mx-auto px-2 pt-[120px] dark:bg-neutral-900'}>
          <div>
            <div className='flex flex-col mx-[20px] border-b pb-[24px]'>
              <div className='flex gap-1 items-center'>
                <div className="flex">
                  <div className="border-r dark:border-neutral-700 text-[36px] pr-2 my-3 flex items-center justify-center">
                    <span className="font-[700] dark:text-white">{updatedPrecData.id}</span>
                  </div>
                  <div className="flex flex-col justify-center text-[12px] pl-2">
                    <span className="font-bold dark:text-white text-[24px]">{updatedPrecData.precatorio}</span>
                    <span className="text-neutral-400 font-medium line-clamp-1">{orcamentoAtualizado.ente}</span>
                  </div>
                </div>
                <div className='ml-auto'>
                  <FilterButton onSetShow={handleShow} />
                </div>
              </div>
              <div className='flex flex-wrap gap-1 mb-[13px]'>
                {statusAtualizado ? (<Tags color={statusAtualizado.extra} text={updatedPrecData.status} />) : null}
                {orcamentoAtualizado ? (<Tags text={updatedPrecData.ente_id} />) : null}
                {naturezaAtualizada ? (<Tags text={naturezaAtualizada.nome} />) : null}
                {empresaAtualizada ? (<Tags text={empresaAtualizada.nome} />) : null}
              </div>
            </div>
          </div>
          <div className='px-5 dark:bg-neutral-900 mt-[16px] max-w-full'>
            <div className='lg:flex lg:gap-4 lg:items-start max-w-full'>
              <div className='hidden lg:block'>
                <Filter show={true} onSetShow={handleShow} />
              </div>
              <div className='lg:w-[calc(100%-300px)]'>
                <InfoPrec precInfo={updatedPrecData} status={status} />
              </div>
            </div>
          </div>
          <Filter show={show} onSetShow={handleShow} />
        </main>) : (<div className='w-screen h-screen flex items-center justify-center'><LoadingSpinner /></div>)}
    </>
  )
}