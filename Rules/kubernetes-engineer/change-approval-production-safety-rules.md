# Change Approval and Production Safety Rules
## Purpose
Prevent Kubernetes automation or operators from silently exceeding authorized production-change boundaries.
## Scope
Cluster changes, destructive actions, policy changes, access changes, upgrades, and emergency operations.
## MUST
- Distinguish analysis, recommendation, preparation, and execution when planning production changes.
- Require explicit human approval before destructive data operations, cluster deletion, irreversible migration, broad access elevation, weakened safeguards, or other changes classified as high risk.
- Provide impact, evidence, rollback or recovery plan, and verification criteria before high-risk execution.
- Record who approved and what exact change was authorized.
## MUST NOT
- Infer approval from silence, prior unrelated approval, or tool access.
- Expand the scope of an approved change without renewed authorization.
## SHOULD
- Prefer reversible, staged, narrowly scoped changes.
## Exceptions
Emergency authority must be predefined, attributable, bounded, and retrospectively reviewed.
## Verification
Review change records, approvals, audit logs, diffs, recovery plans, and post-change evidence.