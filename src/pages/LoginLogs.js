import React, { useState } from 'react';
import Header from '../components/Header'
import SearchInput from '../components/SearchInput';
import LoginLogsList from '../components/LoginLogsList';

export default function LoginLogs() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (query) => {
    setSearchQuery(query);
  }

  return (
    <>
      <Header />
      <main className='container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative'>
        <h2 className='font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white' id='Logs'>Logs</h2>
        <div className='mt-[24px] px-5 mb-4 dark:bg-neutral-900'>
          <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
        </div>

        <div className='w-full h-full max-h-full px-5'>
          <LoginLogsList searchQuery={searchQuery} />
        </div>
      </main>
    </>

  )
}