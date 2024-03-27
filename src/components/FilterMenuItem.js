import React from 'react';

const FilterMenuItem = ({ text, menuType, handleMenuClick, isOpen }) => {
  return (
    <div onClick={() => handleMenuClick(menuType)} className="rounded px-2 py-1 text-gray-600 text-[14px] ">
      <div>
        <div className="flex justify-between items-center">
          <span>{text}</span>
          <span className='text-[12px] '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={isOpen ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterMenuItem;
