# Config Drift Investigation Skill

## Purpose
Determine whether configuration drift is intentional, harmless, risky, or blocking, using repository and deployment evidence rather than assumptions.

## Trigger
The gate returns `blocked` or `approval_required`, or an environment behaves differently from its approved baseline.

## Inputs
Baseline snapshot, current snapshot, gate result, environment, repository revision, deployment/change records, and policy.

## Preconditions
Both snapshots are parseable and represent the same logical application/environment scope.

## Procedure
1. Read `drift-result.json` and group changes into added, removed, changed, protected, approval-required, and blocked-security categories.
2. For each changed key, locate the source of truth in repository config, deployment manifests, release variables, feature-flag definitions, or approved operational change records.
3. Separate facts from hypotheses. A value mismatch alone does not explain why it changed.
4. Determine whether the drift came from code/config deployment, manual environment edit, secret rotation placeholder change, platform default, or unknown source.
5. For protected/auth/database/storage keys, require direct evidence of intended change.
6. Check whether the changed value broadens access, disables validation, changes tenancy, redirects data, weakens TLS/auth, or changes data-plane endpoints.
7. If drift is intentional and safe, prepare `templates/config-change-approval.md` with exact keys, old/new redacted values, environment, evidence, rollback, and verification plan.
8. If drift is accidental, propose the smallest reconciliation action. Do not apply it automatically in production.
9. Re-run the gate after any snapshot or approved config update.
10. Hand the result to the Drift Verifier.

## Allowed tools
Repository read/search, configuration diff script, deployment history read, ticket/change-record read, read-only environment metadata.

## Forbidden actions
Direct production edits, secret retrieval, security-control weakening, silent baseline replacement, permission expansion, or changing policy to hide drift.

## Expected output
Finding, evidence, confidence, affected keys/components, risk, intended state, recommended action, approval requirement, and verification plan.

## Verification
Every conclusion cites concrete repository/deployment/config evidence; the gate result is reproducible; no secret values are disclosed.

## Failure handling
Transient metadata/tool failure: retry once. Missing evidence, permission failure, or conflicting sources: stop as `inconclusive` and escalate. Do not guess intended production state.

## Stop conditions
Unknown source of protected drift, missing baseline provenance, exposed secret, absent production approval, or a blocked security weakening.
