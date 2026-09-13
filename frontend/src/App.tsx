import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AdminRoute } from "@/components/AdminRoute"
import { Navbar } from "@/components/Navbar"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { FavoritesProvider } from "@/context/FavoritesContext"
import { AddProduct } from "@/pages/AddProduct"
import { CartPage } from "@/pages/CartPage"
import { Home } from "@/pages/Home"
import { LoginPage } from "@/pages/LoginPage"
import { OrdersPage } from "@/pages/OrdersPage"
import { ProductDetail } from "@/pages/ProductDetail"
import { Support } from "@/pages/Support"

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <div className="min-h-screen bg-surface-base text-slate-100">
          <Navbar />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/products/add"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </div>
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App
