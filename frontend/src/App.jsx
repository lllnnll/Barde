import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { AuthProvider } from './auth/AuthContext'
import { BrowserRouter } from 'react-router-dom'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
