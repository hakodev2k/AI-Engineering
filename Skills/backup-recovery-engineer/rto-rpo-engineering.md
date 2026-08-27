# RTO and RPO Engineering

## Purpose
Turn recovery objectives into measurable technical budgets and validate that architecture, backup cadence, and restore procedures can satisfy them.

## When to use
Use during service design, disaster-recovery planning, backup reviews, migrations, or after recovery objectives are missed.

## Inputs
Business RTO/RPO, workload architecture, data-change rate, backup schedules, replication topology, restore benchmarks, dependency recovery times, and staffing model.

## Context to inspect
Inspect end-to-end service dependencies, not only the primary database. Include DNS, identity, secrets, network, storage, queues, caches, configuration, and external services.

## Core knowledge
RTO is an end-to-end service objective, while RPO concerns recoverable data state. Replication may improve RPO but can replicate corruption. Restore throughput, validation, orchestration, and human decision time consume RTO.

## Procedure
1. Confirm objective definitions and measurement boundaries.
2. Decompose RTO into detection, decision, provisioning, data restore, application recovery, validation, and traffic restoration budgets.
3. Map each data source to its effective recovery point.
4. Compare backup interval and replication lag with required RPO.
5. Measure restore throughput using representative data volumes.
6. Model dependency sequencing and critical path.
7. Identify bottlenecks and single points of recovery failure.
8. Adjust architecture, automation, backup frequency, or objectives.
9. Validate with timed recovery exercises.
10. Publish measured versus target results.

## Decision points
Use tighter replication only if corruption propagation and failover risks are addressed. Prefer architectural redesign when restore throughput cannot scale to target RTO. Negotiate objectives when cost is disproportionate to business impact.

## Common failure patterns
Measuring database restore but not service recovery; assuming nominal bandwidth; ignoring key retrieval or DNS propagation; treating stated targets as proven capability.

## Verification
A timed exercise must demonstrate recoverable point and service restoration within defined boundaries. Record actual RTO/RPO and variance.

## Expected output
Evidence-backed recovery budgets and a remediation plan for gaps.

## Stop conditions
Escalate if objectives lack business ownership, tests could endanger production, or required targets cannot be met without material architecture or budget changes.