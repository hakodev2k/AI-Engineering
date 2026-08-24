# Change and Release Safety

## Purpose
Make Windows infrastructure changes reviewable, reversible, and proportional to operational risk.

## Scope
Configuration, software, policy, identity, network, storage, platform, and production maintenance changes.

## MUST
- Material changes MUST state intent, affected scope, dependencies, risk, validation, rollback, and owner.
- High-blast-radius or irreversible production changes MUST require explicit human approval before execution.
- Change sequencing MUST preserve recoverability and avoid simultaneous loss of redundant capacity.
- Post-change verification MUST test intended behavior and critical adjacent behavior.

## MUST NOT
- MUST NOT combine unrelated risky changes when separation would improve diagnosis or rollback.
- MUST NOT proceed when rollback prerequisites are missing for a change whose failure could materially disrupt service.
- MUST NOT use forceful or destructive operations merely to save time.

## SHOULD
- Prefer small, staged, observable, reversible changes.
- Schedule riskier changes when qualified responders and recovery resources are available.

## Exceptions
Require documented urgency, alternatives considered, risk, safeguards, approver, and retrospective review.

## Verification
Review change records, diffs/configuration, approvals, deployment evidence, rollback readiness, monitoring, and post-change tests.