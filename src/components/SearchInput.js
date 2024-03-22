import React from 'react';

export default function SearchInput() {
  return (
    <>
      <div className='border rounded mx-5 flex items-center gap-1 px-4'>
        <div className='text-gray-400'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input type='text' placeholder='Pesquisar' className='px-2 py-3 border-none w-full focus:outline-none'></input>
      </div>

    </>
  )
}