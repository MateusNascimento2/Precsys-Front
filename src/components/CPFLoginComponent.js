import React, { useState, useEffect } from "react";
import PasswordLoginComponent from "./PasswordLoginComponent";
import axios from '../api/axios';

import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

function CPFLoginComponent() {
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [cpfcnpj, setCpfCnpj] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [errorClassName, setErrorClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);


  const handleContinue = async (event) => {

    try {
      event.preventDefault();
      setIsLoading(true)
      const { data } = await axios.post('/checkCpfCnpj/', {
        cpfcnpj: cpfcnpj
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setUserName(data.userName);
      setUserImage(data.photoUrl)
      setIsLoading(false);
      setShowPasswordLogin(true);
    } catch (error) {
      setIsLoading(false)
      if (error.response && error.response.data && error.response.data.error && error.response.data.className) {
        setErrorMessageText(error.response.data.error);
        setErrorClassName(error.response.data.className)
        setShowErrorMessage(true);
      } else {
        console.error(error);
      }

      console.error(error);
    }
  };


  const handleCpfCnpjChange = (event) => {
    // Get only the numbers from the data input
    let data = event.target.value.replace(/\D/g, "");
    // Checking data length to define if it is cpf or cnpj
    if (data.length > 11) {
      // It's cnpj
      let cnpj = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(
        5,
        3
      )}/`;
      if (data.length > 12) {
        cnpj += `${data.substr(8, 4)}-${data.substr(12, 2)}`;
      } else {
        cnpj += data.substr(8);
      }
      data = cnpj;
    } else {
      // It's cpf
      let cpf = "";
      let parts = Math.ceil(data.length / 3);
      for (let i = 0; i < parts; i++) {
        if (i === 3) {
          cpf += `-${data.substr(i * 3)}`;
          break;
        }
        cpf += `${i !== 0 ? "." : ""}${data.substr(i * 3, 3)}`;
      }
      data = cpf;
    }
    setCpfCnpj(data);
  };

  return (
    <div className="flex flex-col">
      {showPasswordLogin ? (
        <PasswordLoginComponent nome={userName} userImage={userImage} cpfcnpj={cpfcnpj} darkMode={darkMode} />
      ) : (
        <div className="w-[300px]">

          <div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <h2 className={darkMode ? "font-bold text-3xl text-center mb-8 text-white" : "font-bold text-3xl text-center mb-8 text-black"}>Entrar para o Precsys</h2>
                <div>
                  <form className="flex flex-col gap-4">

                    {showErrorMessage ? (<div className='bg-red-200 border border-red-600 w-full px-4 py-3 rounded'>{errorMessageText === 'CPF/CNPJ inválido.' ? (<span className="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                      {errorMessageText}</span>
                    ) : (<span className="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                      {errorMessageText}</span>)
                    }</div>) : null}


                    <input className={darkMode ? "border rounded py-3 px-4 text-white bg-neutral-900 border-neutral-600" : 'border rounded py-3 px-4 text-black'} type="text" placeholder="CPF/CNPJ" name="cpfcnpj" id="cpfcnpj" value={cpfcnpj} onChange
                    ={(value) => handleCpfCnpjChange(value)} required />

                    <button
                      onClick={handleContinue}
                      disabled={isLoading}
                      className={darkMode ? "border rounded-md text-black text-center bg-white py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85" : "border rounded-md text-white text-center bg-black py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85"}
                    >
                      <span className="font-medium">Continuar com a Senha</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CPFLoginComponent;