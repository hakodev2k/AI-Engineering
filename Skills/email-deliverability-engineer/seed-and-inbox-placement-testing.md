# Seed and Inbox Placement Testing

## Purpose
Use controlled test mailboxes and placement instrumentation as diagnostic evidence without mistaking synthetic recipients for real-user deliverability.

## When to use
Use for pre-release checks, provider comparisons, suspected spam-folder shifts, domain/IP warming observation, or controlled experiments.

## Inputs
Representative seed accounts, mailbox-provider coverage, test messages, sending identities, expected authentication, campaign metadata, and real-production outcome baselines.

## Preconditions
Seed accounts must be authorized, maintained, and excluded from business conversion metrics. Testing volume must remain small and representative.

## Context to inspect
Inspect inbox/spam/tab placement, missing mail, headers, authentication, delivery latency, provider mix, message variations, and differences between seed and production cohorts.

## Core knowledge
Seed panels are directional samples, not ground truth for all recipients. Personalized mailbox filtering means real-user history matters. Seed results are strongest when correlated with SMTP responses, reputation, complaints, and real engagement.

## Procedure
1. Define the diagnostic question before sending.
2. Select seeds covering relevant mailbox providers and account types.
3. Send the exact production-like MIME through the intended production path.
4. Capture placement, arrival time, headers, and authentication.
5. Repeat enough times to distinguish a persistent pattern from one-off filtering.
6. Compare with known-good templates/identities where useful.
7. Correlate seed outcomes with provider-specific real traffic metrics.
8. Investigate divergences rather than averaging all seeds together.
9. Keep test addresses out of warm-up engagement manipulation and campaign analytics.
10. Record limitations in conclusions.

## Decision points
Use seed tests to localize issues, not to justify mass infrastructure rotation. Favor real-recipient operational evidence when seed and production signals conflict.

## Common failure patterns
Tiny panels treated as definitive, artificial opening/clicking to game reputation, non-production send paths, seed accounts that have atypical history, and checking only inbox vs spam without headers.

## Verification
Confirm production-equivalent routing, provider coverage, reproducible placement patterns, and correlation with independent operational signals.

## Expected output
A provider-segmented placement report with headers, limitations, and evidence-backed next actions.

## Stop conditions
Stop when test setup differs materially from production or testing behavior itself could distort reputation.