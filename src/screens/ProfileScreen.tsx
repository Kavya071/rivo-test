import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, User, ChevronDown, Pencil } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { updateProfile, deleteAccount, connectGoogle, connectOutlook } from "@/lib/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [agentType, setAgentType] = useState(user?.agent_type || "");
  const [agentTypeOther, setAgentTypeOther] = useState(user?.agent_type_other || "");
  const [reraNumber, setReraNumber] = useState(user?.rera_number || "");
  const [isEditing, setIsEditing] = useState(!user?.is_profile_complete);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);
  const [connectingOutlook, setConnectingOutlook] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
    } catch {
      toast("Failed to delete account.", "error");
      return;
    }
    // Always clear local state after successful delete
    localStorage.removeItem("rivo_token");
    localStorage.removeItem("rivo_user");
    localStorage.removeItem("rivo_referral_code");
    localStorage.removeItem("rivo_wa_type");
    localStorage.removeItem("rivo_verify_code");
    await logout();
    navigate("/");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setConnectingGoogle(true);
      try {
        // Get user info from Google using access token
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        if (profile.email) {
          setEmail(profile.email);
          await updateProfile({ email: profile.email });
          await refreshUser();
          toast("Google account connected!");
        }
      } catch {
        toast("Failed to connect Google.", "error");
      } finally {
        setConnectingGoogle(false);
      }
    },
    onError: () => {
      toast("Google sign-in cancelled.", "error");
    },
    scope: 'email profile',
  });

  const handleConnectOutlook = useCallback(() => {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID || '';
    if (!clientId) {
      toast("Outlook connect not configured.", "error");
      return;
    }
    const redirectUri = `${window.location.origin}/profile`;
    const scope = encodeURIComponent('openid email profile User.Read');
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_mode=query`;
    window.location.href = authUrl;
  }, []);

  // Handle Outlook OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      // Clean URL
      window.history.replaceState({}, '', '/profile');
      setConnectingOutlook(true);
      const redirectUri = `${window.location.origin}/profile`;
      connectOutlook(code, redirectUri)
        .then(async (data) => {
          setEmail(data.email || '');
          await refreshUser();
          toast("Outlook account connected!");
        })
        .catch(() => {
          toast("Failed to connect Outlook.", "error");
        })
        .finally(() => setConnectingOutlook(false));
    }
  }, []);

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
      setIsEditing(false);
      toast("Profile updated!");
    } catch {
      toast("Failed to update profile.", "error");
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
              readOnly={!isEditing}
              className={`bg-zinc-900 border-zinc-800 text-white ${!isEditing ? "opacity-70" : ""}`}
            />

            <div>
              <label className="text-sm font-medium text-gray-400 ml-1 mb-2 block">Agent Type</label>
              <div className="relative">
                <select
                  value={agentType}
                  onChange={(e) => setAgentType(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full h-14 px-4 rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-rivo-green outline-none transition-all appearance-none ${!isEditing ? "opacity-70" : ""}`}
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
                readOnly={!isEditing}
                className={`bg-zinc-900 border-zinc-800 text-white ${!isEditing ? "opacity-70" : ""}`}
              />
            )}

            {agentType === "RE_BROKER" && (
              <Input
                label="RERA Number"
                placeholder="BRN-XXXXX"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                readOnly={!isEditing}
                className={`bg-zinc-900 border-zinc-800 text-white ${!isEditing ? "opacity-70" : ""}`}
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-medium text-white text-lg">Connect Accounts</h3>

          <div className="space-y-4">
            {isEditing && !email && (
              <>
                <button
                  onClick={() => googleLogin()}
                  disabled={connectingGoogle}
                  className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm font-medium text-white">
                    {connectingGoogle ? "Connecting..." : "Continue with Google"}
                  </span>
                </button>

                <button
                  onClick={handleConnectOutlook}
                  disabled={connectingOutlook}
                  className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4h12l-6 9L6 4z" fill="#EB3C00"/>
                    <path d="M6 4l6 9-6 7h12l-6-7 6-9" fill="none"/>
                    <path d="M6 4l6 9 6-9" fill="#EB3C00"/>
                    <path d="M12 13l-6 7h12l-6-7z" fill="#FCB813"/>
                    <path d="M6 4v16l6-7-6-9z" fill="#087EBF"/>
                    <path d="M18 4v16l-6-7 6-9z" fill="#23A249"/>
                  </svg>
                  <span className="text-sm font-medium text-white">
                    {connectingOutlook ? "Connecting..." : "Continue with Outlook"}
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing}
              className={`bg-zinc-900 border-zinc-800 text-white h-12 ${!isEditing ? "opacity-70" : ""}`}
            />

            {isEditing ? (
              <Button
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium"
                onClick={handleSave}
                isLoading={saving}
              >
                Save Profile
              </Button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full h-12 bg-black border border-zinc-700 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors"
              >
                <Pencil className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Edit Profile</span>
              </button>
            )}
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

          {!showDeleteConfirm ? (
            <Button
              variant="ghost"
              className="w-full text-gray-500 hover:text-red-500 text-sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg space-y-3">
              <p className="text-sm text-red-400 text-center">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 text-gray-400 text-sm border border-zinc-800"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-red-500 text-sm border border-red-500/30 bg-red-500/10"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
