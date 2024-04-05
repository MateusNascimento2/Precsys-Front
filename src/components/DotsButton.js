import React, { useState } from "react";

export default function DotsButton({ listLength, cessaoID, requisitorioFile, escrituraFile }) {

  const [menuState, setMenuState] = useState({});
  

  const handleShow = () => {
    setMenuState((prevMenuState) => ({

      [cessaoID]: !prevMenuState[cessaoID] // abre ou fecha o menu clicado
    }));
  };

  return (
    <>
        <div onClick={() => handleShow()} className={menuState[cessaoID] ? 'w-screen h-screen bg-transparent absolute z-[40] top-0 left-0' : 'hidden'}></div >
        <div className="relative">
          <div onClick={() => handleShow()} className={menuState[cessaoID] ? "cursor-pointer flex bg-neutral-200 items-center justify-center pt-3 pb-3 px-[2px] rounded dark:bg-neutral-800 dark:hover:bg-neutral-800 absolute z-[39] right-0 bottom-0 top-[-10px] " : "absolute z-[39] right-0 bottom-0 top-[-10px] cursor-pointer flex items-center justify-center pt-3 pb-3 px-[2px] rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </div>
          <div className={menuState[cessaoID] && parseInt(Object.keys(menuState)[0]) === cessaoID ? " bg-white border shadow absolute rounded top-4 right-0 z-50 px-1 py-1 gap-1 flex flex-col dark:bg-neutral-900 dark:border-neutral-700 " : " bg-white dark:bg-neutral-900 border shadow absolute rounded top-4 right-0 z-50 px-1 py-1 gap-1 hidden"}>
            <span className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"><a href={requisitorioFile} download target="_blank">Requisitório</a></span>
            <span className="cursor-pointer text-[12px] rounded p-1 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"><a href={escrituraFile} download target="_blank">Escritura</a></span>
          </div>
        </div>
    </>

  )
}