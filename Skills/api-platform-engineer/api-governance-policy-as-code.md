# API Governance Policy as Code

## Purpose
Encode API platform governance as automated, versioned checks with transparent exceptions.

## When to use
Use when manual reviews do not scale, policy drift is common, or API standards must be enforced consistently.

## Inputs
Governance standards, API schemas, security requirements, CI/CD system, exception process.

## Context to inspect
Inspect existing linters, pipeline gates, false-positive history, policy ownership, and legacy exceptions.

## Core knowledge
Policy as code works best for objective assertions: required metadata, forbidden configurations, security baselines, compatibility, and naming constraints. Semantic architecture judgment should not be reduced to brittle rules.

## Procedure
1. Classify governance rules as mandatory, advisory, or human-judgment.
2. Encode deterministic mandatory rules in testable policy.
3. Version policies and document rationale.
4. Run checks locally and in CI before deployment.
5. Produce actionable violations with remediation guidance.
6. Create explicit waiver records with owner, reason, scope, and expiry.
7. Roll out new rules in report-only mode before blocking when appropriate.
8. Track violation trends and false positives.
9. Test policies against known good and bad fixtures.
10. Retire obsolete rules deliberately.

## Decision points
Block releases for high-confidence safety/security violations; use advisory warnings for preferences or uncertain rules.

## Common failure patterns
Opaque policy failures, permanent waivers, rules that encode aesthetics as safety, and central policy changes breaking every team unexpectedly.

## Verification
Run policy test suites, CI integration tests, waiver expiry tests, and representative repository scans.

## Expected output
Versioned governance controls that are predictable, auditable, and developer-friendly.

## Stop conditions
Stop if a proposed automated rule cannot distinguish valid exceptions reliably.