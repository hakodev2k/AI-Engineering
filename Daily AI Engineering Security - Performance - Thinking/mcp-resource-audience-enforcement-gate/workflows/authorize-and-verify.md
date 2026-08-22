# Workflow — Authorize and Verify

## Trigger
A remote HTTP MCP server is protected with OAuth or an authorization change affects issuer, audience, resource, scopes, or gateway delegation.

## Goal
Enforce current MCP resource-binding requirements and prove that valid-but-wrong-resource tokens cannot reach protected tools.

## Inputs
Canonical MCP resource URI, issuer metadata, audience configuration, operation-scope map, trusted middleware claims, security fixtures.

## Baseline
Record current middleware behavior for: intended token, wrong resource, wrong audience, wrong issuer, missing scope, and unverified claims. Do not use production secrets in fixtures.

## Stages
1. **Observe** — map client → authorization server → gateway → MCP resource server trust boundaries.
2. **Measure baseline** — run negative cases against the existing boundary and record which are incorrectly accepted.
3. **Diagnose** — identify whether the gap is token acquisition, gateway forwarding, canonical resource configuration, audience validation, or scope enforcement.
4. **Form hypothesis** — define one explicit boundary fix.
5. **Implement** — configure trusted crypto verification first, then invoke `scripts/audience_gate.py` before tool dispatch.
6. **Measure again** — replay the same positive and negative fixtures.
7. **Verify independently** — `subagents/security-verifier.md` reviews results and topology.

## Responsible agent
Identity/security implementer for stages 1–6; independent security verifier for stage 7.

## Tools
OAuth/JWT middleware, metadata discovery, deterministic gate script, test runner, redacted logs, repository/config diff.

## Outputs
Trust-boundary map, baseline results, configuration diff, gate results, negative-test report, verification record.

## Checkpoints
- Claims are cryptographically verified upstream.
- Canonical resource is not derived from untrusted headers.
- Issuer/audience/resource checks are explicit.
- Operation scopes are enforced before dispatch.
- No raw bearer token appears in logs or fixtures.

## Metrics
Wrong-resource denial rate, wrong-audience denial rate, wrong-issuer denial rate, missing-scope denial rate, positive-fixture success rate, security-test pass rate.

## Retry policy
At most 2 implementation retries per diagnosis. Any retry MUST preserve fail-closed behavior.

## Stop conditions
All negative fixtures deny and intended positive fixtures allow; or identity/resource semantics remain ambiguous; or compatibility would require weakening authorization.

## Failure path
Keep the endpoint fail-closed, preserve evidence, revert unsafe compatibility changes, and escalate resource/issuer design to a human security owner.

## Verification
Implemented = gate integrated. Measured = baseline and candidate fixture outcomes captured. Verified = independent reviewer confirms all required negative cases deny, positive cases allow, and secrets remain protected.

## Definition of Done
Evidence documented, trust boundaries mapped, canonical resource configured, gate integrated, negative fixtures pass, positive fixtures pass, verifier approves, no secrets exposed, and no blocking authorization ambiguity remains.
