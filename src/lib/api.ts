const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api/v1';

function getToken(): string | null {
  const stored = localStorage.getItem('rivo_token');
  return stored;
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw { status: res.status, ...error };
  }

  return res.json();
}

// Auth
export function initWhatsApp(referralCode = '', isWhatsappBusiness = false) {
  return request('/agents/init-whatsapp/', {
    method: 'POST',
    body: JSON.stringify({ referral_code: referralCode, is_whatsapp_business: isWhatsappBusiness }),
  });
}

export function checkVerification(code: string) {
  return request(`/agents/check-verification/${code}/`);
}

export function resolveReferralCode(code: string) {
  return request(`/agents/referral/${code}/`);
}

// Agent
export function getMe() {
  return request('/agents/me/');
}

export function updateProfile(data: Record<string, string>) {
  return request('/agents/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function getNetwork() {
  return request('/agents/network/');
}

export function logoutAgent() {
  return request('/agents/logout/', { method: 'POST' });
}

export function deleteAccount() {
  return request('/agents/delete/', { method: 'DELETE' });
}

// Clients
export function submitClient(data: {
  client_name: string;
  client_phone: string;
  expected_mortgage_amount: number;
  consent: boolean;
}) {
  return request('/clients/ingest/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function listClients(search = '', status = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status && status !== 'All') params.set('status', status.toUpperCase());
  return request(`/clients/?${params.toString()}`);
}

// Config
export function getConfig() {
  return request('/config/');
}

// Bonuses
export function getMyBonuses() {
  return request('/referrals/bonuses/');
}
