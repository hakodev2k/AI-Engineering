# Change Governance Rules

## Purpose
Ensure infrastructure and platform changes are reviewed according to risk, traceable, and reversible.

## Scope
Applies to production infrastructure, cloud services, networking, security controls, platform configuration, and delivery systems.

## MUST
- Every material production change MUST identify purpose, scope, risk, owner, validation, and recovery approach.
- High-risk or irreversible changes MUST require explicit human approval before execution.
- Change records MUST link to the source revision, plan, ticket, or equivalent evidence where applicable.
- Emergency changes MUST receive retrospective review and reconciliation into normal configuration management.
- Competing changes to the same critical resource MUST be coordinated to reduce conflict and ambiguous causality.

## MUST NOT
- MUST NOT execute destructive or security-weakening changes solely because automation permits them.
- MUST NOT bypass peer review for routine high-impact changes.
- MUST NOT leave temporary operational changes undocumented indefinitely.

## SHOULD
- Prefer small, reversible, independently verifiable changes.
- Use risk-based approval rather than identical ceremony for all changes.

## Exceptions
Emergency action may use an expedited path only with named authority, recorded reason, bounded scope, and post-change verification.

## Verification
Inspect change history, approvals, infrastructure diffs, deployment records, rollback evidence, and reconciliation after emergency work.