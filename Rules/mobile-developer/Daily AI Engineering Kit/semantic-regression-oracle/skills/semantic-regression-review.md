# Skill: Semantic Regression Review

## Purpose
Determine whether observed before/after behavior differences are intended, allowed, or regressions.

## Inputs
- Validated scenario suite
- Baseline results
- Candidate results
- Deterministic semantic diff report
- Requirement/change rationale

## Preconditions
Baseline and candidate must use the same scenario suite version and comparable environment assumptions.

## Procedure
1. Validate suite and both result files.
2. Confirm scenario IDs, suite hash, and environment identity.
3. Run `python scripts/compare-semantic-results.py --suite <suite> --baseline <baseline> --candidate <candidate> --out <report>`.
4. Review each `changed` or `blocked` scenario.
5. Trace each change to an explicit requirement/evidence source.
6. Treat invariant violations as blocking unless the invariant itself was explicitly revised with human approval.
7. For intentional behavior changes, record approval/evidence and expected migration impact.
8. Do not convert a difference into an allowed change merely because tests pass.
9. Hand the report to the independent Semantic Reviewer.

## Output
A reviewed semantic diff report with each difference classified as `allowed-change`, `regression`, `needs-human-decision`, or `no-change`.

## Verification
All critical differences are classified and evidence-backed. Implementers cannot be the sole verifier.

## Recovery
Transient test-harness failures may be retried once. Deterministic comparison failures are not retried without correcting inputs.

## Stop conditions
Stop on missing baseline, suite mismatch, critical invariant violation, ambiguous requirement conflict, or unavailable approval for a breaking semantic change.