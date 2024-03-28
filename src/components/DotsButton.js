import React, {useState} from "react";

export default function DotsButton({ cessaoID, requisitorioFile, escrituraFile }) {
  
  const [menuState, setMenuState] = useState({});

  const handleShow = () => {
    setMenuState((prevMenuState) => ({
      ...prevMenuState,
      [cessaoID]: !prevMenuState[cessaoID]
    }));
  };

  return (
    <>
      <div className="relative">
        <div onClick={handleShow} className={ menuState[cessaoID] ? "cursor-pointer flex bg-neutral-200 items-center justify-center pt-1 pb-1 px-[2px] rounded dark:bg-neutral-800 dark:hover:bg-neutral-800" : "cursor-pointer flex items-center justify-center pt-1 pb-1 px-[2px] rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
        </div>
        <div className={ menuState[cessaoID] ? "transition-opacity opacity-1 bg-white border shadow absolute rounded top-8 right-0 z-50 px-2 py-1 gap-2 flex flex-col dark:bg-neutral-900 dark:border-neutral-700" : "transition-opacity opacity-0 bg-white dark:bg-neutral-900 border shadow absolute rounded top-8 right-0 z-50 px-2 py-1 gap-2 flex flex-col"}>
          <span className="text-[12px] rounded p-1 hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-800"><a href={requisitorioFile} download target="_blank">Requisitório</a></span>
          <span className="text-[12px] rounded p-1 hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-800"><a href={escrituraFile} download target="_blank">Escritura</a></span>
        </div>
      </div>
    </>

  )
}