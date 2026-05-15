import React from 'react';
import ConfigRoutes from './routes/mainroutes';
import { ContextProvider } from "./contexts/ProviderContext";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  return (
    <ContextProvider>
      <AuthProvider>
        <div className="App">
          <ConfigRoutes />
        </div>
      </AuthProvider>
    </ContextProvider>
  );
};

export default App;