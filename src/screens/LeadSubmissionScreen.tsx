import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CONFIG, loadConfig } from "@/config";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import { submitClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

const COUNTRY_CODES = [
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+966", flag: "🇸🇦", label: "SA" },
  { code: "+968", flag: "🇴🇲", label: "OM" },
  { code: "+974", flag: "🇶🇦", label: "QA" },
  { code: "+973", flag: "🇧🇭", label: "BH" },
  { code: "+965", flag: "🇰🇼", label: "KW" },
  { code: "+92", flag: "🇵🇰", label: "PK" },
  { code: "+63", flag: "🇵🇭", label: "PH" },
];

export default function LeadSubmissionScreen() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
  });
  const [countryCode, setCountryCode] = useState("+971");
  const [commission, setCommission] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [, setConfigLoaded] = useState(false);
  useEffect(() => {
    loadConfig().then(() => setConfigLoaded(true));
  }, []);

  const calculateCommission = () => {
    const val = formData.amount.replace(/,/g, "");
    if (!val || isNaN(parseInt(val))) {
      setCommission("0");
      return;
    }
    setCommission(
      (parseInt(val) * (CONFIG.COMMISSION.MIN_PERCENT / 100)).toLocaleString()
    );
  };

  const validatePhone = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length < 7) return "Phone number is too short";
    if (digits.length > 15) return "Phone number is too long";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const phone = `${countryCode}${formData.phone.replace(/\s/g, "")}`;
      await submitClient({
        client_name: formData.name,
        client_phone: phone,
        expected_mortgage_amount: parseFloat(formData.amount.replace(/,/g, "")),
        consent: true,
      });
      await refreshUser();
      navigate("/referral-success");
    } catch (err: any) {
      if (err?.client_phone) {
        setError(err.client_phone[0]);
      } else if (err?.non_field_errors) {
        setError(err.non_field_errors[0]);
      } else {
        setError("Failed to submit client. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="bg-black px-6 pt-6 pb-4 z-10 sticky top-0 border-b border-zinc-800">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-medium text-white">New Client</h1>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div>
            <p className="text-sm font-medium text-gray-400">Estimated Commission</p>
            <p className="text-2xl font-medium text-rivo-green mt-1">AED {commission}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-500">{CONFIG.COMMISSION.MIN_PERCENT}% of loan</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 space-y-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-white">Client Details</h2>

            <Input
              label="Full Name"
              placeholder="e.g. Ahmed Al-Mansoor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-zinc-900 border-zinc-800 text-white"
            />

            <Input
              label="Expected Loan Amount (AED)"
              inputMode="numeric"
              placeholder="e.g. 1500000"
              value={formData.amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, amount: val });
              }}
              onBlur={calculateCommission}
              required
              className="bg-zinc-900 border-zinc-800 text-white"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-14 pl-3 pr-8 bg-zinc-900 rounded-lg border border-zinc-800 text-white font-medium appearance-none text-sm focus:ring-2 focus:ring-rivo-green outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <Input
                  type="tel"
                  placeholder="50 123 4567"
                  className="flex-1 bg-zinc-900 border-zinc-800 text-white"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9\s]/g, "");
                    setFormData({ ...formData, phone: val });
                    if (phoneError) setPhoneError("");
                  }}
                  onBlur={() => setPhoneError(validatePhone(formData.phone))}
                  required
                />
              </div>
              {phoneError && (
                <p className="text-sm text-red-400 ml-1">{phoneError}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-start space-x-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              We'll contact them within 30 minutes. By submitting, you confirm you have the client's consent to be contacted by Rivo.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-medium rounded-lg"
            isLoading={isSubmitting}
            disabled={!formData.name || !formData.phone || !formData.amount || !!phoneError}
          >
            Submit Client
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
