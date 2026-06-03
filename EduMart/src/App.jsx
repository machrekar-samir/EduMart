import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import GetStarted from './pages/GetStarted'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import AiToolsPage from './pages/AiToolsPage'
import TrustPage from './pages/TrustPage'
import RevenuePage from './pages/RevenuePage'
import AudiencePage from './pages/AudiencePage'
import VisionPage from './pages/VisionPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="get-started" element={<GetStarted />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="ai-tools" element={<AiToolsPage />} />
          <Route path="trust" element={<TrustPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="audience" element={<AudiencePage />} />
          <Route path="vision" element={<VisionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
