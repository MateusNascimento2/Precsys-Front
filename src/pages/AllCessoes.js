import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import Lista from '../components/List';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';

export default function AllCessoes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : [];
  });
  const [show, setShow] = useState(false)
  const [dataCessoes, setDataCessoes] = useState([])


  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(selectedCheckboxes));

  }, [selectedCheckboxes]);

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  const handleData = (data) => {
    setDataCessoes(data)
  }

  const handleShow = () => {
    setShow((prevState) => !prevState)

    
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }

  }

  const handleSelectedCheckboxesChange = (childData) => {
    setSelectedCheckboxes(childData);
  };

  const scroll = (id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <>
      <Header />
      <main className={show ? 'container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative' : 'relative container mx-auto pt-[120px] dark:bg-neutral-900 h-full'}>
        <div className='px-[20px]'>
          <h2 className='font-[700] text-[32px] mt-[16px] dark:text-white' id='cessoes'>Cessões</h2>
        </div>
        <div className='mt-[24px] px-5 dark:bg-neutral-900'>
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
              <Filter show={true} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} dataCessoes={dataCessoes} />

            </div>
            <div className='w-full h-full max-h-full'>
              <Lista searchQuery={searchQuery} selectedFilters={selectedCheckboxes} setData={handleData} />

            </div>
          </div>


        </div>
        <Filter show={show} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} selectedCheckboxes={selectedCheckboxes} dataCessoes={dataCessoes} />

      </main>
    </>

  )
}
