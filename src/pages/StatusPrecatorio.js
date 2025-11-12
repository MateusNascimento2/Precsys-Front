import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';
import Filtro from '../components/FiltroCessoes/Filtro';

export default function StatusPrecatorio() {
  return (
    <main className={`container mx-auto dark:bg-neutral-900 h-full`}>
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
  )
}
