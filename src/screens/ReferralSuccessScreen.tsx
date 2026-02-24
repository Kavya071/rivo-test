import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Briefcase, Check, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function ReferralSuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 items-center justify-center text-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-rivo-green rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,208,132,0.3)]"
        >
          <Check className="w-10 h-10 text-black" strokeWidth={4} />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-medium text-white mb-4 tracking-tight"
        >
          Referral Submitted
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-400 text-lg mb-12 leading-relaxed"
        >
          We've received your referral details.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full space-y-4"
        >
          {/* WhatsApp Update Info */}
          <div className="flex items-center p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-4 flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Updates via WhatsApp</p>
              <p className="text-sm text-gray-500">You'll receive status changes instantly.</p>
            </div>
          </div>

          {/* Clients Tab Info */}
          <div className="flex items-center p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-4 flex-shrink-0">
              <Briefcase className="w-5 h-5 text-rivo-green animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Track in Clients</p>
              <p className="text-sm text-gray-500">View progress in your dashboard.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full pt-6 pb-6"
      >
        <Button 
          className="w-full h-14 text-lg font-medium rounded-lg bg-white text-black hover:bg-zinc-200"
          onClick={() => navigate("/home")}
        >
          Done
        </Button>
      </motion.div>
    </div>
  );
}
