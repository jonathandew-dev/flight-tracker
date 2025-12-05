import { useEffect, useContext, useState } from "react";
import { AuthContext, User } from "../context/AuthContext";
import { setAuthToken, api } from "../api/authService";

interface MeResponse {
  user: User;
}

export const useAuthInit = () => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");

      if (token) setAuthToken(token); // always set Axios header

      if (userStr) setUser(JSON.parse(userStr)); // populate context immediately

      if (token) {
        try {
          const res = await api.get<MeResponse>("/auth/me");
          setUser(res.data.user); // update user with backend data
          setAuthToken(token, res.data.user); // refresh storage just in case
        } catch (err) {
          console.warn("Token invalid or /auth/me failed", err);
          setAuthToken(null);
          setUser(null);
        }
      } else {
        setAuthToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, [setUser]);

  return { loading };
};