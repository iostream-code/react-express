import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './pages/layout/MainLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Posts from './pages/posts/Index'
import PostCreate from './pages/posts/Create'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="posts" element={<Posts />} />
            <Route path="post/create" element={<PostCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
