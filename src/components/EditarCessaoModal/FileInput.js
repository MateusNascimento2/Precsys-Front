import React, { useState, useRef } from 'react'

function FileInput({ label, name, handleCessionarioInputChange, handleCessaoInputChange, cessionarioId, formDataCessao }) {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);


  return (
    <div className='dark:text-white text-black flex flex-col md:items-start gap-1 w-full'>
      <span className='text-[14px] font-medium'>{label}</span>
      <label className='w-full relative'>
        <span className='text-[15px] px-2 py-1 border rounded dark:border-neutral-600 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 line-clamp-1 w-full h-[34px] dark:bg-neutral-800 text-gray-400 block'>
          {file || formDataCessao ? (
            <div className='flex justify-between items-center mt-[2px]'>
              {file ? file.name : formDataCessao.split('/')[1]}

            </div>
          ) : <span className='mt-[2px] inline-block'>Selecione um arquivo</span>}

        </span>



        <input
          ref={inputRef}
          name={name}
          type='file'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files[0];
            console.log(file)
            setFile(file);
            handleCessionarioInputChange ? handleCessionarioInputChange(cessionarioId, file, name) : handleCessaoInputChange(file, name);
          }}
        />


        {(file || formDataCessao) && <button onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setFile(null);
          if (inputRef.current) {
            inputRef.current.value = null; // 👉 limpa o input de verdade
          }
          handleCessionarioInputChange ? handleCessionarioInputChange(cessionarioId, null, name) : handleCessaoInputChange(null, name);
        }} className='font-semibold text-neutral-400 rounded-full p-0.5 absolute top-1 right-1'>
          <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-tj5bde-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
        </button>}
      </label>

    </div>
  )
}

export default FileInput