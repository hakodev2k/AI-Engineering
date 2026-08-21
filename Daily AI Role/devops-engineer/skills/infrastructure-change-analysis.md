# Skill: Infrastructure Change Analysis

## Purpose
Assess infrastructure or platform changes before mutation and make blast radius, dependencies, reversibility, security, and cost explicit.

## Trigger
IaC changes, network/identity/storage changes, runtime upgrades, scaling changes, state backend changes, policy changes, or environment reconfiguration.

## Inputs
Current state evidence, proposed diff/plan, dependencies, ownership, environments, data classification, expected load, security rules, cost constraints, and recovery options.

## Procedure
1. Identify every resource and environment touched.
2. Separate create/update/replace/delete semantics.
3. Determine downstream dependencies and shared-resource consumers.
4. Identify stateful data and irreversible transitions.
5. Evaluate permission expansion and network exposure.
6. Evaluate availability, capacity, performance, and cost effects.
7. Determine safe ordering and which changes can be parallel.
8. Define pre-change backup/snapshot or recovery prerequisite where relevant.
9. Define verification signals after each critical phase.
10. Escalate destructive, broad-impact, or unclear changes for human approval.

## Decision rules
Replacement of stateful resources is high risk by default. Permission broadening requires justification and review. Shared production resources should not be mutated concurrently by independent owners.

## Outputs
Change-impact matrix, ordered execution plan, approval needs, verification plan, recovery plan, and residual risk.

## Verification
Compare intended plan to applied state and validate health/security/cost signals after change.

## Failure handling
Stop further mutations after an unexpected destructive diff or dependency failure; preserve evidence and recover from the last known safe checkpoint.