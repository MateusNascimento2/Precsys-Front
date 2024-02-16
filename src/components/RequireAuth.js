import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const RequireAdminAuth = ({admin}) => {
    // esse auth ta recebendo as informaçoes do usuario e ta verificando para ver se ele esta autenticado, 
    // se ele estiver, ele tem acesso as minhas outras rotas, se nao ele volta pro login 
    const { auth } = useAuth();
    console.log(auth.user.admin);
    
    const location = useLocation();

    return (
        auth?.user?.admin
           ? <Outlet /> 
           : auth?.user 
                ? <Navigate to="/unauthorized" state={{ from: location }} replace  />
                : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export const RequireNormalUserAuth = () => {
    const { auth } = useAuth();

    const location = useLocation();

    return (
        auth?.user ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace />
    )
}