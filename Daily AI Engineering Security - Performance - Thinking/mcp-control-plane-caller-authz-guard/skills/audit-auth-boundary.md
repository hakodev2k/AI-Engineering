# Skill: Audit MCP Caller Authorization Boundary

## Purpose
Determine whether an MCP deployment preserves separate trust boundaries for the inbound caller and the privileged backend credential used by the server.

## Trigger
Run before exposing an MCP HTTP/SSE listener, after changing bind/proxy/auth settings, after enabling mutating tools, after changing backend credentials, and during incident review.

## Inputs
- Listener bind address and port.
- Whether the listener is reachable outside the host/pod.
- Inbound authentication mechanism and whether it yields a distinct caller identity.
- Authorization policy mapping callers to tools/actions.
- Backend credential type and scope.
- Enabled MCP tools and whether they mutate state.
- Read-only/sandbox settings.
- Reverse-proxy and network-policy configuration.

## Preconditions
The reviewer MUST have the effective deployment configuration, not only template defaults. Secrets MUST be represented by presence/scope metadata, never copied into this skill's outputs.

## Required context
Runtime transport, network path, trust zones, caller classes, backend service, enabled tool inventory, and approval requirements.

## Allowed tools
Configuration readers, deployment manifests, socket/listener inspection, network-policy inspection, MCP tool enumeration, audit logs, and `scripts/verify_mcp_auth_boundary.py`.

## Constraints
- MUST NOT print or persist raw tokens.
- MUST NOT send test mutations to production merely to prove access.
- MUST treat network reachability and application-layer authorization as separate controls.
- MUST require human approval for any active test that can change backend state.

## Procedure
1. Draw two explicit trust directions: caller → MCP server and MCP server → backend.
2. Record the effective bind address and all routes/proxies that can reach it.
3. Identify what proves inbound caller identity. Distinguish shared-secret possession from per-caller identity.
4. Enumerate enabled tools and classify each as read, write, destructive, credential/data export, or administrative.
5. Record backend credential scope and whether it can perform every enabled tool action.
6. Build a caller/tool matrix. Each mutating or administrative tool MUST have an explicit authorized caller set.
7. Run the deterministic checker against a normalized JSON deployment record.
8. If the checker blocks, reduce exposure, add inbound authentication/authorization, reduce backend scope, or disable mutating tools; then rerun.
9. Independently verify the effective listener, proxy and tool surface from runtime evidence.

## Decision points
- Wildcard/public bind + no inbound authentication + backend credential: BLOCK.
- Mutating tools + no per-caller authorization: BLOCK.
- Backend credential broader than tool requirement: REMEDIATE before verification.
- Read-only tools with authenticated, constrained callers: eligible for verification.

## Expected output
A boundary review containing effective exposure, caller identities, authorization matrix, backend scope, checker result, residual risks, and verification evidence.

## Metrics
- Unauthorized mutating paths: target 0.
- Unauthenticated reachable privileged listeners: target 0.
- Mutating tools without explicit caller policy: target 0.
- Backend privileges unused by enabled tools: target minimized and documented.

## Verification
An independent reviewer MUST confirm that the runtime bind/proxy path matches the reviewed configuration and that blocked caller/tool combinations cannot reach privileged execution.

## Failure handling
Capture the failed invariant and evidence. Retry only after a concrete configuration change, maximum 3 remediation cycles. If still unsafe, disable external reach or mutating tools and escalate to the service owner/security reviewer.

## Stop conditions
Stop with failure if effective caller identity cannot be established, runtime exposure cannot be determined, a privileged listener is unauthenticated, or a required dangerous active test lacks human approval.
