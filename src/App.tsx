import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/Toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "@/components/Layout";
import LandingScreen from "@/screens/LandingScreen";
import ReferralBonusScreen from "@/screens/ReferralBonusScreen";
import HomeScreen from "@/screens/HomeScreen";
import ClientsScreen from "@/screens/ClientsScreen";
import NetworkScreen from "@/screens/NetworkScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import LeadSubmissionScreen from "@/screens/LeadSubmissionScreen";
import ReferralSuccessScreen from "@/screens/ReferralSuccessScreen";
import WhatsAppListeningScreen from "@/screens/WhatsAppListeningScreen";
import ReferralInfoScreen from "@/screens/ReferralInfoScreen";

import TermsScreen from "@/screens/TermsScreen";
import PrivacyScreen from "@/screens/PrivacyScreen";
import BonusTermsScreen from "@/screens/BonusTermsScreen";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/whatsapp-verify" element={<WhatsAppListeningScreen />} />
            <Route path="/terms" element={<TermsScreen />} />
            <Route path="/privacy" element={<PrivacyScreen />} />
            <Route path="/bonus-terms" element={<BonusTermsScreen />} />
            <Route path="/referral-info" element={<ReferralInfoScreen />} />
            <Route
              path="/referral-bonus"
              element={
                <ProtectedRoute>
                  <ReferralBonusScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <ClientsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/network"
              element={
                <ProtectedRoute>
                  <NetworkScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/refer-client"
              element={
                <ProtectedRoute>
                  <LeadSubmissionScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referral-success"
              element={
                <ProtectedRoute>
                  <ReferralSuccessScreen />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
