# Configuration Change Safety

## Purpose
Control reliability risk from changes to model parameters, routing, prompts, quotas, timeouts, feature flags, retrieval settings, and tool permissions.

## When to use
Use whenever runtime behavior can change without a conventional code deployment.

## Inputs
Current configuration, proposed change, affected workflows, dependency limits, rollback value, audit history, validation tests.

## Preconditions
Configuration is versioned or otherwise recoverable and ownership is known.

## Context to inspect
Config stores, environment overrides, model gateways, prompt registries, feature flags, secrets, deployment automation, caches.

## Core knowledge
Configuration drift can be as risky as code changes and is often harder to correlate with incidents. Reliable systems treat behavior-changing configuration as reviewed, observable, reversible release artifacts.

## Procedure
1. Identify every runtime surface affected by the change.
2. Capture the current known-good value.
3. Validate syntax, ranges, dependencies, and compatibility.
4. Review blast radius and rollback path.
5. Apply change to the smallest safe scope.
6. Confirm effective configuration, not only stored configuration.
7. Monitor operational and behavioral metrics.
8. Expand only after validation gates pass.
9. Record actor, timestamp, reason, and resulting state.
10. Detect and reconcile drift across regions or environments.

## Decision points
Use dynamic configuration for reversible tuning; require deployment-level controls when compatibility or migration order matters.

## Common failure patterns
Manual undocumented edits, differing regional values, global model alias changes, incorrect units, unbounded timeout increases, and assuming control-plane success means data-plane application.

## Verification
Effective runtime state matches intended values across target instances and validation tests show no reliability regression.

## Expected output
A reviewed change plan, versioned configuration, rollout evidence, and rollback procedure.

## Stop conditions
Escalate when the prior state cannot be reconstructed, authorization is unclear, or the change affects security/privacy boundaries.