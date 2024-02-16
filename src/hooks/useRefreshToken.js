import axios from "axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('api/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.acessToken);
            return {...prev, acessToken: response.data.acessToken}
        })
        return response.data.acessToken;
    }
    
  return refresh;
}

export default useRefreshToken