# Orchestration Rules

## Purpose
Keep AI workload orchestration deterministic, recoverable, and safe at scale.

## Scope
Applies to cluster schedulers, controllers, job specifications, operators, queues, and workload lifecycle automation.

## MUST
- Desired state for production workloads MUST be declarative, versioned, and reviewable.
- Controllers MUST define retry, backoff, timeout, and terminal-failure behavior.
- Job identity and ownership MUST be traceable through scheduling, execution, and cleanup.
- Orchestration changes MUST be tested against failure and recovery scenarios.

## MUST NOT
- MUST NOT depend on manual mutation of production workload state as a normal operating model.
- MUST NOT retry failed jobs indefinitely without bounded policy.
- MUST NOT delete active workload state without ownership and impact checks.

## SHOULD
- Reconciliation logic SHOULD be idempotent.
- Workload policies SHOULD be enforced centrally where feasible.

## Exceptions
Exceptions require reason, risk, recovery steps, and approval.

## Verification
Review manifests, controller code, retry policies, ownership metadata, failure tests, and operational audit records.