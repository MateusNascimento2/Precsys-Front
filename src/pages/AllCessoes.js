import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';
import * as XLSX from 'xlsx';
import { Modal } from '../components/CessaoCessionarioModal/Modal';
import useAuth from "../hooks/useAuth";
import Filtro from '../components/FiltroCessoes/Filtro';

export default function Cessoes({ isInPerfilUsuario, userIdUrlParam }) {
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
    status: '1' //Novas cessões adicionadas sempre vão começar com o status '1' (Em Andamento)
  });

  const [formDataCessionario, setFormDataCessionario] = useState({
    user_id: '',
    valor_pago: '',
    comissao: '',
    percentual: '',
    exp_recebimento: '',
    valor_oficio_pagamento: '',
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

  // Estado que vai pegar os filtos salvos no local storage
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const saved = localStorage.getItem('selectedFilters');
    const parsed = saved ? JSON.parse(saved) : {};

    return {
      status: parsed.status || [],
      ente: parsed.ente || [],
      empresa: parsed.empresa || [],
      natureza: parsed.natureza || [],
      anuencia_advogado: parsed.anuencia_advogado || [],
      falecido: parsed.falecido || [],
      tele: parsed.tele || [],
      data_cessao: Array.isArray(parsed.data_cessao) ? parsed.data_cessao : [],
      requisitorio: parsed.requisitorio || [],
      escritura: parsed.escritura || [],
      gestoresEClientes: parsed.gestoresEClientes || []
    };
  });

  const [status, setStatus] = useState('typing');
  const [cessionariosQtd, setCessionariosQtd] = useState([]);
  const [idCessionarioForm, setIdCessionarioForm] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [cessoes, setCessoes] = useState([]);
  const [dadosFiltro, setDadosFiltro] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  // Estado para selecionar os campos da cessão que o usuário vai exportar para excel
  const [selectedExportFields, setSelectedExportFields] = useState([
    "id",
    "precatorio",
    "cedente",
    "status",
    "ente",
    "natureza",
    "data_cessao",
    "empresa",
    "anuencia_advogado",
    "falecido",
  ]);

  const { minhascessoes } = useParams();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setter) => {
      try {
        setIsLoading(true)
        const { data } = await axiosPrivate.get(url, {
          signal: controller.signal,
        });
        if (isMounted) setter(data);
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.error(`Failed to fetch ${url}:`, err);
      }
    };

    {/* Função que vai pegar as cessões e os filtros de acordo com a página em que o usuário está ou se ele for um admin */ }
    const fetchAllData = async () => {
      try {
        const urlCessoes = minhascessoes || isInPerfilUsuario ? `/cessoes-usuario/${userIdUrlParam ? userIdUrlParam : auth.user.id}` : '/todas-cessoes';
        const urlFiltros = auth.user.admin || auth.user.advogado ? '/filtros' : '/filtros-usuario';
        await Promise.all([
          fetchData(urlCessoes, setCessoes),
          fetchData(urlFiltros, setDadosFiltro)
        ]);

      } catch (err) {
        console.error('Erro ao buscar informações sobre cessões:', err);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, minhascessoes, auth.user?.id]);

  // Vai guardar os valores selecionados no filtro no local storage
  useEffect(() => {
    localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  // Função para atualizar o estado dos filtros
  const handleFilterChange = (filterCategory, value) => {

    setSelectedFilters(prevState => {
      // Pega a lista atual de filtros para essa categoria
      const currentFilters = prevState[filterCategory];

      let updatedFilters;

      if (currentFilters.includes(value)) {
        // Se já tinha o valor, remove ele (desmarcando)
        updatedFilters = currentFilters.filter(item => item !== value);

      } else if (filterCategory === 'gestoresEClientes' && currentFilters.some(dado => dado.cliente_id === value.cliente_id)) {

        updatedFilters = currentFilters.filter(item => item.cliente_id !== value.cliente_id)

      } else if (filterCategory === 'gestoresEClientes' && currentFilters.some(dado => dado.gestor_id === value.gestor_id)) {

        updatedFilters = currentFilters.filter(item => item.gestor_id !== value.gestor_id)

      } else {
        // Se não tinha, adiciona o valor (marcando)
        updatedFilters = [...currentFilters, value];
      }

      // Retorna o novo objeto de filtros atualizado
      return {
        ...prevState,
        [filterCategory]: updatedFilters
      };
    });
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    const emptyFilters = {
      status: [],
      ente: [],
      empresa: [],
      natureza: [],
      anuencia_advogado: [],
      falecido: [],
      tele: [],
      data_cessao: [],
      requisitorio: [],
      escritura: [],
      gestoresEClientes: [],
    };

    setSelectedFilters(emptyFilters);
    localStorage.removeItem('selectedFilters');
  };

  // Função para lidar com a data do filtro de cessões
  const handleDateChange = (id, value) => {
    setSelectedFilters((prevState) => {
      let newDataCessao = [...prevState.data_cessao];

      if (id === 'data_cessao_inicial') {
        newDataCessao[0] = value;  // Atualiza a data inicial
        // Se a data final ainda não foi preenchida, define como a data de hoje
        if (!newDataCessao[1]) {
          newDataCessao[1] = new Date().toISOString().split('T')[0];  // Data de hoje no formato yyyy-mm-dd
        }
      } else if (id === 'data_cessao_final') {
        newDataCessao[1] = value;  // Atualiza a data final
      }

      return {
        ...prevState,
        data_cessao: newDataCessao,  // Atualiza o array de datas
      };
    });
  };

  // Função para filtrar os dados das cessões com base nos filtros selecionados
  const filteredData = cessoes.filter(item => {

    // 1. Filtro de pesquisa (searchQuery) em todos os campos do item
    const filterSearchInput = searchQuery
      ? Object.values(item).some(value =>
        // Concatenando "ente - ano" na pesquisa
        (value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (`${item.ente} - ${item.ano}`.toLowerCase().includes(searchQuery.toLowerCase()))  // Concatenando ente + ano
      )
      : true;

    // 2. Filtro de "status"
    const filterStatus = selectedFilters.status.length
      ? selectedFilters.status.includes(item.status)  // Verifica se o status está selecionado
      : true;  // Se não houver filtro de status, retorna true (sem filtro)

    // 3. Filtro de "ente + ano" (ex: "Estado RJ - 2017")
    const filterEnteAno = selectedFilters.ente.length
      ? selectedFilters.ente.includes(`${item.ente} - ${item.ano}`)  // Concatenando ente e ano com " - "
      : true;  // Se não houver filtro de ente/ano, retorna true

    // 4. Filtro de "empresa"
    const filterEmpresa = selectedFilters.empresa.length
      ? selectedFilters.empresa.includes(item.empresa)  // Verifica se a empresa está selecionada
      : true;  // Se não houver filtro de empresa, retorna true

    // 5. Filtro de "natureza"
    const filterNatureza = selectedFilters.natureza.length
      ? selectedFilters.natureza.includes(item.natureza)  // Verifica se a natureza está selecionada
      : true;  // Se não houver filtro de natureza, retorna true

    // 6. Filtro de "anuencia_advogado"
    const filterAnuenciaAdvogado = selectedFilters.anuencia_advogado.length
      ? selectedFilters.anuencia_advogado.includes(item.anuencia_advogado)  // Verifica se a anuência do advogado está selecionada
      : true;  // Se não houver filtro de anuência, retorna true

    // 7. Filtro de "falecido"
    const filterFalecido = selectedFilters.falecido.length
      ? selectedFilters.falecido.includes(item.falecido)  // Verifica se o valor de falecido está selecionado
      : true;  // Se não houver filtro de falecido, retorna true

    // 8. Filtro de "tele"
    const filterTele = selectedFilters.tele.length
      ? selectedFilters.tele.includes(item.tele)  // Verifica se o tele está selecionado
      : true;  // Se não houver filtro de tele, retorna true

    // 9. Filtro de "data_cessao"
    // Filtro de data_cessao com base no intervalo de data inicial e final (dentro do array)
    const filterDataCessao = selectedFilters.data_cessao.length === 2
      ? new Date(item.data_cessao) >= new Date(selectedFilters.data_cessao[0]) &&
      new Date(item.data_cessao) <= new Date(selectedFilters.data_cessao[1])
      : true;


    // 10. Filtro de "documentos faltantes"
    const filterEscrituraFaltando = selectedFilters.escritura.length
      ? selectedFilters.escritura.includes(null) && (item.escritura === null || item.escritura === '')
      : true;

    // 11. Filtro de "documentos faltantes"
    const filterRequisitorioFaltando = selectedFilters.requisitorio.length
      ? selectedFilters.requisitorio.includes(null) && (item.requisitorio === null || item.requisitorio === '')
      : true;

    // 12. Filtro de "Gestores e Clientes"
    const filterCessoesGestoresEClientes = selectedFilters.gestoresEClientes.length
      ? selectedFilters.gestoresEClientes.some(dado => (dado.cessoes_cliente?.includes(item.id) || dado.cessoes_gestor?.includes(item.id)))
      : true

    // 13. Verifica se todos os filtros são verdadeiros
    return (
      filterSearchInput &&
      filterStatus &&
      filterEnteAno &&
      filterEmpresa &&
      filterNatureza &&
      filterAnuenciaAdvogado &&
      filterFalecido &&
      filterTele &&
      filterDataCessao &&
      filterRequisitorioFaltando &&
      filterEscrituraFaltando &&
      filterCessoesGestoresEClientes
    );
  });

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }


  const fetchCessoes = async () => {
    try {
      const { data } = await axiosPrivate.get('/todas-cessoes');
      setCessoes(data);// atualiza a lista
    } catch (error) {
      console.error('Erro ao buscar as cessões após cadastro:', error);
    }
  };

  {/* Função para manejar o estado de visibilidade e scroll do filtro no mobile */ }
  const handleShow = () => {
    setShow((prevState) => !prevState);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

  {/* Função para exportar os itens da lista de cessões para um documento PDF */ }
  const exportPDF = (filteredData) => {

    const statusColors = {
      'Em Andamento': '#d2c7b3',
      'Em Andamento Com Depósito': '#bdb4a9',
      'Em Andamento Com Pendência': '#aaa59e',
      'Homologado': '#9eabaf',
      'Homologado Com Depósito': '#aabcb5',
      'Homologado Com Pendência': '#9299a8',
      'Ofício de Transferência Expedido': '#b2c8b7',
      'Recebido': '#bad3b9',
    };

    const chunks = [];
    for (let i = 0; i < filteredData.length; i += 8) {
      chunks.push(filteredData.slice(i, i + 8));
    }

    const docDefinition = {
      content: chunks.map((chunk, index) => [
        ...chunk.map(cessao => [
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    columns: [
                      { width: 60, text: cessao.id, style: 'id', margin: [10, 10, 0, 5] },
                      {
                        width: '*', stack: [
                          { text: cessao.precatorio, style: 'precatorio', margin: [5, 5, 0, 2] },
                          { text: cessao.cedente, style: 'cedente', margin: [5, 0, 0, 5] },
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return '#f5f5f5'; // Cor de fundo cinza
              },
              hLineWidth: function (i, node) {
                return 0; // Sem linhas horizontais internas
              },
              vLineWidth: function (i, node) {
                return 0; // Sem linhas verticais
              }
            },
            margin: [0, 10, 0, 0],
            keepTogether: true, // Mantém este bloco junto
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      {
                        columns: [
                          { text: cessao.status, style: 'status', color: statusColors[cessao.status] || '#000000' },
                          ...(cessao.ente ? [{ text: `${cessao.ente} - ${cessao.ano}`, style: 'badge' }] : []),
                          ...(cessao.natureza ? [{ text: cessao.natureza, style: 'badge' }] : []),
                          ...(cessao.data_cessao ? [{ text: cessao.data_cessao.split('-').reverse().join('/'), style: 'badge' }] : []),
                          ...(cessao.empresa ? [{ text: cessao.empresa, style: 'badge' }] : []),
                          ...(cessao.anuencia_advogado ? [{ text: cessao.anuencia_advogado, style: 'badge' }] : []),
                          ...(cessao.falecido ? [{ text: cessao.falecido, style: 'badge' }] : []),
                        ],
                        columnGap: 5,
                        margin: [10, 5, 0, 5]
                      }
                    ]
                  }
                ]
              ]
            },
            layout: {
              hLineWidth: function (i, node) {
                return 0; // Sem linhas horizontais internas
              },
              vLineWidth: function (i, node) {
                return 0; // Sem linhas verticais
              },
              hLineColor: function (i, node) {
                return '#ccc'; // Cor da borda
              },
              paddingLeft: function (i, node) { return 10; },
              paddingRight: function (i, node) { return 10; },
              border: function (i, node) {
                return { left: 1, top: 1, right: 1, bottom: 1 }; // Borda ao redor do container
              }
            },
            margin: [0, 0, 0, 10],
            keepTogether: true, // Mantém este bloco junto
          }
        ]),
        ...(index < chunks.length - 1 ? [{ text: '', pageBreak: 'after' }] : []) // Adiciona quebra de página após cada grupo, exceto o último
      ]).flat(),
      styles: {
        id: {
          fontSize: 9,
          bold: true
        },
        precatorio: {
          fontSize: 9,
          bold: true
        },
        cedente: {
          fontSize: 8,
          color: '#757575'
        },
        status: {
          bold: true,
          fontSize: 7,
          margin: [0, 0, 0, 5],
          alignment: 'center'
        },
        badge: {
          color: '#000',
          fontSize: 7,
          margin: [0, 0, 0, 5],
          bold: true,
          alignment: 'center'
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('lista.pdf');
  };

  {/* Função para manejar quais colunas vão ser exportadas para o excel */ }
  const handleFieldSelectionChange = (field) => {
    setSelectedExportFields((prevState) =>
      prevState.includes(field)
        ? prevState.filter((item) => item !== field)
        : [...prevState, field]
    );
  };

  {/* Função para exportar os itens da lista de cessões para uma planilha de excel */ }
  const exportToExcel = (filteredData, selectedFields) => {
    // Mapeamento de rótulos personalizados
    const fieldLabels = {
      id: "Id",
      precatorio: "Precatório",
      processo: "Processo",
      cedente: "Cedente",
      status: "Status",
      ente: "Ente Público",
      natureza: "Natureza",
      data_cessao: "Data da Cessão",
      empresa: "Empresa",
      anuencia_advogado: "Anuência",
      falecido: "Falecido",
    };

    // Ajustar os dados filtrados com base nos rótulos
    const selectedData = filteredData.map((item) => {
      const filteredItem = {};
      selectedFields.forEach((field) => {

        if (fieldLabels[field] === 'Ente Público') {
          const label = fieldLabels[field] || field; // Usa o rótulo personalizado ou a chave original
          filteredItem[label] = `${item[field]} - ${item.ano}`;
        } else {
          const label = fieldLabels[field] || field; // Usa o rótulo personalizado ou a chave original
          filteredItem[label] = item[field];
        }
      });

      return filteredItem;
    });

    // Criar a planilha e o arquivo Excel
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cessões");

    // Baixar o arquivo Excel
    XLSX.writeFile(workbook, "cessoes.xlsx");
  };


  //Funções do Modal
  {/* Função de manipulação dos campos do formulário de cessão */ }
  const handleCessaoInputChange = (value, name) => {
    if (value instanceof File) {
      let values;
      let file;

      //Vai adicionar o caminho dos arquivos do drive no nome do arquivo
      if (name === 'escritura') {
        values = `cessoes_escrituras/${value.name}`
        file = value
      } else if (name === 'requisitorio') {
        values = `cessoes_requisitorios/${value.name}`
        file = value
      }

      setFormDataCessao({ ...formDataCessao, [name]: values });
      setFileCessao({ ...fileCessao, [name]: file })


      //Vai capturar o valor formatado do input do número de precatório e do processo
    } else if (value instanceof Object) {
      setFormDataCessao({ ...formDataCessao, [name]: value?.formattedValue ? value.formattedValue : value.value });


      //Pega o valor do input de arquivo se o usuario remover o arquivo do input (que no caso vai ser null quando ele remover o arquivo)
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

      //Pega o valor do resto dos inputs
    } else {
      setFormDataCessao({ ...formDataCessao, [name]: value?.formattedValue ? value.formattedValue : value });
    }
  };

  {/* Função de manipulação dos campos do formulário de cessionário */ }
  const handleCessionarioInputChange = (id, values, name) => {
    console.log(values)

    //Acho que nao precisa mais dessa funcao '-'
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

      //Vai loopando para encontrar o formulario certo e preenche as informações no state
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

  //Muda o nome da aba de cessionario de acordo com o nome selecionado no input
  const handleNomeTab = (nome, id) => {
    setCessionariosQtd(prevCessionarios =>
      prevCessionarios.map(cessionario =>
        cessionario.id === id
          ? { ...cessionario, nomeTab: nome }
          : cessionario
      )
    );
  }

  {/* Função de adicionar um cessionário no modal de adicionar cessão/cessionário */ }
  const handleAddCessionario = () => {
    setIdCessionarioForm(prevId => prevId + 1);

    setCessionariosQtd(
      [...cessionariosQtd, { id: idCessionarioForm, nomeTab: '', formDataCessionario: { ...formDataCessionario }, fileCessionarios: { ...fileCessionario } }]
    )
  }

  {/* Função de remover um cessionário do modal de adicionar cessão/cessionário */ }
  const handleDeleteCessionarioForm = (id) => {
    setCessionariosQtd(
      cessionariosQtd.filter(cessionarioForm => cessionarioForm.id !== id)
    )
  }

  {/* Função de enviar arquivos da cessão e dos cessionários  */ }
  const uploadFiles = async () => {
    try {
      const formDataCessao = new FormData();
      const formDataCessionarios = new FormData();

      // Adicionando os arquivos da cessão ao formDataCessao
      if (fileCessao.requisitorio) {
        formDataCessao.append("requisitorio", fileCessao.requisitorio);
      }

      if (fileCessao.escritura) {
        formDataCessao.append("escritura", fileCessao.escritura);
      }

      // Adicionando arquivos dos cessionários ao formDataCessionarios
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

      // Enviar arquivos da cessão primeiro
      if (fileCessao.requisitorio || fileCessao.escritura) {
        await axiosPrivate.post("/upload", formDataCessao, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Upload dos arquivos da cessão realizado com sucesso!");
      }

      // Enviar arquivos dos cessionários, se existirem
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

  {/* Função de adicionar cessão e cessionários dessa cessão */ }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Estado inicial: envio iniciado
    setStatus({ status: "sending", message: "Enviando dados..." });

    try {
      // Validação da cessão
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

      // Validação dos cessionários
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

      // Upload dos arquivos
      const uploadResponse = await uploadFiles();

      if (!uploadResponse) {
        setStatus({
          status: 'error',
          message: 'Erro no upload dos arquivos. Cadastro cancelado.',
        });
        return;
      }

      // Montagem do payload
      const payload = {
        ...formDataCessao,
        cessionarios: cessionariosQtd.map(c => c.formDataCessionario),
      };

      // Envio da cessão
      const response = await axiosPrivate.post("/cessoes", payload);

      setStatus({
        status: 'success',
        message: 'Cessão cadastrada com sucesso!',
      });

      await fetchCessoes();
    } catch (error) {
      console.error("Erro ao cadastrar cessão e cessionários:", error);
      setStatus({
        status: 'error',
        message: 'Erro ao enviar dados. Tente novamente.',
      });
    }
  };

  {/* Props do componente de CessaoCessionarioModal */ }
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
    <>
      {/* Esse componente é reutilizado no componente MeuPerfil.js */}
      {/* Se estiver no componente MeuPerfil.js, é retirado o componente Header junto com modificações no CSS */}
      {!isInPerfilUsuario ? <Header /> : null}
      <main className={show ? `container mx-auto ${isInPerfilUsuario ? '' : 'pt-[120px]'} dark:bg-neutral-900 h-full` : `container mx-auto ${isInPerfilUsuario ? '' : 'pt-[120px]'} dark:bg-neutral-900 h-full`}>
        <ToastContainer />
        <div className={isInPerfilUsuario ? '' : 'px-[20px]'}>
          <div className='flex justify-between items-center md:items-end'>

            {isInPerfilUsuario ?
              <div className='flex flex-col'>
                <span className='font-semibold dark:text-white'>Cessões</span>
                <span class="text-[12px] font-medium dark:text-neutral-400 text-neutral-600">Acompanhe suas cessões no sistema</span>
              </div>

              :
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='font-[700] text-[32px] md:mt-[16px] dark:text-white'
                id='cessoes'
              >
                Cessões
              </motion.h2>
            }

            {/* Se não estiver nas minhas cessões e não estiver no componente MeuPerfil.js e o usuário for um admin, é mostrado o botão de adicionar cessão */}
            {!minhascessoes && !isInPerfilUsuario && auth.user.admin
              ?
              <div>
                {/* Componente que vem da pasta CessaoCessionarioModal */}
                <Modal {...modalProps} />
              </div>
              : null
            }

          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={isInPerfilUsuario ? 'mt-[24px]' : 'mt-[24px] px-5 dark:bg-neutral-900'}
        >
          <div className='flex gap-3 items-center mb-4 w-full'>
            {/* Barra de Pesquisa */}
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />

            {/* Botão do Filtro no mobile */}
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>

            {/* Filtro no Desktop */}
            <div className={isInPerfilUsuario ? 'hidden lg:block lg:sticky lg:top-[7%] lg:w-[320px]' : 'hidden lg:block lg:sticky lg:top-[7%] lg:w-[320px]'}>
              <Filtro show={show} dadosFiltro={dadosFiltro} selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} handleDateChange={handleDateChange} exportPDF={() => exportPDF(filteredData)} exportExcel={(fields) => exportToExcel(filteredData, fields)} selectedExportFields={selectedExportFields} handleFieldSelectionChange={handleFieldSelectionChange} clearAllFilters={clearAllFilters} />
            </div>

            {/* Lista de Cessões */}
            <div className='w-full h-full max-h-full'>
              <Lista cessoes={cessoes} filteredCessoes={filteredData} searchQuery={searchQuery} isLoading={isLoading} />
            </div>
          </div>
        </motion.div>

        {/* Filtro no Mobile */}
        <div className='lg:hidden'>
          <Filtro onSetShow={handleShow} setShow={setShow} show={show} dadosFiltro={dadosFiltro} selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} handleDateChange={handleDateChange} exportPDF={() => exportPDF(filteredData)} exportExcel={(fields) => exportToExcel(filteredData, fields)} selectedExportFields={selectedExportFields} handleFieldSelectionChange={handleFieldSelectionChange} clearAllFilters={clearAllFilters} />
        </div>

        {/* Botão Scroll-to-top */}
        <ScrollToTopButton />
      </main>
    </>
  )
}
