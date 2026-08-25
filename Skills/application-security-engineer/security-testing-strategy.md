# Security Testing Strategy

## Purpose
Build a risk-based portfolio of security tests that catches regressions at the cheapest reliable layer.

## When to use
Use when establishing AppSec coverage, designing release gates, modernizing test suites, or addressing recurring defect classes.

## Inputs
Threat models, architecture, defect history, SDLC, test infrastructure, release cadence, and risk tolerance.

## Context to inspect
Inspect unit/integration/E2E capabilities, CI duration, staging parity, scanner precision, ownership, and production monitoring.

## Core knowledge
No single security test technique is sufficient. High-value strategy maps security properties to deterministic tests and supplements them with analysis, scanning, fuzzing, and manual review according to risk.

## Procedure
1. Rank critical security properties and recurring vulnerability classes.
2. Map each property to the lowest-cost test layer that can prove it.
3. Add negative unit/integration tests for authorization, validation, and invariants.
4. Add protocol/API/browser tests where runtime semantics matter.
5. Integrate SAST/SCA/DAST only with defined triage ownership.
6. Use fuzzing for complex parsers and stateful boundaries where valuable.
7. Define which high-confidence failures block releases.
8. Track escaped defects, false positives, execution time, and remediation latency.
9. Periodically remove redundant low-value checks and add tests for incidents.

## Decision points
Gate on reliable evidence, not tool count. Prefer deterministic regression tests over permanent reliance on manual retesting for known defect classes.

## Common failure patterns
Security testing only before release, scanners with no owners, flaky gates, no negative authorization tests, and measuring number of findings instead of risk reduction.

## Verification
Seed known test fixtures or controlled vulnerable cases to confirm each testing layer detects what it claims, and verify gates behave correctly.

## Expected output
A layered security test plan with ownership, gates, metrics, and regression coverage.

## Stop conditions
Escalate when required testing would violate production safety, regulated testing constraints, or release governance.