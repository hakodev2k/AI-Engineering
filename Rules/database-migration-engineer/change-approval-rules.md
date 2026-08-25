# Change Approval and Authority

## Purpose
Ensure migration execution never exceeds granted authority.

## Scope
Covers production DDL, DML, deletion, cutover, configuration, credentials, and irreversible actions.

## MUST
- Analyze, recommend, prepare, and execute MUST be treated as distinct authority levels.
- Production deployment, destructive SQL, data deletion, irreversible migration, security weakening, secret rotation, and breaking contract changes MUST require explicit human approval.
- Approval MUST identify the intended change and be obtained before the consequential action.

## MUST NOT
- MUST NOT infer execution approval from permission to analyze or prepare.
- MUST NOT force push, rewrite repository history, or bypass protected change controls to complete a migration.

## SHOULD
- Use two-person review for high-blast-radius or difficult-to-reverse changes.
- Keep approvals and execution evidence auditable.

## Exceptions
Emergency procedures may use predefined incident authority but MUST preserve attribution and retrospective review.

## Verification
Inspect change records, approvals, audit logs, Git history, runbooks, and execution timestamps.