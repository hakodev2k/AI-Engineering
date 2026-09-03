# Skill: MCP Listener Exposure Assessment

## Purpose
Determine whether an MCP HTTP/SSE deployment exposes privileged tools beyond its intended trust boundary.

## Trigger
Any bind-host, ingress, proxy, authentication, authorization, credential, or transport change.

## Inputs
Deployment descriptor; effective bind host and published ports; authentication and authorization controls; Origin validation; proxy topology; tool privilege; upstream credentials.

## Preconditions
The assessor can inspect effective runtime/deployment configuration. Do not infer safety from documentation alone.

## Required context
Network path from caller to MCP process, where identity is checked, whether the backend is bypass-reachable, and what authority tools inherit.

## Allowed tools
Configuration readers, `ss`/`netstat`, container/Kubernetes inspection, firewall/NetworkPolicy readers, safe unauthenticated negative probes, and `scripts/listener_policy_check.py`.

## Constraints
MUST NOT invoke destructive tools during verification. MUST NOT print secrets. MUST treat `0.0.0.0`, `::`, and non-loopback addresses as remote-capable until network evidence proves otherwise.

## Procedure
1. Record the baseline listener, exposed ports, ingress/proxy path, and tool authority.
2. Classify the listener as loopback-only or remote-capable.
3. Locate the first mandatory caller-identity check on every reachable path.
4. Confirm authorization is narrower than mere authentication when tools are privileged.
5. Verify Origin validation for browser-reachable HTTP/SSE transports.
6. Check that an authenticated proxy cannot be bypassed through a directly reachable backend port.
7. Record server-side credentials and classify read/write/destructive capabilities.
8. Encode the effective state in the policy JSON and run the deterministic checker.
9. Perform a safe negative test: unauthenticated initialization/tool dispatch must be rejected before tool execution.
10. Hand evidence to an independent verifier.

## Decision points
Remote listener + no identity enforcement => FAIL. Proxy-authenticated + directly reachable backend => FAIL. Remote browser-reachable transport + missing Origin protection => FAIL unless a documented architecture proves browsers cannot reach it and an approved exception exists. Loopback-only listener => remote-auth requirement may be waived, but local privilege remains documented.

## Expected output
PASS/FAIL, violations, network-path evidence, negative-test evidence, and remediation.

## Metrics
Unauthorized tool calls reaching dispatch; remote listeners without auth; proxy bypass paths; Origin-validation coverage.

## Verification
Independent reviewer reproduces the policy result and validates at least one unauthorized request is rejected before a privileged handler runs.

## Failure handling
If topology is unknown, fail closed. Maximum two evidence-collection retries; then escalate for human network review.

## Stop conditions
Stop only after PASS evidence is collected or a blocking exposure is documented and deployment remains blocked.
