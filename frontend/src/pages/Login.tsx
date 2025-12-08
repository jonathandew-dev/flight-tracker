import React from "react";
import AuthForm from "@/components/forms/AuthForm";
import { useLogin } from "@/api/authService";
import DashboardLayout from "@/components/DashboardLayout";

const Login: React.FC = () => {
  const { mutateAsync } = useLogin();

  return (
    <DashboardLayout hideAuthenticatedLinks>
      <AuthForm
        title="Login"
        mutationFn={mutateAsync}
        redirectLink={{ text: "Don’t have an account?", path: "/register" }}
      />
    </DashboardLayout>
  );
};

export default Login;
