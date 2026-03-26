import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router"; // Added Routes import
import App from './App.jsx'
import About from './pages/About.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RootLayout from './pages/RootLayout';
import Services from './pages/Services';

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/dashboard" element={<Userlayout />}>
          <Route index element={<Userhome />} />
          <Route path="profile" element={<Userprofile />} />
          
        </Route>
        <Route path="oauth/success" element={<OAuthSuccess />} />
        <Route path="oauth/failure" element={<OAuthSuccess />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
)