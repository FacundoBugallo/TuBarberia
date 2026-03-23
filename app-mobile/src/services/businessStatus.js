function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getBusinessStatus(business, referenceDate = new Date()) {
  if (business?.is_active === false) {
    return "expired";
  }

  const subscriptionEndsAt = toDate(business?.subscription_ends_at);
  if (subscriptionEndsAt && subscriptionEndsAt >= referenceDate) {
    return "active";
  }

  const trialEndsAt = toDate(business?.trial_ends_at);
  if (trialEndsAt && trialEndsAt >= referenceDate) {
    return "trial";
  }

  return "expired";
}
