# Workflow: Measure → Diagnose → Optimize MCP Dispatch

## Trigger
A malformed call, repeated MCP timeout, long tool hang, or evidence that generic/deferred tools bypass full schema validation.

## Goal
Reduce invalid-call latency and wasted dispatch/retry work while preserving valid and legitimately long-running tool behavior.

## Inputs
Failing request fixture, valid control fixture, tool schema, timeout/retry configuration, traces and timings.

## Baseline
Record at minimum: validation time, dispatch count, time-to-first-error, total failure latency, retry count, timeout result, token/tool-call overhead.

## Context
Use the same runtime, transport, server version, and fixture set for before/after comparison.

## Stages
1. **Observe** — reproduce failure once; capture exact arguments and outcome.
2. **Measure baseline** — run at least three comparable repetitions when safe.
3. **Diagnose** — identify whether invalid arguments were locally detectable before dispatch.
4. **Form hypothesis** — e.g. “full schema preflight will convert a 420-second remote timeout into a sub-second repair response.”
5. **Implement improvement** — integrate `scripts/mcp_preflight.py` or equivalent into the dispatch boundary without bypassing existing middleware.
6. **Measure again** — repeat invalid and valid fixtures.
7. **Improved?**
   - No: allow at most two hypothesis revisions; record each result.
   - Yes: continue to regression verification.
8. **Verify** — test nested/type/enum/additional-property failures, valid calls, missing/unsupported schemas, and a legitimate long-running call.
9. **Complete** — publish measured deltas and residual risks.

## Responsible agent
MCP Performance Investigator for stages 1–4 and measurement; implementation owner for stage 5; independent verifier for stages 6–9.

## Tools
Runtime logs, JSON Schema validator, benchmark harness, MCP inspector, test runner.

## Outputs
Baseline dataset, root-cause classification, patch/integration, before/after metrics, regression evidence.

## Checkpoints
- Baseline captured before code/config change.
- Exact concrete schema confirmed.
- Invalid call demonstrably blocked before downstream dispatch.
- Valid control still reaches the tool.
- Security/approval chain still executes.

## Metrics
p50/p95 invalid-call failure latency, invalid dispatches prevented, valid-call overhead, retry count, timeout rate, repair-success rate.

## Retry policy
Maximum two hypothesis revisions. Identical invalid tool arguments may be repaired once by default before `block_retry`.

## Stop conditions
Stop on user cancellation, safety/permission uncertainty, inability to obtain a comparable baseline, or exhaustion of bounded hypothesis retries.

## Failure path
If schema validation cannot safely support the encountered schema dialect, mark schema validation unavailable, retain bounded timeout protections, and escalate for validator support rather than pretending the call is valid.

## Verification
Independent replay must show invalid fixture never invokes the target handler and valid fixture does.

## Definition of Done
Implemented + measured + verified; before/after evidence exists; no permission boundary was weakened; residual unsupported schema behavior is documented.
