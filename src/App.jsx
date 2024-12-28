import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TripSchedulePage from "./pages/TripSchedulePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "./app/feature/auth/authSlice";
import BusPage from "./pages/BusPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import SeatLayoutPage from "./pages/SeatLayoutPage";
import BookingPage from "./pages/BookingPage";

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            user?.role === "admin" ? <Navigate to="/admin" replace /> : <Home />
          }
        />
        <Route path="trips" element={<TripSchedulePage />} />

        <Route
          path="seat-layout/:busId"
          element={
            <ProtectedRoute requiredRole="commuter">
              <SeatLayoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="booking/details"
          element={
            <ProtectedRoute requiredRole="commuter">
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="/buses"
          element={
            <ProtectedRoute>
              <BusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
