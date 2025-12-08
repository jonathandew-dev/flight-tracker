// src/pages/Login.tsx
import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useLogin, setAuthToken} from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { mutateAsync, status } = useLogin();
  const isLoading = status === "pending";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await mutateAsync({ email, password });

      if (!data.accessToken || !data.user) throw new Error("Login failed");

      // Updates Zustand + localStorage + Axios headers
      setAuthToken(data.accessToken, data.user);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <DashboardLayout hideAuthenticatedLinks>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md p-8 border rounded-xl shadow-md bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
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
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Login;
