# Probes and Lifecycle

## Purpose
Configure startup, readiness, liveness, and termination behavior so Kubernetes reacts correctly to application state.
## When to use
New workloads, restart loops, bad rollouts, dropped requests, or slow startup.
## Inputs
Application startup/health semantics, dependency behavior, shutdown time, SLOs.
## Context to inspect
Probe definitions, terminationGracePeriodSeconds, preStop hooks, server drain behavior, rollout settings, restart events.
## Core knowledge
Readiness controls traffic, liveness triggers restart, startup protects slow initialization. A probe must test the condition Kubernetes can safely act on.
## Procedure
1. Define healthy, ready, and irrecoverably stuck states. 2. Implement shallow readiness. 3. Add liveness only for recoverable-by-restart failures. 4. Add startup probe for long initialization. 5. Coordinate graceful shutdown and traffic drain. 6. Test dependency outage, overload, startup, and termination. 7. Tune thresholds from measured timings.
## Decision points
Do not make liveness depend on remote dependencies; choose HTTP/TCP/exec based on what accurately represents local process state.
## Common failure patterns
Same endpoint for every probe, cascading restarts during dependency failure, probes too aggressive, and termination shorter than request drain.
## Verification
Observe controlled rollout, dependency failure, SIGTERM handling, and absence of dropped traffic or restart storms.
## Expected output
Lifecycle settings backed by application semantics and failure tests.
## Stop conditions
Stop when application health semantics are unknown or safe shutdown requires code changes outside current authority.