# Recipient Engagement and Segmentation

## Purpose
Use recipient relevance and recency signals to control sending pressure and reputation risk without turning engagement metrics into a substitute for valid consent.

## When to use
Use when defining bulk-send eligibility, recovering reputation, launching re-engagement, or diagnosing placement differences between cohorts.

## Inputs
Consent state, signup/source data, send/open/click history where lawful and reliable, product activity, bounce/complaint history, frequency preferences, and message purpose.

## Preconditions
Treat privacy controls and consent as hard boundaries. Account for unreliable open tracking caused by privacy features and machine-generated events.

## Context to inspect
Inspect recency, frequency, acquisition source, provider distribution, complaint rate, downstream conversion, inactive cohorts, and seasonality.

## Core knowledge
Engagement is strongest when based on multiple trustworthy signals. Recent product activity can be more reliable than opens. Sending indefinitely to unresponsive recipients increases reputation risk. Segmentation must not conceal low-quality acquisition.

## Procedure
1. Define the business purpose and permissible recipient population.
2. Choose engagement signals with known reliability and privacy constraints.
3. Build recency/frequency tiers rather than one binary engaged flag.
4. Compare bounce, complaint, conversion, and placement by tier.
5. Establish sending-frequency limits and inactivity thresholds.
6. Route early warm-up and reputation recovery to highest-quality cohorts.
7. Design re-engagement as a bounded program with clear exit conditions.
8. Suppress or reduce non-essential mail to persistently inactive cohorts.
9. Re-evaluate thresholds as product behavior and tracking reliability change.

## Decision points
Favor product activity and clicks over opens when opens are noisy. Use stricter eligibility during reputation recovery. Do not keep sending solely because a recipient has not unsubscribed.

## Common failure patterns
Over-trusting opens, ignoring acquisition source, increasing frequency to inactive users, mixing active and dormant cohorts in analysis, and using segmentation to route poor lists through fresh infrastructure.

## Verification
Compare cohort-level complaint, bounce, conversion, and placement before and after policy changes. Confirm excluded recipients remain excluded and no consent boundary was weakened.

## Expected output
A transparent segmentation policy with evidence-based thresholds and lifecycle actions.

## Stop conditions
Stop experimentation if tracking is legally impermissible, consent state is unreliable, or segmentation would materially increase unwanted mail.