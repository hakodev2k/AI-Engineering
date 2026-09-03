# Skill: Transport Boundary Assessment

## Purpose
Determine whether an MCP Streamable HTTP endpoint has an explicit, testable browser-origin trust boundary rather than relying on undocumented SDK or framework defaults.

## Trigger
New MCP HTTP endpoint, SDK upgrade, proxy/CORS change, bind-address change, authentication change, or security review.

## Inputs
`config/policy.json`, deployment configuration, effective Host/Origin behavior, SDK/version, and representative request cases.

## Preconditions
The reviewer can identify the actual HTTP listener and all middleware/proxies in front of it.

## Required context
MCP transport type, listener address, authentication mode, reverse proxy behavior, CORS middleware, SDK version, and whether browsers can reach the endpoint.

## Allowed tools
Repository/config inspection, dependency inspection, local integration tests, HTTP clients against owned test endpoints, and `scripts/mcp_boundary_probe.py`.

## Constraints
- MUST NOT weaken authentication or bind scope to make tests pass.
- MUST NOT treat SDK version alone as proof of effective protection.
- MUST NOT test third-party endpoints without authorization.
- SHOULD use loopback fixtures for negative tests.

## Procedure
1. Identify every HTTP boundary from browser/network to MCP handler.
2. Record the effective bind mode: loopback, authenticated-private, or public.
3. Record whether authentication is required and where it is enforced.
4. Resolve the expected Host allowlist and exact Origin tuples.
5. Compare those values with `config/policy.json`.
6. Run the policy oracle against valid and malicious fixtures.
7. On an owned integration endpoint, verify foreign Host and foreign Origin requests are rejected before MCP tool dispatch.
8. Verify wildcard CORS is absent for credential-bearing or local/private MCP endpoints.
9. Capture results as Implemented, Measured, and Verified separately.

## Decision points
- Unknown effective Host/Origin handling -> block verification.
- Wildcard origin -> block.
- Public/private bind without required authentication -> block.
- SDK patched but proxy overrides validation -> block until effective behavior passes.

## Expected output
A boundary assessment containing listener scope, authentication status, policy inputs, negative-test results, remaining risks, and verification status.

## Metrics
Negative-case rejection rate, unknown-state count, wildcard count, and regression pass rate.

## Verification
A verifier independent of the implementer checks policy and negative tests. A claim is Verified only after both Host and Origin failure paths are observed or deterministically enforced at an upstream boundary.

## Failure handling
Capture the failing request class and responsible layer. Retry after at most two configuration/code corrections; otherwise escalate to the endpoint owner.

## Stop conditions
Stop when all required negative cases pass, or after two failed remediation cycles, or when effective deployment state cannot be established.
