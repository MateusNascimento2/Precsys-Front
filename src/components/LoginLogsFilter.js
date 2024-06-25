import React, { useState, useMemo } from "react";

export default function LoginLogsFilter({ show, onSetShow, filters, onSelectedCheckboxesChange, resetFilters }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuType, setMenuType] = useState(null);
  const [userFilterQuery, setUserFilterQuery] = useState('');

  const handleShow = () => {
    onSetShow((prevState) => !prevState);
  };

  function handleMenu(type) {
    if (menuType === type) {
      setShowMenu(prevState => !prevState);
    } else {
      setShowMenu(true);
      setMenuType(type);
    }
  }

  const handleCheckboxChange = (event) => {
    const { name, checked, dataset } = event.target;
    const category = dataset.category;

    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [name]: checked,
      },
    };

    onSelectedCheckboxesChange(newFilters);
  };

  const handleUserFilterChange = (event) => {
    setUserFilterQuery(event.target.value);
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    const newFilters = {
      ...filters,
      dates: {
        ...filters.dates,
        [name]: value,
      },
    };
    onSelectedCheckboxesChange(newFilters);
  };

  const filteredUserKeys = useMemo(() => {
    return Object.keys(filters.users).filter(userName =>
      userName.toLowerCase().includes(userFilterQuery.toLowerCase())
    );
  }, [userFilterQuery, filters.users]);

  return (
    <>
      <div onClick={handleShow} className={show ? "bg-neutral-800 opacity-60 w-screen h-screen fixed top-0 z-[55] transition-opacity duration-300 left-0 lg:hidden" : 'h-screen top-[9999px] bg-neutral-800 opacity-0 w-screen fixed transition-opacity duration-[700] left-0'}>
      </div>
      <div className={show ? "bg-white dark:bg-neutral-900 h-full w-screen fixed z-[60] top-[15%] transition-all ease-in-out duration-[0.3s] shadow rounded-t-[20px] lg:bg-transparent lg:border-r dark:border-neutral-700 lg:transition-none lg:rounded-none lg:w-[300px] lg:relative lg:shadow-none lg:mt-5 lg:h-full lg:z-0 left-0" : 'top-[100%] transition-all ease-in-out duration-[0.3s] w-screen fixed bg-white dark:bg-neutral-900 h-full left-0'}>
        <div className="p-4 lg:p-0 lg:px-2">
          <div className="flex items-center justify-between ">
            <span className="font-[700] dark:text-white">Filtros</span>
            <span className="cursor-pointer hover:rounded p-1 text-black hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white" onClick={resetFilters}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="122.88"
                height="110.668"
                x="0"
                y="0"
                version="1.1"
                viewBox="0 0 122.88 110.668"
                xmlSpace="preserve"
                className="w-5 h-5 dark:fill-white fill-black"
              >
                <path
                  fillRule="evenodd"
                  d="M91.124 15.645c12.928 0 23.406 10.479 23.406 23.406s-10.479 23.406-23.406 23.406-23.406-10.479-23.406-23.406c0-12.926 10.479-23.406 23.406-23.406zM2.756 0h117.322a2.801 2.801 0 012.802 2.802 2.75 2.75 0 01-.996 2.139l-10.667 13.556a28.777 28.777 0 00-4.614-3.672l6.628-9.22H9.43l37.975 46.171c.59.516.958 1.254.958 2.102v49.148l21.056-9.623V57.896a28.914 28.914 0 005.642 4.996v32.133a2.735 2.735 0 01-1.586 2.506l-26.476 12.758a2.753 2.753 0 01-3.798-1.033 2.74 2.74 0 01-.368-1.4V55.02L.803 4.756a2.825 2.825 0 010-3.945A2.731 2.731 0 012.756 0zM96.93 28.282a3.388 3.388 0 014.825-.013 3.47 3.47 0 01.013 4.872l-5.829 5.914 5.836 5.919c1.317 1.338 1.299 3.506-.04 4.843-1.34 1.336-3.493 1.333-4.81-.006l-5.797-5.878-5.807 5.889a3.39 3.39 0 01-4.826.013 3.47 3.47 0 01-.013-4.872l5.83-5.913-5.836-5.919c-1.317-1.338-1.3-3.507.04-4.843a3.385 3.385 0 014.81.006l5.796 5.878 5.808-5.89z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2 lg:divide-y dark:divide-neutral-700">
            <div className="rounded px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300">
              <div>
                <div onClick={() => handleMenu('users')} className="flex justify-between items-center cursor-pointer">
                  <span>Usuários</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'users' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className={showMenu && menuType === 'users' ? 'mt-2 pl-2 flex flex-col justify-center gap-2 text-[12px] h-full max-h-[300px] overflow-y-hidden cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden flex flex-col gap-2 text-[12px] border-l dark:border-neutral-600'}>
                {showMenu && menuType === 'users' && (
                  <div className='border dark:border-neutral-700 rounded flex items-center gap-1 px-2 w-full'>
                    <div className='text-neutral-400'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </div>
                    <input value={userFilterQuery} onChange={handleUserFilterChange} type='text' placeholder='Pesquisar' className={`px-2 py-1 border-none w-full focus:outline-none dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-400`} />
                  </div>
                )}
                <div className="flex flex-col gap-2 overflow-auto">
                  {filteredUserKeys.map((filter) => (
                    <div key={filter} className="flex gap-1 items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name={filter}
                          data-category='users'
                          className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white flex-none"
                          onChange={handleCheckboxChange}
                          checked={filters.users[filter]}
                        />
                        <span
                          className={showMenu && menuType === 'users' ? "absolute text-white transition-opacity right-[1px] top-[1px] opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black" : 'hidden'}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[1px]" viewBox="0 0 20 20" fill="currentColor"
                            stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"></path>
                          </svg>
                        </span>
                      </div>

                      <label htmlFor={filter}>{filter}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 text-gray-600 text-[14px] dark:text-neutral-300 ">

              <div className="cursor-pointer">
                <div onClick={() => handleMenu('dates')} className="flex justify-between items-center cursor-pointer">
                  <span>Data de acesso</span>
                  <span className='text-[12px] '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showMenu && menuType === 'dates' ? "w-3 h-3 inline-block rotate-180 transition-all" : 'w-3 h-3 inline-block'}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                <div className={showMenu && menuType === 'dates' ? 'mt-2 pl-2 flex flex-col gap-2 h-full max-h-[300px] cursor-default border-l dark:border-neutral-600' : 'h-0 overflow-y-hidden flex flex-col gap-2  border-l dark:border-neutral-600'}>
                  <div className="flex flex-col gap-2 justify-between text-neutral-600 dark:text-neutral-400 py-3">
                    <div className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
                      <label htmlFor="startDate" className="text-[12px] font-bold">Data Inicial:</label>
                      <input className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded" type="date" name="startDate" onChange={handleDateChange} value={filters.dates?.startDate || ''} />
                    </div>
                    <div className="flex justify-between border dark:border-neutral-600 rounded px-2 py-1 items-center">
                      <label htmlFor="endDate" className="text-[12px] font-bold">Data Final:</label>
                      <input className="text-[12px] outline-none dark:bg-neutral-800 px-2 rounded" type="date" name="endDate" onChange={handleDateChange} value={filters.dates?.endDate || ''} />
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div >
    </>
  );
}
