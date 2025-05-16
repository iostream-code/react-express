// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PostsLayout from './pages/layouts/PostsLayout';
import MyPosts from './pages/posts/MyPosts';
import PostCreate from './pages/posts/Create';
import PostDetail from './pages/posts/Edit';
import Profile from './pages/Profile';
import UserManagement from './pages/admin/Users';
import AdminLayout from './pages/layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoutes';
import AdminRoute from './routes/admin/AdminRoutes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Umum) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostsLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyPosts />} />
            <Route path="create" element={<PostCreate />} />
            <Route path="detail/:id" element={<PostDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="users" element={<UserManagement />} />
            {/* Tambahkan route admin lainnya di sini */}
          </Route>

          {/* 404 Handler */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;