# Workflow: Implement → Reconstruct → Verify

## Trigger
Candidate coding-agent patch is ready for completion review.

## Goal
Prevent false completion by requiring evidence-bound, independent verification of patch intent, integrity, and behavior.

## Inputs
Original task, frozen criteria, base SHA, candidate SHA/diff, test plan.

## Baseline
Before implementation record base SHA and acceptance criteria. For existing systems record relevant passing/failing test baseline.

## Stages
1. Freeze requirements and criterion IDs.
2. Implement change; implementation agent records candidate state only, not final verdict.
3. Capture diff hash, affected files, file sizes/hashes, and test evidence.
4. Independent Verifier reconstructs apparent patch intent from the resulting change.
5. Compare reconstructed intent against frozen criteria.
6. Validate integrity and execute required tests/static checks.
7. If BLOCK, return targeted evidence-linked findings; implementation may revise once per cycle.
8. Repeat verification for maximum two revision cycles.
9. Final completion hook validates report freshness and PASS.

## Checkpoints
Frozen criteria before final verification; source-state binding before tests count as evidence; independent verifier before DONE; integrity checks before merge readiness.

## Metrics
Criterion evidence coverage, unsupported claims, stale evidence, revision cycles, integrity anomalies, regression failures.

## Retry policy
Maximum two revision cycles. Each revision invalidates prior source-bound evidence and requires fresh verification.

## Stop conditions
Unresolved contradiction after two cycles, source-state drift during verification, integrity anomaly, mandatory test failure, or ambiguous mandatory criterion requiring human decision.

## Failure path
Retain BLOCK report and evidence. Do not mark DONE. Escalate only the specific unresolved criteria/findings.

## Verification
Completion requires current PASS report, current source-state identity, integrity PASS, required tests PASS, and no unsupported mandatory criterion.

## Definition of Done
All mandatory criteria have fresh evidence; reconstructed patch intent aligns with the task; integrity is verified; tests pass; independent verifier returns PASS; final hook accepts current state.