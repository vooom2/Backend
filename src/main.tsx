import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import DashboardLayout from "./components/dashboard_layout.tsx";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import PaymentHistory from "./pages/dashboard/payment/PaymentHistory.tsx";
import FleetManager from "./pages/dashboard/fleet_manager.tsx";
import BikeHistory from "./pages/dashboard/bikes_history.tsx";
import Profile from "./pages/dashboard/profile.tsx";
import SetupAccount from "./pages/dashboard/verification/setup_account.tsx";
import MotorcycleRental from "./pages/dashboard/rentals/motorcycle_rental.tsx";
import MotorcycleRentalDetails from "./pages/dashboard/rentals/motorcycle_rental_details.tsx";
import BikeApplication from "./pages/dashboard/rentals/bike_application.tsx";
import BikeApplicationFinale from "./pages/dashboard/rentals/bike_application_finale.tsx";
import VerificationBanner from "./components/verification_banner.tsx";
import MakePayment from "./pages/dashboard/payment/MakePayment.tsx";
import Complaints from "./pages/dashboard/complaints/complaints.tsx";
import ComplaintForm from "./pages/dashboard/complaints/complaint_form.tsx";
import Signup from "./pages/auth/signup.tsx";
import Login from "./pages/auth/login.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Signup />} path="auth/signup" />
        <Route element={<Login />} path="auth/login" />
        <Route element={<Login />} path="/" />
        <Route element={<DashboardLayout />} path="dashboard">
          <Route index element={<Dashboard />} />
          <Route path="unverified" element={<VerificationBanner />} />
          <Route path="rent/available" element={<MotorcycleRental />} />
          <Route path="rent/available/:id" element={<MotorcycleRentalDetails />} />
          <Route path="rent/available/apply/:id" element={<BikeApplication />} />
          <Route path="rent/available/apply/success" element={<BikeApplicationFinale />} />

          <Route path="payments" element={<PaymentHistory />} />
          <Route path="payments/pay" element={<MakePayment />} />

          <Route path="fleet" element={<FleetManager />} />

          <Route path="complaints" element={<Complaints />} />
          <Route path="complaints/create" element={<ComplaintForm />} />

          <Route path="bikes" element={<BikeHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="setupaccount" element={<SetupAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
