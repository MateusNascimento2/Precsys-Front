import React from 'react'

export default function FilterButton({onSetShow, isPerfilCessao}) {

  const handleShow = () => {
    onSetShow((prevState) => !prevState)
  }
 
  return (
    <button className={isPerfilCessao ? 'border dark:border-neutral-700  py-3 px-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-900 ' : 'border dark:border-neutral-700  py-3 px-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 lg:hidden bg-white dark:bg-neutral-900'} onClick={handleShow}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-neutral-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
    </button>
  )
}