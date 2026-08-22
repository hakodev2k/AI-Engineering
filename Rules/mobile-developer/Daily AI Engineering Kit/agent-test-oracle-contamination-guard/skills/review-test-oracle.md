# Review Test Oracle Integrity

## Purpose
Independently verify that test expectations are evidence-derived and capable of rejecting plausible wrong implementations.

## When to use
Use for any `review-required` result and for all high/critical claims.

## Inputs
- Oracle claims.
- Contamination report.
- Test assertion inventory.
- Mutation report when required.
- Implementation owner identity.

## Preconditions
Reviewer is not the implementation owner for high-risk work.

## Allowed tools
Read-only repository inspection, test runner, mutation reports, policy/scripts in this package.

## Forbidden actions
- Do not edit implementation to make tests pass while reviewing.
- Do not replace requirement evidence with current implementation behavior.
- Do not approve deterministic blockers.
- Do not weaken policy or permissions to obtain approval.

## Procedure
1. Recompute the oracle fingerprint from current claims and policy.
2. Confirm every high-risk behavior has an independent source.
3. Inspect warnings for shared formulas, symbols, snapshots, or copied literals.
4. For each suspicious assertion, trace the expected value back to the evidence source.
5. Check negative/boundary cases against the same source.
6. Review mutation evidence: verify mutant count, killed count, and kill ratio are from the current test set.
7. Reject if tests survive an obvious behavior-changing mutant that should violate the oracle.
8. Record findings and verdict in `schemas/oracle-review.schema.json` format.
9. Bind the review to the exact `oracle_fingerprint`.
10. Run the final gate.

## Expected output
A review document with `approved` or `rejected`, reviewer identity, implementation owner, fingerprint, and findings.

## Verification
The final gate must independently validate fingerprint and reviewer separation.

## Failure handling
If evidence conflicts or requirement meaning is ambiguous, reject and escalate for human/domain clarification. Do not choose the implementation's current behavior by default.

## Stop conditions
Stop if review fingerprint becomes stale after claim or policy changes; regenerate review from the new evidence set.
