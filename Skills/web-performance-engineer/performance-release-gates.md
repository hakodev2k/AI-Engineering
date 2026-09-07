# Performance Release Gates

## Purpose
Turn web-performance requirements into reliable release controls that prevent known regressions without creating noisy, bypass-prone delivery friction.

## When to use
Use when integrating performance into CI/CD, formalizing release readiness, or preventing repeated regressions in critical journeys.

## Inputs
Performance budgets, synthetic tests, bundle reports, RUM baselines, release process, risk classification, exception policy.

## Context to inspect
Review build determinism, test variance, branch strategy, deployment cadence, feature flags, rollback capability, critical routes, and ownership for failed gates.

## Core knowledge
Different signals need different enforcement. Asset-size and dependency checks are deterministic enough for hard CI gates. Timing measurements are noisy and usually require repeated samples, tolerance bands, or trend logic. Production RUM is essential for validating the release after deployment.

## Procedure
1. Classify performance requirements by user impact and measurement reliability.
2. Use deterministic pre-merge gates for bundle size, request count, and known structural violations.
3. Use repeated synthetic runs for timing-sensitive critical journeys.
4. Define both absolute budgets and regression thresholds.
5. Require diagnostic artifacts on failure: trace, waterfall, bundle diff, and environment metadata.
6. Define severity-based outcomes: block, warn, or observe.
7. Add time-bounded exception records with owner, rationale, risk, and expiry.
8. Canary or progressively expose high-risk releases when possible.
9. Compare post-release RUM against the prior stable release.
10. Roll back or disable features when production impact breaches agreed limits.
11. Review false positives, escaped regressions, and expired exceptions regularly.

## Decision points
Block automatically when evidence is deterministic and impact is material. Prefer warnings or statistical comparison for noisy metrics until the test is sufficiently stable. Allow exceptions only when the user cost is quantified and a remediation owner/date exist.

## Common failure patterns
Single-run timing gates; permanent waivers; thresholds disconnected from user impact; missing diagnostics; tests covering only the landing page; passing CI while production RUM degrades; treating every minor metric movement as release-blocking.

## Verification
Inject or replay representative regressions to prove gates fail correctly. Confirm healthy builds pass consistently, exceptions expire, and post-release telemetry detects problems that lab gates cannot.

## Expected output
A documented performance release policy with automated checks, exception workflow, diagnostics, and post-deploy verification.

## Stop conditions
Escalate when test variance makes enforcement unreliable, required business releases need risk acceptance, or rollback authority and production validation are unavailable.