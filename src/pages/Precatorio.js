import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import NavMenu from '../components/NavMenu';
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
  const [teles, setTeles] = useState([]);
  const [users, setUsers] = useState([]);
  const [todasCessoes, setTodasCessoes] = useState([]);
  const [escreventes, setEscreventes] = useState([]);
  const [cessionarios, setCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { precID } = useParams();

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
          fetchData(`/cessoes/${String(precID)}`, setPrecData),
          fetchData('/status', setStatus),
          fetchData('/orcamentos', setOrcamentos),
          fetchData('/natureza', setNatureza),
          fetchData('/empresas', setEmpresas),
          fetchData('/vara', setVaras),
          fetchData('/tele', setTeles),
          fetchData('/cessoes', setTodasCessoes),
          fetchData('/escreventes', setEscreventes),
          fetchData('/users', setUsers),
          fetchData('/cessionarios', setCessionarios)
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

  }, [precID]);

  const handleShow = () => {
    setShow((prevState) => !prevState)
  }


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

  const updatedPrecData = { ...precData };
  const orcamentoAtualizado = orcamentos.find(o => parseInt(updatedPrecData.ente_id) === parseInt(o.id));


  if (orcamentoAtualizado && updatedPrecData.ano) {
    updatedPrecData.ente_id = orcamentoAtualizado.apelido + " - " + updatedPrecData.ano;
  } else if (orcamentoAtualizado) {
    updatedPrecData.ente_id = orcamentoAtualizado.apelido;
  }

  const naturezaAtualizada = natureza.find(n => parseInt(updatedPrecData.natureza) === parseInt(n.id));
  const empresaAtualizada = empresas.find(e => parseInt(updatedPrecData.empresa_id) === parseInt(e.id));
  const statusAtualizado = status.find(s => parseInt(updatedPrecData.status) === parseInt(s.id));
  const varasAtualizada = varas.find(v => parseInt(updatedPrecData.vara_processo) === parseInt(v.id));
  const telesAtualizado = users.find(u => parseInt(updatedPrecData.tele_id) === parseInt(u.id));
  const escreventesAtualizado = escreventes.find(escrevente => parseInt(updatedPrecData.escrevente_id) === parseInt(escrevente.id));


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

  if (telesAtualizado) {
    updatedPrecData.tele_id = telesAtualizado.nome
  }

  if (escreventesAtualizado) {
    updatedPrecData.escrevente_id = escreventesAtualizado.nome
  }

  const cessionarioRefPrec = cessionarios.filter(cessionario => parseInt(updatedPrecData.id) === parseInt(cessionario.cessao_id));


  const updatedCessionario = [...cessionarioRefPrec];


  updatedCessionario.forEach(cessionario => {
    const nomeDoCessionario = users.find(user => parseInt(cessionario.user_id) === parseInt(user.id))

    console.log(nomeDoCessionario)

    if (nomeDoCessionario) {
      cessionario.user_id = nomeDoCessionario.nome;
      cessionario.cpfcnpj = nomeDoCessionario.cpfcnpj
    }
  })

  const cessoesRelacionadas = todasCessoes.filter(cessao => {
    if (updatedPrecData.id === cessao.id) {
      return ''
    }

    return updatedPrecData.processo === cessao.processo || updatedPrecData.cedente === cessao.cedente || updatedPrecData.precatorio === cessao.precatorio
  })

  cessoesRelacionadas.forEach(cessao => {
    // Atualiza propriedades de status
    const statusAtualizado = status.find(s => parseInt(cessao.status) === parseInt(s.id));
    if (statusAtualizado) {
      cessao.status = statusAtualizado.nome;
      cessao.statusColor = statusAtualizado.extra;
    }

    // Atualiza propriedades de ente_id
    const orcamentoAtualizado = orcamentos.find(o => parseInt(cessao.ente_id) === parseInt(o.id));
    if (orcamentoAtualizado && cessao.ano) {
      cessao.ente_id = orcamentoAtualizado.apelido + " - " + cessao.ano;
    } else if (orcamentoAtualizado) {
      cessao.ente_id = orcamentoAtualizado.apelido;
    }

    // Atualiza propriedades de natureza
    const naturezaAtualizada = natureza.find(n => parseInt(cessao.natureza) === parseInt(n.id));
    if (naturezaAtualizada) {
      cessao.natureza = naturezaAtualizada.nome;
    }

    // Atualiza propriedades de empresa_id
    const empresaAtualizada = empresas.find(e => parseInt(cessao.empresa_id) === parseInt(e.id));
    if (empresaAtualizada) {
      cessao.empresa_id = empresaAtualizada.nome;
    }

    // Atualiza propriedades de adv
    const anuencia = anuenciaValores[cessao.adv];
    if (anuencia) {
      cessao.adv = anuencia;
    }

    // Atualiza propriedades de falecido
    const falecido = falecidoValores[cessao.falecido];
    if (falecido) {
      cessao.falecido = falecido;
    }

  });

  console.log(updatedCessionario)


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
                    <span className="text-neutral-400 font-medium line-clamp-1">{updatedPrecData.cedente}</span>
                  </div>
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
          <div className='px-5 dark:bg-neutral-900 mt-[16px] max-w-full h-full'>
            <div className='lg:flex lg:gap-4 lg:items-start max-w-full h-full relative'>
              <div className='hidden lg:block lg:sticky lg:h-full lg:max-h-full lg:top-[8%]'>
                <NavMenu/>
              </div>
              <div className='lg:w-[calc(100%-300px)]'>
                <InfoPrec precInfo={updatedPrecData} status={status} cessionario={updatedCessionario} cessoes={cessoesRelacionadas} />
              </div>
            </div>
          </div>
        </main>) : (<div className='w-screen h-screen flex items-center justify-center'><LoadingSpinner /></div>)}
    </>
  )
}