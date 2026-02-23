import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { updateProfile, deleteAccount } from "@/lib/api";

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [agentType, setAgentType] = useState(user?.agent_type || "");
  const [agentTypeOther, setAgentTypeOther] = useState(user?.agent_type_other || "");
  const [reraNumber, setReraNumber] = useState(user?.rera_number || "");
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await deleteAccount();
        await logout();
        navigate("/");
      } catch {
        alert("Failed to delete account.");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name,
        email,
        agent_type: agentType,
        agent_type_other: agentTypeOther,
        rera_number: reraNumber,
      });
      await refreshUser();
      alert("Profile updated!");
    } catch {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <div className="bg-black px-6 pt-12 pb-6 mb-6 border-b border-zinc-800">
        <h1 className="text-3xl font-medium text-white mb-6 tracking-tight">Profile</h1>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">{user?.name || "Set your name"}</h2>
            <p className="text-gray-400">{user?.phone}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-rivo-green/10 text-rivo-green text-xs font-medium rounded-full">
              Verified Partner
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        <div className="space-y-6">
          <h3 className="font-medium text-white text-lg">Personal Details</h3>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white"
            />

            <div>
              <label className="text-sm font-medium text-gray-400 ml-1 mb-2 block">Agent Type</label>
              <div className="relative">
                <select
                  value={agentType}
                  onChange={(e) => setAgentType(e.target.value)}
                  className="w-full h-14 px-4 rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-rivo-green outline-none transition-all appearance-none"
                >
                  <option value="">Select type</option>
                  <option value="RE_BROKER">Real Estate Broker</option>
                  <option value="MORTGAGE_BROKER">Mortgage Broker</option>
                  <option value="OTHER">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {agentType === "OTHER" && (
              <Input
                label="What do you do?"
                value={agentTypeOther}
                onChange={(e) => setAgentTypeOther(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            )}

            {agentType === "RE_BROKER" && (
              <Input
                label="RERA Number"
                placeholder="BRN-XXXXX"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-medium text-white text-lg">Connect Accounts</h3>

          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white h-12"
                />
              </div>
            </div>

            <Button
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium"
              onClick={handleSave}
              isLoading={saving}
            >
              Save Profile
            </Button>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-zinc-800">
          <Button
            variant="secondary"
            className="w-full bg-zinc-900 border border-zinc-800 text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>

          <Button
            variant="ghost"
            className="w-full text-gray-500 hover:text-red-500 text-sm"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
