import axios, { axiosPrivate } from "../api/axios";
import React, { useEffect } from 'react';
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from 'react-router-dom';


function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {

    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers.authorization) {
          config.headers.authorization = `Bearer ${auth?.accessToken}`;
        }

        return config;
      }, (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (err) {
            // Falha no refresh: redireciona para login
            navigate('/', { replace: true });
            return Promise.reject(err);
          }
        }

        if (error.response?.status === 403) {
          navigate('/forbidden', { replace: true });
        }


        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate