# Containment Strategy

## Purpose
Limit ongoing damage and propagation while preserving the ability to recover and investigate safely.

## When to use
Use when an incident is actively expanding, corrupting state, exposing data, exhausting resources, or cascading through dependencies.

## Inputs
Blast radius, architecture, traffic patterns, dependency graph, feature controls, isolation mechanisms, data risks, and business priorities.

## Context to inspect
Inspect network boundaries, tenancy, regions, queues, write paths, credentials, feature flags, rate limits, failover routes, and state replication.

## Core knowledge
Containment trades service capability for risk reduction. The best containment is narrow, reversible, observable, and prevents new harm without destroying evidence.

## Procedure
1. Define the harm that must stop first.
2. Identify propagation paths and controllable choke points.
3. Generate containment options from narrowest to broadest.
4. Evaluate each option for customer impact, state integrity, reversibility, and evidence preservation.
5. Select measurable success criteria.
6. Assign one owner and execute the chosen control.
7. Monitor propagation and secondary effects.
8. Tighten or relax containment based on evidence.
9. Document temporary controls requiring later removal.

## Decision points
Prefer tenant, region, feature, or operation isolation over full shutdown when scope is verified. Use broad isolation when uncertainty makes continued propagation unacceptable.

## Common failure patterns
Containing the symptom instead of propagation, disabling observability, destroying forensic evidence, creating hidden backlog in queues, and forgetting temporary restrictions after recovery.

## Verification
Confirm new harmful events stop or materially decline and unaffected populations remain healthy.

## Expected output
A containment decision with scope, rationale, controls, success metrics, side effects, and removal conditions.

## Stop conditions
Escalate before containment that can cause irreversible data loss, broad contractual impact, or safety/compliance consequences outside delegated authority.