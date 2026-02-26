import React from 'react';
import ConfigRoutes from './routes/mainroutes';
import { ContextProvider } from "./contexts/ContextProvider";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhKYVFxWmFZfVhgdl9HYVZQTWYuP1ZhSXxVdkdhXH9ccXVXQWJfUEF9XEA=');

const App: React.FC = () => {
  return (
    <ContextProvider>
      <div className="App">
        <ConfigRoutes />
      </div>
    </ContextProvider>
  );
};

export default App;