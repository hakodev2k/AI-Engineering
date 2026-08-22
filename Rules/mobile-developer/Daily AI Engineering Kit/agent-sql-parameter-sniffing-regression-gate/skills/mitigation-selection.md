# Mitigation Selection Skill

## Purpose
Select the smallest reversible mitigation after parameter-sensitive plan behavior is proven.

## Inputs
Verified benchmark result, execution-plan evidence, application constraints, deployment boundaries.

## Process
1. Reject mitigations that do not address the observed selectivity/plan mismatch.
2. Prefer application/query-shape changes that preserve correctness and public contracts.
3. Consider recompilation only when execution frequency and compile cost make it acceptable.
4. Consider `OPTIMIZE FOR UNKNOWN` only after proving average-density estimates improve the tested parameter classes.
5. Consider parameter bucketing or intentionally separate query shapes when distinct selectivity classes require different plans.
6. Treat query hints, forced plans, index changes, schema changes, and database settings as approval-required.
7. Benchmark the candidate against the same parameter matrix and baseline.
8. Reject a candidate that improves one class while crossing configured regression limits for another class.
9. Document operational cost, rollback, and residual risk.

## Expected output
A ranked mitigation decision with evidence, rollback method, approval status, and verification result.

## Verification
Independent verifier repeats the parameter matrix. A recommendation is not complete unless correctness and latency checks pass.

## Failure handling
At most two revisions of a mitigation are allowed per workflow run. After two failed candidates, stop and escalate with preserved evidence.
