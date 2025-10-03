import axios, { axiosPrivate } from "../api/axios";
import React, { useEffect } from 'react';
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from 'react-router-dom';

/**
 * Hook customizado que devolve uma instância do axios configurada
 * para lidar automaticamente com:
 * - Inclusão do accessToken nos headers
 * - Tentativa de refresh quando o token expira
 * - Redirecionamento em caso de falha de autenticação/permissão
 */
function useAxiosPrivate() {
  // Hook que sabe chamar o endpoint de refresh e devolver novo accessToken
  const refresh = useRefreshToken();

  // Contexto de autenticação, onde guardamos o usuário + accessToken atual
  const { auth } = useAuth();

  // Para redirecionar o usuário em caso de logout ou erro de permissão
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Interceptor de REQUEST
     * - Executa antes de cada requisição
     * - Se não houver header Authorization, injeta o accessToken atual
     */
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers.authorization) {
          config.headers.authorization = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error) // em caso de erro, rejeita direto
    );

    /**
     * Interceptor de RESPONSE
     * - Executa em caso de resposta ou erro
     * - Se vier 403 (token inválido/expirado) e ainda não tentamos refresh:
     *    → chama o refresh, pega novo accessToken e refaz a requisição original
     * - Se refresh falhar, redireciona para login
     * - Se continuar sendo 403 (falta de permissão), manda para /forbidden
     */
    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true; // evita loop infinito
          try {
            const newAccessToken = await refresh();
            prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest); // repete a request original
          } catch (err) {
            // Refresh falhou → força logout e redireciona
            navigate('/', { replace: true });
            return Promise.reject(err);
          }
        }

        // Se foi 403 sem chance de refresh → rota proibida
        if (error.response?.status === 403) {
          navigate('/forbidden', { replace: true });
        }

        return Promise.reject(error);
      }
    );

    /**
     * Cleanup do useEffect
     * - Remove interceptors ao desmontar o hook ou mudar dependências
     * - Evita duplicação de interceptors ao longo da vida da aplicação
     */
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]); // roda sempre que mudar o auth ou a função de refresh

  // Retorna a instância configurada
  return axiosPrivate;
}

export default useAxiosPrivate;
