import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, createBrowserRouter ,RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx'
import SignInPage from './auth/sign-in/index.jsx';
import Dashboard from './pages/Dashboard.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    element:<App />,
    children:[
      {
        path:'/dashboard',
        element:<Dashboard />
      }
    ]
  },
  {
    path:'/',
    element:<Home />
  }
  ,
  {
    path:'/auth/sign-in',
    element:<SignInPage />
  }
])

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing publishable key");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} >
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
