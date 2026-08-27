# Pre- and Post-Change Verification Rules

## Purpose
Prove that network changes start from safe conditions and achieve intended outcomes.

## Scope
Health checks, invariants, routing/forwarding state, sessions, telemetry, and service probes.

## MUST
- Every production workflow MUST define preconditions that can stop execution when baseline health is unsafe.
- Post-change checks MUST validate intended operational outcomes, not only configuration presence.
- Verification MUST cover control-plane and data-plane behavior relevant to the change.
- Failed critical post-checks MUST trigger a defined halt, rollback, or escalation decision.
- Baseline and post-change evidence MUST be correlated to the exact targets and execution.

## MUST NOT
- MUST NOT declare success solely because device commands or API requests returned successfully.
- MUST NOT ignore pre-existing critical faults that invalidate the safety assumptions of a planned change.
- MUST NOT average away a failed critical target behind fleet-wide success percentages.

## SHOULD
- Verification SHOULD use independent telemetry or probes where practical.
- Checks SHOULD distinguish transient convergence from persistent failure using bounded observation windows.

## Exceptions
Unavailable telemetry requires documented substitute evidence, reduced scope, and reviewer acceptance before risky production changes.

## Verification
Inspect workflow gates, baseline snapshots, post-check outputs, per-target status, convergence timing, and failure-path tests for halt/rollback/escalation behavior.