# Graceful Shutdown and Deployment Rules

## Purpose
Prevent avoidable RPC loss during deploys, scaling, maintenance, and process termination.

## Scope
Readiness withdrawal, connection draining, stream termination, rollout, rollback, and shutdown budgets.

## MUST
- Instances MUST stop receiving new traffic before forced termination when the platform supports draining.
- Shutdown budgets MUST account for normal unary and streaming call durations.
- Deployments MUST preserve compatibility across mixed versions.
- Rollout health MUST be evaluated using RPC error, latency, saturation, and business-critical signals.
- A rollback or forward-fix path MUST exist before high-risk production changes.

## MUST NOT
- MUST NOT terminate healthy in-flight calls immediately merely because deployment began.
- MUST NOT deploy a breaking contract assuming clients update simultaneously.
- MUST NOT execute production deployment or rollback without required human authorization.

## SHOULD
- Prefer progressive rollout for material transport, runtime, or contract changes.
- Long-lived streams SHOULD have reconnect/resume behavior.

## Exceptions
Emergency termination requires incident authority and documented impact.

## Verification
Run shutdown/drain tests, inspect rollout telemetry, verify mixed-version behavior, and confirm rollback procedures before release.