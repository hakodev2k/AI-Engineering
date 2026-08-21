# Skill: Spec-Bound Patch Verification

## Purpose
Verify a generated patch against frozen acceptance criteria using evidence independent of the implementing agent's own conclusion.

## Trigger
Any coding-agent change that is about to transition to DONE, ready-to-merge, or equivalent lifecycle state.

## Inputs
Original issue/task, frozen acceptance criteria, base commit SHA, candidate commit/diff, test commands/results, integrity metadata.

## Preconditions
Acceptance criteria and base source-state identity must be captured before implementation or reconstructed and explicitly frozen before verification.

## Required context
Task statement, observable requirements, candidate diff, affected-file inventory, current commit/tree identity, relevant test evidence.

## Allowed tools
Git diff/status, test runners, static analyzers, file hashing, read-only repository inspection.

## Constraints
Do not request hidden chain-of-thought. Do not accept implementation-agent assertions as evidence. Do not modify the patch while acting as verifier.

## Procedure
1. Validate candidate source state matches the state referenced by evidence.
2. Read the original task and frozen criteria.
3. Independently inspect the resulting diff without relying on the implementation rationale.
4. Reconstruct the problem/behavior the patch appears to address.
5. Compare reconstructed intent with original criteria; record aligned, missing, contradictory, or unsupported items.
6. Check affected-file integrity, unexpected deletions/truncation, and diff scope.
7. Run required deterministic tests/static checks.
8. Map every acceptance criterion to current evidence.
9. Return PASS only when all mandatory criteria have admissible evidence and no blocking contradiction remains.

## Decision points
Missing evidence => BLOCK, not assumed success. Stale evidence => rerun once. Contradictory patch intent => return to implementation with targeted findings.

## Expected output
Structured verification report: Facts, Acceptance Criteria, Evidence, Reconstructed Patch Intent, Alignment, Risks, Verification Status.

## Metrics
Criteria evidence coverage, unsupported-claim count, stale-evidence count, revision cycles, post-merge regression rate.

## Verification
A separate final gate validates report schema, source-state binding, and test freshness.

## Failure handling
At most two implementation-reverification cycles. Persist unresolved findings and stop rather than weakening gates.

## Stop conditions
Stop on unresolvable criterion ambiguity, source-state drift that invalidates evidence, or two failed revision cycles.