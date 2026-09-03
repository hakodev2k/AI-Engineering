# Skill: Listener Exposure Assessment

## Purpose
Determine whether an MCP network transport is reachable beyond its intended trust boundary and whether inbound caller authentication matches that reachability.

## Trigger
Before enabling HTTP/SSE/streamable HTTP, changing a bind host, publishing a container port, adding a proxy, or provisioning privileged downstream credentials.

## Inputs
Configured bind host/port, effective listening socket, container/proxy publishing rules, inbound authentication state, downstream credential state, Host/Origin policy, and transport type.

## Preconditions
The deployment can inspect application configuration and effective socket/proxy exposure.

## Required context
Know which callers are intended, which network segments can reach the service, and what tools/downstream authorities the MCP server possesses.

## Allowed tools
Socket inspection, container/Kubernetes configuration inspection, reverse-proxy config, deterministic `scripts/listener_policy_check.py`, integration tests, and non-secret request logs.

## Constraints
- MUST treat non-loopback reachability as an explicit trust-boundary expansion.
- MUST distinguish inbound caller credentials from downstream service credentials.
- MUST NOT infer caller authorization from possession of an Argo CD/GitHub/cloud/API token held by the server.
- MUST NOT accept “behind a firewall” as the sole control for a privileged MCP listener.

## Procedure
1. Classify the configured bind address as loopback or non-loopback.
2. Determine effective exposure after Docker/Kubernetes/proxy/port-publishing rules.
3. Inventory inbound authentication and downstream credentials separately.
4. Enforce the invariant: any non-loopback effective exposure requires inbound authentication.
5. Verify inbound and downstream secrets are logically distinct and cannot substitute for each other.
6. For HTTP transports, validate Host policy; if browser reachable, validate allowed Origin and DNS-rebinding protection.
7. Enumerate the tool authority available to a successful caller and classify impact if auth is bypassed.
8. Run deterministic startup-policy tests and unauthorized request tests.
9. Record actual listening endpoints and policy decision without exposing secrets.

## Decision points
- If effective exposure is wider than configured intent, block deployment until reachability is reduced or auth is added.
- If the same credential is used inbound and downstream, require redesign unless an explicit security review proves separation is impossible and acceptable.
- If browser reachability exists and Host/rebinding behavior cannot be verified, block browser-facing deployment.

## Expected output
Exposure classification, auth/credential-role assessment, tool-authority impact, allow/deny decision, and evidence references.

## Metrics
100% rejection of exposed unauthenticated configurations, zero credential-role confusion, 100% listener attestation coverage, and zero unauthorized tool invocations in tests.

## Verification
Run the deterministic policy checker and then attest the actual listening socket/proxy path in a non-production environment.

## Failure handling
Fail startup or deployment. Preserve evidence and require an explicit security owner for exceptions.

## Stop conditions
Stop when configured and effective exposure match, required authentication is enforced, Host/Origin/rebinding controls are verified where applicable, and an independent reviewer confirms the result.
