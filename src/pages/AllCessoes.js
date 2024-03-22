import React, {useState} from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import List from '../components/List';

export default function AllCessoes() {

  return (
    <>
      <Header />
      <main className='container mx-auto'>
        <div className='px-[20px]'>
          <h1 className='font-[700] text-[32px] mt-[16px]'>Cessões</h1>
        </div>
        <div className='mt-[24px]'>
          <SearchInput/>
          <List/>
        </div>
      </main>
    </>
    
  )
}
