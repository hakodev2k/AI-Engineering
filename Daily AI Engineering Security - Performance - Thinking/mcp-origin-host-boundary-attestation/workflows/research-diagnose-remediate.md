# Workflow: Research, Diagnose, Remediate, Verify

## Trigger
A new/changed MCP Streamable HTTP endpoint or a failed boundary preflight.

## Goal
Prove that the deployed endpoint enforces the intended Host/Origin trust boundary while preserving valid MCP traffic.

## Inputs
Policy, SDK/version, listener/auth/proxy configuration, valid request fixtures, and malicious Host/Origin fixtures.

## Baseline
Record current results for valid Host+Origin, foreign Host, foreign Origin, missing Origin, bind mode, and authentication state before changes.

## Context
Use `evidence/research.md` and the MCP transport specification as the normative security baseline.

## Stages
1. **Observe** — inventory listener, SDK, framework, proxy, CORS and auth layers.
2. **Measure baseline** — run policy and owned-endpoint negative cases.
3. **Diagnose** — locate the first layer that accepts a request that policy says should be rejected.
4. **Form hypothesis** — state the configuration/code change expected to restore the invariant.
5. **Implement improvement** — change the narrowest responsible layer; do not broaden trusted origins.
6. **Measure again** — rerun all baseline cases.
7. **Improved?** — if no, perform at most one additional diagnosis/remediation cycle.
8. **Independent verify** — Security Verifier checks all evidence.

## Responsible agent
Implementer owns stages 1–7. `subagents/security-verifier.md` owns stage 8.

## Tools
Configuration/dependency inspection, authorized HTTP client, `scripts/mcp_boundary_probe.py`, and unit/integration tests.

## Outputs
Before/after matrix, remediation diff, verification record, and remaining-risk statement.

## Checkpoints
- C1: effective topology documented.
- C2: baseline captured before modification.
- C3: failing boundary attributed to a layer.
- C4: negative and positive tests rerun.
- C5: independent verification complete.

## Metrics
Negative-case rejection rate, valid-case pass rate, unknown-state count, and regression count.

## Retry policy
Maximum two remediation attempts per failure class. A retry MUST change the hypothesis or implementation evidence.

## Stop conditions
Stop on verified pass, after two failed remediation attempts, or when effective behavior cannot be safely tested.

## Failure path
Preserve current security settings, mark status Not Verified, capture evidence, and escalate to the endpoint owner. Never bypass the boundary to obtain a green test.

## Verification
Security Verifier confirms foreign Host and Origin requests are rejected before MCP dispatch and valid requests still work.

## Definition of Done
Evidence documented; baseline captured; limitation identified; remediation implemented where needed; policy and integration tests pass; risks documented; independent verification complete; no blocking unknown remains.
