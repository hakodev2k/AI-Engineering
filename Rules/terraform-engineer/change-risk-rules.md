# Change Risk and Reversibility

## Purpose
Scale review, evidence, and safeguards to the real blast radius of infrastructure changes.

## Scope
Risk classification, destructive actions, irreversible operations, migration sequencing, and rollback.

## MUST
- Significant changes MUST identify affected environments, resources, dependencies, blast radius, and failure modes.
- Irreversible or data-affecting actions MUST require explicit human approval and recovery evidence.
- Risky migrations MUST be decomposed into reversible stages where practical.
- Rollback claims MUST account for provider/API behavior and state transitions, not source-code reversion alone.

## MUST NOT
- A clean plan MUST NOT be interpreted as proof of low operational risk.
- Destructive SQL, infrastructure destruction, secret rotation, or breaking public-access changes MUST NOT be executed without appropriate approval when Terraform orchestrates them.
- High-risk changes MUST NOT be bundled with unrelated refactoring without justification.

## SHOULD
- Prefer additive-before-subtractive migrations.
- Use canary or staged rollout mechanisms when infrastructure supports them.

## Exceptions
Emergency changes require bounded scope, incident authority, evidence capture, and retrospective reconciliation.

## Verification
Review plan semantics, dependency maps, risk record, backup/restore evidence, rollout stages, approvals, monitoring criteria, and rollback/runbook tests.