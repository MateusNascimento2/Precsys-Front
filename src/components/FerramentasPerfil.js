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
  const [isCheckedPropostaCliente, setIsCheckedPropostaCliente] = useState(false);
  const [isCheckedPermissaoEmail, setIsCheckedPermissaoEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sala, setSala] = useState('');
  const [teles, setTeles] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [extraInputs, setExtraInputs] = useState([]); // estado para os inputs extras
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

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
      }
    };

    const fetchAllData = async () => {
      try {
        setIsLoading(true)
        await Promise.all([fetchData('/tele', setTeles)]);
        await Promise.all([fetchData('/empresas', setEmpresas)])
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
    setIsCheckedPropostaCliente(user.permissao_proposta === 1);
    setIsCheckedPermissaoEmail(user.permissao_email === 1);

  }, [teles]);

  console.log(empresas)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    console.log('extraInputs:', extraInputs)

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
      permissao_email: isCheckedPermissaoEmail ? 1 : 0,
      permissao_proposta: isCheckedPropostaCliente ? 1 : 0,
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
            permissao_email: updates.permissao_email,
            permissao_proposta: updates.permissao_proposta,
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
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
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

  // Função para adicionar novos inputs
  const addNewInput = () => {
    setExtraInputs([...extraInputs, { apelido: '', email: '', senha: '', link: '' }]);
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
                  <div className="py-4">
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <div className='flex items-center gap-4'>
                          <div className='flex flex-col'>
                            <label htmlFor={'email-corporativo'} key={'email-corporativo'} className='dark:text-white font-medium'>E-mail Corporativo</label>
                            <span className='text-neutral-400 text-sm'>Acesso rápido aos e-mails corporativos</span>
                          </div>
                          {isCheckedPermissaoEmail && <div>
                            {/* <button
                              type="button"
                              onClick={addNewInput}
                              className='flex items-center justify-center dark:text-white w-10 h-10 text-lg dark:hover:bg-neutral-800 rounded-full'
                            >
                              +
                            </button> */}
                          </div>}
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
                  </div>

                  {/* Proposta ao Cliente */}
                  <div className="py-4">
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
                  </div>

                  {/* Representante Comercial */}
                  <div className="py-4">
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
                  </div>

                  {/* Calc. Escritura */}
                  <div className="py-4">
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
                  </div>
                </div>
                <button className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2' type='submit' onClick={(e) => handleSubmit(e)}>Salvar Alterações</button>
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
}
