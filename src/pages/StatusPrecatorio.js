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
import Filtro from '../components/FiltroStatusCessoes/Filtro';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default function StatusPrecatorio() {

  // Estado que vai pegar os filtos salvos no local storage
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const saved = localStorage.getItem('selectedFilters');
    const parsed = saved ? JSON.parse(saved) : {};

    return {
      status: parsed.status || [],
      status_antigo: parsed.status_antigo || [],
      data_modificacao_status: Array.isArray(parsed.data_modificacao_status) ? parsed.data_modificacao_status : [],
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
    "status_atual",
    "status_antigo",
    "data_modificacao_status",
  ]);

  console.log(selectedFilters)

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
      status_antigo: [],
      data_modificacao_status: [],
    };

    setSelectedFilters(emptyFilters);
    localStorage.removeItem('selectedFilters');
  };

  // Função para lidar com a data do filtro de cessões
  const handleDateChange = (id, value) => {
    setSelectedFilters((prevState) => {
      const novoIntervalo = [...(prevState.data_modificacao_status || [])];

      if (id === 'data_modificacao_inicial') {
        novoIntervalo[0] = value; // "dd/mm/aaaa"
      } else if (id === 'data_modificacao_final') {
        novoIntervalo[1] = value;
      }

      return {
        ...prevState,
        data_modificacao_status: novoIntervalo,
      };
    });
  };

  const parseDate = (data) => {
    if (!data) return null;
    if (data instanceof Date) return data;

    if (typeof data !== 'string') return null;

    // ISO do input: 2025-11-20
    if (data.includes('-')) {
      // garante que não entra fuso esquisito
      return new Date(data + 'T00:00:00');
    }

    if (data.includes('/')) {
      const [a, b, c] = data.split('/'); // pode ser dd/mm/yyyy, mm/dd/yyyy ou yyyy/mm/dd

      // yyyy/mm/dd
      if (a.length === 4) {
        return new Date(`${a}-${b}-${c}`);
      }

      const nA = parseInt(a, 10);
      const nB = parseInt(b, 10);

      // se o primeiro número > 12, não pode ser mês → dd/mm/yyyy
      if (nA > 12) {
        // dd/mm/yyyy
        return new Date(`${c}-${b}-${a}`);
      }

      // caso contrário, assume mm/dd/yyyy (teu caso: 11/20/2025)
      return new Date(`${c}-${a}-${b}`);
    }

    // fallback
    return new Date(data);
  };


  const filteredData = cessoes.filter(item => {

    // 1. Filtro de pesquisa (searchQuery) em todos os campos do item
    const filterSearchInput = searchQuery
      ? Object.values(item).some(value =>
        // Concatenando "ente - ano" na pesquisa
        (value && value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      )
      : true;

    const filterStatusAtualeAntigo = () => {
      if (selectedFilters.status.length && !selectedFilters.status_antigo.length) {
        return selectedFilters.status.includes(item.status_atual)

      } else if (!selectedFilters.status.length && selectedFilters.status_antigo.length) {
        return selectedFilters.status_antigo.includes(item.status_antigo)

      } else if (selectedFilters.status.length && selectedFilters.status_antigo.length) {
        return (selectedFilters.status.includes(item.status_atual) && selectedFilters.status_antigo.includes(item.status_antigo))

      } else {
        return true
      }
    }

    // 4. Filtro de "data_cessao"
    // Filtro de data_cessao com base no intervalo de data inicial e final (dentro do array)
    const filterDataModificacao = (() => {
      const intervalo = selectedFilters.data_modificacao_status || [];
      const [inicioStr, fimStr] = intervalo;

      const temInicio = !!inicioStr;
      const temFim = !!fimStr;

      // se não tem nenhum dos dois no filtro → não filtra por data
      if (!temInicio && !temFim) return true;

      // item sem data de modificação → não entra no resultado
      if (!item.data_modificacao_status) return false;

      const dataItem = parseDate(item.data_modificacao_status);
      if (!dataItem) return false;

      const dataInicio = temInicio ? parseDate(inicioStr) : null;
      const dataFim = temFim ? parseDate(fimStr) : null;

      if (dataInicio && !dataFim) {
        // só data inicial → a partir dessa data
        return dataItem >= dataInicio;
      }

      if (!dataInicio && dataFim) {
        // só data final → até essa data
        return dataItem <= dataFim;
      }

      // data inicial e final → dentro do intervalo (inclusive)
      return dataItem >= dataInicio && dataItem <= dataFim;
    })();


    // 5. Verifica se todos os filtros são verdadeiros
    return (
      filterSearchInput &&
      filterStatusAtualeAntigo() &&
      filterDataModificacao
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
      status_atual: "Status Atual",
      status_antigo: "Status Antigo",
      data_modificacao_status: "Data da Modificação",
    };

    // Ajustar os dados filtrados com base nos rótulos
    const selectedData = filteredData.map((item) => {
      const filteredItem = {};
      selectedFields.forEach((field) => {

        const label = fieldLabels[field] || field; // Usa o rótulo personalizado ou a chave original
        filteredItem[label] = item[field];

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
                          { text: cessao.status_antigo, style: 'status', color: statusColors[cessao.status_antigo] || '#000000' },
                          { text: cessao.status_atual, style: 'status', color: statusColors[cessao.status_atual] || '#000000' },
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

        status_atual: {
          bold: true,
          fontSize: 7,
          margin: [0, 0, 0, 5],
          alignment: 'center'
        },

        status_antigo: {
          bold: true,
          fontSize: 7,
          margin: [0, 0, 0, 5],
          alignment: 'center'
        },
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
