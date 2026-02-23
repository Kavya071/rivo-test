import { Button } from "@/components/ui/Button";
import { CONFIG, loadConfig } from "@/config";
import { useAuth } from "@/lib/auth";
import { motion } from "motion/react";
import { Copy, Share2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getNetwork } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface NetworkAgent {
  id: string;
  name: string;
  agent_code: string;
  created_at: string;
  deals_count: number;
  bonus_earned: number;
}

interface NetworkData {
  agent_code: string;
  referred_agents: NetworkAgent[];
  bonus_summary: {
    total_earned: number;
    bonuses_count: number;
    max_bonuses: number;
    completed: boolean;
  };
}

export default function NetworkScreen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [network, setNetwork] = useState<NetworkData | null>(null);

  useEffect(() => {
    loadConfig();
    getNetwork()
      .then(setNetwork)
      .catch(console.error);
  }, []);

  const agentCode = network?.agent_code || user?.agent_code || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(CONFIG.LINKS.RIVO_JOIN + "?ref=" + agentCode);
    toast("Link copied!");
  };

  const handleShare = async () => {
    const url = `${CONFIG.LINKS.RIVO_JOIN}?ref=${agentCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Rivo Partner Network",
          text: CONFIG.MESSAGES.SHARE_TEXT,
          url,
        });
      } catch {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(CONFIG.MESSAGES.SHARE_TEXT + url)}`, "_blank");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-AE", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <div className="bg-black text-white pt-12 pb-8 px-6 border-b border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-medium tracking-tight text-white mb-6">My network</h1>

          <p className="text-gray-400 text-sm mb-4">Your Referral Code</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
            <h2 className="text-4xl font-medium tracking-widest text-white">{agentCode}</h2>
          </div>

          <Button
            variant="whatsapp"
            className="w-full h-14 font-medium rounded-lg mb-4 text-lg"
            onClick={handleShare}
          >
            <svg className="w-7 h-7 mr-2 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Invite your network
          </Button>

          <button
            onClick={handleCopy}
            className="text-sm text-gray-400 flex items-center justify-center hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Tap to copy link
          </button>

          <div className="mt-6 pt-4 border-t border-zinc-800/50">
            <Link to="/referral-info" className="text-sm font-medium text-rivo-green hover:text-rivo-green/80 transition-colors flex items-center justify-center">
              Know more about the referral program
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <h3 className="font-medium text-lg mb-6 text-white">How it works</h3>
          <div className="space-y-8">
            <div className="flex space-x-5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-medium flex-shrink-0 text-sm">1</div>
              <div>
                <h4 className="font-medium text-base text-white">Ask Agents to join Rivo</h4>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">Share your link with agents in your network.</p>
              </div>
            </div>
            <div className="flex space-x-5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-medium flex-shrink-0 text-sm">2</div>
              <div>
                <h4 className="font-medium text-base text-white">They refer mortgages to Rivo</h4>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">Bonuses unlock on their first 3 disbursals.</p>
              </div>
            </div>
            <div className="flex space-x-5">
              <div className="w-8 h-8 rounded-full bg-rivo-green text-black flex items-center justify-center font-medium flex-shrink-0 text-sm">3</div>
              <div>
                <h4 className="font-medium text-base text-white">You both get paid</h4>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">AED {CONFIG.REFERRAL_BONUS.FIRST_DEAL}, {CONFIG.REFERRAL_BONUS.SECOND_DEAL}, then {CONFIG.REFERRAL_BONUS.THIRD_DEAL} respectively.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900">
            <p className="text-xs text-gray-500">
              *Terms and conditions apply. Bonuses are subject to successful loan disbursal and verification.
              <Link to="/terms" className="text-gray-400 hover:text-white underline ml-1">Read full T&Cs</Link>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-4 flex items-center text-white">
            <Users className="w-5 h-5 mr-2" />
            Your Network
            {network?.bonus_summary.completed && (
              <span className="ml-2 px-2 py-0.5 bg-rivo-green/10 text-rivo-green text-xs font-medium rounded-full">Completed</span>
            )}
          </h3>

          {network?.referred_agents.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No agents in your network yet. Share your link to start earning bonuses.</p>
          ) : (
            <div className="space-y-4">
              {network?.referred_agents.map((agent) => (
                <div key={agent.id} className={`flex justify-between items-center py-2 border-b border-zinc-900 ${agent.deals_count === 0 ? 'opacity-50' : ''}`}>
                  <div>
                    <h4 className="font-medium text-base text-white">{agent.name || "Agent"}</h4>
                    <p className="text-xs text-gray-500 mt-1">Joined {formatDate(agent.created_at)} • {agent.deals_count}/3 Deals</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-medium text-sm ${agent.bonus_earned > 0 ? 'text-rivo-green' : 'text-gray-500'}`}>
                      +AED {agent.bonus_earned}
                    </span>
                    <p className="text-[10px] text-gray-500 uppercase">Bonus</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
