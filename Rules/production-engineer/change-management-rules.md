# Change Management Rules

## Purpose
Make production changes traceable, reviewable, reversible, and proportionate to risk.

## Scope
Applies to code, infrastructure, configuration, data, networking, access, and operational policy changes.

## MUST
- Every material production change MUST identify owner, intent, affected systems, risk, validation, rollback or recovery path, and timing constraints.
- Change risk MUST be assessed from blast radius, reversibility, dependency impact, data impact, and operational complexity.
- High-risk changes MUST receive human approval before execution.
- Emergency changes MUST be recorded and reviewed after stabilization.

## MUST NOT
- MUST NOT combine unrelated high-risk changes into one release without a justified operational reason.
- MUST NOT perform irreversible changes without explicit approval and recovery planning.
- MUST NOT assume a small diff implies low operational risk.

## SHOULD
- Prefer small, independently verifiable, reversible changes.
- Schedule risky changes when qualified responders and rollback capacity are available.

## Exceptions
Exceptions require reason, compensating controls, named owner, evidence, and post-change verification.

## Verification
Review change records, diffs, approvals, risk classification, rollback plans, deployment logs, and post-change health evidence.
