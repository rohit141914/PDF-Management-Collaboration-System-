import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import PDFView from './pages/PDFView';
import SharedPDF from './pages/SharedPDF';
import PrivateRoute from './components/Layout/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pdf/:id" element={<PDFView />} />
        </Route>
        <Route path="/shared/:token" element={<SharedPDF />} />
      </Routes>
    </Router>
  );
}

export default App;