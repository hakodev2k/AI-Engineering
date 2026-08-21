# Workflow — MCP OAuth Conformance and Regression

## Trigger
Protected MCP connector implementation or upgrade, OAuth provider change, client/server version change, resource metadata change, or auth-related incident.

## Goal
Prove resource-bound authorization and prevent wrong-audience acceptance or inbound-token passthrough.

## Inputs
Canonical resource URI, provider metadata, request captures, claim summaries, configured issuer/audience/scopes, downstream request trace.

## Baseline
Capture current behavior before changes: whether `resource` is present at authorization/token endpoints, accepted audiences, negative-test outcomes, and whether inbound tokens appear downstream.

## Context
Use non-production credentials and sanitized captures. Record component versions so results are reproducible.

## Stages
1. Observe current authorization flow.
2. Measure baseline conformance controls.
3. Diagnose missing resource binding, audience validation, or token separation.
4. Form a concrete hypothesis for each failure.
5. Implement the smallest standards-conformant change.
6. Re-run the same captures/tests.
7. Execute negative fixtures: wrong audience, wrong issuer, expired token, insufficient privilege, and inbound-token passthrough.
8. Independent reviewer validates evidence.

## Responsible agent
Integration owner implements. OAuth Boundary Reviewer verifies independently.

## Tools
HTTP test client/proxy, provider metadata endpoints, `scripts/oauth_conformance_gate.py`, authentication test suite.

## Outputs
Before/after conformance report, failing-control evidence, sanitized traces, independent verdict.

## Checkpoints
- Canonical resource URI established.
- `resource` verified in both requests.
- Audience and issuer checks active server-side.
- Negative fixtures fail as expected.
- Downstream token fingerprint differs from inbound MCP token fingerprint.

## Metrics
Controls passed/total; wrong-audience accepts; wrong-issuer accepts; passthrough detections; negative-test coverage; regressions by version combination.

## Retry policy
Maximum 2 remediation cycles. Each retry MUST be linked to a specific failed control and new evidence.

## Stop conditions
Stop and block enablement if provider/client cannot produce resource-bound tokens, server cannot validate audience, token passthrough remains, or secret-safe evidence cannot be collected.

## Failure path
Disable or keep connector disabled; preserve sanitized evidence; use separate upstream credential flow; escalate interoperability blockers to provider/client maintainers.

## Verification
Independent reviewer reruns all negative fixtures and checks sanitized downstream fingerprints.

## Definition of Done
Implemented: conformant resource/audience handling configured. Measured: baseline and post-change controls captured. Verified: all negative fixtures rejected, no passthrough, independent review passed.