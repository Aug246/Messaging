import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './pages/Homepage.jsx'
import RegisterPage from "./pages/RegisterPage.jsx"
import Messages from './pages/Messages.jsx'
import PageNotFound from "./pages/PageNotFound.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const router = createBrowserRouter([
  {path: '/', element: <Homepage/>},
  {path: '/register', element: <RegisterPage/>},
  {path: '/messages', element: <Messages/>},
  {path: '*', element: <PageNotFound/>}

]); 

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
