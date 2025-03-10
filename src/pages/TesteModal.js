import React, { useState } from 'react'
import { Modal } from '../components/CessaoCessionarioModal/Modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export function TesteModal() {
  const axiosPrivate = useAxiosPrivate();
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
    status: '1'
  });
  const [formDataCessionario, setFormDataCessionario] = useState({
    user_id: '',
    valor_pago: '',
    comissao: '',
    percentual: '',
    exp_recebimento: '',
    recebido: '',
    assinatura: '',
    mandado: '',
    comprovante: '',
    expedido: '',
    obs: '',
    nota: ''
  })
  const [fileCessao, setFileCessao] = useState({
    requisitorio: '',
    escritura: ''
  })
  const [fileCessionario, setFileCessionario] = useState({
    nota: '',
    mandado: '',
    comprovante: ''
  })
  const [status, setStatus] = useState('typing');
  const [cessionariosQtd, setCessionariosQtd] = useState([]);
  const [idCessionarioForm, setIdCessionarioForm] = useState(0);

  console.log(formDataCessao)
  console.log(formDataCessionario)

  const handleCessaoInputChange = (value, name) => {
    console.log(value)


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
      console.log(value)

      setFormDataCessao({ ...formDataCessao, [name]: value?.formattedValue ? value.formattedValue : value.value });

    } else if (value === null) {
      console.log('null')
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

  const handleCessionarioInputChange = (id, values, name) => {

    console.log(values instanceof Object)

    //Função para checar se é um objeto por causa dos inputs que possuem a lib "Select" que retornam um object no parametro values
    function isObject(obj) {
      return obj === Object(obj) && !obj instanceof File
    }


    if (isObject(values)) {

      const { value } = values;

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: value } }
            : cessionario
        )
      );

    } else if (values instanceof File) {
      let value;
      let file;
      console.log('é arquivo')
      console.log(values.name)
      console.log(name)

      if (name === 'nota') {
        value = `cessionarios_nota/${values.name}`
        file = values
      } else if (name === 'mandado') {
        value = `cessionarios_mandado/${values.name}`
        file = values
      } else if (name === 'comprovante') {
        value = value = `cessionarios_comprovante/${values.name}`
        file = values
      }

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: value }, fileCessionarios: { ...cessionario.fileCessionarios, [name]: file } }
            : cessionario
        )
      );


    } else if (values === null) {
      let value;
      let file;
      console.log('é arquivo')

      if (name === 'nota') {
        value = ''
        file = ''
      } else if (name === 'mandado') {
        value = ''
        file = ''
      } else if (name === 'comprovante') {
        value = ''
        file = ''
      }

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: value }, fileCessionarios: { ...cessionario.fileCessionarios, [name]: file } }
            : cessionario
        )
      );

    }

    else {

      setCessionariosQtd(prevCessionarios =>
        prevCessionarios.map(cessionario =>
          cessionario.id === id
            ? { ...cessionario, formDataCessionario: { ...cessionario.formDataCessionario, [name]: values } }
            : cessionario
        )
      );

    }


  };

  const handleNomeTab = (nome, id) => {
    setCessionariosQtd(prevCessionarios =>
      prevCessionarios.map(cessionario =>
        cessionario.id === id
          ? { ...cessionario, nomeTab: nome }
          : cessionario
      )
    );
  }

  const handleAddCessionario = () => {
    setIdCessionarioForm(prevId => prevId + 1);

    setCessionariosQtd(
      [...cessionariosQtd, { id: idCessionarioForm, nomeTab: '', formDataCessionario: { ...formDataCessionario }, fileCessionarios: { ...fileCessionario } }]
    )
  }

  const handleDeleteCessionarioForm = (id) => {
    setCessionariosQtd(
      cessionariosQtd.filter(cessionarioForm => cessionarioForm.id !== id)
    )
  }

  const uploadFiles = async () => {
    try {
      const formDataCessao = new FormData();
      const formDataCessionarios = new FormData();

      // 🔹 Adicionando os arquivos da cessão ao formDataCessao
      if (fileCessao.requisitorio) {
        formDataCessao.append("requisitorio", fileCessao.requisitorio);
      }

      if (fileCessao.escritura) {
        formDataCessao.append("escritura", fileCessao.escritura);
      }

      // 🔹 Adicionando arquivos dos cessionários ao formDataCessionarios
      cessionariosQtd.forEach((cessionario) => {
        const files = cessionario.fileCessionarios || {};

        if (files.nota) {
          // Verifica se `files.nota` é um array antes de adicionar os arquivos corretamente
          if (Array.isArray(files.nota)) {
            files.nota.forEach((file) => formDataCessionarios.append("nota", file));
          } else {
            formDataCessionarios.append("nota", files.nota);
          }
        }

        if (files.mandado) {
          if (Array.isArray(files.mandado)) {
            files.mandado.forEach((file) => formDataCessionarios.append("oficio_transferencia", file));
          } else {
            formDataCessionarios.append("oficio_transferencia", files.mandado);
          }
        }

        if (files.comprovante) {
          if (Array.isArray(files.comprovante)) {
            files.comprovante.forEach((file) => formDataCessionarios.append("comprovante_pagamento", file));
          } else {
            formDataCessionarios.append("comprovante_pagamento", files.comprovante);
          }
        }
      });

      console.log("Arquivos da cessão:", [...formDataCessao.entries()]);
      console.log("Arquivos dos cessionários:", [...formDataCessionarios.entries()]);

      // 🔹 Enviar arquivos da cessão primeiro
      if (fileCessao.requisitorio || fileCessao.escritura) {
        await axiosPrivate.post("/upload", formDataCessao, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Upload dos arquivos da cessão realizado com sucesso!");
      }

      // 🔹 Enviar arquivos dos cessionários, se existirem
      if (formDataCessionarios.has("nota") || formDataCessionarios.has("oficio_transferencia") || formDataCessionarios.has("comprovante_pagamento")) {
        await axiosPrivate.post("/uploadFileCessionario", formDataCessionarios, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Upload dos arquivos dos cessionários realizado com sucesso!");
      }

      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar os arquivos:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
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

      // 🟡 Validação dos cessionários
      if (cessionariosQtd.length > 0) {
        const algumCessionarioInvalido = cessionariosQtd.some((cessionario) => {
          const {
            user_id,
            valor_pago,
            comissao,
            exp_recebimento,
            percentual,
          } = cessionario.formDataCessionario;

          return !user_id || !valor_pago || !comissao || !exp_recebimento || !percentual;
        });

        if (algumCessionarioInvalido) {
          setStatus({
            status: 'error',
            message: 'Preencha todos os campos obrigatórios do cessionário!',
          });
          return;
        }
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
        cessionarios: cessionariosQtd.map(c => c.formDataCessionario),
      };

      // 📡 Envio da cessão (comentado por enquanto)
      // const response = await axiosPrivate.post("/cessoes", payload);
      // console.log(response.data);

      // 📬 Simulação de envio
      await sendMessage();

      console.log('payload', JSON.stringify(payload, null, 2));
      setStatus({
        status: 'success',
        message: 'Cessão cadastrada com sucesso!',
      });
    } catch (error) {
      console.error("Erro ao cadastrar cessão e cessionários:", error);
      setStatus({
        status: 'error',
        message: 'Erro ao enviar dados. Tente novamente.',
      });
    }
  };

  const modalProps = {
    onAddCessionario: handleAddCessionario,
    handleCessionarioInputChange,
    onDeleteCessionarioForm: handleDeleteCessionarioForm,
    cessionariosQtd,
    formCessionario: formDataCessionario,
    setFormDataCessionario,
    formDataCessao,
    handleCessaoInputChange,
    handleSubmit,
    status,
    handleNomeTab
  };

  return (
    <div>
      <Modal {...modalProps} />

    </div>
  )
}

// Simula o envio de uma mensagem.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
} 