# Automation and Configuration Rules

## Purpose
Make storage automation reproducible, reviewable, and safe under partial failure.

## Scope
Applies to infrastructure-as-code, configuration management, orchestration, scripts, and automated remediation.

## MUST
- Keep intended production configuration version-controlled or otherwise auditable.
- Make automation idempotent where repeated execution is plausible.
- Define preconditions, failure handling, and safe retry behavior for state-changing automation.

## MUST NOT
- Embed secrets in automation source or logs.
- Allow an agent or script to execute destructive storage actions beyond its explicit authority.
- Auto-remediate ambiguous corruption or deletion events without human approval.

## SHOULD
- Detect drift between intended and actual storage configuration.
- Use dry-run or plan modes before high-impact changes when supported.

## Exceptions
Manual emergency actions require recorded commands, rationale, authority, and reconciliation back into managed configuration.

## Verification
Inspect diffs, CI checks, dry-run output, permissions, idempotency tests, drift reports, and audit logs.