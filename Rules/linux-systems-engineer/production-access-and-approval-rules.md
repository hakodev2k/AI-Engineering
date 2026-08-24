# Production Access and Approval Rules

## Purpose
Define authority boundaries for analysis, preparation, and execution of high-impact Linux operations.

## Scope
Applies to production shell access, privileged commands, destructive actions, security changes, data operations, and AI-assisted administration.

## MUST
- Operators and agents MUST distinguish read-only analysis, recommendation, prepared commands, and execution.
- Production deployment, destructive storage/data operations, secret rotation, infrastructure destruction, access expansion, security-control weakening, and irreversible changes MUST require explicit human authorization.
- Approval MUST identify the intended action and scope; authorization for one host or command MUST NOT be silently generalized.
- Privileged actions MUST be attributable and logged where platform controls permit.
- Before destructive execution, the target and expected blast radius MUST be independently revalidated.

## MUST NOT
- An AI agent MUST NOT infer permission to execute from permission to analyze or prepare.
- Force push, history rewriting, destructive filesystem commands, or mass host termination MUST NOT be executed without specific authorization.
- Security safeguards MUST NOT be bypassed merely because privileged access is technically available.

## SHOULD
- Use just-in-time and time-bounded privilege.
- Prefer two-person review for high-blast-radius changes.
- Separate routine automation identities from emergency identities.

## Exceptions
Emergency authority follows the incident policy but MUST remain attributable, bounded, and retrospectively reviewed.

## Verification
Review access grants, sudo/audit logs, approvals, command scope, session records where available, and evidence that dangerous actions matched the authorized target and intent.