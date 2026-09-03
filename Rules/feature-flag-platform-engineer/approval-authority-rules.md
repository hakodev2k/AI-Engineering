# Approval and Authority Rules

## Purpose
Ensure high-impact feature-flag actions do not exceed operator or automation authority.

## Scope
Applies to production activation, broad exposure, entitlement-sensitive changes, emergency controls, credential changes, and platform-wide policy changes.

## MUST
- The platform operating model MUST distinguish analyze, recommend, prepare, approve, and execute authority.
- Human approval MUST be required before high-risk production exposure changes, weakening security-related controls, changing entitlement-sensitive targeting, or altering privileged production access unless a formally approved emergency process applies.
- Automated actors MUST be scoped to explicitly authorized environments, projects, and action classes.
- Approval evidence MUST identify the proposed change and its expected impact.
- Irreversible or difficult-to-reverse configuration changes MUST include recovery or containment planning.

## MUST NOT
- MUST NOT allow an AI agent or automation to infer execution authority from its ability to inspect or prepare a change.
- MUST NOT bypass required approval because a change is technically easy to perform.
- MUST NOT use shared identities to obscure who approved or executed a production change.

## SHOULD
- Approval thresholds SHOULD increase with blast radius, security sensitivity, and reversibility risk.

## Exceptions
Emergency authority must be predefined, limited in scope, auditable, and followed by retrospective review.

## Verification
Inspect IAM policy, workflow permissions, approval records, audit logs, automation identities, and emergency-access evidence.