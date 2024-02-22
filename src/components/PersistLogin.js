import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      }
      catch (err) {
        console.error(err);
      }
      finally {
        isMounted && setIsLoading(false);
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => isMounted = false;
  }, [])

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`)
    
    console.log(`AccessToken: ${JSON.stringify(auth?.accessToken)}`)
  }, [isLoading])

  return (
    <>
      {!persist
        ? <Outlet />
        : isLoading
          ? <LoadingSpinner />
          : <Outlet />
      }
    </>
  )
}

export default PersistLogin;