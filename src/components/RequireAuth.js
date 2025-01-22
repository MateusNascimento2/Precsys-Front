import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const RequireAdminAuth = () => {
    // esse auth está recebendo as informaçôes do usuário e verifica para ver se ele está autenticado, 
    // se ele estiver, ele tem acesso as minhas outras rotas, se nao ele volta pro login; 
    const { auth } = useAuth();
    
    const location = useLocation();

    return (
        auth?.user?.admin
           ? <Outlet /> 
           : auth?.user 
                ? <Navigate to="/unauthorized" state={{ from: location }} replace  />
                : <Navigate to="/" state={{ from: location }} replace />
    )
}

export const RequireNormalUserAuth = () => {
    const { auth } = useAuth();

    const location = useLocation();

    return (
        auth?.user ? <Outlet /> : <Navigate to="/" state={{from: location}} replace />
    )
}