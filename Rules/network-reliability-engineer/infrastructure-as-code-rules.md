# Infrastructure as Code Rules

## Purpose
Ensure network infrastructure definitions are reproducible, reviewable, and safely promotable across environments.

## Scope
Declarative network infrastructure, modules, state, plans, and environment promotion.

## MUST
- Infrastructure changes MUST be reviewed from a generated plan or equivalent deterministic diff before production application.
- Shared modules MUST define clear inputs, outputs, ownership, and compatibility expectations.
- State and locking mechanisms MUST be protected against concurrent conflicting changes.
- Production plans MUST be generated from the same revision that is approved for execution.
- Destructive or replacement operations MUST be identified before approval.

## MUST NOT
- MUST NOT apply unreviewed destructive changes to production.
- MUST NOT edit managed state manually except under documented recovery procedures.
- MUST NOT bypass policy checks merely to force a successful apply.

## SHOULD
- Pin provider and module versions within an intentional upgrade policy.
- Test reusable modules in isolated environments.

## Exceptions
Emergency exceptions require explicit approval, recorded diff, recovery plan, and post-change reconciliation.

## Verification
Inspect plans, state history, locks, module versions, policy checks, approvals, and apply logs.