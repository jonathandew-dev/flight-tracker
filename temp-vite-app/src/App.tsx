import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthInit } from "./hooks/useAuthInit";

const App: React.FC = () => {
   useAuthInit();

  return <AppRoutes />;
};

export default App;
