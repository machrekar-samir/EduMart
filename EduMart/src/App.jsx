import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import GetStarted from './pages/GetStarted'
import Marketplace from './pages/Marketplace'
import ProductDetails from './pages/ProductDetails'
import SellProduct from './pages/SellProduct'
import DigitalProducts from './pages/DigitalProducts'
import FreelanceServices from './pages/FreelanceServices'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import AiToolsPage from './pages/AiToolsPage'
import TrustPage from './pages/TrustPage'
import RevenuePage from './pages/RevenuePage'
import AudiencePage from './pages/AudiencePage'
import VisionPage from './pages/VisionPage'
import './App.css'
import './styles/Marketplace.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route
              path="sell"
              element={
                <ProtectedRoute>
                  <SellProduct />
                </ProtectedRoute>
              }
            />
            <Route path="digital" element={<DigitalProducts />} />
            <Route path="freelance" element={<FreelanceServices />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="chat/:conversationId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
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
    </AuthProvider>
  )
}

export default App
