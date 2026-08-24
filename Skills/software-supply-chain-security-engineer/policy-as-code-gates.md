# Supply Chain Policy-as-Code Gates

## Purpose
Convert supply-chain security requirements into deterministic, reviewable, testable controls enforced at build, registry, promotion, or deployment boundaries.

## When to use
Use when manual reviews are inconsistent, scaling provenance/signature requirements, or standardizing release controls.

## Inputs
Security policy, artifact metadata, SBOM, provenance, signatures, vulnerability evidence, environment classification, and exception process.

## Context to inspect
Identify where trustworthy evidence exists and which boundary can block unsafe progression without creating trivial bypass paths.

## Core knowledge
Policy should evaluate authenticated evidence, not self-asserted labels. Controls need versioning, tests, observable decisions, exception governance, and safe rollout.

## Procedure
1. Translate policy statements into measurable predicates.
2. Identify authoritative evidence for each predicate.
3. Select enforcement points closest to the protected boundary.
4. Implement policies in version-controlled code.
5. Add positive, negative, edge-case, and stale-evidence tests.
6. Run initially in audit mode when operational risk warrants it.
7. Measure false positives and uncovered bypasses.
8. Enable blocking by risk tier.
9. Implement time-bound, attributable exceptions.
10. Log decisions and review policy effectiveness periodically.

## Decision points
Block immediately for high-confidence integrity failures such as invalid signatures; use staged enforcement for noisy vulnerability thresholds. Central policies improve consistency but must support justified workload differences.

## Common failure patterns
Policies based on mutable tags; fail-open behavior without alerting; permanent exceptions; rules nobody owns; untested policy changes; evaluating stale scan data as current truth.

## Verification
Exercise compliant and deliberately noncompliant artifacts. Confirm decisions, evidence, logs, and exception expiry.

## Expected output
Versioned enforceable supply-chain policy with tests and governed exceptions.

## Stop conditions
Escalate when required evidence is untrustworthy, blocking would create unacceptable outage risk without staged rollout, or bypass authority is undefined.