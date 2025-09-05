import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import useAuth from "../hooks/useAuth";
import { motion } from 'framer-motion';

export default function FerramentasPerfil({ user, id }) {
  const [isCheckedRepComercial, setIsCheckedRepComercial] = useState(false);
  const [isCheckedCalcEscritura, setIsCheckedCalcEscritura] = useState(false);
  const [isCheckedCalcLiquido, setIsCheckedCalcLiquido] = useState(false);
  const [isCheckedPropostaCliente, setIsCheckedPropostaCliente] = useState(false);
  const [isCheckedPublicacoes, setIsCheckedPublicacoes] = useState(false);
  const [isCheckedPublicacoesIntimadas, setIsCheckedPublicacoesIntimadas] = useState(false);
  const [isCheckedPermissaoEmail, setIsCheckedPermissaoEmail] = useState(false);
  const [isCheckedAcessoApi, setIsCheckedAcessoApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sala, setSala] = useState('');
  const [teles, setTeles] = useState([]);
  const [extraInputs, setExtraInputs] = useState([]); // estado para os inputs extras
  const [apiKey, setApiKey] = useState('');
  const [apiKeyExpiresAt, setApiKeyExpiresAt] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [teleRes] = await Promise.all([
          axiosPrivate.get('/tele', { signal: controller.signal }),
        ]);

        if (isMounted) {
          setTeles(teleRes.data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Erro ao buscar dados:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const tele = teles.find(tele => String(tele.usuario_id) === String(user.id));

    if (tele) {
      setIsCheckedRepComercial(true);
      setSala(tele.sala);
    } else {
      setIsCheckedRepComercial(false);
      setSala('');
    }

    setIsCheckedCalcEscritura(user.ver_calculo === 1);
    setIsCheckedCalcLiquido(user.ver_calculo_liquido === 1);
    setIsCheckedPropostaCliente(user.permissao_proposta === 1);
    setIsCheckedPermissaoEmail(user.permissao_email === 1);
    setIsCheckedAcessoApi(user.acesso_api === 1);
    setIsCheckedPublicacoes(user.ver_publicacoes === 1);
    setIsCheckedPublicacoesIntimadas(user.ver_publicacoes_intimadas === 1);

  }, [teles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    await Promise.all(
      extraInputs.map(async (inputData) => {
        const { email, senha, empresa_id } = inputData;

        // Certifica-se de que os campos estão preenchidos
        if (email && senha && empresa_id) {
          await axiosPrivate.post('/adicionarEmail', {
            email,
            senha,
            empresa_id,
            id_usuario: user.id, // Inclui o id do usuário se necessário
          });
        }
      })
    );

    const { password, ...restOfUser } = user;

    const updates = {
      ...restOfUser,
      ver_calculo: isCheckedCalcEscritura ? 1 : 0,
      ver_calculo_liquido: isCheckedCalcLiquido ? 1 : 0,
      permissao_email: isCheckedPermissaoEmail ? 1 : 0,
      permissao_proposta: isCheckedPropostaCliente ? 1 : 0,
      acesso_api: isCheckedAcessoApi ? 1 : 0,
      ver_publicacoes: isCheckedPublicacoes ? 1 : 0,
      ver_publicacoes_intimadas: isCheckedPublicacoesIntimadas ? 1 : 0
    };

    try {
      setIsLoading(true);

      await axiosPrivate.put(`/users/${user.id}`, updates);

      if (isCheckedRepComercial) {
        await axiosPrivate.post('/tele', { id_usuario: user.id, sala: sala, ativo: user.ativo, })
      } else {
        await axiosPrivate.delete(`/tele/${user.id}`);
      }

      setIsLoading(false);

      if (!id) {
        setAuth(prev => ({
          ...prev,
          user: {
            ...prev.user,
            ver_calculo: updates.ver_calculo,
            ver_calculo_liquido: updates.ver_calculo_liquido,
            permissao_email: updates.permissao_email,
            permissao_proposta: updates.permissao_proposta,
            acesso_api: updates.acesso_api,
            ver_publicacoes: updates.ver_publicacoes,
            ver_publicacoes_intimadas: updates.ver_publicacoes_intimadas
          },
          userImage: prev.userImage,
        }));
      }

      toast.success('Alterações salvas com sucesso!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
    } catch (err) {
      console.log(err);
      toast.error(`Erro ao salvar alterações: ${err}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
      setIsLoading(false);
    }
  };

  // Função para atualizar os valores dos inputs extras
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedInputs = [...extraInputs];
    updatedInputs[index][name] = value;
    setExtraInputs(updatedInputs);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Buscar todas as empresas
        const empresasResponse = await axiosPrivate.get('/empresas');
        const empresasData = empresasResponse.data;

        // Buscar todos os emails cadastrados pelo usuário logado
        const emailsResponse = await axiosPrivate.get('/emails_usuarios');
        let userEmails;

        if (id) {
          userEmails = emailsResponse.data.filter(email => String(email.usuario) === String(id));
        } else {
          userEmails = emailsResponse.data.filter(email => String(email.usuario) === String(auth.user.id));
        }


        // Atualizar os inputs com base nas empresas e nos emails do usuário logado
        const updatedInputs = empresasData.map(empresa => {
          const userEmail = userEmails.find(email => String(email.empresa) === String(empresa.id));
          return {
            nome: empresa.nome,
            email: userEmail ? userEmail.email : '', // Preenche se existir
            senha: userEmail ? userEmail.senha : '', // Sempre vazio por segurança
            empresa_id: empresa.id, // ID da empresa
          };
        });

        setExtraInputs(updatedInputs);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar dados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [auth.user.id, id]);

  // Função para remover inputs
  const removeInput = (index) => {
    const updatedInputs = extraInputs.filter((_, i) => i !== index);
    setExtraInputs(updatedInputs);
  };

  const isKeyExpired = () => {
    if (!apiKeyExpiresAt) return true;
    return new Date(apiKeyExpiresAt) < new Date();
  };

  useEffect(async () => {

    const response = await axiosPrivate.get(`/pegar-api-key/${id ? id : auth.user.id}`)
    setApiKey(response.data.chave)
    setApiKeyExpiresAt(response.data.expires_at)


  }, [auth.user.id, id])

  const generateKey = async (e) => {
    e.preventDefault();

    if (!isKeyExpired()) {
      toast.info('Você já possui uma chave ativa.');
      return;
    }

    try {
      const response = await axiosPrivate.post(`/gerar-api-key/${id ? id : auth.user.id}`);
      setApiKey(response.data.apiKey);
      setApiKeyExpiresAt(response.data.expiresAt);
      toast.success('Nova chave gerada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar nova chave');
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='w-full h-[793px] lg:h-[740px] flex justify-center items-center'>
          <div className='w-8 h-8'>
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <>
          <ToastContainer />
          <section>
            <div className='mb-4 mt-4 lg:mt-0'>
              <span className='font-semibold dark:text-white'>Ferramentas</span>
            </div>

            <div>
              <form>
                <div className='flex flex-col divide-y-[1px] dark:divide-neutral-600'>
                  {/* Permissão Email */}
                  {auth.user.admin ?
                    <div className="py-4">
                      <div className='flex items-center justify-between gap-2'>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-4'>
                            <div className='flex flex-col'>
                              <label htmlFor={'email-corporativo'} key={'email-corporativo'} className='dark:text-white font-medium'>E-mail Corporativo</label>
                              <span className='text-neutral-400 text-sm'>Acesso rápido aos e-mails corporativos</span>
                            </div>
                          </div>
                        </div>

                        <motion.div
                          className={`${isCheckedPermissaoEmail ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                          onClick={() => setIsCheckedPermissaoEmail(!isCheckedPermissaoEmail)}
                        >
                          <motion.div
                            className={`w-4 h-4 rounded-full shadow-md transform ${isCheckedPermissaoEmail ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                          />
                        </motion.div>
                      </div>

                      {/* Adicionar inputs dinamicamente */}
                      {isCheckedPermissaoEmail && (
                        <>
                          {isLoading ? (
                            // Mostra o spinner de carregamento enquanto está carregando
                            <div className='w-full h-[793px] lg:h-[740px] flex justify-center items-center'>
                              <div className='w-8 h-8'>
                                <LoadingSpinner />
                              </div>
                            </div>
                          ) : (
                            // Mapeia os inputs quando não está carregando
                            extraInputs.map((input, index) => (
                              <div
                                key={index}
                                className='flex flex-col lg:flex-row items-end justify-between gap-4 mt-4 lg:flex-wrap xl:flex-nowrap'
                              >
                                <div className='flex flex-col w-full'>
                                  <p className='dark:text-white mb-2'>{input.nome}:</p>
                                </div>

                                <div className='flex flex-col w-full'>
                                  <label className="text-neutral-400 text-sm">E-mail</label>
                                  <input
                                    className='text-neutral-400 border dark:border-neutral-600 text font-medium p-1 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]'
                                    name="email"
                                    value={input.email}
                                    autoComplete="off" // Desativa o preenchimento automático
                                    onChange={(e) => handleInputChange(index, e)} // Atualiza o estado
                                  />
                                </div>

                                <div className="flex flex-col w-full">
                                  <label className="text-neutral-400 text-sm">Senha</label>
                                  <div className="relative">
                                    <input
                                      className="text-neutral-400 border dark:border-neutral-600 text font-medium p-1 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px] w-full"
                                      name="senha"
                                      value={input.senha}
                                      onChange={(e) => handleInputChange(index, e)} // Atualiza o estado
                                      autoComplete="new-password"
                                      type={input.showPassword ? "text" : "password"} // Alterna entre texto e senha
                                    />
                                    {/* Ícone de alternância de senha */}
                                    <button
                                      type="button"
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600"
                                      onClick={() => {
                                        const updatedInputs = [...extraInputs];
                                        updatedInputs[index].showPassword = !updatedInputs[index].showPassword;
                                        setExtraInputs(updatedInputs);
                                      }}
                                    >
                                      {input.showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                      </svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                      } {/* Ícones para alternar */}
                                    </button>
                                  </div>
                                </div>

                                {/* Campo hidden para armazenar o empresa_id */}
                                <input
                                  name="empresa_id"
                                  type="hidden"
                                  value={input.id}
                                  readOnly
                                />
                              </div>
                            ))
                          )}
                        </>
                      )}
                    </div> : null
                  }


                  {/* Proposta ao Cliente */}
                  {auth.user.admin ? <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'proposta-cliente'} key={'proposta-cliente'} className='dark:text-white font-medium'>Proposta ao Cliente</label>
                        <span className='text-neutral-400 text-sm'>Acesso à elaboração de proposta das empresas cadastradas</span>
                      </div>
                      <motion.div
                        className={`${isCheckedPropostaCliente ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedPropostaCliente(!isCheckedPropostaCliente)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform ${isCheckedPropostaCliente ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div>
                    </div>
                  </div> : null}

                  {/* Publicações do Diário */}
                  {auth.user.admin ? <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'publicacoes'} key={'publicacoes'} className='dark:text-white font-medium'>Publicações do Diário</label>
                        <span className='text-neutral-400 text-sm'>Acesso à publicações do diário oficial</span>
                      </div>
                      <motion.div
                        className={`${isCheckedPublicacoes ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedPublicacoes(!isCheckedPublicacoes)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform ${isCheckedPublicacoes ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div>
                    </div>
                  </div> : null}

                  {/* Publicações do Diário Intimadas */}
                  {auth.user.admin ? <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'publicacoes-intimadas'} key={'publicacoes-intimadas'} className='dark:text-white font-medium'>Publicações do Diário Intimadas</label>
                        <span className='text-neutral-400 text-sm'>Acesso à publicações do diário oficial que foram intimadas</span>
                      </div>
                      <motion.div
                        className={`${isCheckedPublicacoesIntimadas ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedPublicacoesIntimadas(!isCheckedPublicacoesIntimadas)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform ${isCheckedPublicacoesIntimadas ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div>
                    </div>
                  </div> : null}

                  {/* Representante Comercial */}
                  {auth.user.admin ? <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'rep-comercial'} key={'rep-comercial'} className='dark:text-white font-medium'>Representante Comercial</label>
                      </div>

                      <motion.div
                        className={`${isCheckedRepComercial ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedRepComercial(!isCheckedRepComercial)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform ${isCheckedRepComercial ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div>
                    </div>
                    {isCheckedRepComercial ? (
                      <div className='mt-2'>
                        <span class="text-neutral-400 text-sm">Nº da sala: </span>
                        <input className='text-neutral-400 border dark:border-neutral-600 text font-medium w-[80px] p-1 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={sala} onChange={e => setSala(e.target.value)} />
                      </div>
                    ) : null}
                  </div> : null}

                  {/* Calc. Líquido */}
                  {auth.user.admin ? <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'calc-liquido'} key={'calc-liquido'} className='dark:text-white font-medium'>Calc. Líquido</label>
                        <span className='text-neutral-400 text-sm'>Calculadora do valor líquido do precatório</span>
                      </div>
                      <motion.div
                        className={`${isCheckedCalcLiquido ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedCalcLiquido(!isCheckedCalcLiquido)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform  ${isCheckedCalcLiquido ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div>
                    </div>
                  </div> : null}

                  {/* Calc. Escritura */}
                  {auth.user.admin ? <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'calc-escritura'} key={'calc-escritura'} className='dark:text-white font-medium'>Calc. Escritura</label>
                        <span className='text-neutral-400 text-sm'>Calculadora da expectativa do valor da escritura</span>
                      </div>
                      <motion.div
                        className={`${isCheckedCalcEscritura ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedCalcEscritura(!isCheckedCalcEscritura)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform  ${isCheckedCalcEscritura ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div>
                    </div>
                  </div> : null}

                  {/* Acesso a API do precsys */}
                  {auth.user.admin || auth.user.acesso_api ? (<div className="py-4 flex flex-col gap-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <label htmlFor={'calc-escritura'} key={'calc-escritura'} className='dark:text-white font-medium'>API PrecSys</label>
                        <p className='text-neutral-400 text-sm flex'>Acesso à informações via
                          <span className='ml-1'>
                            <a target='_blank' href='https://precsysteste.discloud.app/api-docs/' title='Ir para documentação da API' className='font-semibold cursor-pointer flex items-center gap-1 hover:underline'>
                              API Precsys
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline-block">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </a>
                          </span>
                        </p>
                      </div>
                      {auth.user.admin ? <motion.div
                        className={`${isCheckedAcessoApi ? "bg-black dark:bg-white flex-shrink-0" : "bg-neutral-200 dark:bg-neutral-600"} w-12 h-6 flex items-center rounded-full p-1 cursor-pointer flex-shrink-0`}
                        onClick={() => setIsCheckedAcessoApi(!isCheckedAcessoApi)}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full shadow-md transform  ${isCheckedAcessoApi ? "translate-x-6 bg-white dark:bg-black" : "translate-x-0 bg-white"}`}
                        />
                      </motion.div> : null}

                    </div>
                    {isCheckedAcessoApi && (
                      <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                        <div className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 flex items-center gap-2'>
                          <input
                            className='dark:bg-neutral-800 focus:outline-none placeholder:text-[14px] text-gray-400 text-ellipsis w-full'
                            value={apiKey}
                            readOnly
                          />
                          <button
                            title='Copiar chave'
                            type='button'
                            onClick={() => {
                              navigator.clipboard.writeText(apiKey);
                              toast.success('Chave copiada!', {
                                position: "top-right",
                                autoClose: 1000,
                                theme: localStorage.getItem('darkMode') === true ? 'dark' : 'light',
                                transition: Bounce,
                              });
                            }}
                            className='rounded p-1 dark:border-neutral-600 text-gray-400 dark:hover:bg-neutral-700 hover:bg-neutral-200'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
                            </svg>

                          </button>
                        </div>

                        <button
                          className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700'
                          onClick={(e) => generateKey(e)}
                        >
                          Gerar chave da API
                        </button>
                      </div>

                    )}
                  </div>) : null}
                </div>
                {auth.user.admin ? <button className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2' type='submit' onClick={(e) => handleSubmit(e)}>Salvar Alterações</button> : null}
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
}
