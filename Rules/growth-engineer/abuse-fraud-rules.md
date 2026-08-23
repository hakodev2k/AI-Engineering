# Abuse and Fraud Rules

## Purpose
Protect incentives and growth loops from exploitation that corrupts economics or customer trust.

## Scope
Referrals, credits, promotions, trials, coupons, invitations, rewards, and signup incentives.

## MUST
- Model likely abuse paths before launching economically valuable incentives.
- Define eligibility, limits, duplicate-account handling, reversal behavior, and suspicious-pattern monitoring.
- Separate fraud controls from ordinary product errors so legitimate users have recovery paths.

## MUST NOT
- Assume client-provided identity, eligibility, price, or reward state is authoritative.
- Increase incentive value without reassessing abuse economics and controls.

## SHOULD
- Use layered controls rather than a single easily bypassed signal.

## Exceptions
Low-value experiments may use lighter controls when maximum exposure is explicitly bounded.

## Verification
Run abuse scenarios, inspect server-side enforcement, reconcile reward issuance, review anomaly metrics, and sample suspicious cases.