import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import NavMenu from '../components/NavMenu';
import InfoPrec from '../components/InfoPrec';
import Tags from '../components/Tags';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { Tooltip } from 'react-tooltip';
import useAuth from "../hooks/useAuth";

export default function Precatorio() {
  const [show, setShow] = useState(false);
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
  const [juridico, setJuridico] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { precID } = useParams();
  const { auth } = useAuth();
  const userID = String(auth.user.id);
  const isAdmin = auth.user.admin;

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal,
          headers: {
            'UserID': userID,
            'isAdmin': isAdmin,
          }
        });
        if (isMounted) setter(data);
      } catch (err) {
        console.log(err);
        navigate('*', { state: { from: location }, replace: true });
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
          fetchData('/cessionarios', setCessionarios),
          fetchData('/juridicos', setJuridico)
        ]);
      } finally {
        setIsLoading(false);
        setIsDataLoaded(true); // Marcar que todos os dados foram carregados
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };

  }, [precID]);

  useEffect(() => {
    if (!isDataLoaded) return; // Garantir que todos os dados foram carregados antes de atualizar

    const updatedPrecData = { ...precData };
    const orcamentoAtualizado = orcamentos.find(o => parseInt(updatedPrecData.ente_id) === parseInt(o.id));

    if (orcamentoAtualizado && updatedPrecData.ano) {
      updatedPrecData.orcamento = orcamentoAtualizado.apelido + " - " + updatedPrecData.ano;
      updatedPrecData.nome_ente = orcamentoAtualizado.ente;
    } else if (orcamentoAtualizado) {
      updatedPrecData.orcamento = orcamentoAtualizado.apelido;
      updatedPrecData.nome_ente = orcamentoAtualizado.ente;
    }

    const naturezaAtualizada = natureza.find(n => parseInt(updatedPrecData.natureza) === parseInt(n.id));
    const empresaAtualizada = empresas.find(e => parseInt(updatedPrecData.empresa_id) === parseInt(e.id));
    const statusAtualizado = status.find(s => parseInt(updatedPrecData.status) === parseInt(s.id));
    const varasAtualizada = varas.find(v => parseInt(updatedPrecData.vara_processo) === parseInt(v.id));
    const telesAtualizado = users.find(u => parseInt(updatedPrecData.tele_id) === parseInt(u.id));
    const escreventesAtualizado = escreventes.find(escrevente => parseInt(updatedPrecData.escrevente_id) === parseInt(escrevente.id));
    const juridicoAtualizado = juridico.find(juridico => parseInt(updatedPrecData.juridico_id) === parseInt(juridico.id));
    const statusColor = status.find(s => s.id === parseInt(precData.status))

    const anuenciaValores = {
      "0": "Sem anuência",
      "1": "Honorários",
      "2": "Com anuência",
      "3": "Quitação"
    };

    const falecidoValores = {
      "0": "Vivo",
      "1": "Não deixou bens",
      "2": "Deixou bens",
      "3": "Solicitada habilitação",
      "4": "Herdeiros habilitados"
    };

    const anuencia = anuenciaValores[precData.adv];
    if (anuencia) {
      updatedPrecData.adv = anuencia;
    }

    const falecido = falecidoValores[precData.falecido];
    if (falecido) {
      updatedPrecData.falecido = falecido;
    }

    if (statusColor) {
      updatedPrecData.statusColor = statusColor.extra
    }

    if (naturezaAtualizada) {
      updatedPrecData.nome_natureza = naturezaAtualizada.nome;
    }

    if (empresaAtualizada) {
      updatedPrecData.nome_empresa = empresaAtualizada.nome;
    }

    if (statusAtualizado) {
      updatedPrecData.status = statusAtualizado.nome;
    }

    if (varasAtualizada) {
      updatedPrecData.nome_vara = varasAtualizada.nome;
    }

    if (telesAtualizado) {
      updatedPrecData.nome_tele = telesAtualizado.nome;
    }

    if (escreventesAtualizado) {
      updatedPrecData.nome_escrevente = escreventesAtualizado.nome;
    }

    if (juridicoAtualizado) {
      updatedPrecData.juridico_nome = juridicoAtualizado.nome;
    }

    const cessionarioRefPrec = cessionarios.filter(cessionario => parseInt(updatedPrecData.id) === parseInt(cessionario.cessao_id));
    const updatedCessionario = [...cessionarioRefPrec];

    updatedCessionario.forEach(cessionario => {
      const nomeDoCessionario = users.find(user => parseInt(cessionario.user_id) === parseInt(user.id));
      if (nomeDoCessionario) {
        cessionario.nome_user = nomeDoCessionario.nome;
        cessionario.cpfcnpj = nomeDoCessionario.cpfcnpj;
      }
    });

    const cessoesRelacionadas = todasCessoes.filter(cessao => {
      if (updatedPrecData.id === cessao.id) {
        return '';
      }
      return updatedPrecData.processo === cessao.processo || updatedPrecData.cedente === cessao.cedente || updatedPrecData.precatorio === cessao.precatorio;
    });

    cessoesRelacionadas.forEach(cessao => {
      const statusAtualizado = status.find(s => parseInt(cessao.status) === parseInt(s.id));
      if (statusAtualizado) {
        cessao.status = statusAtualizado.nome;
        cessao.statusColor = statusAtualizado.extra;
      }

      const orcamentoAtualizado = orcamentos.find(o => parseInt(cessao.ente_id) === parseInt(o.id));
      if (orcamentoAtualizado && cessao.ano) {
        cessao.ente_id = orcamentoAtualizado.apelido + " - " + cessao.ano;
      } else if (orcamentoAtualizado) {
        cessao.ente_id = orcamentoAtualizado.apelido;
      }

      const naturezaAtualizada = natureza.find(n => parseInt(cessao.natureza) === parseInt(n.id));
      if (naturezaAtualizada) {
        cessao.natureza = naturezaAtualizada.nome;
      }

      const empresaAtualizada = empresas.find(e => parseInt(cessao.empresa_id) === parseInt(e.id));
      if (empresaAtualizada) {
        cessao.empresa_id = empresaAtualizada.nome;
      }

      const anuencia = anuenciaValores[cessao.adv];
      if (anuencia) {
        cessao.adv = anuencia;
      }

      const falecido = falecidoValores[cessao.falecido];
      if (falecido) {
        cessao.falecido = falecido;
      }
    });

    setPrecData(updatedPrecData);

  }, [isDataLoaded]); // Executa o efeito apenas quando todos os dados foram carregados

  const handleShow = () => {
    setShow((prevState) => !prevState);
  };

  const handleUpdate = (newData) => {
    setPrecData((prevData) => {
      return {
        ...prevData,
        ...newData
      };
    });
  };

  return (
    <>
      <Header />
      {!isLoading ? (
        <main className={show ? 'container mx-auto px-2 overflow-hidden dark:bg-neutral-900' : 'container mx-auto px-2 pt-[120px] dark:bg-neutral-900'}>
          <Tooltip id="my-tooltip" style={{ position: 'absolute', zIndex: 60, backgroundColor: '#FFF', color: '#000', fontSize: '12px', fontWeight: '500', maxWidth: '220px' }} border="1px solid #d4d4d4" opacity={100} place="top" />
          <div>
            <div className='flex flex-col mx-[20px] border-b dark:border-neutral-600 pb-[24px]'>
              <div className='flex gap-1 items-center'>
                <div className="flex">
                  <div className="border-r dark:border-neutral-600 text-[36px] pr-2 my-3 flex items-center justify-center">
                    <span className="font-[700] dark:text-white">{precData.id}</span>
                  </div>
                  <div className="flex flex-col justify-center text-[12px] pl-2">
                    <span className="font-bold dark:text-white text-[24px]">{precData.precatorio}</span>
                    <span className="text-neutral-400 font-medium line-clamp-1">{precData.cedente}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap gap-1 mb-[13px] '>
                <a
                  style={{ backgroundColor: `${precData.statusColor}` }}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={`${precData.substatus ? precData.substatus : ''}`}
                  data-tooltip-place="top"
                  className={`px-2 py-1 rounded text-[10px] flex gap-1 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100`}>
                  <span className="text-black font-bold">{precData.status}</span>
                </a>
                {precData.orcamento ? (<Tags text={precData.orcamento} />) : null}
                {precData.nome_natureza ? (<Tags text={precData.nome_natureza} />) : null}
                {precData.nome_empresa ? (<Tags text={precData.nome_empresa} />) : null}
              </div>
            </div>
          </div>
          <div className='px-5 dark:bg-neutral-900 mt-[16px] max-w-full h-full'>
            <div className='lg:flex lg:gap-4 lg:items-start max-w-full h-full'>
              <div className='hidden lg:block lg:sticky lg:h-full lg:max-h-full lg:top-[8%]'>
                <NavMenu />
              </div>
              <div className='lg:w-[calc(100%-300px)]'>
                <InfoPrec
                  precInfo={precData}
                  status={status}
                  cessionario={cessionarios.filter(cessionario => parseInt(precData.id) === parseInt(cessionario.cessao_id))}
                  cessoes={todasCessoes.filter(cessao => precData.id !== cessao.id && (precData.processo === cessao.processo || precData.cedente === cessao.cedente || precData.precatorio === cessao.precatorio))}
                  varas={varas}
                  orcamentos={orcamentos}
                  naturezas={natureza}
                  empresas={empresas}
                  users={users}
                  teles={teles}
                  escreventes={escreventes}
                  juridico={juridico}
                  handleUpdate={handleUpdate}
                />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className='w-screen h-screen flex items-center justify-center'>

          <div className="w-12 h-12">
            <LoadingSpinner />
          </div>
        </div>
      )}
    </>
  );
}
