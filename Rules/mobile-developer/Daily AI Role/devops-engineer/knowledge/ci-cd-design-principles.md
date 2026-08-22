# CI/CD Design Principles

## Fast feedback by structure
Put cheap deterministic checks early. Parallelize independent tests. Avoid downloading/building identical dependencies repeatedly. Cache only with explicit keys and invalidation strategy.

## Reproducibility
Pin material dependencies where appropriate; declare runtime/tool versions; avoid hidden runner state; use clean builds periodically; make environment assumptions explicit.

## Security
Use short-lived/federated credentials where supported, least-privilege job permissions, protected environments for sensitive targets, and secret masking. Untrusted pull-request code must not receive production credentials.

## Separation
Build/test produces immutable evidence and artifacts. Deployment consumes them. Environment configuration is injected separately. Approval is a control boundary, not a shell command embedded in implementation logic.

## Concurrency
Parallelize read/test jobs that are independent. Serialize deployment to a shared target. Use concurrency groups/locks when platform support exists. Cancel obsolete non-production runs only when doing so cannot hide required evidence.

## Observability
Every failure should identify stage, command/category, target, correlation/release ID, and where deeper evidence lives. Deployment should emit version and status evidence.

## Quality gates
A gate should have an owner, purpose, failure meaning, trigger scope, and escalation route. Repeatedly flaky gates should be repaired; silently ignoring them converts uncertainty into hidden risk.