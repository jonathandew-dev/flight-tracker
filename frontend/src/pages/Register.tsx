import React from "react";
import AuthForm from "@/components/forms/AuthForm";
import { useRegister } from "@/api/authService";
import DashboardLayout from "@/components/DashboardLayout";

const Register: React.FC = () => {
  const { mutateAsync } = useRegister();

  return (
    <DashboardLayout hideAuthenticatedLinks>
      <AuthForm
        title="Register"
        mutationFn={mutateAsync}
        redirectLink={{ text: "Already have an account?", path: "/login" }}
      />
    </DashboardLayout>
  );
};

export default Register;
