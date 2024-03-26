import React, { useState } from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';

export default function AllCessoes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false)

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  const handleShow = () => {
    setShow((prevState) => !prevState)
    console.log(show);
  }

  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto overflow-hidden' : 'container mx-auto'}>
        <div className='px-[20px]'>
          <h1 className='font-[700] text-[32px] mt-[16px]'>Cessões</h1>
        </div>
        <div className='mt-[24px] mx-5'>
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow}/>
          </div>
          

          <Lista searchQuery={searchQuery} />

        </div>
        <Filter show={show} onSetShow={handleShow} />
      </main>
    </>

  )
}
