# Blast Radius and Safety Guardrails

## Purpose
Bound experiment impact so resilience learning does not create uncontrolled customer or business risk.

## When to use
Use for every experiment that changes runtime behavior, especially in shared or production environments.

## Inputs
Experiment scope, target inventory, traffic topology, tenant model, service criticality, rollback mechanisms, alerts, ownership, and maintenance constraints.

## Preconditions
Targets are identifiable, stop mechanisms are tested, and responsible operators can observe the experiment.

## Context to inspect
Failure domains, replica placement, shared dependencies, multi-tenant coupling, regional topology, rate limits, autoscaling, alerting, change windows, and rollback paths.

## Core knowledge
Blast radius is the maximum plausible impact, not merely the number of targeted resources. Senior practice limits scope across users, time, geography, dependencies, and data. Guardrails should be machine-checkable where possible and should fail safe when telemetry or control channels disappear.

## Procedure
1. Identify direct and indirect targets.
2. Map possible propagation paths.
3. Bound affected users, requests, regions, and duration.
4. Set pre-experiment health gates.
5. Define abort thresholds tied to user outcomes.
6. Configure automatic experiment expiry.
7. Confirm rollback and target restoration.
8. Protect control-plane and observability dependencies from simultaneous impact.
9. Assign an operator with authority to stop the run.
10. Validate guardrails in a lower-risk environment.
11. Record the approved maximum blast radius.

## Decision points
Use production only when realism justifies the added risk. Reduce scope when dependencies are poorly mapped, recovery is manual, or customer segmentation is weak.

## Common failure patterns
Bounding only the primary target; no automatic expiry; abort criteria based solely on infrastructure metrics; impacting telemetry with the workload; assuming failover paths are independent without evidence; and running during unrelated risky changes.

## Verification
Demonstrate that target filters, abort rules, expiry, and rollback work before the main experiment. Confirm expected impact can be distinguished from unrelated incidents.

## Expected output
A documented blast-radius model, health gates, abort thresholds, rollback plan, and operator responsibilities.

## Stop conditions
Stop if propagation cannot be bounded, rollback is untested, critical telemetry is unavailable, or unrelated incidents are active.