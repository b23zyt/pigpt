import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from '../src/routes/homepage/Homepage.jsx'
import DashBoardPage from '../src/routes/dashboardPage/DashboardPage.jsx'
import ChatPage from '../src/routes/chatPage/ChatPage.jsx'
import RootLayout from './layouts/rootLayout/RootLayout.jsx'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.jsx'
import SignInPage from '../src/routes/signInPage/SignInPage.jsx'
import SignUpPage from '../src/routes/signUpPage/SignUpPage.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children:[
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: '/sign-in/*',
        element: <SignInPage />
      },
      {
        path: '/sign-up/*',
        element: <SignUpPage />
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashBoardPage />
          },
          {
            path: '/dashboard/chats/:id',
            element: <ChatPage />
          }
        ]
      },
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
