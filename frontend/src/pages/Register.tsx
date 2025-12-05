import React, { useState } from "react";
import { Input } from "../components/forms/Input";
import { Button } from "../components/Button";
import { useRegister, setAuthToken, User } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { mutateAsync, status } = useRegister();
  const isLoading = status === "pending";
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await mutateAsync({ email, password });

      if (!data.accessToken || !data.user)
        throw new Error("Registration failed");

      setAuthToken(data.accessToken, data.user);
      setAuth(data.accessToken, data.user as User);

      navigate("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
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
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
