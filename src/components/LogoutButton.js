import React from 'react';
import useLogout from '../hooks/useLogout'

import { useNavigate } from 'react-router-dom';



function LogoutButton() {
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/');
  }

  return (
    <button className='px-2 rounded py-1 w-full text-left font-medium text-[14px] hover:bg-neutral-100 dark:hover:bg-neutral-800' onClick={signOut}>Sair</button>
  )
}

export default LogoutButton;

