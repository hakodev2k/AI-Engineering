# Safety Policy Implementation

## Purpose
Translate safety policy into enforceable, testable system behavior without relying on ambiguous prose at runtime.

## When to use
Use when implementing product safety rules, prohibited-use controls, escalation policies, or domain restrictions.

## Inputs
Approved policy, product scope, user journeys, enforcement architecture, exception process.

## Context to inspect
Where decisions occur, available signals, model uncertainty, deterministic controls, logging, and appeal/review paths.

## Core knowledge
Policy and enforcement are different artifacts. Effective implementation defines decision boundaries, precedence, exceptions, evidence, and failure behavior.

## Procedure
1. Decompose policy into atomic enforceable rules.
2. Identify inputs and signals needed for each rule.
3. Decide deterministic versus model-assisted enforcement.
4. Define precedence and conflict resolution.
5. Specify allow, block, transform, warn, and escalate outcomes.
6. Create representative and adversarial tests.
7. Measure false positives and false negatives.
8. Version policy and enforcement together.
9. Monitor drift and exception usage.

## Decision points
Use deterministic controls for identity, permissions, and hard technical boundaries; use classifiers/models for semantic judgments with calibrated review paths.

## Common failure patterns
Policy hidden only in prompts; contradictory rules; undocumented exceptions; no version traceability; optimizing only for block rate.

## Verification
Trace each policy clause to implementation, tests, telemetry, and an accountable owner.

## Expected output
A versioned enforcement specification with rules, tests, exceptions, and monitoring.

## Stop conditions
Escalate ambiguous high-impact policy requirements or rules that cannot be enforced reliably with available signals.