import React from "react"


export function ModalTab({ status, handleModalShow, nomeCessionario }) {
  return (
    <div className="border-b pt-1 px-1 rounded-t w-full">
      <div className='flex gap-1 items-center justify-between lg:w-full'>
        <div className='flex w-full justify-between'>

          {/*Aba Cessão */}
          <div className="flex w-full max-w-[1760px] overflow-hidden">
            <div className={
              "flex flex-none justify-between items-center bg-white rounded-t py-1 border-t border-l border-r dark:border-neutral-600 dark:text-white dark:bg-neutral-900 px-2"}>

              <div className='text-sm'>
                <span>Editar Cessionário {nomeCessionario}</span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 py-1 px-2 text-black'>
            <button className="hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-white rounded-full p-1" disabled={status === 'sending'} onClick={handleModalShow}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>

  )
}