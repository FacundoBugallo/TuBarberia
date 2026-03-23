export type BusinessPlan = "trial" | "active" | "expired";

export type BusinessWithSubscription = {
  trial_ends_at?: string | null;
  subscription_ends_at?: string | null;
  is_active?: boolean;
};

const toDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function getBusinessStatus(
  business: BusinessWithSubscription,
  referenceDate: Date = new Date(),
): BusinessPlan {
  if (business.is_active === false) {
    return "expired";
  }

  const subscriptionEndsAt = toDate(business.subscription_ends_at);
  if (subscriptionEndsAt && subscriptionEndsAt >= referenceDate) {
    return "active";
  }

  const trialEndsAt = toDate(business.trial_ends_at);
  if (trialEndsAt && trialEndsAt >= referenceDate) {
    return "trial";
  }

  return "expired";
}
