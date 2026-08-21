# Workflow: Validate → Dispatch → Readback

## Trigger
New multi-parameter high-risk tool integration, parser/harness upgrade, integrity incident, or regression in persistence/tool-call arguments.

## Goal
Ensure ambiguous parser output fails closed before side effects and successful writes preserve configured critical fields.

## Inputs
Parsed calls, tool schemas, critical-field policy, known-bad corruption fixtures, benign markup fixtures, mock side-effect target, optional readback API.

## Baseline
Before integration, replay the fixture corpus and record: corrupted calls allowed, hard parse failures, benign controls allowed, side-effect executions, and readback mismatches. Do not use production writes.

## Context
Record harness/parser version, tool schema version, fixture-set hash, and gate configuration. Never record raw production secrets.

## Stages
1. **Observe** — collect current parser outcomes and schema behavior.
2. **Measure baseline** — quantify silent-corruption escapes and benign-control pass rate.
3. **Diagnose** — determine whether corruption is detectable through correlated grammar residue, missing critical fields, or readback mismatch.
4. **Form hypothesis** — define a specific gate rule and expected fixture delta.
5. **Implement** — place deterministic integrity validation immediately before dispatch.
6. **Measure again** — rerun the identical fixture corpus.
7. **Improved?** — require zero known-bad escapes and acceptable benign-control behavior. If not, revise the rule once.
8. **Dispatch test** — run allowed calls against a mock side-effect target; blocked calls must not increment the side-effect counter.
9. **Readback test** — for persistence fixtures, compare configured critical fields after write.
10. **Independent verification** — Tool Call Integrity Verifier returns PASS/BLOCK.

## Responsible agent
Implementation agent owns gate integration. Tool Call Integrity Verifier independently owns final verification.

## Tools
`scripts/tool_arg_integrity.py`, `tests/test_tool_arg_integrity.py`, schema files, mock side-effect adapter, safe readback API.

## Outputs
Baseline report, post-change report, blocked reason-code counts, false-positive report, mock side-effect evidence, readback comparison, final verification report.

## Checkpoints
- Before implementation: known-bad and benign fixtures exist.
- Before every side-effect test: integrity decision is recorded.
- Before production enablement: zero known-bad fixture escapes.
- Before Verified: readback matches where supported.

## Metrics
Known-bad escape rate, benign false-positive rate, blocked-call side-effect count, recomposition success rate, readback mismatch rate, tool success rate.

## Retry policy
Maximum two implementation/re-measure cycles. A blocked model tool call may be re-composed at most twice. Scanner execution may retry once only for transient configuration/I/O failure.

## Stop conditions
Stop on any side effect before ALLOW, any known-bad fixture escape after two cycles, repeated schema/config failure, two failed re-compositions, or post-write critical-field mismatch.

## Failure path
Block the affected tool path, preserve sanitized reason codes and fixture hashes, fall back to a human-reviewed/manual operation if necessary, and escalate. Do not bypass the gate to restore availability.

## Verification
Verify both security and usability: known-bad fixtures block, benign markup controls pass, critical-field checks work, side effects remain zero on blocked calls, and readback mismatches prevent Verified status.

## Definition of Done
Evidence documented; baseline captured; gate integrated before dispatch; tests pass; known-bad escape rate is zero in the fixture corpus; false positives are measured and acceptable/documented; side-effect-before-ALLOW count is zero; readback verification passes where available; independent verifier returns PASS.