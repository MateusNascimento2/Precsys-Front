import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from './useAuth';

const useUpdateUserProfile = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const updateUserProfile = async (updatedUserData) => {
    try {
      // Supondo que o endpoint para atualizar o perfil seja algo como '/users/:id'
      const response = await axiosPrivate.put(`/users/${updatedUserData.id}`, updatedUserData);

      // Atualiza o contexto do usuário com os novos dados
      setAuth(prev => {
        const newAuth = {
          ...prev,
          user: response.data.updatedUser,  // Substitui o perfil antigo pelos novos dados do usuário
          userImage: response.data.photoUrl  // Atualiza a imagem de perfil, se necessário
        };

        // Se persistência estiver habilitada, atualiza no localStorage também
        if (persist) {
          localStorage.setItem('auth', JSON.stringify(newAuth));
        }

        return newAuth;
      });

      // Opcional: Retornar alguma resposta para indicar sucesso
      return response.data.updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar o perfil do usuário:", error);
      throw error;  // Propaga o erro para tratamento posterior
    }
  };

  return updateUserProfile;
};

export default useUpdateUserProfile;
