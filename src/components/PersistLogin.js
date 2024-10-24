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

  return (
    <>
      {!persist
        ? <Outlet />
        : isLoading
          ? (<div className="w-screen h-screen flex justify-center items-center">
            <div className="w-full flex justify-center">
              <div className="w-12 h-12">
                <LoadingSpinner />
              </div>
            </div>
          </div>)
          : <Outlet />
      }
    </>
  )
}

export default PersistLogin;