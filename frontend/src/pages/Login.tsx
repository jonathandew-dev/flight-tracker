import React, { useState } from "react";
import { Input } from "../components/forms/Input";
import { Button } from "../components/Button";
import { useLogin, setAuthToken, User } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { mutateAsync, status } = useLogin();
  const isLoading = status === "pending";
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await mutateAsync({ email, password });
      if (!data.accessToken || !data.user) throw new Error("Login failed");

      setAuthToken(data.accessToken, data.user);
      setAuth(data.accessToken, data.user as User);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
