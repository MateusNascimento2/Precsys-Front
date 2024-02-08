import React, { useState } from "react";
import PasswordLoginComponent from "./PasswordLoginComponent";
import axios from "axios";

function CPFLoginComponent() {
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [cpfcnpj, setCpfCnpj] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleContinue = async (event) => {
    try {
      event.preventDefault();
      const {data} = await axios.post('https://precsys2.vercel.app/api/checkCpfCnpj', {
        cpfcnpj: cpfcnpj
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setUserName(data.userName);
      setUserImage(data.photoUrl)
      setShowPasswordLogin(true);
    } catch (err) {
      setShowErrorMessage(true)
      console.error(err);
    }
    

  };

  return (
    <div className="flex flex-col">

      {showPasswordLogin ? (
        <PasswordLoginComponent nome={userName} imagemUsuario={userImage} cpfcnpj={cpfcnpj} />
      ) : (
        <div className="w-[300px]">
          <h2 className="font-bold text-3xl text-center mb-8 ">Entrar para o Precsys</h2>
          <div>
            <form className="flex flex-col gap-4">
              {showErrorMessage ? (<span>CPF/CNPJ Inválido</span>) : null}
              <input className="border rounded py-3 px-4" type="text" placeholder="CPF/CNPJ" name="cpfcnpj" id="cpfcnpj" value={cpfcnpj} onChange={(event) => setCpfCnpj(event.target.value)} required />
              <button
                onClick={handleContinue}
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
        </div>
      )}
    </div>
  );
}

export default CPFLoginComponent;