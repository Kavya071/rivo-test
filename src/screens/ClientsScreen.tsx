import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listClients } from "@/lib/api";

interface ClientItem {
  id: string;
  client_name: string;
  client_phone: string;
  expected_mortgage_amount: string;
  estimated_commission: string;
  commission_amount: string | null;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  DISBURSED: "text-rivo-green",
  APPROVED: "text-blue-500",
  QUALIFIED: "text-yellow-500",
  CONTACTED: "text-purple-400",
  SUBMITTED: "text-gray-400",
};

const STATUS_OPTIONS = ["All", "Submitted", "Contacted", "Qualified", "Approved", "Disbursed"];

export default function ClientsScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const fetchClients = async () => {
    try {
      const data = await listClients(search, statusFilter);
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchClients(), 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-AE", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <div className="bg-black px-6 pt-12 pb-4 sticky top-0 z-10 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medium tracking-tight text-white">Your Clients</h1>
          <button
            onClick={() => navigate("/refer-client")}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full h-12 pl-10 pr-4 rounded-lg bg-zinc-900 border-none text-white focus:ring-2 focus:ring-rivo-green focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${showFilter ? 'bg-rivo-green text-black' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {showFilter && (
          <div className="flex flex-wrap gap-2 mt-3 pb-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-rivo-green text-black"
                    : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-rivo-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients yet.</p>
          </div>
        ) : (
          clients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-black border-b border-zinc-800 pb-4 last:border-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg text-white">{client.client_name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(client.created_at)}</p>
                </div>
                <span className={`text-xs font-medium tracking-wide ${STATUS_COLORS[client.status] || "text-gray-400"}`}>
                  {client.status}
                </span>
              </div>

              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                  <p className="font-medium text-gray-300">AED {formatAmount(client.expected_mortgage_amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Est. Commission</p>
                  <p className="font-medium text-white text-lg">AED {formatAmount(client.commission_amount || client.estimated_commission)}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
