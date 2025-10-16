import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Tournament from "./pages/Tournament";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Schedule from "./pages/Schedule";
import Rules from "./pages/Rules";
import Dashboard from "./pages/admin/Dashboard";
import RegistrationManagement from "./pages/admin/RegistrationManagement";
import NotificationControls from "./pages/admin/NotificationControls";
import SiteSettings from "./pages/admin/SiteSettings";
import AdminLogin from "./pages/admin/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={
            <>
              <Navbar />
              <Outlet />
              <Footer />
            </>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/rules" element={<Rules />} />
          </Route>
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="registrations" element={<RegistrationManagement />} />
            <Route path="notifications" element={<NotificationControls />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={
            <>
              <Navbar />
              <NotFound />
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
