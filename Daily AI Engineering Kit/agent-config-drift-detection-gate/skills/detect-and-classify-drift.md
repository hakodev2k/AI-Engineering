# Skill: Detect and Classify Configuration Drift

## Purpose
Produce evidence showing whether an observed JSON configuration differs from an approved expected snapshot without exposing secrets.

## When to use
Use after deployment validation, incident triage, environment parity checks, or before a change when configuration drift is suspected.

## Inputs
- Expected JSON snapshot.
- Actual JSON snapshot obtained through an authorized read-only mechanism.
- `config/drift-policy.json`.

## Preconditions
Both snapshots must represent the same application/environment scope. The operator must have read permission for the actual source without increasing privilege.

## Allowed tools
Repository read/search, approved read-only configuration retrieval, Python 3, and the scripts in this package.

## Constraints
Follow `rules/config-drift-safety.md`. Never paste raw secrets into agent context when a redacted snapshot can be used.

## Procedure
1. Identify provenance, environment, and collection time for both snapshots.
2. Reject comparisons whose scopes are not equivalent.
3. Run `python3 scripts/detect-config-drift.py --expected <expected.json> --actual <actual.json> --policy config/drift-policy.json --output artifacts/drift-report.json`.
4. Preserve stdout/stderr and the exit code. `0` means no drift, `2` means drift, `3` means invalid input/tool failure.
5. Run `python3 scripts/verify-drift-report.py artifacts/drift-report.json`.
6. Classify each difference as intentional, suspicious, or unresolved using repository/configuration evidence; do not infer intent from naming alone.
7. Mark any remediation touching approval-required categories as `needs-approval` and stop before applying it.
8. Hand the report and classification evidence to the planner/remediator.

## Expected output
A verified `artifacts/drift-report.json`, classification notes, evidence references, and explicit unresolved questions.

## Verification
The verifier exits `0`; sensitive differences contain `<redacted>`; every drift item has a path and kind; detector failure is not reported as clean.

## Failure handling
Retry transient snapshot retrieval at most twice. Do not retry malformed JSON unchanged. Permission failures stop immediately and escalate without requesting broader access.

## Stop conditions
Stop when inputs are invalid after correction, scope equivalence cannot be proven, approval is required, or two transient retries fail.
