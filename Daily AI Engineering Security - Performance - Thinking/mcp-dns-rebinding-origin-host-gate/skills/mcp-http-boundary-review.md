# Skill: MCP HTTP Boundary Review

## Purpose
Establish whether a Streamable HTTP MCP endpoint is protected against browser-origin and host-routing confusion before any MCP capability is dispatched.

## Trigger
New MCP HTTP endpoint, SDK upgrade, reverse-proxy change, bind-address change, browser integration, or security review.

## Inputs
Listener/bind address, intended clients, Host/Origin policy, proxy topology, authentication model, enabled MCP capabilities, SDK/version.

## Preconditions
A representative deployment configuration is available. High-impact tool inventory is known.

## Required context
MCP transport path from socket/proxy to JSON-RPC dispatcher, effective header source, and which components can rewrite Host/Origin.

## Allowed tools
Repository inspection, configuration inspection, HTTP fixture generation, deterministic scripts/tests, vendor advisories/specification.

## Constraints
Do not probe third-party systems without authorization. Do not weaken authentication or bind scope to simplify testing.

## Procedure
1. Draw the trust path: browser/native client -> DNS -> listener/proxy -> MCP transport -> dispatcher -> tools.
2. Record listener addresses and whether a browser can route to them.
3. Identify where effective Host and Origin are obtained and normalized.
4. Identify all trusted proxies and whether forwarded headers are accepted from untrusted peers.
5. Establish the explicit allowlists and missing-Origin policy.
6. Run `python -m unittest tests/test_origin_host_gate.py`.
7. Map the reference policy to the production framework and add equivalent integration tests before dispatch.
8. Exercise: approved native client, approved browser origin, foreign origin, rebound hostname, wildcard/ambiguous host, untrusted forwarded host, non-loopback bind when disallowed.
9. Confirm denied requests cannot reach `tools/list`, `tools/call`, resources, prompts, or session creation.
10. Record Implemented, Measured, and Verified separately.

## Decision points
- If the service intentionally accepts public browser origins, enumerate exact origins and require authentication/authorization in addition to the gate.
- If forwarded headers are required, restrict trust to known proxy peers and test direct-to-backend traffic.
- If the framework cannot enforce before dispatch, block production use until an earlier middleware/enforcement point exists.

## Expected output
A boundary map, policy, attack-fixture results, residual risks, and deployment decision.

## Metrics
Hostile fixture rejection rate, approved-client pass rate, pre-dispatch blocking coverage, wildcard count, and untrusted-forwarded-header acceptance count.

## Verification
Independent reviewer confirms the production enforcement point and regression evidence, not only the reference script.

## Failure handling
Capture the exact failing fixture and enforcement layer. Retry implementation/test at most twice. If still failing, disable HTTP exposure or restrict it behind a verified boundary and escalate.

## Stop conditions
Stop with failure if any hostile fixture reaches MCP dispatch, if proxy trust cannot be determined, or if production policy contains wildcard Host/Origin values.
