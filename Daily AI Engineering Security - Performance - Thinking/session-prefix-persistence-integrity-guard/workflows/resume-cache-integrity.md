# Workflow: Resume Cache Integrity

## Trigger
First model call after durable session restore, continuation, process restart, or client/gateway handoff.

## Goal
Preserve exact cache-sensitive prefix integrity across persistence and prove that the fix improves token/cache/latency behavior without losing required context.

## Inputs
Known-good baseline manifest, resumed prefix manifest, runtime identity, provider/backend usage telemetry, quality regression suite.

## Baseline
Capture first-call-after-resume input/cache-creation/cache-read tokens and TTFT for representative long sessions before changes.

## Context
Prompt caching is prefix-sensitive. Persistence integrity is separate from semantic correctness: text can mean the same thing while producing cache-invalidating bytes/tokens.

## Stages
1. **Observe** — capture exact request-boundary manifests and provider usage evidence.
2. **Measure baseline** — record resumed-call token/cache/TTFT metrics.
3. **Diagnose** — locate missing state, write ordering, segment ordering, replay serialization, or runtime identity changes.
4. **Form hypothesis** — state the specific persistence/reconstruction defect.
5. **Implement improvement** — repair storage/replay while preserving all required context.
6. **Measure again** — repeat the same resume benchmark.
7. **Improved?** — if no, perform at most two additional repair cycles with changed evidence/hypothesis; if yes, continue.
8. **Verify** — independent Prefix Verifier checks exact manifests, telemetry, and quality regression results.
9. **Complete** — record Implemented/Measured/Verified status.

## Responsible agent
Runtime/prompt-assembly implementer for changes; `subagents/prefix-verifier.md` for independent final verification.

## Tools
Request-boundary prefix capture, package deterministic checker, provider usage telemetry, timing instrumentation, regression tests.

## Outputs
Baseline and resumed manifests, mismatch diagnosis, before/after metrics, quality results, final verification record.

## Checkpoints
- CP1 baseline request manifest persisted
- CP2 baseline resume metrics captured
- CP3 pre-call resumed manifest compared
- CP4 repaired resume benchmark captured
- CP5 independent verification complete

## Metrics
Input tokens, cache creation/write tokens, cache read/hit tokens, cache hit ratio, TTFT, total resume latency, tokens/task, cost/task, prefix-match rate, quality/regression rate.

## Retry policy
Manifest collection: maximum two transient retries. Repair/benchmark loop: maximum three total attempts. Provider measurement: one retry only for clearly transient transport errors.

## Stop conditions
Success requires an exact prefix match for unchanged runtime identity, improved or restored cache telemetry, and passing critical-context regression tests. Stop unsuccessfully after three repair attempts, missing baseline identity, or any correctness regression.

## Failure path
Record hashes/lengths and first differing location -> preserve full required context -> escalate to prompt/persistence owner -> rebaseline only for a justified runtime-identity change.

## Verification
Deterministic fixtures plus a representative real-session before/after benchmark. Never claim a performance/token improvement from code inspection alone.

## Definition of Done
Evidence documented; baseline measured; root cause identified; persistence/replay repair implemented; deterministic tests pass; exact prefix integrity verified; before/after cache and latency metrics recorded; quality regression suite passes; risks documented; no blocking issue remains.
