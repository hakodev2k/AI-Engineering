# Cloud Network Change Review

## Purpose
Review proposed cloud network changes for correctness, blast radius, security, reliability, operability, and rollback quality before deployment.

## When to use
Use for pull requests, change requests, architecture reviews, route/security modifications, new gateways, or high-impact IaC plans.

## Inputs
Change diff/plan, intent, topology, traffic matrix, tests, monitoring, risk assessment, and rollback procedure.

## Preconditions
The proposed change must state the business/technical intent and target environment.

## Context to inspect
Affected routes, security controls, DNS, gateways, load balancers, NAT, transit, hybrid paths, quotas, IaC dependencies, and recent related incidents.

## Core knowledge
Network reviews must reason about both intended reachability and unintended reachability, forward and return paths, stateful devices, failure domains, and control-plane replacement semantics.

## Procedure
1. Restate the intended behavior from the change.
2. Identify affected source/destination flows.
3. Inspect creates, updates, deletes, and replacements.
4. Trace forward and return paths after the change.
5. Check security boundary expansion.
6. Evaluate failure-domain and capacity effects.
7. Check DNS, NAT, MTU, and source-IP side effects.
8. Require explicit verification and rollback.
9. Recommend staging/canary where blast radius is large.
10. Approve only when evidence covers material risks.

## Decision points
Block changes with unbounded blast radius, missing rollback, or unexplained route/security effects. Accept manageable risk when controls, tests, and recovery are proportional to impact.

## Common failure patterns
Reviewing syntax instead of behavior, overlooking resource replacement, accepting broad CIDRs without rationale, ignoring return paths, and approving based solely on a clean IaC plan.

## Verification
Confirm pre-deployment tests exist and post-deployment checks prove expected connectivity, denial, health, and monitoring.

## Expected output
Actionable review findings, risk classification, required changes, and explicit verification criteria.

## Stop conditions
Stop approval when intent is ambiguous, topology evidence is stale, destructive changes are unexplained, or required security/production approval is absent.