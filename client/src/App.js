import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ItemPage from "./pages/ItemPage";
import CartPage from "./pages/CartPage";
import BillPage from "./pages/BillPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dash from "./pages/Dashboard/Dash";
import Items from "./pages/Dashboard/Items";
import Bills from "./pages/Dashboard/Bills";
import User from "./pages/Dashboard/User";
import Cancelbills from "./pages/Dashboard/Cancelbills";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <ItemPage />
              </ProtectedRoute>
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
            path="/bills"
            element={
              <ProtectedRoute>
                <BillPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteAdmin>
                <Dash />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRouteAdmin>
                <Items />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/Billsadmin"
            element={
              <ProtectedRouteAdmin>
                <Bills />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/userlist"
            element={
              <ProtectedRouteAdmin>
                <User />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/CancelBills"
            element={
              <ProtectedRouteAdmin>
                <Cancelbills />
              </ProtectedRouteAdmin>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  const authData = localStorage.getItem("auth");
  if (authData) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
export function ProtectedRouteAdmin({ children }) {
  const authData = localStorage.getItem("auth");

  if (authData) {
    const { roles } = JSON.parse(authData);

    // เพิ่มเงื่อนไขที่ตรวจสอบว่า roles เป็น admin หรือไม่
    if (roles && roles.includes("admin")) {
      return children;
    } else {
      // หากไม่ใช่ admin, ให้ไปที่หน้าแรก
      return <Navigate to="/" />;
    }
  }

  // หากไม่มีข้อมูล auth, ให้ไปที่หน้า login
  return <Navigate to="/login" />;
}
