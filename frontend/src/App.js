import * as React from 'react'
import './App.css'
import {
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { RecoilRoot } from 'recoil'
import RecoilNexus from "recoil-nexus";
import LibrariesList from './components/dashboard/LibrariesList'
import FilesList from './components/dashboard/FilesList'


function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<DashboardPage />}>
            <Route path="home" element={<LibrariesList />} />
            <Route path="library/:libraryName" element={<FilesList />} />
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App;
