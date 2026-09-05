# Production Change Approval Rules

## Purpose
Ensure high-risk container security changes do not exceed delegated authority and remain reversible, reviewable, and evidence-based.

## Scope
Applies to production deployments, security-control changes, privileged workload changes, registry permissions, secret rotation, infrastructure destruction, and emergency exceptions.

## MUST
- Human approval MUST be obtained before production deployment when organizational policy requires it and always before weakening container security controls, enabling privileged execution, broadening high-risk access, rotating shared production secrets, or making destructive infrastructure changes.
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- High-risk changes MUST include documented purpose, affected workloads, security impact, rollback or recovery path, verification plan, and approver.
- Emergency changes MUST be bounded to the smallest effective scope and reviewed after execution.
- Production security changes MUST produce an auditable change record.

## MUST NOT
- MUST NOT force push or rewrite Git history to conceal or simplify production change records.
- MUST NOT disable admission, runtime detection, network isolation, image verification, or privilege restrictions solely to unblock deployment without explicit approval.
- MUST NOT execute destructive cluster, registry, or credential operations based only on inferred user intent.
- MUST NOT claim authorization merely because an action is technically possible.

## SHOULD
- Prefer reversible configuration and progressive rollout over irreversible broad changes.
- Require independent review for changes that expand host-level or cluster-wide authority.

## Exceptions
Emergency authority may permit immediate action under an established incident process; rationale, evidence, affected scope, approver, and post-change verification MUST still be recorded.

## Verification
Inspect approvals, change records, Git history, deployment audit logs, security-policy diffs, rollback evidence, and post-change validation.