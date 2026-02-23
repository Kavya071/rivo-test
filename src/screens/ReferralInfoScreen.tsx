import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Users, Zap, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function ReferralInfoScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <div className="bg-black px-6 pt-12 pb-6 border-b border-zinc-800 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-medium text-white">How Referrals Work</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-medium text-white mb-4">Grow your network,<br />multiply your earnings.</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Our referral program is designed to reward you for bringing high-quality agents into the Rivo ecosystem.
          </p>

          <div className="space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-rivo-green/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-rivo-green" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">1. Invite Agents</h3>
              <p className="text-gray-400 leading-relaxed">
                Share your unique referral link with other real estate agents. When they sign up using your link, they are automatically tagged to your network.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">2. They Close Deals</h3>
              <p className="text-gray-400 leading-relaxed">
                Once your referred agents start submitting mortgage leads, our team processes them. You can track their progress in your Network tab.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">3. Earn Bonuses</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                You earn a bonus for each of the first 3 successful disbursals from every agent you refer.
              </p>
              
              <div className="space-y-3 bg-black/50 rounded-lg p-4 border border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">1st Deal</span>
                  <span className="text-white font-medium">AED 500 Bonus</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">2nd Deal</span>
                  <span className="text-white font-medium">AED 500 Bonus</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">3rd Deal</span>
                  <span className="text-white font-medium">AED 1,000 Bonus</span>
                </div>
                <div className="pt-2 mt-2 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-rivo-green text-sm font-medium">Total Potential</span>
                  <span className="text-rivo-green font-bold">AED 2,000 per Agent</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black border-t border-zinc-800 z-20">
        <div className="max-w-3xl mx-auto w-full">
          <Button 
            variant="whatsapp"
            className="w-full h-14 text-lg font-bold"
            onClick={() => {}}
          >
            <svg className="w-7 h-7 mr-2 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Refer now
          </Button>
        </div>
      </div>
    </div>
  );
}
