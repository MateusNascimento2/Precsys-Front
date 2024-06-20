import React from 'react';
import Header from './Header';
import TabelaGeneradaCalculo from './TabelaGeneradaCalculo';

export default function TabelaCalculo() {
  return (
    <>
      <Header />
      <main className='container max-w-[1024px] mx-auto px-2 py-[120px]'>
        <TabelaGeneradaCalculo />
      </main>

    </>

  )
}