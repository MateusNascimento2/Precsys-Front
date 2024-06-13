import React, {useState} from 'react';
import Users from '../components/Users';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterButton from '../components/FilterButton';
import Filter from '../layout/Filter';




function Usuarios() {
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [dataCessoes, setDataCessoes] = useState([])
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : [];
  });

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

  const handleSelectedCheckboxesChange = (childData) => {
    setSelectedCheckboxes(childData);
  };

  const handleData = (data) => {
    setDataCessoes(data)
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
              <Filter show={true} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} dataCessoes={dataCessoes} />

            </div>
            <div className='w-full h-full max-h-full'>
              <Users searchQuery={searchQuery} />

            </div>
          </div>


        </div>
        <Filter show={show} onSetShow={handleShow} onSelectedCheckboxesChange={handleSelectedCheckboxesChange} selectedCheckboxes={selectedCheckboxes} dataCessoes={dataCessoes} />

      </main>

    </>
  )
}

export default Usuarios;