# Safe Deployments and Rollbacks

## Purpose
Reduce change-induced incidents through progressive delivery, observable verification, and fast reversible rollback.

## When to use
Use when designing deployment pipelines, preparing high-risk releases, or investigating release-related outages.

## Inputs
Deployment process, service topology, health signals, feature flags, migration plan, rollback capabilities, SLOs, and recent incident history.

## Preconditions
The release must have defined success/failure signals and an owner able to stop or reverse deployment.

## Context to inspect
CI/CD gates, canary strategy, readiness probes, version compatibility, schema changes, caches, queues, feature flags, startup behavior, and deployment telemetry.

## Core knowledge
Safe change minimizes blast radius and maximizes reversibility. Application rollback may not reverse schema or data transformations, so compatibility and migration sequencing matter. Progressive exposure provides evidence before full rollout.

## Procedure
1. Classify release risk and affected critical paths.
2. Confirm backward/forward compatibility across rolling versions.
3. Separate irreversible data changes from code rollout where possible.
4. Define canary size and observation period.
5. Identify SLO, error, latency, saturation, and business health signals.
6. Deploy to the smallest safe cohort.
7. Compare canary behavior with baseline.
8. Automatically or manually halt on predefined regression thresholds.
9. Expand progressively when evidence remains healthy.
10. Roll back or disable features on material regression.
11. Observe after full deployment for delayed failures.
12. Record release evidence and improve gates after incidents.

## Decision points
Use feature flags when behavior can be decoupled from deployment. Use blue/green when instant traffic switching is valuable and state compatibility is manageable. Use canaries for representative production validation.

## Common failure patterns
Deploying globally at once, relying only on process health, irreversible migrations in the same step, missing rollback tests, and ignoring delayed queue or cache effects.

## Verification
Demonstrate canary comparison, rollback execution, compatibility across versions, and healthy user-facing metrics after full rollout.

## Expected output
Risk-classified deployment plan, rollout gates, rollback procedure, compatibility evidence, and production verification.

## Stop conditions
Escalate when rollback is impossible, schema changes are destructive, health signals are unavailable, or failure impact exceeds the authorized change window.