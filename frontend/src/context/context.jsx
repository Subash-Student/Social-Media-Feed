import { useState, createContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

export const StoreContext = createContext();


const StoreContextProvider = ({ children }) => {

const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({});
  const [posts,setPosts] = useState();
 const [filterOption,setFilterOption] = useState('all');

  const fetchUser = useCallback(async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
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

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
      setPosts(res.data.posts);
    } catch (err) {
      console.log(err);
    }
  };



  useEffect(() => {
    if (token) {
      fetchUser(token);
      fetchPosts()
    }
  }, [token, fetchUser]);

  useEffect(() => {
    if (posts) {
      console.log('Posts updated:', posts);
    }
  }, [posts]);


  const contextValue = {
    token,
    setToken,
    filterOption,setFilterOption,
    userData,
    posts,
    setPosts,
    fetchPosts
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
