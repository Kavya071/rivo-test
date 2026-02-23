import { getConfig } from "./lib/api";

// Default config — overridden by backend on load
export let CONFIG = {
  COMMISSION: {
    MIN_PERCENT: 0.45,
    MAX_PERCENT: 0.60,
    AVG_PAYOUT: 9000,
    ESTIMATED_RANGE: {
      MIN: 8100,
      MAX: 10800,
    },
  },
  REFERRAL_BONUS: {
    FIRST_DEAL: 500,
    SECOND_DEAL: 500,
    THIRD_DEAL: 1000,
    TOTAL_POTENTIAL: 2000,
  },
  LINKS: {
    WHATSAPP_PERSONAL: "https://wa.me/971545079577",
    WHATSAPP_BUSINESS: "https://wa.me/971545079577",
    RIVO_JOIN: "https://partner.rivo.ae/join",
  },
  MESSAGES: {
    SHARE_TEXT: "Hey, I'm using Rivo to earn mortgage commissions. Join: ",
    LEAD_SUBMIT_CONFIRM: "We'll contact them within 30 minutes.",
  },
};

export async function loadConfig() {
  try {
    const data = await getConfig();
    CONFIG = {
      COMMISSION: {
        MIN_PERCENT: data.commission_min_percent ?? 0.45,
        MAX_PERCENT: data.commission_max_percent ?? 0.60,
        AVG_PAYOUT: data.avg_payout ?? 9000,
        ESTIMATED_RANGE: {
          MIN: Math.round((data.avg_payout ?? 9000) * 0.9),
          MAX: Math.round((data.avg_payout ?? 9000) * 1.2),
        },
      },
      REFERRAL_BONUS: {
        FIRST_DEAL: data.referrer_bonuses?.[0] ?? 500,
        SECOND_DEAL: data.referrer_bonuses?.[1] ?? 500,
        THIRD_DEAL: data.referrer_bonuses?.[2] ?? 1000,
        TOTAL_POTENTIAL: (data.referrer_bonuses || [500, 500, 1000]).reduce((a: number, b: number) => a + b, 0),
      },
      LINKS: {
        WHATSAPP_PERSONAL: data.whatsapp_personal ?? "https://wa.me/971545079577",
        WHATSAPP_BUSINESS: data.whatsapp_business ?? "https://wa.me/971545079577",
        RIVO_JOIN: data.rivo_join_url ?? "https://partner.rivo.ae/join",
      },
      MESSAGES: {
        SHARE_TEXT: data.referral_share_msg ?? "Hey, I'm using Rivo to earn mortgage commissions. Join: ",
        LEAD_SUBMIT_CONFIRM: "We'll contact them within 30 minutes.",
      },
    };
    return CONFIG;
  } catch {
    return CONFIG;
  }
}
