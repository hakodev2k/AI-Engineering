# Change and Approval Rules

## Purpose
Ensure high-impact secret-management actions do not silently exceed operator or automation authority.

## Scope
Production configuration, access changes, secret rotation, revocation, key destruction, platform migration, trust changes, and emergency actions.

## MUST
- Work MUST distinguish analyze, recommend, prepare, and execute authority.
- Human approval MUST precede irreversible key destruction, broad production access changes, weakening security controls, destructive platform changes, and other actions designated high risk by policy.
- Approval requests MUST state affected systems, blast radius, reversibility, validation, rollback, and expected operational impact.
- Executed changes MUST be attributable and followed by verification.

## MUST NOT
- An AI agent or automation MUST NOT infer execution authority from permission to analyze or prepare a change.
- Approval MUST NOT be fabricated, assumed from silence, or reused outside its approved scope.
- Emergency authority MUST NOT become standing authorization after the incident.

## SHOULD
- Prefer reversible, staged changes with bounded blast radius.
- Use peer review for material policy and trust-boundary changes even when not formally destructive.

## Exceptions
Only an established emergency process may alter normal approval sequencing; actions must remain attributable and be reviewed afterward.

## Verification
Inspect change records, approvals, audit logs, authorization scope, rollback evidence, post-change validation, and emergency reconciliations.