import React from 'react';

export default function SearchInput({searchQuery, onSearchQueryChange, p}) {

  const handleChange = (e) => {
    onSearchQueryChange(e.target.value);
  }

  return (
    <>
      <div className='border dark:border-neutral-700 rounded flex items-center gap-1 px-2 w-full'>
        <div className='text-neutral-400'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input value={searchQuery} onChange={handleChange} type='text' placeholder='Pesquisar' className={`px-2 ${p} border-none w-full focus:outline-none dark:bg-neutral-900 dark:placeholder:text-neutral-400`}/>
      </div>

    </>
  )
}

//pegar o que o usuario passar pro input