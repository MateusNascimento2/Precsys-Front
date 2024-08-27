import axios from '../api/axios';
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth, persist } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            const newAuth = {
                ...prev,
                accessToken: response.data.accessToken,
                user: response.data.foundUser,
                userImage: response.data.photoUrl
            };

            // Se a persistência estiver habilitada, salva o estado de auth no localStorage
            if (persist) {
                localStorage.setItem('auth', JSON.stringify(newAuth));
            }

            return newAuth;
        });
        return response.data.accessToken;
    };
    
    return refresh;
};

export default useRefreshToken;
