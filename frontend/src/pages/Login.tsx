import React, { useState, useContext } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useLogin, setAuthToken } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { mutateAsync, status } = useLogin();
  const isLoading = status === "pending";

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const data = await mutateAsync({ email, password });
    console.log("Login response:", data);

    if (!data.accessToken || !data.user) {
      throw new Error("Login failed: missing token or user data");
    }

    // Save token + user to localStorage & axios
    setAuthToken(data.accessToken, data.user);

    // Update context
    setUser(data.user);

    navigate("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Please check your credentials.");
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
