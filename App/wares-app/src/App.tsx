import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './pages/User/UserList'; // Importa desde la nueva ubicación
// import UserForm from './components/UserForm';
// import UserDetail from './components/UserDetail';
import './index.css'; // Importa index.css

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

function App() {
  return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                <Route path="/" element={<UserList />} />
                {/* <Route path="/users/create" element={<UserForm />} />
                <Route path="/users/edit/:id" element={<UserForm />} />
                <Route path="/users/:id" element={<UserDetail />} /> */}
            </Routes>
        </Router>
        </QueryClientProvider>
);
}

export default App;