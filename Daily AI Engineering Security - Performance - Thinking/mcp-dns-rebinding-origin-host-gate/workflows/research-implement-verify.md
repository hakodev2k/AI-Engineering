# Workflow: Research, Implement, Verify

## Trigger
An MCP Streamable HTTP endpoint is introduced or its transport/proxy/security configuration changes.

## Goal
Reject DNS-rebinding and host/origin confusion before MCP dispatch without breaking approved clients.

## Inputs
Deployment topology, SDK/version, request metadata policy, tool exposure, approved client list.

## Baseline
Capture current behavior for approved native/browser clients and hostile foreign-origin/rebound-host fixtures. Record whether hostile requests reach session creation or MCP methods.

## Context
Use `evidence/research.md`, `rules/transport-security-rules.md`, and the actual production transport path.

## Stages
1. **Observe** — collect current transport behavior and public advisory/spec evidence.
2. **Measure baseline** — execute hostile and approved fixtures; record dispatch reachability.
3. **Diagnose** — locate earliest enforcement point and proxy/header transformations.
4. **Form hypothesis** — state which missing/ambiguous check permits the path.
5. **Implement improvement** — add deny-by-default Host/Origin/proxy validation before dispatch.
6. **Measure again** — rerun identical fixtures.
7. **Independent verification** — Security Verifier confirms enforcement point and evidence.
8. **Complete** — record Implemented, Measured, Verified.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
`python scripts/origin_host_gate.py`, `python -m unittest tests/test_origin_host_gate.py`, framework integration tests, local HTTP client.

## Outputs
Before/after results, effective policy, integration evidence, verification verdict, residual risks.

## Checkpoints
- Baseline recorded before change.
- No wildcard policy.
- Enforcement occurs before JSON-RPC dispatch.
- Approved clients still pass.
- Independent verifier signs off.

## Metrics
Hostile rejection rate, approved pass rate, dispatch-before-reject count, wildcard count, regression count.

## Retry policy
Maximum 2 implementation/test cycles after the first failed post-change measurement.

## Stop conditions
Stop and block deployment when a hostile fixture reaches dispatch after maximum retries, proxy trust is ambiguous, or approved behavior can only be restored by weakening security.

## Failure path
Preserve evidence; revert exposure or restrict the endpoint behind a verified boundary; escalate to security/platform owner. Dangerous changes require explicit human approval.

## Verification
Security verifier reruns tests from clean state and inspects the real enforcement point.

## Definition of Done
Evidence documented; baseline captured; patch/integration implemented; hostile fixtures blocked; approved fixtures pass; no secrets exposed; residual risks documented; independent verification complete.
