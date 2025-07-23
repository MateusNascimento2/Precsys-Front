import React from "react";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import { List, AutoSizer, WindowScroller, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';


export default function PublicacoesDiarioList({ publicacoesFiltradas, publicacoesQtd }) {

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
  });

  const renderRow = ({ index, parent, key, style }) => {
    const publicacao = publicacoesFiltradas[index];

    return (
      <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
        <motion.div
          style={{ ...style, paddingBottom: '20px' }}
          className="dark:bg-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="rounded border dark:border-neutral-700 w-full mx-auto mb-4">
            {/* Header */}
            <div className="border-b dark:border-neutral-700">
              <div className="border-b dark:border-neutral-700 px-4 py-2">
                <div className="relative">
                  <h2 className="text-black dark:text-white text-[16px] font-bold inline">
                    {publicacao.precatorio}
                  </h2>
                </div>
              </div>

              <div className="text-[9px] py-2 px-4 flex items-center">
                <span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 font-bold dark:text-neutral-100">
                  {new Intl.DateTimeFormat('pt-BR').format(new Date(publicacao.data_diario))}
                </span>
              </div>
            </div>

            {/* Advogados */}
            <div className="px-4 py-2">
              <div className="flex w-full">
                <table className="font-medium text-sm w-full">
                  <tbody>
                    <tr>
                      <td className=" dark:text-white p-1">
                        {publicacao.advogados}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Texto da publicação */}
            <div className="px-4 pb-2">
              <p className="text-neutral-400 dark:text-neutral-200 text-sm p-1">
                {publicacao.texto_publicacao}
              </p>
            </div>
          </div>
        </motion.div>
      </CellMeasurer>
    );
  };


  return (

    <div>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
          <section className="container dark:bg-neutral-900" style={{ width: "100%" }}>
            <ToastContainer />
            <div className="dark:bg-neutral-900 relative h-full">
              <p className="text-[12px] font-medium lg:font-normal lg:text-[10px] lg:text-end text-neutral-500 dark:text-neutral-300">
                Mostrando {publicacoesFiltradas.length} de {publicacoesQtd} publicações
              </p>
              <AutoSizer style={{ width: '100%', height: '100%' }}>
                {({ width }) => (
                  <div ref={registerChild}>
                    <List
                      rowRenderer={renderRow}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      width={width}
                      autoHeight
                      height={height}
                      rowCount={publicacoesFiltradas.length}
                      scrollTop={scrollTop}
                      deferredMeasurementCache={cache}
                      rowHeight={cache.rowHeight}
                    />
                  </div>
                )}
              </AutoSizer>
            </div>
          </section>
        )}
      </WindowScroller>
    </div>

  );
}
