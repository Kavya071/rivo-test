import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BonusTermsScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 text-white">
      <div className="mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>
      <h1 className="text-3xl font-medium tracking-tight mb-6">Bonus Terms</h1>
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        <p>Last updated: February 2026</p>
        <p>These terms apply to the Rivo Partner Referral Bonus program.</p>
        
        <section>
          <h2 className="text-white font-medium mb-2">1. Eligibility</h2>
          <p>Bonuses are available to verified partners who refer new agents to the Rivo network. The referred agent must not have been previously registered with Rivo.</p>
        </section>

        <section>
          <h2 className="text-white font-medium mb-2">2. Qualification</h2>
          <p>A "closed deal" is defined as a mortgage application that has been successfully disbursed. The bonus is triggered upon the successful disbursal of the referred agent's first, second, and third deals respectively.</p>
        </section>

        <section>
          <h2 className="text-white font-medium mb-2">3. Payouts</h2>
          <p>Bonus payments are processed within 30 days of the qualifying event. Rivo reserves the right to withhold bonuses in cases of suspected fraud or violation of terms.</p>
        </section>
      </div>
    </div>
  );
}
