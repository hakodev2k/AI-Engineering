# Performance Budget Rules

## Purpose
Establish measurable performance limits that protect user experience and prevent gradual regressions.

## Scope
Applies to page weight, JavaScript execution, rendering, Core Web Vitals, API latency, third-party cost, and other user-visible performance constraints.

## MUST
- Define explicit budgets for metrics that materially affect the target user journey.
- Tie each budget to a measurement method, percentile, device/network profile, and release gate where practical.
- Treat budget violations as engineering defects requiring disposition before release.
- Re-baseline budgets only with documented evidence and approval.

## MUST NOT
- Increase a budget solely to make a failing build pass.
- Compare measurements collected under materially different conditions without normalization.
- Claim compliance from averages when tail latency or percentile thresholds are the stated objective.

## SHOULD
- Prefer budgets aligned to user outcomes rather than tool-specific scores.
- Keep critical-path budgets stricter than non-critical surfaces.

## Exceptions
Exceptions require rationale, affected users, measured impact, mitigation, expiry or follow-up, and owner approval.

## Verification
Verify through CI performance checks, RUM dashboards, lab tests, bundle analysis, and release review evidence.