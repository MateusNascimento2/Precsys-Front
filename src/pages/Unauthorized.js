import React from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-neutral-900 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-6xl font-bold text-neutral-900 dark:text-white">401</h1>
          <h2 className="text-2xl font-semibold mt-4 text-neutral-700 dark:text-neutral-200">
            Acesso Negado
          </h2>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Você não tem permissão para acessar esta página ou recurso. 
            Caso acredite que isso é um erro, entre em contato com o administrador do sistema.
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-6 px-6 py-2 text-sm font-medium rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </>
  )
}