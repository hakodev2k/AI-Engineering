# Architecture Validation and Fitness Functions

## Purpose
Turn important architecture rules and quality assumptions into repeatable evidence so architectural drift is detected early.

## When to use
Use when boundaries, dependency rules, performance budgets, security constraints, or operational qualities must remain valid as the codebase evolves.

## Inputs
Architecture principles, NFRs, dependency rules, codebase, test suites, build pipeline, runtime metrics.

## Context to inspect
Module graph, static-analysis rules, integration tests, performance tests, deployment checks, security tests, telemetry, and recurring architecture regressions.

## Core knowledge
Architecture diagrams are insufficient if critical constraints can silently decay. Fitness functions are automated or repeatable checks that evaluate architecture characteristics such as dependency direction, latency, coupling, resilience, compatibility, or security.

## Procedure
1. Identify architecture characteristics that must remain true.
2. Prioritize rules whose violation creates material risk.
3. Define measurable pass/fail or trend criteria.
4. Implement the cheapest reliable check: static analysis, architecture test, contract test, benchmark, security test, deployment probe, or runtime metric.
5. Integrate deterministic checks into CI where practical.
6. Establish baselines for nonbinary metrics.
7. Define owners and remediation expectations.
8. Review false positives and maintenance cost.
9. Update checks when architecture decisions legitimately change.

## Decision points
Automate stable, high-value rules. Keep human review for contextual decisions that cannot be represented reliably as code. Prefer trend thresholds when exact pass/fail limits would be brittle.

## Common failure patterns
Testing implementation details instead of architecture intent, brittle dependency checks, ignored warnings, unowned dashboards, fitness functions that never fail builds despite critical risk, and stale rules after an ADR changes.

## Verification
Intentionally violate representative architecture constraints and confirm the appropriate check detects them; confirm legitimate changes have a documented update path.

## Expected output
A maintainable architecture validation suite with measurable rules, owners, thresholds, and CI/runtime evidence.

## Stop conditions
Stop when a proposed automated rule cannot distinguish valid from invalid designs reliably enough to avoid harmful enforcement.