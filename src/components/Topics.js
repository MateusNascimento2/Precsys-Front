import React from 'react';

function Topics({ icone, texto }) {
  return (
    <>
      <div className="relative  ring-1 ring-neutral-200 dark:ring-neutral-600  drop-shadow h-[64px] overflow-hidden">
        <div className='absolute top-0 left-0 right-0 px-4 py-3 flex gap-2 items-center font-semibold text-sm text-slate-900 bg-slate-50/90 dark:bg-neutral-800 backdrop-blur-sm dark:text-white'>
          <span className="rounded-[999px] ring-1 ring-black dark:ring-neutral-600 p-2">{icone}</span>
          <span className="font-[600] text-[15px] lg:text-[16px]">{texto}</span>
        </div>
      </div>
    </>

  )
}

export default Topics;