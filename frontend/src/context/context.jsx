import { useState, createContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

export const StoreContext = createContext();


const StoreContextProvider = ({ children }) => {

const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({});

  const fetchUser = useCallback(async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { token },
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserData(response.data.user);
        navigate("/");

      } else {
        navigate("/login")
        toast.info(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token, fetchUser]);

  const contextValue = {
    token,
    setToken,
    userData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;