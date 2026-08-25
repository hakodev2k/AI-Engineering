# Deployment and Rollback Rules

## Purpose
Limit production risk when deploying load-balancer software, configuration, or infrastructure.

## Scope
Rolling updates, blue/green changes, canaries, firmware/software upgrades, configuration rollout, and rollback.

## MUST
- Production deployments MUST define success metrics, abort thresholds, and rollback or forward-fix strategy before execution.
- Critical traffic changes MUST preserve sufficient healthy capacity during rollout.
- Rollouts MUST verify data-plane health independently of control-plane success messages.
- Breaking changes to routing or protocol behavior MUST be tested against representative clients and backends.
- Human approval MUST precede high-risk production execution unless an explicitly authorized automated policy governs it.

## MUST NOT
- MUST NOT deploy fleet-wide when a smaller safe canary is practical for a material change.
- MUST NOT continue rollout after abort criteria are met without explicit incident/change authority.
- MUST NOT assume rollback is safe unless configuration and state compatibility permit it.

## SHOULD
- Prefer progressive delivery with automated health gates.
- Practice rollback for critical changes.

## Exceptions
Emergency remediation may accelerate rollout under incident command with continuous monitoring.

## Verification
Review rollout logs, canary metrics, capacity, error and latency changes, runtime versions/configuration, and rollback tests.