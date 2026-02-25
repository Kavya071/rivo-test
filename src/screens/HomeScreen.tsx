import { CONFIG, loadConfig, HomeBanner } from "@/config";
import { useAuth } from "@/lib/auth";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState<HomeBanner[]>([]);

  useEffect(() => {
    loadConfig().then((cfg) => {
      setBanners(cfg.HOME_BANNERS);
    });
    refreshUser();
  }, []);

  const totalEarned = parseFloat(user?.total_earned || "0");
  const pending = parseFloat(user?.pending_amount || "0");
  const disbursals = user?.disbursed_count || 0;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="bg-black px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium text-lg">
              {(user?.name || user?.phone || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-medium text-white leading-tight">
                {user?.name ? user.name.split(" ")[0] : user?.phone}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-rivo-green" />
                <span className="text-xs text-gray-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Display */}
        <div className="mb-2">
          <p className="text-sm text-gray-400 font-medium mb-1">Total Paid</p>
          <h2 className="text-5xl font-medium tracking-tight text-white">AED {totalEarned.toLocaleString()}</h2>
        </div>

        <div className="flex space-x-8 mt-6">
          <div>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Pending</p>
            <p className="text-lg font-medium text-white">AED {pending.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Disbursals</p>
            <p className="text-lg font-medium text-white">{disbursals}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-5xl mx-auto w-full">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg text-white">Actions</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/refer-client")}
              className="w-full bg-zinc-900 p-4 rounded-lg flex items-center justify-between group hover:bg-zinc-800 transition-colors h-full"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-medium text-white text-base truncate">Submit Client</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-sm text-gray-400 whitespace-nowrap">Earn ~AED {CONFIG.COMMISSION.AVG_PAYOUT.toLocaleString()}</p>
                    <div className="px-2 py-0.5 rounded-full border border-rivo-green/50 bg-black flex items-center shadow-[0_0_8px_rgba(0,208,132,0.2)] whitespace-nowrap">
                      <span className="text-[10px] font-bold text-rivo-green tracking-wide">{CONFIG.COMMISSION.MIN_PERCENT}% - {CONFIG.COMMISSION.MAX_PERCENT}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/network")}
              className="w-full bg-zinc-900 p-4 rounded-lg flex items-center justify-between group hover:bg-zinc-800 transition-colors h-full"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-rivo-green text-black flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white text-base">Invite Agent</h3>
                  <p className="text-sm text-gray-400">Get AED {CONFIG.REFERRAL_BONUS.TOTAL_POTENTIAL.toLocaleString()} Bonus</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Home Banners */}
        {banners.length > 0 && (
          <div className="space-y-4">
            {banners.map((banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
              >
                {banner.thumbnail && (
                  <img src={banner.thumbnail} alt="" className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {banner.icon && (
                      <span className="text-2xl flex-shrink-0">{banner.icon}</span>
                    )}
                    <div className="flex-1">
                  <h3 className="font-medium text-white text-base">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-400 mt-1">{banner.subtitle}</p>
                  )}
                  {banner.cta_text && banner.cta_link && (
                    banner.cta_link.startsWith("/") ? (
                      <button
                        onClick={() => navigate(banner.cta_link)}
                        className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-rivo-green hover:underline"
                      >
                        {banner.cta_text}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <a
                        href={banner.cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-rivo-green hover:underline"
                      >
                        {banner.cta_text}
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    )
                  )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Complete Profile Banner */}
        {!user?.is_profile_complete && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/profile")}
            className="w-full border border-zinc-800 rounded-lg p-4 flex justify-between items-center bg-zinc-900/50"
          >
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Complete your profile</h3>
              <p className="text-xs text-gray-400">Add your name, type, and email.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
