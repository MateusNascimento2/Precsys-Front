import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import ListaStatus from '../components/ListaStatus';
import FilterButton from '../components/FilterButton';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';
import * as XLSX from 'xlsx';
import Filtro from '../components/FiltroCessoes/Filtro';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default function StatusPrecatorio() {

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
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [cessoes, setCessoes] = useState([]);
  const [dadosFiltro, setDadosFiltro] = useState([]);
  const axiosPrivate = useAxiosPrivate();
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

  console.log(cessoes)
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

    const fetchAllData = async () => {
      try {
        const urlCessoes = '/logs-status-precatorio';
        const urlFiltros = '/filtros';
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
  }, [axiosPrivate]);

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

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

  const handleFieldSelectionChange = (field) => {
    setSelectedExportFields((prevState) =>
      prevState.includes(field)
        ? prevState.filter((item) => item !== field)
        : [...prevState, field]
    );
  };

  const handleShow = () => {
    setShow((prevState) => !prevState);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }
  }

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



  return (
    <>
      <Header />
      <main className={`container mx-auto dark:bg-neutral-900 h-full pt-[120px]`}>
        <div className={'px-[20px]'}>
          <div className='flex justify-between items-center md:items-end'>


            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='font-[700] text-[32px] md:mt-[16px] dark:text-white'
              id='cessoes'
            >
              Cessões
            </motion.h2>


          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={'mt-[24px] px-5 dark:bg-neutral-900'}
        >
          <div className='flex gap-3 items-center mb-4 w-full'>
            {/* Barra de Pesquisa */}
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />

            {/* Botão do Filtro no mobile */}
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>

            {/* Filtro no Desktop */}
            <div className={'hidden lg:block lg:sticky lg:top-[7%] lg:w-[320px]'}>
              <Filtro show={show} dadosFiltro={dadosFiltro} selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} handleDateChange={handleDateChange} exportPDF={() => exportPDF(filteredData)} exportExcel={(fields) => exportToExcel(filteredData, fields)} selectedExportFields={selectedExportFields} handleFieldSelectionChange={handleFieldSelectionChange} clearAllFilters={clearAllFilters} />
            </div>

            {/* Lista de Cessões */}
            <div className='w-full h-full max-h-full'>
              <ListaStatus cessoes={cessoes} filteredCessoes={filteredData} searchQuery={searchQuery} isLoading={isLoading} />
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
