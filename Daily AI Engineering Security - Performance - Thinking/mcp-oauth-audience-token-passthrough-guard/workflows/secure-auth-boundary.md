# Workflow: Secure Auth Boundary

## Trigger
Authorization or downstream client integration change.

## Goal
Preserve MCP resource/audience isolation and prevent token passthrough.

## Inputs
Policy, decoded synthetic claim fixtures, downstream credential metadata.

## Baseline
Run the negative/positive fixtures against the pre-change implementation and record decisions.

## Stages
1. **Observe** — map request, auth, tool, and downstream boundaries.
2. **Measure baseline** — capture pass/deny results for all fixtures.
3. **Diagnose** — identify missing audience/scope/provenance controls.
4. **Hypothesis** — state the exact boundary invariant the change will enforce.
5. **Implement** — add validation/credential separation without changing unrelated auth behavior.
6. **Measure again** — rerun deterministic fixtures.
7. **Independent verify** — Security Verifier checks code path and evidence.

## Responsible agent
Implementation owner implements; `subagents/security-verifier.md` verifies.

## Tools
`python3 scripts/oauth_boundary_guard.py`, source/config inspection, non-production integration tests.

## Outputs
Baseline, post-change results, audit evidence, verification status.

## Checkpoints
Audience rejection occurs before tool execution; downstream credential provenance is approved; raw tokens absent.

## Metrics
Negative-case block rate 100%; positive-case success 100%; passthrough detection 100%; secret leakage 0.

## Retry policy
Maximum 2 implementation/retest cycles.

## Stop conditions
Stop on a secret leak, unexplained credential provenance, or persistent auth bypass.

## Failure path
Fail closed, preserve evidence, escalate to security owner. Dangerous production changes require explicit human approval.

## Definition of Done
Implemented, Measured, and independently Verified are all recorded; every required fixture passes; no blocking issue remains.
