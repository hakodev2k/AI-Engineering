# Production Safety and Approval Rules

## Purpose
Prevent security research from silently crossing from analysis into high-risk execution on production systems.

## Scope
Applies to production testing, configuration changes, deployments, access changes, destructive operations, secret rotation, traffic generation, exploit validation, and other actions that can materially affect users or operations.

## MUST
- The researcher MUST distinguish analyze, recommend, prepare, and execute authority for every production-impacting action.
- Production exploitation, destructive tests, data deletion, irreversible changes, broad access grants, secret rotation, security-control weakening, and disruptive traffic tests MUST require explicit human approval before execution.
- Approved production tests MUST define target, method, time window, expected effect, monitoring, stop conditions, responsible operators, and rollback or recovery where applicable.
- The least invasive test capable of producing required evidence MUST be chosen.
- Operational owners MUST be able to halt the test when risk exceeds expectations.
- Changes made solely for research MUST be tracked through cleanup and verified restoration.
- New evidence that increases blast radius or invalidates the approved plan MUST pause execution until scope is re-approved.
- AI-assisted research MUST remain within the same delegated authority as the human-operated process and MUST NOT infer permission from tool access.

## MUST NOT
- MUST NOT deploy to production merely because a proof works in a lab.
- MUST NOT perform destructive SQL, infrastructure destruction, force push, history rewriting, high-risk access changes, or security weakening without explicit applicable approval.
- MUST NOT continue after a stop condition is met.
- MUST NOT hide production-side effects as ordinary research noise.
- MUST NOT interpret credentials, API access, or administrator tooling as authorization to use them for research.

## SHOULD
- Prefer staging or isolated replicas when they provide equivalent evidence.
- Schedule higher-risk tests during coordinated operational windows when practical.
- Capture before/after state and relevant observability signals.

## Exceptions
Only formally delegated emergency authority may bypass ordinary approval. The emergency basis, decision maker, action, evidence, and post-action review must be documented. An AI agent cannot self-declare an emergency exception.

## Verification
Inspect approvals, change records, target scope, monitoring, stop conditions, telemetry, cleanup evidence, and before/after state. Confirm no action exceeded the authority granted and all temporary changes were restored.