import React, { useState, useEffect } from 'react';
import Users from '../components/Users';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import UserFilter from '../components/UserFilter';


function Usuarios() {
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);


  const initialFilters = {
    status: {
      Ativo: false,
      Desativado: false,
    },
    tipo: {
      Usuário: false,
      Administrador: false,
    },
  };

  const [filters, setFilters] = useState(initialFilters)

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };


  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  const handleShow = () => {
    setShow((prevState) => !prevState)


    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = 'scroll';
    }

  }
  
  return (
    <>
      <Header />
      <main className='container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative'>
        <h2 className='font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white' id='cessoes'>Usuários</h2>
        <div className='mt-[24px] px-5 dark:bg-neutral-900'>
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className='hidden lg:block lg:sticky lg:top-[5%]'>
              <UserFilter show={true} onSetShow={handleShow} filters={filters} onSelectedCheckboxesChange={updateFilters} resetFilters={resetFilters} />

            </div>
            <div className='w-full h-full max-h-full'>
              <Users searchQuery={searchQuery} selectedFilters={filters} />

            </div>
          </div>


        </div>
        <UserFilter show={show} onSetShow={handleShow} filters={filters} onSelectedCheckboxesChange={updateFilters} resetFilters={resetFilters} />

      </main>

    </>
  )
}

export default Usuarios;