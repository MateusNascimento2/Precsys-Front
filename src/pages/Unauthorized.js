import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <section className='flex flex-col justify-center items-center'>
      <h1>401</h1>
      <h2>Unauthorized</h2>
      <br />
      <p>Você não possui autorização para acessar a página requisitada !</p>
      <div>
        <button onClick={goBack}>Voltar</button>
      </div>
    </section>
  )
}
