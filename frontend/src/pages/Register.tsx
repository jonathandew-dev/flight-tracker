import React, { useState, useContext } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRegister, setAuthToken } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { mutateAsync, status } = useRegister();
  const isLoading = status === "pending";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await mutateAsync({ email, password });
      setAuthToken(data.accessToken, data.user); // save token + user
      setUser(data.user);
      navigate("/dashboard"); // redirect
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Registration failed");
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
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
