# Production Change and Approval Rules

## Purpose
Keep high-risk gRPC changes reversible, reviewed, evidence-based, and within delegated authority.

## Scope
Production configuration, certificates, service policies, breaking contracts, dependency/runtime migrations, and emergency changes.

## MUST
- High-risk changes MUST state blast radius, evidence, rollback, verification, and accountable approver before execution.
- Analysis, recommendation, preparation, and execution authority MUST be distinguished explicitly.
- Breaking public-contract changes, security-control weakening, credential rotation, and production routing changes MUST receive required human approval.
- Post-change verification MUST use production evidence appropriate to the change.
- Failed verification MUST trigger predefined rollback or escalation criteria.

## MUST NOT
- MUST NOT force push or rewrite shared Git history to repair a release.
- MUST NOT bypass security, compatibility, or deployment gates merely to restore speed.
- MUST NOT claim success from configuration acceptance alone when runtime behavior can differ.
- An AI agent MUST NOT silently exceed granted execution authority.

## SHOULD
- Prefer small, progressive, reversible changes with explicit stop conditions.

## Exceptions
Incident procedures may accelerate approval but MUST retain authorization, audit trail, and post-incident review.

## Verification
Inspect approvals, diffs, rollout records, telemetry, audit events, rollback readiness, and final production state.