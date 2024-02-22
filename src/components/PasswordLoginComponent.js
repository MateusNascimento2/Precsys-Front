import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileImage from './ProfileImage';

import axios from '../api/axios';

function PasswordLoginComponent({ nome, userImage, cpfcnpj }) {
  const { setAuth, persist, setPersist } = useAuth();
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

      console.log(data.accessToken);

      if (data.accessToken) {
        const accessToken = data.accessToken;
        const user = data.user
        console.log(`user do login: ${user}`);
        setAuth({ user, userImage, accessToken });

        navigate(from, { replace: true });
      }

    } catch (error) {
      setPasswordErrorMessage(true);
      setErrorMessage(error.response.data.error)
    }

  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist])

  const nomeArr = nome.split(" ");
  const primeiroNome = nomeArr[0];
  const sobrenome = nomeArr[nomeArr.length - 1];

  return (
    <div className="flex flex-col items-center gap-4 w-[300px]">
      <div className='w-[200px]'>
        <ProfileImage userImage={userImage}/>
      </div>
      <h2>Bem-vindo, <strong>{`${primeiroNome} ${sobrenome}`}</strong></h2>
      {passwordError ? <div>{errorMessage}</div> : null}
      <div className='w-full'>
        <form className="flex flex-col gap-4 w-full">
          <input className="border rounded py-3 px-4" type="text" placeholder="Senha" name='password' id='password' required onChange={(event) => setPassword(event.target.value)} value={password} />
          <button type="submit" className="border rounded-md text-white text-center bg-black py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85" onClick={handlePassword}>
            <span className="font-medium">Entrar</span>
          </button>
          <div className='flex gap-1 items-center justify-center'>
            <input type="checkbox" name="persist" id="persist" onChange={togglePersist} checked={persist} style={{color:'black'}}/>
            <label className='font-medium text-sm' htmlFor="persist">Lembrar de mim nesse dispositivo ?</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordLoginComponent;