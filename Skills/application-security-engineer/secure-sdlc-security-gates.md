# Secure SDLC and Security Gates

## Purpose
Embed proportionate security controls into delivery workflows so high-risk changes receive deeper assurance without making security an indiscriminate bottleneck.

## When to use
Use when designing engineering lifecycle controls, release criteria, repository standards, or risk-based review triggers.

## Inputs
SDLC, repository portfolio, deployment model, incident history, security tooling, ownership model, and release cadence.

## Context to inspect
Inspect how requirements become code, how code is reviewed and built, artifact provenance, deployment approvals, exception handling, and production feedback loops.

## Core knowledge
Effective secure SDLC uses risk-based controls, paved roads, automation, clear ownership, and measurable exceptions. Gates should prevent specific unacceptable outcomes and be fast enough to remain credible.

## Procedure
1. Classify applications and changes by security risk.
2. Define mandatory baseline controls for all repositories.
3. Define triggers for threat modeling, AppSec review, penetration testing, or specialist review.
4. Place deterministic checks early: secret scanning, dependency integrity, tests, and high-confidence static rules.
5. Define artifact/build provenance and protected release paths where needed.
6. Make exceptions explicit, owned, time-bound, and reviewable.
7. Feed incidents and recurring findings back into reusable controls.
8. Measure control latency, bypass rate, defect escape, and remediation time.
9. Tune or remove controls that create noise without reducing risk.

## Decision points
Block releases only for well-defined unacceptable risk or high-confidence violations. Use advisory checks while new controls mature. Central standards should permit justified domain-specific extensions.

## Common failure patterns
One-size-fits-all gates, manual approval for low-risk changes, permanent exceptions, security tools with no remediation path, and measuring compliance rather than outcomes.

## Verification
Sample repositories across risk tiers, trace changes through required controls, test gate failure behavior, and review exception expiry.

## Expected output
A risk-tiered SDLC control model with enforceable gates, ownership, exception process, and metrics.

## Stop conditions
Escalate when proposed gates conflict with regulatory obligations, protected-branch governance, or release authority outside the AppSec team's mandate.