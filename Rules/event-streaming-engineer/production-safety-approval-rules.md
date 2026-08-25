# Production Safety and Approval Rules

## Purpose
Separate analysis and preparation from execution of high-risk streaming operations.

## Scope
Applies to production topics/streams, offsets, state, schemas, security, retention, infrastructure, and data operations.

## MUST
- Automation and AI agents MUST distinguish analyze, recommend, prepare, and execute authority for every production-impacting action.
- Human approval MUST precede topic/stream deletion, destructive retention reduction, mass offset reset, state deletion, production replay with side effects, irreversible schema change, security weakening, secret rotation, infrastructure destruction, and breaking public contracts.
- High-risk changes MUST define affected resources, expected effect, rollback or irreversibility, validation steps, and blast radius before execution.
- Production actions MUST be attributable through audit records or equivalent operational evidence.
- Operators MUST verify target environment and resource identity immediately before destructive execution.

## MUST NOT
- MUST NOT infer approval from prior discussion or from permission to analyze.
- MUST NOT bypass safeguards, ACLs, compatibility checks, or change controls merely to unblock work.
- MUST NOT execute a broader operation than the approved scope.
- MUST NOT conceal partial failure; stop and reassess when observed state diverges from the plan.

## SHOULD
- Dangerous operations SHOULD support dry-run, bounded selection, rate limiting, and two-person review where impact warrants it.
- Reversible changes SHOULD be preferred when they achieve the same objective.

## Exceptions
Emergency authority must be explicitly defined by project incident policy; urgency does not imply unlimited authority.

## Verification
Inspect approvals, command/configuration diffs, audit trails, environment identity, dry-run evidence, post-change telemetry, and reconciliation results.