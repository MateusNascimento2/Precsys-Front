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
  }

  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto overflow-hidden' : 'container mx-auto pt-[120px] dark:bg-neutral-900'}>
        <div className='px-[20px]'>
          <h2 className='font-[700] text-[32px] mt-[16px] dark:text-white'>Cessões</h2>
        </div>
        <div className='mt-[24px] px-5 dark:bg-neutral-900'>
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
