# Policy as Code

## Purpose
Enforce infrastructure guardrails on Terraform configuration and plans before unsafe changes reach production.

## When to use
Governance, compliance, security, cost, tagging, or architectural controls that should be automated.

## Inputs
Policies, exceptions, Terraform plans/configuration, enforcement points, ownership model.

## Context to inspect
Existing OPA/Sentinel/check frameworks, CI stages, false positives, exception process, provider coverage.

## Core knowledge
Policies should express high-value invariants, produce actionable failures, be testable, and distinguish advisory from mandatory controls.

## Procedure
1. Translate policy intent into machine-testable assertions.
2. Choose configuration- or plan-level evaluation based on required evidence.
3. Define scope and exemptions explicitly.
4. Write positive, negative, and edge-case tests.
5. Integrate checks before apply.
6. Roll out new policies in advisory mode when impact is uncertain.
7. Measure violations and tune false positives.
8. Version policy changes and document remediation.

## Decision points
Block high-confidence security/compliance violations; warn for contextual optimization guidance.

## Common failure patterns
Unclear errors, blanket exceptions, policies coupled to one module layout, no tests, and controls that evaluate too early to see computed values.

## Verification
Tests cover allowed/denied cases and representative plans fail or pass for the intended reason.

## Expected output
Versioned enforceable guardrails with documented exceptions.

## Stop conditions
Stop when policy intent is ambiguous, required plan data is unavailable, or enforcement could block critical recovery without an exception path.