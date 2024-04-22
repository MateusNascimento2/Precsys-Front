import React, {useState} from 'react';

const FilterMenuItem = () => {
  return (
    <div className="rounded px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
      <div>
        <div onClick={() => handleMenu('status')} className="flex justify-between items-center cursor-pointer">
          <span>Status</span>
          <span className='text-[12px] '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'status' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
      </div>
      <div className={showMenu && menuType === 'status' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-[210px] overflow-y-hidden transition-all cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden transition-all flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
        {status.map((s) => (
          <div className="flex items-center gap-2" key={s.id}>
            <input type="checkbox" name={"status"} id={s.nome} value={s.nome} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" onChange={(e) => handleCheckboxChange(e)} checked={checkedStatus[s.nome] || false} />
            <span
              className={showMenu && menuType === 'status' ? "absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"></path>
              </svg>
            </span>
            <label htmlFor={s.nome} key={s.id}>{s.nome}</label>
          </div>

        ))}
      </div>
    </div>
  );
};

export default FilterMenuItem;
