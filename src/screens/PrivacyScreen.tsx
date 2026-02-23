import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 text-white">
      <div className="mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>
      <h1 className="text-3xl font-medium tracking-tight mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        <p>Last updated: February 2026</p>
        <p>Your privacy is important to us. It is Rivo's policy to respect your privacy regarding any information we may collect from you across our application.</p>
        
        <section>
          <h2 className="text-white font-medium mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your name, phone number, and referral details when you use our services.</p>
        </section>

        <section>
          <h2 className="text-white font-medium mb-2">2. How We Use Information</h2>
          <p>We use the information to process referrals, pay commissions, communicate with you, and improve our services.</p>
        </section>

        <section>
          <h2 className="text-white font-medium mb-2">3. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        </section>
      </div>
    </div>
  );
}
