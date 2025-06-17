import React from 'react'
import CurrencyFormat from 'react-currency-format';

export default function FormAdicionarUsuario({ usuarioFormData, setUsuarioFormData, handleSubmit }) {

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
    setUsuarioFormData({ ...usuarioFormData, cpfcnpj: data });
  };

  return (
    <form className='mt-[20px]' onSubmit={handleSubmit}>
      <div className='px-3'>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
          {/* Nome */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="nome">Nome Completo</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              name={'nome'}
              value={usuarioFormData.nome}
              required={true}
              onChange={(e) => {
                setUsuarioFormData({ ...usuarioFormData, nome: e.target.value });
                /* e.target.value.length < 3 ? setNomeError(true) : setNomeError(false); */
              }}
            />
            {/* {nomeError && <p className='text-red-600 text-[11px]'>Nome inválido</p>} */}
          </div>

          {/* Senha */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="password">Senha</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              name={'password'}
              value={usuarioFormData.password}
              onChange={(e) => {
                setUsuarioFormData({ ...usuarioFormData, password: e.target.value });
                /* e.target.value.length < 3 ? setPasswordError(true) : setPasswordError(false); */
              }}
            />
            {/* {passwordError && <p className='text-red-600 text-[11px]'>Senha inválida</p>} */}
          </div>

          {/* CPF/CNPJ */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="cpfcnpj">CPF/CNPJ</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              name='cpfcnpj'
              value={usuarioFormData.cpfcnpj}
              onChange={(value) => handleCpfCnpjChange(value)}
            />
          </div>

          {/* Email */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="email">Email</label>
            <input
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
              name='email'
              value={usuarioFormData.email}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, email: e.target.value })}
            />
          </div>

          {/* Telefone */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="telefone">Telefone</label>
            <CurrencyFormat
              value={usuarioFormData.telefone}
              format={'(##)#####-####'}
              onValueChange={(values) => {
                const { formattedValue } = values;
                setUsuarioFormData({ ...usuarioFormData, telefone: formattedValue });
              }}
              name='telefone'
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400'
            />
          </div>

          {/* Endereço */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="endereco">Endereço</label>
            <textarea
              rows={12}
              cols={6}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] h-[34px]'
              value={usuarioFormData.endereco}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, endereco: e.target.value })}
              name='endereco'
            />
          </div>

          {/* Qualificação */}
          <div className='dark:text-white text-black flex flex-col gap-2 py-2 px-2'>
            <label className='text-[14px] font-medium' htmlFor="qualificacao">Qualificação</label>
            <textarea
              rows={12}
              cols={6}
              className='dark:bg-neutral-800 border rounded dark:border-neutral-600 py-1 px-2 focus:outline-none placeholder:text-[14px] text-gray-400 text-[15px] h-[110px]'
              value={usuarioFormData.qualificacao}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, qualificacao: e.target.value })}
              name='qualificacao'
            />
          </div>

          {/* Cargo */}
          <div className='p-2'>
            <p className='text-[14px] font-medium dark:text-white'>Cargo</p>
            <div className='flex flex-col divide-y dark:divide-neutral-600 divide-dashed gap-2'>
              <div className='dark:text-white py-2 relative'>
                <input id="admin" value={1} onChange={(e) => setUsuarioFormData({ ...usuarioFormData, admin: Number(e.target.value), advogado: 0 })} className="absolute left-0 top-[40%] w-4 h-4 appearance-none checked:bg-neutral-800 bg-neutral-200 checked:border-neutral-200 checked:border-[4px] dark:border-[4px] border-black dark:border-white rounded-full dark:bg-white dark:checked:bg-neutral-800" type="radio" name="user-type" />
                <label htmlFor="admin" className="ml-8">Administrador</label>
                <p className='text-neutral-600 dark:text-neutral-400 text-[14px] ml-8'>Acesso total a todas as funções.</p>
              </div>
              <div className='dark:text-white py-2 relative'>
                <input id="advogado" value={1} onChange={(e) => setUsuarioFormData({ ...usuarioFormData, advogado: Number(e.target.value), admin: 0 })} className="absolute left-0 top-[40%] w-4 h-4 appearance-none checked:bg-neutral-800 bg-neutral-200 checked:border-neutral-200 checked:border-[4px] dark:border-[4px] border-black dark:border-white rounded-full dark:bg-white dark:checked:bg-neutral-800" type="radio" name="user-type" />
                <label htmlFor="advogado" className="ml-8">Jurídico</label>
                <p className='text-neutral-600 dark:text-neutral-400 text-[14px] ml-8'>Acesso a todos os detalhes das cessões.</p>
              </div>
              <div className='dark:text-white py-2 relative'>
                <input id="user" value={0} onChange={(e) => setUsuarioFormData({ ...usuarioFormData, admin: Number(e.target.value), advogado: 0 })} className="absolute left-0 top-[40%] w-4 h-4 appearance-none checked:bg-neutral-800 bg-neutral-200 checked:border-neutral-200 checked:border-[4px] dark:border-[4px] border-black dark:border-white rounded-full dark:bg-white dark:checked:bg-neutral-800" type="radio" name="user-type" />
                <label htmlFor="user" className="ml-8">Usuário</label>
                <p className='text-neutral-600 dark:text-neutral-400 text-[14px] ml-8'>Acesso limitado ao sistema.</p>
              </div>

            </div>
          </div>

          <button type="submit" className='hidden'>Salvar</button>
        </div>
      </div>
    </form>
  )
}
