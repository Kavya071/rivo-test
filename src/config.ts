import { getConfig } from "./lib/api";

const DEFAULTS = {
  commission_min_percent: 0.45,
  commission_max_percent: 0.60,
  avg_payout: 9000,
  referrer_bonuses: [500, 500, 1000] as number[],
  whatsapp_personal: "https://wa.me/971545079577",
  whatsapp_business: "https://wa.me/971545079577",
  referral_share_msg: "Hey, I'm using Rivo to earn mortgage commissions. Join: ",
};

export interface HomeBanner {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  thumbnail: string;
  cta_text: string;
  cta_link: string;
  order: number;
}

function buildConfig(data: Record<string, any> = {}) {
  const min = data.commission_min_percent ?? DEFAULTS.commission_min_percent;
  const max = data.commission_max_percent ?? DEFAULTS.commission_max_percent;
  const avg = data.avg_payout ?? DEFAULTS.avg_payout;
  const bonuses = data.referrer_bonuses ?? DEFAULTS.referrer_bonuses;

  return {
    COMMISSION: {
      MIN_PERCENT: min,
      MAX_PERCENT: max,
      AVG_PAYOUT: avg,
      ESTIMATED_RANGE: {
        MIN: Math.round(avg * 0.9),
        MAX: Math.round(avg * 1.2),
      },
    },
    REFERRAL_BONUS: {
      FIRST_DEAL: bonuses[0],
      SECOND_DEAL: bonuses[1],
      THIRD_DEAL: bonuses[2],
      TOTAL_POTENTIAL: bonuses.reduce((a: number, b: number) => a + b, 0),
    },
    LINKS: {
      WHATSAPP_PERSONAL: data.whatsapp_personal ?? DEFAULTS.whatsapp_personal,
      WHATSAPP_BUSINESS: data.whatsapp_business ?? DEFAULTS.whatsapp_business,
    },
    MESSAGES: {
      SHARE_TEXT: data.referral_share_msg ?? DEFAULTS.referral_share_msg,
    },
    HOME_BANNERS: (data.home_banners || []) as HomeBanner[],
  };
}

export let CONFIG = buildConfig();

export async function loadConfig() {
  try {
    const data = await getConfig();
    CONFIG = buildConfig(data);
    return CONFIG;
  } catch {
    return CONFIG;
  }
}
