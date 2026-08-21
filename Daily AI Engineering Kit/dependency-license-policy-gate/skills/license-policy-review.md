# License Policy Review

## Purpose
Classify evidence-backed dependency licenses against repository policy and decide whether merge/release may proceed, requires review, or must be blocked.

## When to use
After `dependency-license-evidence-capture.md` has produced a validated inventory.

## Inputs
- Validated license inventory.
- `config/license-policy.json`.
- Repository distribution context.
- Optional exception record bound to the exact package/version/source.

## Preconditions
- Inventory validation passed.
- Policy version is known.
- Candidate dependency set is stable for the review.

## Allowed tools
- Read-only repository/package metadata inspection.
- `scripts/evaluate-license-policy.py`.
- `scripts/evaluate-license-gate.py`.

## Constraints
- Policy categories are repository rules, not legal advice.
- Unknown, partial, or conflicting evidence is never silently treated as allowed.
- An exception is valid only for the package/version/source and expiry recorded in it.
- The implementing agent must not be the sole reviewer for `restricted`, `prohibited`, `unknown`, or ambiguous multi-license findings.

## Procedure
1. Load the validated inventory and policy.
2. Classify each dependency license expression into `allowed`, `restricted`, `prohibited`, or `unknown`.
3. Apply policy rules for direct/transitive dependencies and distribution mode.
4. Detect ambiguous expressions that cannot be safely classified by configured policy.
5. Verify provenance confidence for every dependency that would otherwise be allowed.
6. Determine whether an exception is required.
7. For a supplied exception, verify package name, ecosystem, version, source fingerprint, license expression, policy version, approver, approval time, and expiry.
8. Require independent review for all non-allowed findings and any exception path.
9. Produce a policy evaluation artifact with finding, evidence, risk, required action, and gate status.
10. Run the deterministic final gate only after reviewer evidence exists.

## Status contract
- `verified`: all changed dependencies are policy-allowed with sufficient provenance, or a valid approved exception exists where policy permits it.
- `human-approval-required`: policy permits an exception but no valid bound approval exists.
- `blocked`: prohibited dependency, invalid/expired exception, unknown provenance where policy blocks unknowns, or mismatched evidence.

## Verification
- Evaluation references the exact inventory fingerprint and policy version.
- Every changed dependency has a classification.
- Required reviewer evidence is independent for non-allowed paths.
- Exceptions are time-bounded and exact-scope.
- Final gate returns `verified` only with all required evidence.

## Failure handling
- Validation failure: stop and return to evidence capture.
- Policy ambiguity: classify `unknown` and escalate.
- Tool failure: retry once if transient; otherwise stop with preserved evidence.
- Changed inventory after review: invalidate the review and re-run.

## Stop conditions
Stop before merge/release if final gate is not `verified`.