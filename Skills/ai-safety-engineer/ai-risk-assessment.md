# AI Risk Assessment

## Purpose
Assess AI-system risk consistently so engineering effort and governance match real-world consequence.

## When to use
Use for new AI features, material model changes, new user populations, expanded autonomy, or changed data sensitivity.

## Inputs
Use cases, model capabilities, affected users, data classes, deployment context, incident history, applicable policy.

## Context to inspect
Intended use, foreseeable misuse, decision impact, reversibility, scale, human oversight, privileges, monitoring, and fallback paths.

## Core knowledge
Risk is not model capability alone. Evaluate severity, likelihood, exposure, affected population, reversibility, uncertainty, and control strength. Distinguish inherent from residual risk.

## Procedure
1. Define system purpose and prohibited outcomes.
2. Identify stakeholders and potentially affected parties.
3. Enumerate safety, security, privacy, reliability, and misuse hazards.
4. Estimate severity and likelihood using documented evidence.
5. Evaluate existing controls and control dependencies.
6. Rate residual risk and uncertainty.
7. Define additional mitigations and acceptance criteria.
8. Assign accountable risk owners.
9. Set reassessment triggers.

## Decision points
Use conservative assumptions when evidence is weak and consequences are high. Prefer quantitative evidence where measurable; use structured qualitative judgment where not.

## Common failure patterns
Averaging away catastrophic low-frequency risks; confusing lack of evidence with safety; failing to distinguish users from affected non-users; undocumented risk acceptance.

## Verification
Ensure ratings have evidence, mitigations have owners, and high residual risks have explicit approval.

## Expected output
A traceable risk register with severity, likelihood, controls, residual risk, uncertainty, owners, and reassessment triggers.

## Stop conditions
Escalate when risk cannot be bounded, required evidence is unavailable, or acceptance authority is unclear.