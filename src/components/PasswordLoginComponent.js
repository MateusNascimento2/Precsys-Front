import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import placeholder from "../../public/assets/placeholder-perfil.jpg";
import axios from '../api/axios';

function PasswordLoginComponent({ nome, imagemUsuario, cpfcnpj }) {
  const { setAuth } = useAuth();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  console.log(from);


  const handlePassword = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post('/login', {
        cpfcnpj: cpfcnpj,
        password: password
      }, {
        headers: { 'Content-type': 'application/json' },
        withCredentials: true
      });

      console.log(data.token);

      if (data.token) {
        const token = data.token;
        const user = data.result
        console.log(`user do login: ${user}`);
        setAuth({user, token});

        navigate(from, {replace: true});
      }

    } catch (error) {
      setPasswordErrorMessage(true);
      setErrorMessage(error.response.data.error)
    }

  }

  const nomeArr = nome.split(" ");
  const primeiroNome = nomeArr[0];
  const sobrenome = nomeArr[nomeArr.length - 1];

  return (
    <div className="bg-white flex flex-col items-center gap-4 w-[300px]">
      <img className='w-[200px] rounded-lg' src={imagemUsuario ? `${imagemUsuario}` : placeholder} alt="Imagem de Perfil do Usuário" />
      <h2>Bem-vindo, <strong>{`${primeiroNome} ${sobrenome}`}</strong></h2>
      {passwordError ? <div>{errorMessage}</div> : null}
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