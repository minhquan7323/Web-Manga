import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './styles/index.css';
import AppRoutes from './routes/AppRoutes';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);