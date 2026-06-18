import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";

export default function App() {
  return <div className="app-shell"><Navbar /><main className="page-wrap"><Routes><Route path="/" element={<Home />} /><Route path="/menu" element={<Menu />} /><Route path="/products/:id" element={<ProductDetails />} /><Route path="/cart" element={<Cart />} /><Route path="/order-confirmation/:id" element={<OrderConfirmation />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/products" element={<ProductManagement />} /><Route path="/admin/orders" element={<OrderManagement />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></main><Footer /></div>;
}
