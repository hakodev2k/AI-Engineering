# Network Automation Code Review

## Purpose
Review network automation for correctness, blast radius, maintainability, security, and operational safety.

## When to use
Use for pull requests affecting models, templates, workflows, integrations, policy, or deployment logic.

## Inputs
Change diff, requirements, tests, target platforms, source-of-truth model, deployment path, and risk classification.

## Context to inspect
Callers, shared libraries, schemas, secrets handling, existing conventions, rollback, and prior incidents.

## Core knowledge
Review must examine both software correctness and network consequences. A small code diff can generate a fleet-wide configuration change.

## Procedure
1. Understand intended network behavior and target scope.
2. Trace data from source of truth to rendered/actioned state.
3. Check validation and capability assumptions.
4. Review idempotency, timeout, retry, and partial-failure handling.
5. Assess concurrency against topology/failure domains.
6. Inspect secret and privilege handling.
7. Review generated semantic diffs/examples.
8. Demand tests for edge/failure cases.
9. Confirm prechecks, postchecks, rollback, and observability.
10. Classify rollout risk and approval requirements.

## Decision points
Require deeper lab/canary evidence for routing, security, core, or fleet-wide changes; accept simpler proof for bounded read-only tooling.

## Common failure patterns
Reviewing Python style but not generated config, hidden broad selectors, unbounded retries, missing negative tests, and assumptions tied to one vendor version.

## Verification
Run tests, inspect representative rendered output, exercise failure paths, and validate target selection.

## Expected output
Actionable review findings categorized by correctness, safety, security, maintainability, and rollout risk.

## Stop conditions
Block approval on unknown blast radius, missing rollback for risky mutations, secret exposure, or insufficient verification.