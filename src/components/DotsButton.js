import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DotsButton({ children, isModal }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  const handleShow = () => {
    setShow(!show);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target) && !isModal) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={handleShow} className={show ? "cursor-pointer flex bg-neutral-200 items-center justify-center pt-3 pb-3 px-[2px] rounded dark:bg-neutral-800 dark:hover:bg-neutral-800 absolute z-[39] right-0 bottom-0 top-[-10px]" : "absolute z-[39] right-0 bottom-0 top-[-10px] cursor-pointer flex items-center justify-center pt-3 pb-3 px-[2px] rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 dark:text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className="bg-white border shadow absolute rounded top-4 right-0 z-40 px-1 py-1 gap-1 flex flex-col dark:bg-neutral-900 dark:border-neutral-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
