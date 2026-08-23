# Attribution Rules

## Purpose
Prevent acquisition decisions from relying on overstated or inconsistent attribution.

## Scope
Campaign attribution, referral sources, channel reporting, incrementality, and conversion credit.

## MUST
- Document attribution model, lookback window, identity rules, exclusions, and known blind spots.
- Reconcile material spend and conversion discrepancies across source systems before decisions.
- Distinguish attributed conversions from incremental conversions.

## MUST NOT
- Present last-touch or platform-reported attribution as causal incrementality without evidence.
- Change attribution logic silently when comparing historical performance.

## SHOULD
- Use holdouts, geo tests, lift studies, or other incrementality methods for high-spend decisions where practical.

## Exceptions
Directional attribution may guide low-risk exploration when uncertainty is stated.

## Verification
Compare platform, analytics, billing, and warehouse records; inspect attribution queries and model versions; validate with incrementality evidence where available.