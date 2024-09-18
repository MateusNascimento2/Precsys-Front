import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import useAuth from "../hooks/useAuth";

export default function FerramentasPerfil({ user, id }) {
  const [isCheckedRepComercial, setIsCheckedRepComercial] = useState(false);
  const [toChangeRepComercial, setToChangeRepComercial] = useState(false);
  const [isCheckedCalcEscritura, setIsCheckedCalcEscritura] = useState(false);
  const [isCheckedPropostaCliente, setIsCheckedPropostaCliente] = useState(false);
  const [isCheckedPermissaoEmail, setIsCheckedPermissaoEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sala, setSala] = useState('');
  const [teles, setTeles] = useState([]);
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
        await Promise.all([
          fetchData('/tele', setTeles),
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


  // Atualiza o valor de isCheckedRepComercial quando teles é carregado
  useEffect(() => {
    const tele = teles.find(tele => String(tele.usuario_id) === String(user.id));

    if (tele) {
      // Define o estado baseado no valor encontrado
      setIsCheckedRepComercial(true); // Marque o checkbox se o tele foi encontrado
      setSala(tele.sala); // Atualiza o campo sala com o valor correspondente
    } else {
      // Caso contrário, desmarca o checkbox e limpa o campo sala
      setIsCheckedRepComercial(false);
      setSala('');
    }

    if (user.ver_calculo) {
      setIsCheckedCalcEscritura(true);
    } else {
      setIsCheckedCalcEscritura(false);
    }

    if (user.permissao_proposta) {
      setIsCheckedPropostaCliente(true);
    } else {
      setIsCheckedPropostaCliente(false);
    }

    if (user.permissao_email) {
      setIsCheckedPermissaoEmail(true);
    } else {
      setIsCheckedPermissaoEmail(false);
    }

  }, [teles, user.id, user.ver_calculo, user.permissao_proposta, user.permissao_email]); // Reexecuta o efeito sempre que teles ou user.id mudar

  console.log('isTele: ', isCheckedRepComercial)

  const handleCheckboxPermissaoEmail = (event) => {
    setIsCheckedPermissaoEmail(event.target.checked);
  }

  const handleCheckboxPermissaoProposta = (event) => {
    setIsCheckedPropostaCliente(event.target.checked);
  }


  const handleCheckboxRepComercialChange = (event) => {
    setToChangeRepComercial(event.target.checked);
    setIsCheckedRepComercial(event.target.checked)
    console.log(toChangeRepComercial)
  };

  const handleCheckboxCalcEscritura = (event) => {
    setIsCheckedCalcEscritura(event.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    const { password, ...restOfUser } = user; // Exclui o campo "senha"

    // Preparar as atualizações
    const updates = {
      ...restOfUser,
      ver_calculo: isCheckedCalcEscritura ? 1 : 0,
      permissao_email: isCheckedPermissaoEmail ? 1 : 0,
      permissao_proposta: isCheckedPropostaCliente ? 1 : 0,
      // Adicione outros campos que você deseja atualizar aqui
    };

    try {
      setIsLoading(true);
      await axiosPrivate.put(`/users/${user.id}`, updates);

      setIsLoading(false);

      // Atualiza o estado do auth com as novas informações
      if (!id) {
        setAuth(prev => ({
          ...prev,
          user: {
            ...prev.user,
            ver_calculo: updates.ver_calculo,
            permissao_email: updates.permissao_email,
            permissao_proposta: updates.permissao_proposta,
            // Atualize outros campos conforme necessário
          },
          userImage: prev.userImage, // Mantém a imagem do usuário
        }));
      }

      toast.success('Alterações salvas com sucesso!', {
        position: "top-right",
        autoClose: 3000,
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
        autoClose: 3000,
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


  console.log(user)

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
                  <div className="flex items-center justify-between py-4">
                    <div className='flex items-center gap-2'>
                      <input
                        type="checkbox"
                        name={"email-corporativo"}
                        id={"email-corporativo"}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
                        onChange={handleCheckboxPermissaoEmail}
                        checked={isCheckedPermissaoEmail}
                      />
                      <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[3px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <div className='flex flex-col'>
                        <label htmlFor={'email-corporativo'} key={'email-corporativo'} className='dark:text-white font-medium'>E-mail Corporativo

                        </label>
                        <span className='text-neutral-400 text-sm'>Acesso rápido aos e-mails corporativos</span>

                      </div>

                    </div>

                    <div>
                      <button
                        type='submit'
                        className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black'>
                        Configurar
                      </button>
                    </div>



                  </div>

                  <div className="flex items-center py-4 justify-between">
                    <div className='flex items-center gap-2'>
                      <input
                        type="checkbox"
                        name={"proposta-cliente"}
                        id={"proposta-cliente"}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
                        onChange={handleCheckboxPermissaoProposta}
                        checked={isCheckedPropostaCliente}
                      />
                      <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[3px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <div className='flex flex-col'>
                        <label htmlFor={'proposta-cliente'} key={'proposta-cliente'} className='dark:text-white font-medium'>Proposta ao Cliente

                        </label>
                        <span className='text-neutral-400 text-sm'>Acesso à elaboração de proposta das empresas cadastradas</span>

                      </div>

                    </div>

                    <div>
                      <button
                        type='submit'
                        className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black'>
                        Configurar
                      </button>
                    </div>



                  </div>

                  <div className="flex items-center py-4 justify-between">
                    <div className='flex items-center gap-2'>
                      <input
                        type="checkbox"
                        name={"rep-comercial"}
                        id={"rep-comercial"}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
                        onChange={handleCheckboxRepComercialChange}
                        checked={isCheckedRepComercial}
                      />
                      <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[3px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <div className='flex flex-col'>
                        <label htmlFor={'rep-comercial'} key={'rep-comercial'} className='dark:text-white font-medium'>Representante Comercial

                        </label>
                        <span className='text-neutral-400 text-sm'>Nº da sala</span>

                      </div>

                    </div>

                    <div>
                      <input className='text-neutral-400 border dark:border-neutral-600 text font-medium w-[113.36px] p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={sala} onChange={e => setSala(e.target.value)} />
                    </div>



                  </div>

                  <div className="flex items-center py-4 justify-between">
                    <div className='flex items-center gap-2'>
                      <input
                        type="checkbox"
                        name={"calc-escritura"}
                        id={"calc-escritura"}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white"
                        onChange={handleCheckboxCalcEscritura}
                        checked={isCheckedCalcEscritura}
                      />
                      <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[3px]" viewBox="0 0 20 20" fill="currentColor"
                          stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <div className='flex flex-col'>
                        <label htmlFor={'calc-escritura'} key={'calc-escritura'} className='dark:text-white font-medium'>Calc. Escritura

                        </label>
                        <span className='text-neutral-400 text-sm'>Calculadora da expectativa do valor da escritura</span>

                      </div>

                    </div>
                  </div>


                </div>
                <button onClick={(e) => {
                  e.preventDefault();
                  handleCancelButton();
                }} className='bg-neutral-200 text-neutral-800 rounded px-4 py-2 font-medium dark:bg-neutral-800 dark:text-neutral-200 mt-4 mr-4 text-[14px] lg:text-[16px]'>Cancelar</button>
                <button className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2' type='submit' onClick={(e) => handleSubmit(e)}>Salvar Alterações</button>
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
}