# Delivery Reliability Knowledge

## Build once, promote many
A release artifact should be identifiable and immutable. Rebuilding per environment creates untracked differences and weakens rollback confidence.

## Failure domains
Classify failures before action: application/build/test, dependency/package registry, runner/agent, permission/identity, environment/configuration, infrastructure/control plane, external service/network, migration/data, or non-deterministic/flaky behavior.

## Bounded automation
Retries need a known transient failure class, attempt limit, backoff, and terminal action. Polling needs timeout and status evidence. Recovery loops need checkpoints and escalation.

## Recovery choice
Rollback is preferable when the previous version remains compatible with current state and restoration is faster/safer. Forward recovery is preferable when rollback would conflict with data/schema/state transitions or the corrective change is safer.

## Evidence hierarchy
Strong evidence: artifact digest/version from target, deployment event, health metrics, synthetic/user-path check, logs correlated to release ID. Weak evidence: command returned zero or implementation agent says it worked.

## Shared mutable surfaces
Environment configuration, deployment slots, state backends, cluster namespaces, shared workflow files, DNS, identity policies, and databases need explicit single-owner mutation or safe locking.

## Temporary exceptions
Every gate bypass or emergency manual change needs reason, approver, owner, scope, timestamp, expiry, and a tracked restoration action.