import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SessionPage from './pages/SessionPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-13">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/session" element={<SessionPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
