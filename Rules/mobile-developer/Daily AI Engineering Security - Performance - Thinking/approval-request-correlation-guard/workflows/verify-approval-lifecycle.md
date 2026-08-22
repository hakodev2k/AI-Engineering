# Workflow — Verify Approval Lifecycle

## Trigger
New approval transport/client, reconnect support, session resume, interrupt behavior change, or approval incident.

## Goal
Prove that an approval authorizes exactly one intended live request.

## Inputs
Schemas, pending-request store, test envelopes, cancellation hooks, logs.

## Baseline
Capture valid one-shot approval latency, request fields, terminal transition, and execution count.

## Stages
1. **Observe** — map request creation → presentation → response → validation → execution → terminalization.
2. **Measure baseline** — record valid request behavior and lifecycle timings.
3. **Diagnose** — identify fields not carried end-to-end.
4. **Hypothesize** — rank possible misbinding/orphan paths.
5. **Implement** — add immutable correlation envelope and revocation handling.
6. **Measure again** — run normal and adversarial cases.
7. **Independent verify** — Security Verifier reviews raw evidence.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
`python3 scripts/verify_approval_envelope.py`, integration test runner, sanitized lifecycle logs.

## Outputs
Before/after matrix of exact-match acceptance, mismatch rejection, orphan count, duplicate execution count, and cancellation revocation.

## Checkpoints
- CP1: all identity fields inventoried.
- CP2: baseline captured.
- CP3: every mismatch type has a test.
- CP4: no negative case accepts.
- CP5: independent verification complete.

## Metrics
False accepts = 0; duplicate executions = 0; pending approvals after terminal cancel = 0; missing correlation fields = 0.

## Retry policy
Maximum 3 implementation/test cycles. Each retry requires a materially changed hypothesis or implementation.

## Stop conditions
Stop immediately on a false accept and return to implementation. Stop successfully only after all security tests and independent review pass.

## Failure path
Fail closed, retain evidence, disable automated/external response acceptance for the affected path, and require exact local approval when safe/available.

## Definition of Done
Evidence documented; correlation envelope implemented; lifecycle revocation present; negative tests pass; no secret leakage; independent verifier returns `VERIFIED`.
