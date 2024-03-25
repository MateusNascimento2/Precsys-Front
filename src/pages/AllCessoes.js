import React, {useState} from 'react'
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import List from '../components/List';

export default function AllCessoes() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  return (
    <>
      <Header />
      <main className='container mx-auto'>
        <div className='px-[20px]'>
          <h1 className='font-[700] text-[32px] mt-[16px]'>Cessões</h1>
        </div>
        <div className='mt-[24px]'>
          <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange}/>
          <List searchQuery={searchQuery}/>
        </div>
      </main>
    </>
    
  )
}
