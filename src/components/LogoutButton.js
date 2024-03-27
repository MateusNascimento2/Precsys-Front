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
    <button className='px-2 py-1 font-medium text-[14px] hover:bg-neutral-100' onClick={signOut}>Sair</button>
  )
}

export default LogoutButton;

