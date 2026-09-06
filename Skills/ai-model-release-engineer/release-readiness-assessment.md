# Release Readiness Assessment

## Purpose
Determine whether an AI model, adapter, prompt bundle, or inference configuration is ready to progress toward production without confusing implementation completion with release evidence.

## When to use
Use before staging promotion, production launch, major model replacement, or material inference-policy change. Do not use as a substitute for domain-specific safety or regulatory approval.

## Inputs
Candidate artifact, requirements, evaluation results, risk classification, deployment plan, rollback plan, dependency inventory, and operational SLOs.

## Preconditions
A versioned candidate and explicit release target exist. Critical acceptance criteria have owners.

## Context to inspect
Inspect model lineage, evaluation suites, serving configuration, runtime dependencies, data assumptions, security controls, observability, prior incidents, and environment differences.

## Core knowledge
Readiness is multidimensional: quality, safety, security, reliability, performance, cost, compatibility, operability, and governance. Passing an average benchmark cannot compensate for an unbounded critical failure mode.

## Procedure
1. Identify release scope and user-impact boundary.
2. Translate requirements into measurable gates.
3. Classify risks by severity, likelihood, detectability, and reversibility.
4. Confirm artifact provenance and immutable version identifiers.
5. Review offline and task-specific evaluations, including critical slices.
6. Validate latency, throughput, capacity, and cost against budgets.
7. Check security, privacy, abuse, and policy controls.
8. Confirm deployment, rollback, and kill-switch procedures.
9. Verify dashboards, alerts, logs, traces, and ownership.
10. Record unresolved risks and explicit exceptions.
11. Produce a go, conditional-go, or no-go recommendation with evidence.

## Decision points
Prefer no-go when a high-severity failure is poorly detectable or irreversible. Conditional-go is appropriate only when residual risk is bounded, monitored, owned, and time-limited.

## Common failure patterns
Benchmark-only approval, stale evaluation data, mutable artifacts, missing rollback, undocumented exceptions, hidden dependency changes, and treating staging success as production proof.

## Verification
Independently trace every gate to evidence; rehearse rollback; confirm alerts and owners; verify the exact candidate digest matches the assessed artifact.

## Expected output
A release-readiness decision with gate results, evidence references, residual risks, owners, and expiry dates for exceptions.

## Stop conditions
Stop and escalate on missing provenance, critical failed gates, unknown production blast radius, unavailable rollback, or required approval outside the engineer's authority.
