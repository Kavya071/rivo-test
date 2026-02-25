import { Button } from "@/components/ui/Button";
import { CONFIG, loadConfig } from "@/config";
import { useAuth } from "@/lib/auth";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function ReferralBonusScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [, setConfigLoaded] = useState(false);
  useEffect(() => {
    loadConfig().then(() => setConfigLoaded(true));
  }, []);

  const handleShare = () => {
    const url = `https://partners.rivo.ae?ref=${user?.agent_code}`;
    const message = CONFIG.MESSAGES.SHARE_TEXT.includes("{url}")
      ? CONFIG.MESSAGES.SHARE_TEXT.replace("{url}", url)
      : CONFIG.MESSAGES.SHARE_TEXT + url;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 relative">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 right-6 p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="flex-1 flex flex-col pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-medium tracking-tight mb-6">Refer Agents</h1>

          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            Your network can get you started with Rivo. <br />
            <span className="text-white">They close deals, you get paid.</span>
          </p>

          {/* Timeline Visualization */}
          <div className="relative pl-4 space-y-12">
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-zinc-800" />

            {CONFIG.REFERRAL_BONUS.AMOUNTS.map((amount, i) => {
              const isLast = i === CONFIG.REFERRAL_BONUS.AMOUNTS.length - 1;
              return (
                <div key={i} className="relative flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 border-black z-10 mr-6 ${isLast ? 'bg-rivo-green shadow-[0_0_10px_rgba(0,208,132,0.5)]' : 'bg-zinc-800'}`} />
                  <div className="flex-1 flex justify-between items-baseline">
                    <span className={`text-lg font-medium ${isLast ? 'text-white' : 'text-gray-400'}`}>{ordinal(i + 1)} Deal</span>
                    <span className={`text-2xl font-medium ${isLast ? 'text-rivo-green' : 'text-white'}`}>AED {amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-900">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 uppercase tracking-wider font-medium">Total Potential</span>
              <span className="text-3xl font-medium text-white tracking-tight">AED {CONFIG.REFERRAL_BONUS.TOTAL_POTENTIAL.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-auto pt-8 space-y-4">
        <Button
          className="w-full h-14 text-lg font-medium bg-white text-black hover:bg-gray-200 rounded-lg"
          onClick={handleShare}
        >
          <svg className="w-5 h-5 mr-2 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Share link via WhatsApp
        </Button>

        <button
          onClick={() => navigate("/home")}
          className="w-full py-4 text-sm font-medium text-gray-500 hover:text-white transition-colors"
        >
          Skip for now
        </button>

        <div className="mt-2 pt-4 border-t border-zinc-800/50">
          <Link to="/referral-info" className="text-sm font-medium text-rivo-green hover:text-rivo-green/80 transition-colors flex items-center justify-center">
            Know more about the referral program
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
