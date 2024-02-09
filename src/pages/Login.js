import React from 'react';

import CPFLoginComponent from '../components/CPFLoginComponent';
import bgImage from '../../public/assets/background-precsys.jpg';

function Login() {
  return (
    <section className="bg-cover h-[calc(100vh-60px)] flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <CPFLoginComponent />
    </section>
  )
}

export default Login;