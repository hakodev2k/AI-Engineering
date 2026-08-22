# Health Probes and Lifecycle

## Purpose
Configure startup, readiness, liveness, and termination behavior that reflects real application health without causing self-inflicted outages.

## When to use
Workload onboarding, restart loops, bad rollouts, or graceful-shutdown problems.

## Inputs
Startup profile, dependency model, failure modes, shutdown time, and traffic behavior.

## Context to inspect
Probe definitions, application endpoints, events, restart counts, terminationGracePeriodSeconds, hooks, and load-balancer behavior.

## Core knowledge
Readiness controls traffic; liveness triggers restart; startup protects slow initialization. A liveness check should not fail merely because a remote dependency is down.

## Procedure
1. Define what healthy means for each lifecycle phase.
2. Measure startup and shutdown duration.
3. Build lightweight readiness and liveness checks.
4. Add startup probe when initialization can exceed liveness timing.
5. Align termination grace with request draining.
6. Test dependency outages and overload.
7. Verify rollouts do not drop traffic.

## Decision points
Include dependencies in readiness only when the instance truly cannot serve; keep liveness focused on local unrecoverable state.

## Common failure patterns
Same endpoint for every probe, aggressive timeouts, liveness tied to database availability, and insufficient termination grace.

## Verification
Simulate slow startup, dependency loss, hung process, and termination; confirm expected traffic and restart behavior.

## Expected output
Evidence-based probes and lifecycle settings.

## Stop conditions
Escalate when the application exposes no reliable health semantics.