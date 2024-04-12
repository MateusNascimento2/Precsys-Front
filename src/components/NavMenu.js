import React, { useState, useEffect } from 'react';

export default function NavMenu() {
  const [show, setShow] = useState(true);
  const [hideInfo, setHideInfo] = useState(true);
  const [hideCessionarios, setHideCessionarios] = useState(true);
  const [hideJuridico, setHideJuridico] = useState(true);
  const [hideRelacionados, setHideRelacionados] = useState(true);

  const handleShow = () => {
    setShow((prevState) => !prevState);
  };

  const checkIfIdExists = (id) => {
    const section = document.getElementById(id);

    if (section === null) {
      return false
    } else { 
      return true
    }
  };

  useEffect(() => {
    setHideInfo(checkIfIdExists('info-gerais'));
    setHideCessionarios(checkIfIdExists('cessionarios'));
    setHideJuridico(checkIfIdExists('juridico'));
    setHideRelacionados(checkIfIdExists('relacionados'));
  }, []);

  const scroll = (id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div
        onClick={handleShow}
        className={
          show
            ? 'bg-neutral-800 opacity-60 w-screen h-screen fixed top-0 z-[51] transition-opacity duration-300 left-0 lg:hidden'
            : 'h-screen top-[9999px] bg-neutral-800 opacity-0 w-screen fixed transition-opacity duration-[700] left-0'
        }
      ></div>
      <div
        className={
          show
            ? 'bg-white dark:bg-neutral-900 w-screen z-[60] top-[15%] transition-all ease-in-out duration-[0.3s] shadow rounded-t-[20px] lg:bg-transparent lg:border-r dark:border-neutral-700 lg:transition-none lg:rounded-none lg:w-[300px]  lg:shadow-none lg:mt-5 lg:z-0 left-0'
            : 'top-[100%] transition-all ease-in-out duration-[0.3s] w-screen fixed bg-white dark:bg-neutral-900 h-full left-0'
        }
      >
        <div className="p-4 lg:p-0 lg:px-2">
          <div className="">
            <span className="font-[700] dark:text-white">Navegação</span>
            <ul className="flex flex-col mt-4 divide-y justify-center">
              <li className={hideInfo ? "py-2 px-1" : 'hidden'}>
                <a
                  onClick={() => scroll('info-gerais')}
                  className={
                    hideInfo
                      ? 'text-[14px] text-gray-600 cursor-pointer hover:underline'
                      : 'hidden'
                  }
                >
                  Informações Gerais
                </a>
              </li>
              <li className={hideCessionarios ? "py-2 px-1" : 'hidden'}>
                <a
                  onClick={() => scroll('cessionarios')}
                  className={
                    hideCessionarios
                      ? 'text-[14px] text-gray-600 cursor-pointer hover:underline'
                      : 'hidden'
                  }
                >
                  Cessionários
                </a>
              </li>
              <li className={hideJuridico ? "py-2 px-1" : 'hidden'}>
                <a
                  onClick={() => scroll('juridico')}
                  className={
                    hideJuridico
                      ? 'text-[14px] text-gray-600 cursor-pointer hover:underline'
                      : 'hidden'
                  }
                >
                  Jurídico
                </a>
              </li>
              <li className={hideRelacionados ? "py-2 px-1" : 'hidden'}>
                <a
                  onClick={() => scroll('relacionados')}
                  className={
                    hideRelacionados
                      ? 'text-[14px] text-gray-600 cursor-pointer hover:underline'
                      : 'hidden'
                  }
                >
                  Relacionados
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
