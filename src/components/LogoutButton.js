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
    <button className='bg-black text-white rounded px-4 py-1' onClick={signOut}>Sair</button>
  )
}

export default LogoutButton;

