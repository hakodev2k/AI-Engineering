# Workflow: Observe, Measure, Contain

## Trigger
Before enabling network access for an autonomous agent or after any egress/control change.

## Goal
Reduce effective network authority to the minimum required by the task and prove it before execution.

## Inputs
Task dependencies, runtime topology, current egress configuration, approved test endpoints.

## Baseline
Record all currently reachable approved probe destinations, wildcard routes, protocols, DNS behavior, and proxy/firewall path.

## Context
Network containment is evaluated separately from host/container isolation.

## Stages
1. Observe effective runtime network topology.
2. Measure baseline reachability.
3. Diagnose excess routes and policy mismatches.
4. Form a specific least-privilege hypothesis.
5. Implement default-deny plus required routes.
6. Run deterministic preflight.
7. Measure the same probe corpus again.
8. If improved and functional, run independent verification; otherwise re-evaluate.

## Responsible agent
Containment implementer for stages 1-7; Containment Reviewer for stage 8.

## Tools
Config readers, safe probes, network logs, `scripts/check_egress_policy.py`.

## Outputs
Before/after reachability matrix, policy, test evidence, reviewer decision.

## Checkpoints
No external agent run begins until preflight passes. No wildcard route proceeds without formal exception.

## Metrics
Unauthorized routes; required-route success; negative-probe success; DNS/IP mismatches; externally visible side effects.

## Retry policy
Maximum 2 remediation cycles.

## Stop conditions
Unexpected external side effect; unknown effective route after one evidence retry; two failed remediation cycles.

## Failure path
Keep runtime network-disabled, preserve logs, quarantine affected state if needed, escalate.

## Verification
Independent reviewer reproduces policy check and representative negative probes.

## Definition of Done
Baseline captured, least-privilege policy passes, required routes work, denied routes fail closed, no uncontrolled external path remains.