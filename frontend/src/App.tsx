import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { restoreAuth } from "./api/authService";

restoreAuth(); 

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" />
      <AppRoutes />
    </>
  );
};

export default App;