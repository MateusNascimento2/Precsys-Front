// src/components/ThemeSwitcher.js
import React, { useState } from 'react';

const ThemeSwitcher = ({ updateLogo, darkMode, onDarkModeChange }) => {

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    onDarkModeChange(newDarkMode); // Chame a função de retorno para atualizar o estado darkMode no componente Header
    updateLogo(newDarkMode); // Atualize o logo com base no novo estado do modo escuro
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={darkMode ? 'text-black border-l border-neutral-600 pl-2' : 'text-white border-l border-neutral-300 pl-2'}
    >
      {darkMode ? (<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>

      ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="#000" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>

      )}
    </button>
  );
};

export default ThemeSwitcher;