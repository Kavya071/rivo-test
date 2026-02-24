import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 text-white">
      <div className="mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>
      <h1 className="text-3xl font-medium tracking-tight mb-6">Terms of Service</h1>
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        <p>Last updated: February 2026</p>
        <p>Please read these terms carefully before using Rivo Partners.</p>
        
        <section>
          <h2 className="text-white font-medium mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-white font-medium mb-2">2. Agent Referral Bonus Program</h2>
          <p>Bonuses are paid only upon successful disbursal of the loan by the referred agent's client. Rivo reserves the right to modify bonus structures with prior notice.</p>
        </section>

        <section>
          <h2 className="text-white font-medium mb-2">3. User Conduct</h2>
          <p>You agree to use the app only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the app.</p>
        </section>
      </div>
    </div>
  );
}
