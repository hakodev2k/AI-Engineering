# Removal Plan and Verification

## Purpose
Convert a validated dead-code candidate into the smallest safe removal plan and prove that the removal does not introduce regressions or unintended contract changes.

## When to use
Use only after `dead-code-evidence-collection.md` produced a valid evidence record and the candidate is `candidate` or `approved-for-removal`.

## Inputs
- Validated evidence record.
- Repository revision.
- Candidate code and dependency neighborhood.
- Relevant build/test commands.

## Preconditions
- `scripts/validate-evidence.py` exits 0.
- No evidence channel contains `reference-found`.
- Required channels are not `unknown`.
- Human approval exists before deleting files, removing public/external contracts, deleting data, rewriting Git history, or making production/configuration changes.

## Procedure
1. Re-read the candidate and direct dependency neighborhood at the current revision.
2. Confirm evidence is still fresh and candidate content/path has not materially changed.
3. Define the exact removal set: candidate plus only imports, registrations, tests, config, docs, or adapters that become unreachable because of the removal.
4. Separate `must-remove` from `optional-cleanup`; do not bundle unrelated refactors.
5. Identify contract risks: public API, serialized shape, routes, events, DB schema, config keys, environment variables, plugin entry points, CLI commands, monitoring, and operational runbooks.
6. If any contract risk is externally visible, require explicit human approval and migration/deprecation evidence.
7. Apply the smallest approved change.
8. Run repository reference scan again for the removed identifier and stale registrations/config.
9. Run targeted tests for the affected component, then required broader regression/build/static checks from policy.
10. Inspect the diff for unrelated modifications and accidental generated/vendor changes.
11. Produce post-removal verification evidence and set `verification_status` to `verified` only if all mandatory checks pass.

## Constraints
- Do not replace deletion with behavior-changing refactoring unless explicitly requested.
- Do not weaken tests to make removal pass.
- Do not delete a public/external contract merely because repository references are absent.
- Do not claim success when build/test tooling was unavailable.

## Expected output
A removal plan, changed-file list, check results, unresolved risks, approvals, and final status: `verified`, `failed`, or `blocked`.

## Failure handling
- Transient build/test tool failure: retry at most once while preserving the first failure.
- Deterministic build/test failure: no blind retry; diagnose and either restore the candidate or mark `failed`.
- Unexpected reference after edit: stop, restore or revise the removal, and return to evidence collection.
- Approval missing: stop at `approved-pending-human`.

## Stop conditions
Stop when verification succeeds, a blocking reference appears, approval is missing, the same deterministic failure persists, or removal expands beyond the reviewed scope.