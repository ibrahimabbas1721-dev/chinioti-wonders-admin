import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddEditProduct from './pages/AddEditProduct';
import Categories from './pages/Categories';
import Videos from './pages/Videos';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected + Layout */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddEditProduct />} />
          <Route path="products/edit/:id" element={<AddEditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="videos" element={<Videos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}