import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProductList from './components/productList';
import ProductForm from './components/productForm';
// Import other components as needed

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RegisterPage />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/create" element={<ProductForm />} />
      <Route path="/update/:id" element={<ProductForm />} />
      {/* Add other routes for your application */}
    </Routes>
  );
}

export default App;