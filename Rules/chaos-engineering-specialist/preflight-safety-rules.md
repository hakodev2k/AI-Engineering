# Preflight Safety Rules

## Purpose
Prevent experiments from starting when prerequisites, dependencies, or operating conditions make risk unacceptable.

## Scope
Applies immediately before execution of any material chaos experiment.

## MUST
- Preflight checks MUST confirm target identity, environment, current health, experiment version, permissions, telemetry, abort controls, and cleanup readiness.
- The operator MUST verify that no conflicting incident or risky change invalidates the approved plan.
- Required backup, restore, failover, or redundancy controls MUST be confirmed when the experiment could threaten state or availability.
- Failed mandatory preflight checks MUST block execution.

## MUST NOT
- Stale screenshots, cached dashboards, or assumptions MUST NOT substitute for current health verification.
- Safety checks MUST NOT be bypassed simply to meet an experiment schedule.
- Production identity or environment selection MUST NOT depend on ambiguous defaults.

## SHOULD
- Preflight validation SHOULD be automated where deterministic checks are possible.
- Tooling SHOULD present the final target set and fault parameters for human review before high-risk execution.

## Exceptions
A bypass requires documented reason, risk, compensating control, verification method, and explicit approval from the accountable authority.

## Verification
Review preflight logs, target resolution, health evidence, control readiness, approvals, and any recorded exception.