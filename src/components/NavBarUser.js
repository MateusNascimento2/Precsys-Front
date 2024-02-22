import React from 'react';

function NavBarUser() {
  return (
    <nav>
      <span>USUÁRIO</span>
      <ul className='flex gap-2'>
        <li>Dashboard</li>
        <li>Minhas Cessões</li>
        <li>Meus Clientes</li>
        <li>Cessões</li>
      </ul>
    </nav>
  )
}

export default NavBarUser;