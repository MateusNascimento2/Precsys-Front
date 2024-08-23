import React, {useState} from 'react'
import Header from '../components/Header'
import { motion } from 'framer-motion';
import SearchInput from '../components/SearchInput';
import ClientesList from '../components/ClientesList';
import ScrollToTopButton from '../components/ScrollToTopButton';

export default function Clientes() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header />
      <motion.main
        className='container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='flex justify-between items-center'>
          <motion.h2
            className='font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white'
            id='usuarios'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Clientes
          </motion.h2>
        </div>

        <div className='mt-[24px] px-5 dark:bg-neutral-900'>
          <div className='flex gap-3 items-center mb-4 w-full'>
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'p-3'} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className='w-full h-full max-h-full'>
              <ClientesList searchQuery={searchQuery} />
            </div>
          </div>
        </div>

        <ScrollToTopButton />
      </motion.main>

    </>
  )
}