import React, { useState } from 'react';

import placeholder from "../../public/assets/placeholder-perfil.jpg";
import axios from 'axios';
import { useUser } from '../context/UserContext';

function PasswordLoginComponent({ nome, imagemUsuario, cpfcnpj }) {
  const [password, setPassword] = useState('');
  const { updateUser } = useUser();
  const [isAuthenticated, setisAuthenticated] = useState(false);

  const handlePassword = async (event) => {
    try{
      event.preventDefault();
      const {data} = await axios.post('https://precsys2.vercel.app/api/login', {
        cpfcnpj: cpfcnpj,
        password: password
      }, {
        headers: { 'Content-type': 'application/json' }
      })

      if(data) {
        setisAuthenticated(true);
        updateUser(data);
      }
  
    } catch (err) {
      console.log(err);
    }

  }

  const nomeArr = nome.split(" ");
  const primeiroNome = nomeArr[0];
  const sobrenome = nomeArr[nomeArr.length - 1];

  return (
    <div className="bg-white flex flex-col items-center gap-4 w-[300px]">
      <img className='w-[200px] rounded-lg' src={imagemUsuario ? `${imagemUsuario}` : placeholder} alt="Imagem de Perfil do Usuário" />
      <h2>Bem-vindo, <strong>{`${primeiroNome} ${sobrenome}`}</strong></h2>
      <div className='w-full'>
        <form className="flex flex-col gap-4 w-full">
          <input className="border rounded py-3 px-4" type="text" placeholder="Senha" name='password' id='password' required onChange={(event) => setPassword(event.target.value)} value={password} />
          <button type="submit" className="border rounded-md text-white text-center bg-black py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85" onClick={handlePassword}>
            <span className="font-medium">Entrar</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordLoginComponent;