import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import BookingCreatePage from "./pages/BookingCreatePage.jsx";
import BookingDetailsPage from "./pages/BookingDetailsPage.jsx";
import BookingEditPage from "./pages/BookingEditPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import BookingsGate from "./components/BookingsGate.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route element={<BookingsGate />}>
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/new" element={<BookingCreatePage />} />
        <Route path="bookings/:id" element={<BookingDetailsPage />} />
        <Route path="bookings/:id/edit" element={<BookingEditPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
