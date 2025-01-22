import React, { useState, useEffect } from 'react';
import ProfileImage from './ProfileImage';
import useAuth from "../hooks/useAuth";
import SegurancaPerfil from './SegurancaPerfil';
import DesativarPerfil from './DesativarPerfil';
import CurrencyFormat from 'react-currency-format';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdministradorPerfil from './AdministradorPerfil';
import GestorPerfil from './GestorPerfil';
import { motion } from 'framer-motion';

export default function ConfiguracoesPerfil({ user, id }) {
  const { auth, setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);

  const [nome, setNome] = useState(user ? user.nome : auth.user.nome);
  const [cpfcnpj, setCpfCnpj] = useState(user ? user.cpfcnpj : auth.user.cpfcnpj);
  const [telefone, setTelefone] = useState(user ? user.telefone : auth.user.telefone);
  const [endereco, setEndereco] = useState(user ? user.endereco : auth.user.endereco);
  const [obs, setObs] = useState(user ? user.obs : auth.user.obs);
  const [qualificacao, setQualificacao] = useState(user ? user.qualificacao : auth.user.qualificacao);
  const [foto, setFoto] = useState(user ? user.foto : auth.user.foto);
  const [avatar, setAvatar] = useState(null); // Armazena o arquivo de imagem
  const [fotoParaMostrar, setFotoParaMostrar] = useState(user.photoUrl ? user.photoUrl : auth.userImage);

  // Toggle Switch State
  const [isSwitchOn, setIsSwitchOn] = useState(user ? user.ver_dashboard === 1 : auth.user.ver_dashboard === 1);

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setCpfCnpj(user.cpfcnpj);
      setTelefone(user.telefone);
      setEndereco(user.endereco);
      setObs(user.obs);
      setQualificacao(user.qualificacao);
      setFoto(user.foto);
      setFotoParaMostrar(user.photoUrl ? user.photoUrl : null);
      setIsSwitchOn(user.ver_dashboard === 1); // Inicializa o switch com base em ver_dashboard
    }
  }, [user]);

  const handleEditUserInformation = async (e) => {
    e.preventDefault();
    const isDarkMode = localStorage.getItem('darkMode');

    try {
      setIsLoading(true);
      const email = user ? user.email : auth.user.email;
      const userId = user ? user.id : auth.user.id;

      await axiosPrivate.put(`/users/${userId}`, {
        nome,
        cpfcnpj,
        email,
        telefone,
        endereco,
        obs,
        qualificacao,
        foto: foto !== user.foto ? foto : user.foto,
        admin: user ? user.admin : auth.user.admin,
        ativo: user ? user.ativo : auth.user.ativo,
        permissao_email: user ? user.permissao_email : auth.user.permissao_email,
        permissao_proposta: user ? user.permissao_proposta : auth.user.permissao_proposta,
        permissao_expcartorio: user ? user.permissao_expcartorio : auth.user.permissao_expcartorio,
        ver_dashboard: isSwitchOn ? 1 : 0, // Atualiza o valor de ver_dashboard
      });

      const uploadFiles = async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(file.name, file.file);
        });

        try {
          await axiosPrivate.post('/uploadAvatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (err) {
          console.log(`Erro ao enviar arquivos: ${err}`);
          return;
        }
      };

      // Enviar o avatar se existir
      if (avatar) {
        const filesToUpload = [{ name: 'avatar', file: avatar }];
        await uploadFiles(filesToUpload);
      }

      // Atualiza o estado do auth com as novas informações
      if (!id) {
        setAuth(prev => ({
          ...prev,
          user: {
            ...prev.user,
            nome,
            cpfcnpj,
            telefone,
            endereco,
            obs,
            qualificacao,
            foto,
            ver_dashboard: isSwitchOn ? 1 : 0, // Atualiza o valor de ver_dashboard no auth
          },
          userImage: fotoParaMostrar, // Atualiza a imagem do usuário
        }));
      }


      setIsLoading(false);

      toast.success('Perfil alterado com sucesso!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
        onClose: () => window.location.reload(), // Recarrega após o toast ser fechado
      });
    } catch (err) {
      console.log(err.response.data.error);
      toast.error(`Erro ao editar perfil: ${err.response.data.error}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: isDarkMode === 'true' ? 'dark' : 'light',
        transition: Bounce,
      });
      setIsLoading(false);
    }
  };

  const handleCpfCnpjChange = (event) => {
    let data = event.target.value.replace(/\D/g, "");
    if (data.length > 11) {
      let cnpj = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/`;
      if (data.length > 12) {
        cnpj += `${data.substr(8, 4)}-${data.substr(12, 2)}`;
      } else {
        cnpj += data.substr(8);
      }
      data = cnpj;
    } else {
      let cpf = "";
      let parts = Math.ceil(data.length / 3);
      for (let i = 0; i < parts; i++) {
        if (i === 3) {
          cpf += `-${data.substr(i * 3)}`;
          break;
        }
        cpf += `${i !== 0 ? "." : ""}${data.substr(i * 3, 3)}`;
      }
      data = cpf;
    }
    setCpfCnpj(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file); // Armazena o arquivo real para envio
      setFoto(`avatar/${file.name}`);
      const imageUrl = URL.createObjectURL(file);
      setFotoParaMostrar(imageUrl);
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setFotoParaMostrar(null);
    setAvatar(null); // Remove o avatar selecionado
    setFoto(''); // Define a foto como uma string vazia
  };

  const handleCancelButton = () => {
    if (user) {
      setNome(user.nome);
      setCpfCnpj(user.cpfcnpj);
      setTelefone(user.telefone);
      setEndereco(user.endereco);
      setObs(user.obs);
      setQualificacao(user.qualificacao);
      setFoto(user.foto);
      setFotoParaMostrar(user.photoUrl);
      setIsSwitchOn(user.ver_dashboard === 1); // Reinicia o switch baseado em ver_dashboard
    } else {
      setNome(auth.user.nome);
      setCpfCnpj(auth.user.cpfcnpj);
      setTelefone(auth.user.telefone);
      setEndereco(auth.user.endereco);
      setObs(auth.user.obs);
      setQualificacao(auth.user.qualificacao);
      setFoto(auth.user.foto);
      setFotoParaMostrar(auth.userImage);
      setIsSwitchOn(auth.user.ver_dashboard === 1); // Reinicia o switch baseado em ver_dashboard
    }
    setAvatar(null);
  };

  return (
    <>
      {isLoading ? (
        <div className='w-full h-[793px] lg:h-[740px] flex justify-center items-center'>
          <div className='w-8 h-8'>
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <>
          <ToastContainer />
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
                          <ProfileImage userImage={fotoParaMostrar} />
                        </div>

                        <div className='bg-white rounded-full absolute size-7 right-[-13px] top-[5px] flex items-center justify-center p-2 drop-shadow-lg'>
                          <label htmlFor='userImage'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[18px] hover:text-blue-500 cursor-pointer">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            <input name='userImage' id='userImage' type='file' accept=".jpg, .jpeg, .png" className='hidden' onChange={handleImageChange}></input>
                          </label>
                        </div>

                        <div className='bg-white rounded-full absolute size-7 right-[-13px] bottom-[5px] flex items-center justify-center p-2 drop-shadow-lg'>
                          <button onClick={(e) => handleRemoveImage(e)}>
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
                    <input className='text-neutral-400 border dark:border-neutral-600 font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={nome ? nome : ''} onChange={(e) => setNome(e.target.value)} />
                  </div>

                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>CPF/CNPJ <span className='text-red-500'>*</span></p>
                    <input className='text-neutral-400 border dark:border-neutral-600 text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={cpfcnpj ? cpfcnpj : ''} onChange={(value) => handleCpfCnpjChange(value)} />
                  </div>

                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Telefone</p>
                    <CurrencyFormat
                      value={telefone ? telefone : ''}
                      format={'(##)#####-####'}
                      onValueChange={(values) => {
                        const { formattedValue } = values;
                        setTelefone(formattedValue);
                      }}
                      name='telefone'
                      className='text-neutral-400 border dark:border-neutral-600 text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]'
                    />
                  </div>

                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Endereço</p>
                    <input className='text-neutral-400 border dark:border-neutral-600 text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={endereco ? endereco : ''} onChange={(e) => setEndereco(e.target.value)} />
                  </div>

                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Obs</p>
                    <input className='text-neutral-400 border dark:border-neutral-600 text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={obs ? obs : ''} onChange={(e) => setObs(e.target.value)} />
                  </div>

                  <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Qualificação</p>
                    <input className='text-neutral-400 border dark:border-neutral-600 text font-medium w-full p-2 rounded dark:bg-neutral-800 outline-none text-sm lg:text-[16px]' value={qualificacao ? qualificacao : ''} onChange={(e) => setQualificacao(e.target.value)} />
                  </div>

                  {/* Toggle Switch */}
                  {auth.user.admin ? <div>
                    <p className='dark:text-neutral-200 text-neutral-600 font-medium text-[15px] mb-2 lg:mb-0'>Ativar Gráfico do Dashboard</p>
                    <motion.div
                      className={`${isSwitchOn ? "bg-green-600" : "bg-red-600"
                        } w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-700`}
                      onClick={() => setIsSwitchOn(!isSwitchOn)}

                    >
                      <motion.div
                        className={`${isSwitchOn ? "bg-neutral-100" : "bg-black"
                          } w-4 h-4 rounded-full shadow-md transform ${isSwitchOn ? "translate-x-6" : "translate-x-0"}`}
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 50 }}
                      />
                    </motion.div>
                  </div> : null}

                </div>
                <button onClick={(e) => {
                  e.preventDefault();
                  handleCancelButton();
                }} className='bg-neutral-200 text-neutral-800 rounded px-4 py-2 font-medium dark:bg-neutral-800 dark:text-neutral-200 mt-4 mr-4 text-[14px] lg:text-[16px]'>Cancelar</button>
                <button className='bg-black rounded text-[14px] lg:text-[16px] px-4 py-2 font-medium text-white dark:bg-white dark:text-black mt-2' type='submit' onClick={(e) => handleEditUserInformation(e)}>Salvar Alterações</button>
              </form>
            </div>
          </section>
        </>
      )}
      <>
        <SegurancaPerfil user={user} id={id} />
        {auth.user.admin ? <AdministradorPerfil user={user} id={id} /> : null}
        {auth.user.admin ? <GestorPerfil user={user} /> : null}
        <DesativarPerfil user={user} id={id} />
      </>
    </>
  );
}
