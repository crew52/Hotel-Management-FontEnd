import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/Login/SignIn'
import ForgotPassword from './components/Login/ForgotPassword'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/SignIn" />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
