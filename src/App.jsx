import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'; 
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetail';
import EditPostPage from './pages/EditPostPage';
import CommentSection from './components/CommentSection';

import NavBar from './components/NavBar.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { ConfirmDialog } from 'primereact/confirmdialog';

function App() {
  return (
    <BrowserRouter>
      <ConfirmDialog />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<NavBar />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/new" element={<CreatePostPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/posts/:postId/edit" element={<EditPostPage />} />
            <Route path="/posts/:postId/comments" element={<CommentSection />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;