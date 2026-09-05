# Skill: Auth Boundary Assessment

## Purpose
Prove that MCP gateway authentication failures cannot become accepted identities or gain tool access.

## Trigger
LiteLLM upgrade/change; MCP enablement; OAuth2 passthrough change; auth advisory; gateway/reverse-proxy change.

## Inputs
Effective gateway version/build, MCP routes, auth modes, targeted MCP servers, tool permissions, proxy topology, negative-test endpoint.

## Preconditions
Read-only discovery access. Production probes must be non-destructive.

## Required context
Actual deployed request path and effective configuration, not documentation alone.

## Allowed tools
Version inspection, config/source reads, safe HTTP negative probes, dependency/advisory lookup, package checker.

## Constraints
Never use stolen/real user tokens. Never invoke destructive tools. No auth downgrade for troubleshooting.

## Procedure
1. Confirm deployed version/build provenance.
2. Inventory every MCP route and direct backend path.
3. Map valid auth modes and public discovery exceptions.
4. Identify OAuth2 passthrough targets explicitly configured as OAuth2.
5. Map anonymous/invalid identity to effective MCP server/tool permissions.
6. Run `scripts/check_litellm_mcp_auth.py`.
7. Execute negative cases: no token, random bearer token, malformed token, public-discovery-like query/path variations.
8. Record status code and whether any MCP session/tool list/call is accepted.
9. Remediate and repeat.
10. Hand evidence to independent Security Verifier.

## Decision points
Any vulnerable exposed version, malformed-token acceptance, over-broad public exception, or anonymous sensitive-tool access blocks release.

## Expected output
Facts, route/auth matrix, tool-permission matrix, negative-test evidence, findings, verification status.

## Metrics
0 malformed-token accepted sessions; 0 anonymous sensitive tools; 100% sensitive routes covered by negative tests.

## Verification
Independent verifier reproduces the deterministic gate and at least one invalid-token test per exposed MCP route.

## Failure handling
Retry transient connectivity once. Unknown auth state is blocking.

## Stop conditions
Stop on confirmed bypass, unknown effective build, or a probe that would require destructive execution.