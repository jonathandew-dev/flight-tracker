import React from "react";
import AppRoutes from "./routes/AppRoutes.js";
import { Toaster } from "react-hot-toast";
import { restoreAuth } from "@/store/authStore";


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