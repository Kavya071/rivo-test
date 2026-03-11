import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calculator, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return principal / tenureMonths;
  
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
}

function generateAmortizationSchedule(
  principal: number, 
  annualRate: number, 
  tenureMonths: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  let balance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPart = balance * monthlyRate;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    
    schedule.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalPart),
      interest: Math.round(interestPart),
      balance: Math.round(balance),
    });
  }

  return schedule;
}

export default function MortgageCalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [showResults, setShowResults] = useState(false);

  const principal = parseFloat(loanAmount) || 0;
  const rate = parseFloat(interestRate) || 0;
  const months = parseInt(tenure) || 0;

  const results = useMemo(() => {
    if (principal <= 0 || months <= 0) return null;

    const emi = calculateEMI(principal, rate, months);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    const schedule = generateAmortizationSchedule(principal, rate, months);

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      schedule,
    };
  }, [principal, rate, months]);

  const handleCalculate = () => {
    if (principal > 0 && months > 0) {
      setShowResults(true);
    }
  };

  const maxBalance = principal;
  const chartHeight = 200;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="bg-black px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-zinc-800">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-rivo-green text-black flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-white">Mortgage Calculator</h1>
            <p className="text-sm text-gray-400">Calculate your monthly EMI</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 space-y-5"
        >
          <Input
            label="Loan Amount (AED)"
            type="number"
            placeholder="e.g., 500000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
          <Input
            label="Interest Rate (% per annum)"
            type="number"
            step="0.1"
            placeholder="e.g., 4.5"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <Input
            label="Tenure (months)"
            type="number"
            placeholder="e.g., 240"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
          <Button
            variant="primary"
            size="full"
            onClick={handleCalculate}
            disabled={principal <= 0 || months <= 0}
          >
            Calculate EMI
          </Button>
        </motion.div>

        {/* Results Section */}
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-rivo-green/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-rivo-green" />
                  </div>
                  <span className="text-sm text-gray-400">Monthly EMI</span>
                </div>
                <p className="text-3xl font-medium text-white">
                  AED {results.emi.toLocaleString()}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-sm text-gray-400">Total Interest</span>
                </div>
                <p className="text-3xl font-medium text-white">
                  AED {results.totalInterest.toLocaleString()}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-400">Total Payment</span>
                </div>
                <p className="text-3xl font-medium text-white">
                  AED {results.totalPayment.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Breakdown Chart */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="font-medium text-lg text-white mb-4">Payment Breakdown</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="h-4 rounded-full overflow-hidden bg-zinc-800 flex">
                    <div 
                      className="bg-rivo-green h-full transition-all duration-500"
                      style={{ width: `${(principal / results.totalPayment) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500 h-full transition-all duration-500"
                      style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rivo-green" />
                  <span className="text-gray-400">Principal ({((principal / results.totalPayment) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-400">Interest ({((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            {/* Amortization Chart */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="font-medium text-lg text-white mb-4">Amortization Chart</h3>
              <div className="relative" style={{ height: chartHeight }}>
                <svg 
                  className="w-full h-full" 
                  viewBox={`0 0 ${results.schedule.length} ${chartHeight}`}
                  preserveAspectRatio="none"
                >
                  {/* Balance line */}
                  <path
                    d={results.schedule.map((row, i) => {
                      const x = i;
                      const y = chartHeight - (row.balance / maxBalance) * (chartHeight - 20);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#00D084"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Interest area */}
                  <path
                    d={`M 0 ${chartHeight} ` + 
                       results.schedule.map((row, i) => {
                         const x = i;
                         const y = chartHeight - (row.interest / results.emi) * 60;
                         return `L ${x} ${y}`;
                       }).join(' ') +
                       ` L ${results.schedule.length - 1} ${chartHeight} Z`}
                    fill="rgba(239, 68, 68, 0.3)"
                  />
                  {/* Principal area */}
                  <path
                    d={`M 0 ${chartHeight} ` + 
                       results.schedule.map((row, i) => {
                         const x = i;
                         const y = chartHeight - (row.principal / results.emi) * 60;
                         return `L ${x} ${y}`;
                       }).join(' ') +
                       ` L ${results.schedule.length - 1} ${chartHeight} Z`}
                    fill="rgba(0, 208, 132, 0.3)"
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
                  <span>Month 1</span>
                  <span>Month {Math.floor(months / 2)}</span>
                  <span>Month {months}</span>
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rivo-green" />
                  <span className="text-gray-400">Outstanding Balance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rivo-green/30" />
                  <span className="text-gray-400">Principal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/30" />
                  <span className="text-gray-400">Interest</span>
                </div>
              </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="font-medium text-lg text-white">Amortization Schedule</h3>
                <p className="text-sm text-gray-400 mt-1">Monthly breakdown of your payments</p>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Month</th>
                      <th className="px-4 py-3 text-right text-gray-400 font-medium">EMI</th>
                      <th className="px-4 py-3 text-right text-gray-400 font-medium">Principal</th>
                      <th className="px-4 py-3 text-right text-gray-400 font-medium">Interest</th>
                      <th className="px-4 py-3 text-right text-gray-400 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                        <td className="px-4 py-3 text-white">{row.month}</td>
                        <td className="px-4 py-3 text-right text-white">AED {row.emi.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-rivo-green">AED {row.principal.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-red-400">AED {row.interest.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-gray-400">AED {row.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
