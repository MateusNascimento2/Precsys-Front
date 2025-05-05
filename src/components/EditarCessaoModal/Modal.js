import React, { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { ModalTab } from './ModalTab'
import { FormEditarCessao } from './FormEditarCessao';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export function Modal({ precID }) {
  console.log(precID)
  const axiosPrivate = useAxiosPrivate();
  const [status, setStatus] = useState('typing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalElement = useRef();
  const [formDataCessao, setFormDataCessao] = useState({
    precatorio: '',
    processo: '',
    cedente: '',
    vara_processo: '',
    ente_id: '',
    ano: '',
    natureza: '',
    empresa_id: '',
    data_cessao: '',
    escrevente_id: '',
    juridico_id: '',
    tele_id: '',
    requisitorio: '',
    escritura: '',
  });
  const [fileCessao, setFileCessao] = useState({
    requisitorio: '',
    escritura: ''
  })

  useEffect(async () => {
    let isMounted = true; // ✅ Flag para verificar se o componente está montado

    const fetchData = async (ApiRoute) => {
      try {
        const { data } = await axiosPrivate.get(ApiRoute);
        if (isMounted) {  // ✅ Só atualiza o estado se o componente ainda estiver montado
          setFormDataCessao({
            precatorio: data.precatorio,
            processo: data.processo,
            cedente: data.cedente,
            vara_processo: Number(data.vara_processo),
            ente_id: Number(data.ente_id),
            ano: data.ano,
            natureza: Number(data.natureza),
            empresa_id: Number(data.empresa_id),
            data_cessao: data.data_cessao,
            escrevente_id: Number(data.escrevente_id),
            juridico_id: Number(data.juridico_id),
            tele_id: data.tele_id,
            requisitorio: data.requisitorio,
            escritura: data.escritura,
          })
        }
      } catch (e) {
        console.log(e);
      }
    };

    await Promise.all([
      fetchData(`/cessoes/${String(precID)}`),
    ]);


    return () => {
      isMounted = false; // ✅ Cleanup: evita atualização após desmontar
    };
  }, []);

  // Atualiza a referência do status sempre que ele mudar
  useEffect(() => {

    if (status.status === 'success') {
      const isDarkMode = localStorage.getItem('darkMode');
      toast.success(status.message, {
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
    } else if (status.status === 'error') {
      const isDarkMode = localStorage.getItem('darkMode');
      toast.error(status.message, {
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
    }

  }, [status]);

  const handleEditarCessao = async (e) => {
    e.preventDefault();

    // Estado inicial: envio iniciado
    setStatus({ status: "sending", message: "Enviando dados..." });

    try {
      // 🟡 Validação da cessão
      const camposObrigatorios = [
        'precatorio',
        'processo',
        'cedente',
        'vara_processo',
        'ente_id',
        'ano',
        'natureza',
        'data_cessao',
        'escrevente_id',
        'juridico_id',
      ];

      const algumCampoVazio = camposObrigatorios.some((campo) => !formDataCessao[campo]);

      if (
        algumCampoVazio ||
        !formDataCessao.precatorio || formDataCessao.precatorio.length < 12 ||
        !formDataCessao.processo || formDataCessao.processo.length < 25
      ) {
        setStatus({
          status: 'error',
          message: 'Preencha todos os campos obrigatórios da cessão!',
        });
        return;
      }

      // 📤 Upload dos arquivos
      const uploadResponse = await uploadFiles();

      if (!uploadResponse) {
        setStatus({
          status: 'error',
          message: 'Erro no upload dos arquivos. Cadastro cancelado.',
        });
        return;
      }

      // 🧾 Montagem do payload
      const payload = {
        ...formDataCessao,
      };

      // 📡 Envio da cessão (comentado por enquanto)
      const response = await axiosPrivate.put(`/cessoes/${precID}`, payload);

      setStatus({
        status: 'success',
        message: 'Cessão editada com sucesso!',
      });

    } catch (error) {
      console.error("Erro ao editar cessão:", error);
      setStatus({
        status: 'error',
        message: 'Erro ao enviar dados. Tente novamente.',
      });
    }
  };

  const uploadFiles = async () => {
    try {
      const formDataCessao = new FormData();

      // 🔹 Adicionando os arquivos da cessão ao formDataCessao
      if (fileCessao.requisitorio) {
        formDataCessao.append("requisitorio", fileCessao.requisitorio);
      }

      if (fileCessao.escritura) {
        formDataCessao.append("escritura", fileCessao.escritura);
      }


      // 🔹 Enviar arquivos da cessão primeiro
      if (fileCessao.requisitorio || fileCessao.escritura) {
        await axiosPrivate.post("/upload", formDataCessao, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Upload dos arquivos da cessão realizado com sucesso!");
      }


      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar os arquivos:", error);
      return false;
    }
  };

  //As coisas que estão nesse useEffect só funcionam quando eu clico no modal
  useEffect(() => {
    const handler = (event) => {

      if (!modalElement.current) {
        return;
      }
      // Se status for 'sending', não fechar o modal ao clicar fora
      if (status === 'sending') {
        return
      }

      if (!modalElement.current.contains(event.target)) {
        if (document.body.style.overflow == "hidden") {
          document.body.style.overflow = "scroll";
        }
        setIsModalOpen(false);
      }

    }



    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
    }
  }, []);

  const handleModalShow = () => {
    setIsModalOpen(prevState => !prevState)

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

  const handleCessaoInputChange = (value, name) => {

    if (value instanceof File) {
      let values;
      let file;

      if (name === 'escritura') {
        values = `cessoes_escrituras/${value.name}`
        file = value
      } else if (name === 'requisitorio') {
        values = `cessoes_requisitorios/${value.name}`
        file = value
      }

      setFormDataCessao({ ...formDataCessao, [name]: values });
      setFileCessao({ ...fileCessao, [name]: file })

    } else if (value instanceof Object) {

      setFormDataCessao({ ...formDataCessao, [name]: value?.formattedValue ? value.formattedValue : value.value });

    } else if (value === null) {
      let values;
      let file;

      if (name === 'escritura') {
        values = ''
        file = ''
      } else if (name === 'requisitorio') {
        values = ''
        file = ''
      }

      setFormDataCessao({ ...formDataCessao, [name]: values });
      setFileCessao({ ...fileCessao, [name]: file })

    } else {
      setFormDataCessao({ ...formDataCessao, [name]: value?.formattedValue ? value.formattedValue : value });
    }


  };


  return (
    !isModalOpen ? (
      <button
        title='Adicionar nova cessão'
        className='dark:text-white hover:bg-neutral-800 text-sm px-4 py-2 rounded w-full'
        onClick={() => {
          setIsModalOpen(true)
          if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = 'scroll';
          }
        }}
      >
        Editar

      </button>

    ) : (
      <div className='fixed w-[100vw] h-[100vh] left-0 top-0 z-[100] bg-black bg-opacity-40'>
        <ToastContainer />

        <div ref={modalElement} className='bg-white dark:bg-neutral-900 w-[85%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded shadow-sm fixed'>

          <ModalTab status={status} handleModalShow={handleModalShow} precID={precID} />

          {status.status === 'sending' ? (
            <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>

              <div className='w-full h-full absolute z-[100] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-20 flex justify-center items-center'>
                <div className='w-10 h-10'>
                  <LoadingSpinner />
                </div>
              </div>

              <div>
                <form>
                  <div>
                    {/* Mantém os formulários montados, mas esconde um deles dinamicamente */}
                    <div>
                      <FormEditarCessao
                        formDataCessao={formDataCessao}
                        precID={precID}
                        handleCessaoInputChange={handleCessaoInputChange}
                      />
                    </div>
                  </div>

                </form>
              </div>

              <div>
                <button className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200' onClick={handleEditarCessao}>Salvar</button>
              </div>

            </div>) :
            <div className='p-4 overflow-y-auto h-[calc(100%-50px)] lg:flex lg:flex-col lg:justify-between'>
              <div>
                <form onSubmit={handleEditarCessao}>
                  <div>
                    {/* Mantém os formulários montados, mas esconde um deles dinamicamente */}
                    <div>
                      <FormEditarCessao
                        formDataCessao={formDataCessao}
                        precID={precID}
                        handleCessaoInputChange={handleCessaoInputChange}
                      />
                    </div>
                  </div>

                </form>
              </div>

              <div>
                <button className='border rounded py-1 px-4 float-right mt-4 lg:mt-0 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700' onClick={handleEditarCessao}>Salvar</button>
              </div>
            </div>
          }

        </div>
      </div>
    )
  )
}