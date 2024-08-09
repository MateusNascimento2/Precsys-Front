import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import useAuth from "../hooks/useAuth";
import SegurancaPerfil from './SegurancaPerfil';
import DesativarPerfil from './DesativarPerfil';

export default function ConfiguracoesPerfil() {
  const [userInputImage, setUserInputImage] = useState('')
  const { auth } = useAuth();


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserInputImage(imageUrl);
    }
  };

  return (
    <>
      <section>
        <div className='mb-4 mt-4 lg:mt-0'>
          <span className='font-semibold dark:text-white'>Configurações do Perfil</span>
        </div>

        <div>
          <form>
            <div className='flex flex-col gap-4'>
              <div className='flex-col lg:flex-row items-center lg:justify-around'>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Avatar</p>
                <div className='flex flex-col gap-4'>
                  <div className='size-32 bg-gray-100 relative rounded drop-shadow-2xl'>
                    <div className='absolute bottom-0 w-full h-full'>
                      <ProfileImage userImage={userInputImage ? userInputImage : auth?.userImage} />
                    </div>


                    <div className='bg-white rounded-full absolute size-7 right-[-16px] top-0 flex items-center justify-center p-2 drop-shadow-lg'>

                      <label htmlFor='userImage'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[18px] hover:text-blue-500 cursor-pointer">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        <input name='userImage' id='userImage' type='file' className='hidden' onChange={handleImageChange}></input>
                      </label>
                    </div>

                    <div className='bg-white rounded-full absolute size-7 right-[-16px] bottom-0 flex items-center justify-center p-2 drop-shadow-lg'>

                      <button onClick={() => setUserInputImage('')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[18px] hover:text-blue-500 cursor-pointer">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className='text-neutral-400 dark:text-neutral-500 text-[12px] font-medium'>Apenas arquivos com as extenções: png, jpg, jpeg.</p>
                </div>


              </div>


              <div>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Nome <span className='text-red-500'>*</span> </p>



                <input className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={auth.user.nome} />


              </div>

              <div>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0' >CPF/CNPJ <span className='text-red-500'>*</span></p>



                <input className='text-neutral-400 border dark:border-neutral-600  text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={auth.user.cpfcnpj} />


              </div>

              <div>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Telefone</p>



                <input className='text-neutral-400 border dark:border-neutral-600  text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={auth.user.telefone} />


              </div>

              <div>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Endereço</p>



                <input className='text-neutral-400 border dark:border-neutral-600  text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={auth.user.endereco} />


              </div>

              <div>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Obs</p>



                <input className='text-neutral-400 border dark:border-neutral-600  text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={auth.user.obs} />


              </div>

              <div>
                <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Qualificação</p>



                <input className='text-neutral-400 border dark:border-neutral-600  text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={auth.user.qualificacao} />


              </div>
            </div>
            <button className='bg-neutral-200 text-neutral-800 rounded px-4 py-2 font-medium dark:bg-neutral-800 dark:text-neutral-200 mt-4 mr-4 text-[14px] lg:text-[16px]'>Cancelar</button>
            <button className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2' type='submit'>Salvar Alterações</button>


          </form>

        </div>

      </section>

      <SegurancaPerfil />
      <DesativarPerfil />
    </>

  )
}