# Network Automation Rules

## Purpose
Ensure cloud network changes are repeatable, reviewable, and safe to operate at scale.

## Scope
Applies to infrastructure as code, policy as code, orchestration, configuration generation, and automated network changes.

## MUST
- Production network configuration SHOULD be expressed through reviewable automation where practical; manual-only state MUST be documented and reconciled.
- Automation MUST validate inputs, environment, target resources, and expected changes before execution.
- Destructive or broad-scope network changes MUST require human approval.
- Automation MUST fail safely when prerequisites or invariants are not satisfied.
- Drift between declared and effective network state MUST be detected and investigated.

## MUST NOT
- MUST NOT embed credentials or long-lived secrets in automation code or state.
- MUST NOT execute unreviewed broad routing or firewall changes against production.
- MUST NOT suppress plan or diff output when it is required for safe review.

## SHOULD
- Prefer idempotent workflows and reusable modules.
- Add policy checks for forbidden public exposure, overlapping CIDRs, and unsafe routes.

## Exceptions
Exceptions require documented operational need, compensating verification, bounded scope, and approval.

## Verification
Inspect plans, diffs, CI checks, state drift reports, policy results, approval records, and post-change validation.