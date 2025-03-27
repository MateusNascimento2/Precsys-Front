import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileImage from './ProfileImage';

import axios from '../api/axios';

function PasswordLoginComponent({ nome, userImage, cpfcnpj, darkMode }) {
  const { setAuth, persist, setPersist } = useAuth();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";


  const handlePassword = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post('/login/', {
        cpfcnpj: cpfcnpj,
        password: password
      }, {
        headers: { 'Content-type': 'application/json' },
        withCredentials: true
      });


      if (data.accessToken) {
        const accessToken = data.accessToken;
        const user = data.user
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
      <div className='w-[200px] bg-neutral-100 rounded'>
        <ProfileImage userImage={userImage} />
      </div>
      <h2 className={darkMode ? 'text-white' : 'text-black'}>Bem-vindo, <strong>{`${primeiroNome} ${sobrenome}`}</strong></h2>
      {passwordError ? <div className='bg-red-200 border border-red-600 w-full px-4 py-3 rounded flex gap-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg> {errorMessage} </div> : null}
      <div className='w-full'>
        <form className="flex flex-col gap-4 w-full">
          <input className={darkMode ? "text-white border rounded py-3 px-4 bg-neutral-900 border-neutral-600" : 'border rounded py-3 px-4 text-black bg-white'} type="password" placeholder="Senha" name='password' id='password' required onChange={(event) => setPassword(event.target.value)} value={password} />
          <button type="submit" className={darkMode ? "border rounded-md text-black text-center bg-white py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85" : "border rounded-md text-white text-center bg-black py-3 px-4 flex items-center justify-center gap-2 hover:opacity-85"} onClick={handlePassword}>
            <span className="font-medium">Entrar</span>
          </button>
          <div className='flex gap-1 items-center justify-center'>
            <div className='relative mt-[6px]'>
              <input type="checkbox" name="persist" id="persist" onChange={togglePersist} checked={persist} className="peer relative h-4 w-4 cursor-pointer appearance-none rounded bg-neutral-200 transition-all checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-10 dark:bg-neutral-600 dark:checked:bg-white" />
              <span
                className="absolute right-[1px] top-[2px] text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 dark:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-[2px] mt-[1px]" viewBox="0 0 20 20" fill="currentColor"
                  stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </span>
            </div>

            <label className={darkMode ? 'font-medium text-sm text-white' : 'font-medium text-sm text-black'} htmlFor="persist">Lembrar credenciais neste dispositivo?</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordLoginComponent;