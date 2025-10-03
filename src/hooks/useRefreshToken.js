import axios from '../api/axios';
import useAuth from "./useAuth";

/**
 * Hook customizado para renovar o accessToken
 * - Faz requisição ao endpoint /refresh
 * - Atualiza o contexto de autenticação (setAuth)
 * - Opcionalmente salva no localStorage, se persistência estiver habilitada
 */
const useRefreshToken = () => {
    // Pega do contexto:
    // - setAuth → para atualizar os dados de autenticação na aplicação
    // - persist → flag que indica se deve salvar no localStorage
    const { setAuth, persist } = useAuth();

    /**
     * Função de refresh em si
     * - Chama a API para pegar novo accessToken (cookie HttpOnly é enviado automático)
     * - Atualiza estado global de auth com novos dados
     * - Salva no localStorage se persistência estiver ativa
     */
    const refresh = async () => {
        // Chamada ao backend: o refreshToken está no cookie HttpOnly
        const response = await axios.get('/refresh', {
            withCredentials: true, // garante envio de cookies
        });

        // Atualiza o estado global com os novos dados
        setAuth(prev => {
            const newAuth = {
                ...prev, // mantém dados antigos que não mudaram
                accessToken: response.data.accessToken,
                user: response.data.foundUser,
                userImage: response.data.photoUrl,
            };

            // Se persistência estiver ligada → salva no localStorage
            if (persist) {
                localStorage.setItem('auth', JSON.stringify(newAuth));
            }

            return newAuth;
        });

        // Retorna o novo token para quem chamou a função
        return response.data.accessToken;
    };
    
    // Retorna a função refresh pronta para ser usada
    return refresh;
};

export default useRefreshToken;
