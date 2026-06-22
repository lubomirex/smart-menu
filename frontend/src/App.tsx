import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingCartWidget from "./components/FloatingCartWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import { useEffect } from "react";
import { usePush } from "./hooks/usePush";

export default function App() {
  usePush(); // Tento hook teraz automaticky zaregistruje SW ak už máme povolenie z minula

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/register" element={<Navigate to="/admin/login" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FloatingCartWidget />
      <Footer />
    </div>
  );
}
  