import React, { useState } from "react";
import PasswordLoginComponent from "./PasswordLoginComponent";
import axios from "axios";

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

  const handleContinue = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true)
      const { data } = await axios.post('https://precsys2.vercel.app/api/checkCpfCnpj', {
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

  return (
    <div className="flex flex-col">
      {showPasswordLogin ? (
        <PasswordLoginComponent nome={userName} imagemUsuario={userImage} cpfcnpj={cpfcnpj} />
      ) : (
        <div className="w-[300px]">

          <div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <h2 className="font-bold text-3xl text-center mb-8 ">Entrar para o Precsys</h2>
                <div>
                  <form className="flex flex-col gap-4">


                    {showErrorMessage ? (<span className={errorClassName}>{errorMessageText === 'CPF/CNPJ inválido.' ? (<span className="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                      {errorMessageText}</span>
                    ) : (<span className="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                      {errorMessageText}</span>)
                    }</span>) : null}


                    <input className="border rounded py-3 px-4" type="text" placeholder="CPF/CNPJ" name="cpfcnpj" id="cpfcnpj" value={cpfcnpj} onChange={(event) => setCpfCnpj(event.target.value)} required />
                    <button
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="border rounded-md text-white text-center bg-black py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85"
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