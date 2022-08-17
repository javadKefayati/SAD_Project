import * as React from 'react'
import './App.css'
import {
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import Dashboard from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App;
