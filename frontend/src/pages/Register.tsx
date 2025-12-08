import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRegister, setAuthToken, User } from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import DashboardLayout from "@/components/DashboardLayout";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { mutateAsync, status } = useRegister();
  const isLoading = status === "pending";

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
    <DashboardLayout hideAuthenticatedLinks>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md p-8 border rounded-xl shadow-md bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
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
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Register;
