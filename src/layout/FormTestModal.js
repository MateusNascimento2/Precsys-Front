import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format';

export function FormTestModal({ formDataCessao, handleInputChange }) {
  return (
    <>
      <div>
        <label htmlFor='precatorio'>Precatório</label>
        <CurrencyFormat
          className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
          placeholder={'Número do precatório'}
          name='precatorio'
          format={'####.#####-#'}
          value={formDataCessao.precatorio}
          required={true}
          onValueChange={(values) => handleInputChange(values, 'precatorio')}
        />
      </div>

    </>
  )
}