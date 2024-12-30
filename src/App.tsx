import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import useAuth from "./hooks/useAuth";
import Vendors from "./pages/dashboard/Vendors";
import Categories from "./pages/dashboard/Categories";
import Discount from "./pages/dashboard/Discount";
import Login from "./pages/login/Login";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const auth = useAuth();
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          element={<PrivateRoute isAuthenticated={auth.isAuthenticated} />}
        >
          <Route>
            <Route
              path="/"
              element={<Navigate to="/dashboard/vendors" replace />}
            />
            <Route path="/dashboard/*" element={<Dashboard />}>
              <Route path="vendors" element={<Vendors />} />
              <Route path="categories" element={<Categories />} />
              <Route path="discount" element={<Discount />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
