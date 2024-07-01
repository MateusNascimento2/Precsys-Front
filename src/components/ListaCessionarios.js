import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import EditarCessionario from './EditarCessionario';
import AdicionarCessionario from './AdicionarCessionario';
import DotsButton from './DotsButton';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm }) {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 bg-white dark:bg-black bg-opacity-40 dark:bg-opacity-40 flex justify-center items-center z-50 p-2">
      <div onClick={(e) => e.stopPropagation()} className="bg-white border dark:border-neutral-600 dark:bg-neutral-900 p-6 rounded shadow-lg relative w-full max-w-md">
        <h2 className="text-lg text-black dark:text-white font-semibold">Deseja excluir o cessionário?</h2>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
            onClick={onRequestClose}
          >
            Cancelar
          </button>
        </div>
        <button
          className="absolute top-3 right-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={onRequestClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ListaCessionarios({ cessionario, users, precID }) {
  const [valorPago, setValorPago] = useState('');
  const [comissao, setComissao] = useState('');
  const [percentual, setPercentual] = useState('');
  const [expectativa, setExpectativa] = useState('');
  const [cessionarios, setCessionarios] = useState([])
  const [valoresCessionarios, setValoresCessionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [valorPagoEditado, setValorPagoEditado] = useState('');
  const [comissaoEditado, setComissaoEditado] = useState('');
  const [percentualEditado, setPercentualEditado] = useState('');
  const [expectativaEditado, setExpectativaEditado] = useState('');
  const [cessionarioEditado, setCessionarioEditado] = useState('');
  const [obsEditado, setObsEditado] = useState('');
  const [assinaturaEditado, setAssinaturaEditado] = useState(false);
  const [expedidoEditado, setExpedidoEditado] = useState(false);
  const [recebidoEditado, setRecebidoEditado] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const confirmDelete = async (id) => {
    const isDarkMode = localStorage.getItem('darkMode');

    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete(`/cessionarios/${id}`);
      toast.success('Cessionário excluído com sucesso!', {
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
      toast.error(`Erro ao deletar cessionário: ${err}`, {
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
      return;
    }
    closeModal();
  };

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    addCessionario();
  }, [])

  const addCessionario = () => {
    const id = uuidv4();
    const novoCessionario = {
      componente: <AdicionarCessionario valorPago={valorPago} setValorPago={setValorPago} comissao={comissao} setComissao={setComissao} percentual={percentual} setPercentual={setPercentual} expectativa={expectativa} setExpectativa={setExpectativa} key={id} users={users} enviarValores={(valores) => handleReceberValoresNovoCessionarios(valores, id)} />,
      index: id,
      valores: {} // Inicialmente os valores são um objeto vazio
    };
    setCessionarios([...cessionarios, novoCessionario]);
    setValoresCessionarios([...valoresCessionarios, {}]);
  }

  const handleReceberValoresNovoCessionarios = (valores, id) => {
    // Atualize apenas os valores do componente com o ID correspondente
    setCessionarios(prev => {
      return prev.map(cessionario => {
        if (cessionario.index === id) {
          return { ...cessionario, valores: valores };
        } else {
          return cessionario;
        }
      });
    });
  };

  const handleReceberValoresCessionarioEditado = (valores) => {
    console.log(valores)
    setValorPagoEditado(valores.valorPagoEditado)
    setComissaoEditado(valores.comissaoEditado)
    setPercentualEditado(valores.percentualEditado)
    setExpectativaEditado(valores.expectativaEditado)
    setCessionarioEditado(valores.cessionarioEditado)
    setObsEditado(valores.obsEditado)
    setAssinaturaEditado(valores.assinaturaEditado)
    setExpedidoEditado(valores.expedidoEditado)
    setRecebidoEditado(valores.recebidoEditado)

  }

  const handleExcluirCessionario = (id) => {
    // Filtra os cessionários com base no ID para removê-lo
    const novaListaCessionarios = cessionarios.filter(cessionario => cessionario.index !== id);
    setCessionarios(novaListaCessionarios);

    // Filtra os valores correspondentes com base no ID para removê-los
    setValoresCessionarios(prev => {
      return prev.filter((_, index) => index !== id);
    });
  };

  const handleEditarCessionarioSubmit = async (id) => {
    const isDarkMode = localStorage.getItem('darkMode');
    console.log(id, valorPagoEditado, comissaoEditado, percentualEditado, expectativaEditado, cessionarioEditado, obsEditado, assinaturaEditado, expedidoEditado, recebidoEditado)

    try {
      setIsLoading(true)

      if (!valorPagoEditado || !comissaoEditado || !percentualEditado || !expectativaEditado || !cessionarioEditado) {
        toast.error(`Os campos (cessionário, valor pago, comissão, porcentagem e expectativa) precisam ser preenchidos!`, {
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

        setIsLoading(false)
        return
      }

      const cessionariosEditados = { valorPagoEditado, comissaoEditado, percentualEditado, expectativaEditado, cessionarioEditado, obsEditado, assinaturaEditado, expedidoEditado, recebidoEditado };

      await axiosPrivate.put(`/cessionarios/${id}`, cessionariosEditados);
      console.log(`Cessionario editado com sucesso.`);
    } catch (err) {
      toast.error(`Erro ao editar cessionário: ${err}`, {
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
      setIsLoading(false)
      console.error('Erro ao editar cessionario:', err);
      return
    }

    toast.success('Cessionário editado com sucesso!', {
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
    setIsLoading(false)

  }

  const handleSubmit = async () => {
    console.log('asdass', cessionarios)
    const isDarkMode = localStorage.getItem('darkMode');
    setIsLoading(true)

    if (cessionarios.length > 0) {
      for (const cessionario of cessionarios) {
        console.log(cessionario)
        if (!cessionario.valores.valorPago || !cessionario.valores.comissao || !cessionario.valores.percentual || !cessionario.valores.expectativa || !cessionario.valores.cessionario) {
          toast.error(`Os campos (cessionário, valor pago, comissão, porcentagem e expectativa) precisam ser preenchidos!`, {
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

          setIsLoading(false)
          return
        }

      }

      try {
        for (const cessionario of cessionarios) {
          cessionario.valores.id_cessao = precID; // Associa o ID da cessão ao cessionário
          try {
            await axiosPrivate.post('/cessionarios', cessionario.valores);
            console.log(`Cessionario ${cessionario.valores} adicionado com sucesso.`);
          } catch (err) {
            toast.error(`Erro ao adicionar cessionário: ${err}`, {
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
            setIsLoading(false)
            console.error('Erro ao adicionar cessionario:', err);
            return
          }
        }
      } catch (err) {
        setIsLoading(false)
        console.log(err);
        return
      }

      toast.success('Cessionário(s) adicionado(s) com sucesso!', {
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
      setIsLoading(false)
    }

    const id = uuidv4();
    const novoCessionario = {
      componente: <AdicionarCessionario valorPago={''} setValorPago={setValorPago} comissao={''} setComissao={setComissao} percentual={''} setPercentual={setPercentual} expectativa={''} setExpectativa={setExpectativa} key={id} users={users} enviarValores={(valores) => handleReceberValoresNovoCessionarios(valores, id)} />,
      index: id,
      valores: {} // Inicialmente os valores são um objeto vazio
    };
    setCessionarios([novoCessionario]);
  }

  function changeStringFloat(a) {
    const virgulaParaBarra = a.replace(',', '/');
    const valorSemPonto = virgulaParaBarra.replace(/\./g, '');
    const semMoeda = valorSemPonto.replace('R$ ', '');
    const barraParaPonto = semMoeda.replace('/', '.');
    const valorFloat = Number(barraParaPonto);
    return valorFloat;
  }

  function localeTwoDecimals(a) {

    if (Number.isInteger(a)) {
      return a.toLocaleString() + ",00";
    } else {
      return a.toLocaleString();
    }

  }

  function changePorcentagemToFloat(numero) {
    const valorSemPorcentagem = parseFloat(numero.replace(',', '.'))
    return valorSemPorcentagem
  }


  const valorPagoTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changeStringFloat(currentValue.valor_pago)
  }, 0)

  const valorComissaoTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changeStringFloat(currentValue.comissao)
  }, 0)

  const valorExpTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changeStringFloat(currentValue.exp_recebimento)
  }, 0)

  const valorPorcentagemTotal = cessionario.reduce((previousValue, currentValue) => {
    return (previousValue) + changePorcentagemToFloat(currentValue.percentual);
  }, 0)

  console.log(cessionario)

  return (
    cessionario.length !== 0 ? (
      <div className='w-full mb-[60px] flex flex-col'>
        <div className='mb-[16px] flex items-center justify-between'>
          <span className="font-[700] dark:text-white " id='cessionarios'>Cessionários</span>
          <Modal
            botaoAbrirModal={
              <button title='Adicionar cessionário' className='hover:bg-neutral-100 flex justify-center items-center dark:text-white dark:hover:bg-neutral-800 rounded w-[25px] h-[25px] p-[2px]' >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

              </button>
            }
            tituloModal={`Adicionar cessionário`}
            botaoSalvar={<button onClick={() => handleSubmit()}
              className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
              Salvar
            </button>
            }
            botaoAdicionarCessionario={<button
              onClick={() => addCessionario()}
              className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
              Adicionar cessionário
            </button>}
          >
            <div className='h-[450px] overflow-auto'>
              {isLoading && (<div className='absolute bg-neutral-800 w-full h-full opacity-85  left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                <div className='absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30'>
                  <LoadingSpinner />
                </div>
              </div>)}
              <div className="w-full flex flex-col gap-10 divide-y dark:divide-neutral-600">
                {cessionarios.map((componente) => (
                  <div key={componente.index} className='w-full pt-5'>
                    <div className='px-4 flex justify-end items-center'>
                      <button onClick={() => handleExcluirCessionario(componente.index)} className={cessionarios.length > 1 ? 'rounded hover:bg-neutral-100 float-right w-4 h-4 dark:hover:bg-neutral-800' : 'hidden'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 dark:text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {componente.componente}
                  </div>
                ))}
              </div>

            </div>

          </Modal>

        </div>
        <div className='overflow-x-auto w-full'>
          <div className='w-max lg:w-full flex text-[12px] font-[600] uppercase border-b-2 border-[#111] dark:border-neutral-600'>
            <div className='min-w-[250px] w-[24%] dark:text-white'>Nome</div>
            <div className='min-w-[120px] w-[15%] text-center dark:text-white'>valor pago</div>
            <div className='min-w-[120px] w-[17%] text-center dark:text-white'>comissão</div>
            <div className='min-w-[60px] w-[5%] text-center dark:text-white'>%</div>
            <div className='min-w-[120px] w-[17%] text-center dark:text-white'>expectativa</div>
            <div className='min-w-[180px] w-[18%] text-center dark:text-white'>nota</div>
            <div className='min-w-[50px] w-[5%] ml-auto text-center dark:text-white'></div>
          </div>
          {cessionario.map(c => (
            <div className='w-max lg:w-full flex text-[12px] items-center border-b dark:border-neutral-600 last:border-0 py-[10px] border-gray-300' key={c.id}>
              <div className='min-w-[250px] w-[24%]'>
                <div className="flex flex-col justify-center text-[12px]">
                  <span className="font-bold dark:text-neutral-200">{c.nome_user} </span>
                  <span className=" text-neutral-400 font-medium">{c.cpfcnpj}</span>
                </div>
              </div>
              <div className='min-w-[120px] w-[15%] text-center dark:text-neutral-200'>{c.valor_pago}</div>
              <div className='min-w-[120px] w-[17%] text-center dark:text-neutral-200'>{c.comissao}</div>
              <div className='min-w-[60px] w-[5%] text-center dark:text-neutral-200'>{c.percentual}</div>
              <div className='min-w-[120px] w-[17%] text-center dark:text-neutral-200'>{c.exp_recebimento}</div>
              <div className='min-w-[180px] w-[18%] text-center'><a href="" className='hover:underline dark:text-neutral-200'>{c.nota ? c.nota.split('/')[1] : ''}</a></div>
              <div className='min-w-[50px] w-[5%] ml-auto flex justify-center dark:text-neutral-200'>

                <DotsButton>
                  <Modal
                    botaoAbrirModal={
                      <button title='Editar cessionário' className='hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm px-4 py-2 rounded'>
                        Editar
                      </button>
                    }
                    tituloModal={`Editar cessionário #${c.id}`}
                    botaoSalvar={<button onClick={() => handleEditarCessionarioSubmit(c.id)}
                      className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
                      Salvar
                    </button>}
                  >
                    {isLoading && (<div className='absolute bg-neutral-800 w-full h-full opacity-85  left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-20'>
                      <div className='absolute left-1/2 top-[40%] -translate-x-[50%] -translate-y-[50%] z-30'>
                        <LoadingSpinner />
                      </div>
                    </div>)}
                    <EditarCessionario cessionario={c} users={users} enviarValores={(valores) => handleReceberValoresCessionarioEditado(valores)} />
                  </Modal>
                  <button onClick={openModal} className='hover:bg-red-800  bg-red-600 text-white text-sm px-4 py-2 rounded'>
                    Excluir
                  </button>
                </DotsButton>


                <DeleteConfirmationModal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  onConfirm={() => confirmDelete(c.id)}
                />

              </div>
            </div>

          ))}
          <div className='w-max lg:w-full flex text-[12px] items-center border-b last:border-0 py-[10px] border-gray-300'>
            <div className='min-w-[250px] w-[24%]'>
              <div className="flex flex-col justify-center text-[12px]">
                <span className="font-bold dark:text-white">TOTAL </span>
              </div>
            </div>
            <div className='min-w-[120px] w-[15%] font-bold text-center dark:text-neutral-200'>R$ {localeTwoDecimals(valorPagoTotal)}</div>
            <div className='min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200'>R$ {localeTwoDecimals(valorComissaoTotal)}</div>
            <div className='min-w-[60px] w-[5%] font-bold text-center dark:text-neutral-200'>{valorPorcentagemTotal.toLocaleString()}%</div>
            <div className='min-w-[120px] w-[17%] font-bold text-center dark:text-neutral-200'>R$ {localeTwoDecimals(valorExpTotal)}</div>
            <div className='min-w-[180px] w-[18%] text-center dark:text-neutral-200'></div>
            <div className='min-w-[50px] w-[5%] ml-auto text-center dark:text-neutral-200'></div>
          </div>

        </div>
      </div>
    ) : (<>
      <div className='mb-[16px] flex items-center gap-4'>
        <span className="font-[400] text-[12px] dark:text-white " id='cessionarios'>Não há cessionários</span>
        <Modal
          botaoAbrirModal={
            <button title='Adicionar cessionário' className='hover:bg-neutral-100 flex justify-center items-center dark:text-white dark:hover:bg-neutral-800 rounded w-[20px] h-[20px] p-[1px]' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>

            </button>
          }
          tituloModal={`Adicionar cessionário`}
          botaoSalvar={<button onClick={() => handleSubmit()}
            className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
            Salvar
          </button>
          }
          botaoAdicionarCessionario={<button
            onClick={() => addCessionario()}
            className='bg-black dark:bg-neutral-800 text-white border rounded dark:border-neutral-600 text-[14px] font-medium px-4 py-1 float-right mr-5 mt-4 hover:bg-neutral-700 dark:hover:bg-neutral-700'>
            Adicionar cessionário
          </button>}
        >
          <div className='h-[450px] overflow-auto'>
            <div className="w-full flex flex-col gap-10 divide-y dark:divide-neutral-600">
              {cessionarios.map((componente) => (
                <div key={componente.index} className='w-full pt-5'>
                  <div className='px-4 flex justify-end items-center'>
                    <button onClick={() => handleExcluirCessionario(componente.index)} className={cessionarios.length > 1 ? 'rounded hover:bg-neutral-100 float-right w-4 h-4 dark:hover:bg-neutral-800' : 'hidden'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 dark:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {componente.componente}
                </div>
              ))}
            </div>

          </div>

        </Modal>
      </div>
    </>)
  )
}