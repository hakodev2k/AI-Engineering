# Production Change Safety

## Purpose
Control dangerous configuration actions that can affect live systems, users, data, or security boundaries.

## Scope
Production configuration edits, policy changes, access changes, destructive toggles, and emergency actions.

## MUST
- Production changes MUST be attributable to an authorized actor and approved according to risk.
- Changes that weaken security controls, broaden privileged access, enable destructive behavior, or materially alter public contracts MUST require explicit human approval before execution.
- The operator or agent MUST distinguish analysis, recommendation, preparation, and execution authority.
- High-risk changes MUST define blast radius, dependencies, verification, and recovery actions.
- Emergency changes MUST be reconciled into normal configuration management after stabilization.

## MUST NOT
- An AI agent MUST NOT infer permission to execute a production change from permission to analyze or prepare it.
- Safety controls MUST NOT be disabled merely to unblock deployment.
- Production configuration MUST NOT be changed through an untracked personal workaround when an approved path exists.

## SHOULD
- Use just-in-time privilege and two-person review for critical changes.
- Prefer reversible controls over irreversible actions.

## Exceptions
Incident procedures may accelerate approvals but do not eliminate attribution, authorization, evidence, or post-incident reconciliation.

## Verification
Inspect audit logs, approval records, access grants, change tickets, diffs, telemetry, and reconciliation history. Confirm privileged execution paths enforce authorization rather than relying solely on convention.