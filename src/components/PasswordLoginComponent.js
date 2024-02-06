import React from 'react';

import placeholder from "../../public/assets/placeholder-perfil.jpg";

function PasswordLoginComponent() {
  return (
    <div className="bg-white flex flex-col gap-4">
      <img className='w-[300px]' src={placeholder} alt="Imagem de Perfil do Usuário" />
      <div>
        <form className="flex flex-col gap-4">
          <input className="border rounded py-3 px-4" type="text" placeholder="Senha" required/>
          <button type="submit" className="border rounded-md text-white text-center bg-black py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85">
            <span className="font-medium">Entrar</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordLoginComponent;