import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  Trash2, 
  User, 
  Wallet, 
  Building2, 
  BarChart3,
  MessageCircle,
  TrendingUp,
  Percent,
  Home,
  Calculator
} from "lucide-react";

type ResidencyStatus = "uae_national" | "resident" | "non_resident";
type EmploymentType = "salaried" | "self_employed";
type PropertyType = "ready" | "off_plan";
type PropertyLocation = "dubai" | "abu_dhabi" | "other";
type ObligationType = "car_loan" | "credit_card" | "personal_loan";

interface Obligation {
  id: string;
  type: ObligationType;
  amount: number;
}

interface FormData {
  name: string;
  residencyStatus: ResidencyStatus;
  employmentType: EmploymentType;
  monthlySalary: string;
  obligations: Obligation[];
  existingMortgage: string;
  dependents: number;
  propertyValue: string;
  propertyType: PropertyType;
  propertyLocation: PropertyLocation;
  firstTimeBuyer: boolean;
}

const initialFormData: FormData = {
  name: "",
  residencyStatus: "resident",
  employmentType: "salaried",
  monthlySalary: "",
  obligations: [],
  existingMortgage: "",
  dependents: 0,
  propertyValue: "",
  propertyType: "ready",
  propertyLocation: "dubai",
  firstTimeBuyer: true,
};

const BANKS = [
  { name: "Emirates NBD", baseScore: 85 },
  { name: "ADCB", baseScore: 82 },
  { name: "Mashreq", baseScore: 80 },
  { name: "FAB", baseScore: 78 },
  { name: "DIB", baseScore: 75 },
];

function formatAED(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString();
}

function parseAED(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, "")) || 0;
}

function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
         (Math.pow(1 + monthlyRate, tenureMonths) - 1);
}

function calculateMaxLoanFromEMI(maxEMI: number, annualRate: number, tenureYears: number): number {
  if (maxEMI <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  return (maxEMI * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) / 
         (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
}

export default function EligibilityCheckScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const steps = [
    { num: 1, label: "Personal", icon: User },
    { num: 2, label: "Financial", icon: Wallet },
    { num: 3, label: "Property", icon: Building2 },
    { num: 4, label: "Results", icon: BarChart3 },
  ];

  const results = useMemo(() => {
    const salary = parseAED(formData.monthlySalary);
    const propertyValue = parseAED(formData.propertyValue);
    const existingMortgage = parseAED(formData.existingMortgage);
    const totalObligations = formData.obligations.reduce((sum, o) => sum + o.amount, 0);

    let ltvPercent = 80;
    if (formData.propertyType === "off_plan") {
      ltvPercent = 50;
    } else {
      if (formData.residencyStatus === "uae_national") ltvPercent = formData.firstTimeBuyer ? 85 : 80;
      else if (formData.residencyStatus === "resident") ltvPercent = formData.firstTimeBuyer ? 80 : 75;
      else ltvPercent = 65;
    }

    const maxLoanLTV = propertyValue * (ltvPercent / 100);
    const maxEMIAllowed = (salary * 0.5) - totalObligations - existingMortgage;
    const maxLoanDBR = calculateMaxLoanFromEMI(Math.max(0, maxEMIAllowed), 4.5, 25);
    const maxLoanAmount = Math.min(maxLoanLTV, maxLoanDBR);
    const estimatedEMI = calculateEMI(maxLoanAmount, 4.5, 25);
    const totalMonthlyDebt = totalObligations + existingMortgage + estimatedEMI;
    const dbr = salary > 0 ? (totalMonthlyDebt / salary) * 100 : 0;

    let score = Math.max(0, 100 - (dbr * 1.2));
    if (formData.residencyStatus === "uae_national") score += 10;
    if (formData.residencyStatus === "non_resident") score -= 10;
    if (formData.firstTimeBuyer) score += 5;
    if (formData.propertyType === "ready") score += 5;
    if (formData.employmentType === "self_employed") score -= 5;
    if (formData.dependents > 3) score -= (formData.dependents - 3) * 2;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const bankMatches = BANKS.map(bank => ({
      name: bank.name,
      matchPercent: Math.max(0, Math.min(100, Math.round(bank.baseScore * (score / 100) + Math.random() * 5)))
    })).sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 3);

    return {
      score,
      maxLoanAmount: Math.round(maxLoanAmount),
      estimatedEMI: Math.round(estimatedEMI),
      dbr: Math.round(dbr),
      ltvPercent,
      bankMatches,
      salary,
      totalObligations: totalObligations + existingMortgage,
      availableForEMI: Math.max(0, maxEMIAllowed),
    };
  }, [formData]);

  const canProceed = useMemo(() => {
    if (currentStep === 1) return formData.name.trim() && parseAED(formData.monthlySalary) > 0;
    if (currentStep === 2) return true;
    if (currentStep === 3) return parseAED(formData.propertyValue) > 0;
    return false;
  }, [currentStep, formData]);

  const handleNext = () => {
    if (currentStep < 4 && canProceed) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addObligation = () => {
    setFormData({
      ...formData,
      obligations: [...formData.obligations, { id: Date.now().toString(), type: "car_loan", amount: 0 }]
    });
  };

  const removeObligation = (id: string) => {
    setFormData({ ...formData, obligations: formData.obligations.filter(o => o.id !== id) });
  };

  const updateObligation = (id: string, field: "type" | "amount", value: ObligationType | number) => {
    setFormData({
      ...formData,
      obligations: formData.obligations.map(o => o.id === id ? { ...o, [field]: value } : o)
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 71) return "#00D084";
    if (score >= 41) return "#F59E0B";
    return "#EF4444";
  };

  const getDBRStatus = (dbr: number) => {
    if (dbr < 50) return { color: "text-rivo-green", bg: "bg-rivo-green/20", label: "Healthy" };
    if (dbr < 65) return { color: "text-amber-400", bg: "bg-amber-400/20", label: "Moderate" };
    return { color: "text-red-400", bg: "bg-red-400/20", label: "High Risk" };
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm px-4 pt-8 pb-4 sticky top-0 z-20 border-b border-zinc-800/50">
        <div className="flex items-center justify-between mb-6">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          ) : <div className="w-10" />}
          <h1 className="text-lg font-medium text-white">Eligibility Check</h1>
          <div className="w-10" />
        </div>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep > step.num ? "bg-rivo-green text-black" :
                    currentStep === step.num ? "bg-rivo-green text-black" : "bg-zinc-800 text-zinc-500"
                  }`}
                  animate={{ scale: currentStep === step.num ? 1.1 : 1 }}
                >
                  {currentStep > step.num ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </motion.div>
                <span className={`text-xs mt-2 ${currentStep >= step.num ? "text-white" : "text-zinc-500"}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mt-[-20px]">
                  <div className={`h-full transition-all duration-300 ${currentStep > step.num ? "bg-rivo-green" : "bg-zinc-800"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-white">Personal Details</h2>
                <p className="text-zinc-400">Tell us about yourself</p>
              </div>
              <div className="space-y-5">
                <Input label="Full Name" placeholder="e.g., Ahmed Al-Mansoor" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">Residency Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([{ value: "uae_national", label: "UAE National" }, { value: "resident", label: "Resident" }, { value: "non_resident", label: "Non-Resident" }] as const).map((opt) => (
                      <button key={opt.value} onClick={() => setFormData({ ...formData, residencyStatus: opt.value })}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${formData.residencyStatus === opt.value ? "bg-rivo-green text-black" : "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 text-zinc-300 hover:bg-zinc-800"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">Employment Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([{ value: "salaried", label: "Salaried" }, { value: "self_employed", label: "Self-Employed" }] as const).map((opt) => (
                      <button key={opt.value} onClick={() => setFormData({ ...formData, employmentType: opt.value })}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.employmentType === opt.value ? "bg-rivo-green text-black" : "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 text-zinc-300 hover:bg-zinc-800"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">Monthly Salary (AED)</label>
                  <Input type="text" inputMode="numeric" placeholder="e.g., 25,000" value={formData.monthlySalary} onChange={(e) => setFormData({ ...formData, monthlySalary: formatAED(e.target.value) })} />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-white">Financial Details</h2>
                <p className="text-zinc-400">Your existing commitments</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-400">Monthly Obligations</label>
                    <button onClick={addObligation} className="flex items-center space-x-1 text-rivo-green text-sm font-medium hover:opacity-80 transition-opacity">
                      <Plus className="w-4 h-4" /><span>Add</span>
                    </button>
                  </div>
                  <AnimatePresence>
                    {formData.obligations.map((obligation) => (
                      <motion.div key={obligation.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="flex items-center space-x-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-3">
                        <select value={obligation.type} onChange={(e) => updateObligation(obligation.id, "type", e.target.value as ObligationType)}
                          className="flex-1 bg-zinc-800 border-none rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-rivo-green">
                          <option value="car_loan">Car Loan</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="personal_loan">Personal Loan</option>
                        </select>
                        <input type="text" inputMode="numeric" placeholder="Amount" value={obligation.amount || ""}
                          onChange={(e) => updateObligation(obligation.id, "amount", parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                          className="w-28 bg-zinc-800 border-none rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-rivo-green" />
                        <button onClick={() => removeObligation(obligation.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {formData.obligations.length === 0 && <p className="text-sm text-zinc-500 text-center py-4">No obligations added</p>}
                </div>
                <Input label="Existing Mortgage Payment (AED/month)" type="text" inputMode="numeric" placeholder="e.g., 5,000" value={formData.existingMortgage} onChange={(e) => setFormData({ ...formData, existingMortgage: formatAED(e.target.value) })} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">Number of Dependents</label>
                  <div className="flex items-center justify-center space-x-6 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
                    <button onClick={() => setFormData({ ...formData, dependents: Math.max(0, formData.dependents - 1) })} className="w-12 h-12 rounded-full bg-zinc-800 text-white text-xl font-medium hover:bg-zinc-700 transition-colors">-</button>
                    <span className="text-3xl font-medium text-white w-12 text-center">{formData.dependents}</span>
                    <button onClick={() => setFormData({ ...formData, dependents: Math.min(10, formData.dependents + 1) })} className="w-12 h-12 rounded-full bg-zinc-800 text-white text-xl font-medium hover:bg-zinc-700 transition-colors">+</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-white">Property Details</h2>
                <p className="text-zinc-400">Tell us about the property</p>
              </div>
              <div className="space-y-5">
                <Input label="Property Value (AED)" type="text" inputMode="numeric" placeholder="e.g., 1,500,000" value={formData.propertyValue} onChange={(e) => setFormData({ ...formData, propertyValue: formatAED(e.target.value) })} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">Property Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([{ value: "ready", label: "Ready" }, { value: "off_plan", label: "Off-Plan" }] as const).map((opt) => (
                      <button key={opt.value} onClick={() => setFormData({ ...formData, propertyType: opt.value })}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.propertyType === opt.value ? "bg-rivo-green text-black" : "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 text-zinc-300 hover:bg-zinc-800"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">Property Location</label>
                  <select value={formData.propertyLocation} onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value as PropertyLocation })}
                    className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-white outline-none focus:ring-2 focus:ring-rivo-green">
                    <option value="dubai">Dubai</option>
                    <option value="abu_dhabi">Abu Dhabi</option>
                    <option value="other">Other Emirates</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">First-Time Buyer?</label>
                  <button onClick={() => setFormData({ ...formData, firstTimeBuyer: !formData.firstTimeBuyer })}
                    className={`w-full py-4 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${formData.firstTimeBuyer ? "bg-rivo-green/20 border border-rivo-green/50 text-rivo-green" : "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 text-zinc-300"}`}>
                    <span>This is my first property purchase in UAE</span>
                    <div className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.firstTimeBuyer ? "bg-rivo-green" : "bg-zinc-700"}`}>
                      <motion.div className="w-5 h-5 rounded-full bg-white" animate={{ x: formData.firstTimeBuyer ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="p-6 space-y-6 pb-32">
              {/* Score */}
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 flex flex-col items-center">
                <p className="text-zinc-400 text-sm mb-4">Eligibility Score</p>
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#27272A" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(results.score)} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${results.score * 2.83} 283`} initial={{ strokeDasharray: "0 283" }} animate={{ strokeDasharray: `${results.score * 2.83} 283` }} transition={{ duration: 1.5, ease: "easeOut" }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span className="text-5xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{results.score}</motion.span>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm mt-2">out of 100</p>
              </motion.div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2"><Calculator className="w-4 h-4 text-rivo-green" /><span className="text-xs text-zinc-500">Max Loan</span></div>
                  <p className="text-xl font-bold text-white">AED {results.maxLoanAmount.toLocaleString()}</p>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2"><TrendingUp className="w-4 h-4 text-blue-400" /><span className="text-xs text-zinc-500">Monthly EMI</span></div>
                  <p className="text-xl font-bold text-white">AED {results.estimatedEMI.toLocaleString()}</p>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2"><Percent className="w-4 h-4 text-amber-400" /><span className="text-xs text-zinc-500">DBR Ratio</span></div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold text-white">{results.dbr}%</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDBRStatus(results.dbr).bg} ${getDBRStatus(results.dbr).color}`}>{getDBRStatus(results.dbr).label}</span>
                  </div>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2"><Home className="w-4 h-4 text-purple-400" /><span className="text-xs text-zinc-500">LTV Ratio</span></div>
                  <p className="text-xl font-bold text-white">{results.ltvPercent}%</p>
                </motion.div>
              </div>

              {/* Banks */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-white mb-4">Recommended Banks</h3>
                <div className="space-y-4">
                  {results.bankMatches.map((bank, index) => (
                    <div key={bank.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{bank.name}</span>
                        <span className="text-sm text-rivo-green font-medium">{bank.matchPercent}% match</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-rivo-green rounded-full" initial={{ width: 0 }} animate={{ width: `${bank.matchPercent}%` }} transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Affordability */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-white mb-4">Affordability Breakdown</h3>
                <div className="space-y-4">
                  <div className="h-8 bg-zinc-800 rounded-lg overflow-hidden flex">
                    <motion.div className="bg-rivo-green h-full" initial={{ width: 0 }} animate={{ width: `${results.salary > 0 ? (results.availableForEMI / results.salary) * 100 : 0}%` }} transition={{ delay: 1, duration: 0.5 }} />
                    <motion.div className="bg-red-500 h-full" initial={{ width: 0 }} animate={{ width: `${results.salary > 0 ? (results.totalObligations / results.salary) * 100 : 0}%` }} transition={{ delay: 1.1, duration: 0.5 }} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-rivo-green" /><span className="text-zinc-400">Available: AED {Math.round(results.availableForEMI).toLocaleString()}</span></div>
                    <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="text-zinc-400">Obligations: AED {results.totalObligations.toLocaleString()}</span></div>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }} className="space-y-3">
                <Button variant="primary" size="full" className="h-14">
                  <MessageCircle className="w-5 h-5 mr-2" />Talk to an Advisor
                </Button>
                <p className="text-center text-sm text-zinc-500">Get personalized guidance for your mortgage</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-zinc-800/50 p-4 z-10">
          <Button variant="primary" size="full" onClick={handleNext} disabled={!canProceed} className="h-14">
            <span>Continue</span><ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
