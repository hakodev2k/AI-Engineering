# Skill: Breaking Change Review

## Purpose
Turn deterministic breaking-change findings into a safe implementation decision.

## Inputs
- Gate result JSON.
- Requirement or ticket authorizing the API change.
- Consumer/versioning context when available.

## Process
1. Separate confirmed findings from hypotheses.
2. For each blocking finding, identify affected consumers and whether a backward-compatible alternative exists.
3. Prefer additive routes, optional fields, new enum values, versioned endpoints, or compatibility shims.
4. If a breaking change is unavoidable, prepare an approval request using `templates/breaking-change-approval.md`.
5. Require explicit approval before changing public contracts.
6. After implementation, regenerate the candidate spec and rerun the deterministic gate.
7. Report remaining risk and migration requirements.

## Verification
A review is complete only when each blocking finding is either removed by a compatible implementation or linked to explicit human approval plus migration/versioning evidence.

## Failure handling
If consumer impact cannot be determined, mark the change blocked rather than assuming safety.
