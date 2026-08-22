# Policy as Code

## Purpose
Encode platform governance as testable, versioned, consistently enforced policy.

## When to use
Use for security, compliance, resource, deployment, or configuration rules that must apply repeatedly.

## Inputs
Policy requirements, enforcement points, exceptions, resource schemas, and ownership.

## Context to inspect
IaC, admission controllers, CI/CD, cloud policies, existing manual reviews, and violation history.

## Core knowledge
Policy should be explicit, testable, explainable, and enforced as early as practical. Controls need exception and rollout mechanisms.

## Procedure
1. Translate requirements into precise machine-testable rules.
2. Choose preventive or detective enforcement by risk.
3. Add unit tests for allowed and denied cases.
4. Provide actionable violation messages.
5. Roll out in audit mode when uncertainty is high.
6. Measure violations and false positives.
7. Define time-bound exceptions with owners.
8. Version and review policy changes.

## Decision points
Block high-impact deterministic violations; detect lower-confidence conditions before enforcing.

## Common failure patterns
Opaque rules, no tests, permanent exceptions, policy duplication, sudden enforcement, and controls with no owner.

## Verification
Policy tests pass, known bad configurations fail, approved exceptions are bounded, and enforcement telemetry is visible.

## Expected output
Versioned policy code, tests, enforcement strategy, exception process, and operational metrics.

## Stop conditions
Stop when policy intent is ambiguous or enforcement would create unacceptable production risk.