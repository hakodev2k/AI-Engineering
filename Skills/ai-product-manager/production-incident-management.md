# AI Production Incident Management

## Purpose
Coordinate product decisions during AI production incidents involving severe quality regressions, unsafe behavior, model/provider outages, cost spikes, or broken agent workflows.

## When to use
Use when production AI behavior materially harms task success, trust, reliability, cost, or operational safety.

## Inputs
Incident symptoms, affected users, model and prompt versions, telemetry, eval results, provider status, recent changes, rollback options, support reports.

## Context to inspect
Deployment history, feature flags, routing, retrieval changes, tool errors, rate limits, latency, cost anomalies, safety alerts, and known-good configurations.

## Core knowledge
AI incidents can originate outside application code: model version drift, provider degradation, retrieval data, prompt changes, tool dependencies, or traffic-distribution shifts. Product response should prioritize user impact containment before root-cause certainty.

## Procedure
1. Define incident severity and affected user workflows.
2. Freeze nonessential AI changes.
3. Identify the fastest safe containment option: disable, degrade, reroute, restrict, or roll back.
4. Preserve representative failing examples and system versions.
5. Coordinate engineering, support, safety, and provider owners as needed.
6. Communicate user-visible limitations accurately.
7. Validate recovery through production metrics and targeted evals.
8. Perform root-cause analysis after containment.
9. Convert confirmed failures into regression tests, monitoring, and product controls.
10. Record follow-up owners and deadlines.

## Decision points
Prefer degraded deterministic behavior over unreliable automation when core workflows can continue. Roll back when the previous configuration is known-good and migration risk is lower than ongoing impact.

## Common failure patterns
Waiting for perfect diagnosis before containment, changing several variables simultaneously, losing failing examples, relying solely on provider status pages, and declaring recovery from aggregate metrics only.

## Verification
Confirm affected segments recover, targeted failing cases pass, rollback/degraded modes work, and follow-up controls are assigned.

## Expected output
A contained incident, validated recovery, root-cause record, and prioritized prevention actions.

## Stop conditions
Escalate immediately when user impact is severe, containment requires privileged production changes, or the system cannot be made acceptably safe through existing controls.