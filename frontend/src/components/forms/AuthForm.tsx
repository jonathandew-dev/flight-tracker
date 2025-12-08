// src/components/forms/AuthForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, Link } from "react-router-dom";

interface AuthFormProps {
  title: string;
  mutationFn: (payload: { email: string; password: string }) => Promise<{
    accessToken?: string;
    token?: string;
    user: { id: string; email: string; name?: string | null };
  }>;
  redirectLink?: { text: string; path: string };
}

const AuthForm: React.FC<AuthFormProps> = ({ title, mutationFn, redirectLink }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    toast.error("Email and password are required");
    return;
  }

  let toastId: string | undefined;

  try {
    setIsLoading(true);
    toastId = toast.loading(`${title} in progress...`);

    const data = await mutationFn({ email: trimmedEmail, password: trimmedPassword });

    const finalToken = data.accessToken || data.token;
    const apiUser = data.user;

    if (!finalToken || !apiUser) throw new Error(`${title} failed`);

    // Normalize user to match new User type
    const normalizedUser = {
      id: apiUser.id,
      email: apiUser.email,
      firstName: apiUser.name?.split(" ")[0] || null,
      lastName: apiUser.name?.split(" ")[1] || null,
    };

    setAuth(finalToken, normalizedUser); // update Zustand store & localStorage

    toast.success(`${title} successful!`, { id: toastId });
    navigate("/dashboard");
  } catch (err: unknown) {
    let message = `${title} failed`;

    if (err instanceof AxiosError && err.response?.data) {
      const data = err.response.data as { message?: string };
      if (data.message) message = data.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    if (toastId) toast.dismiss(toastId);
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 border rounded-xl shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? `${title}...` : title}
          </Button>
        </form>

        {redirectLink && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {redirectLink.text}{" "}
            <Link to={redirectLink.path} className="text-blue-600 hover:underline font-medium">
              {redirectLink.path.includes("login") ? "Login" : "Register"}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
