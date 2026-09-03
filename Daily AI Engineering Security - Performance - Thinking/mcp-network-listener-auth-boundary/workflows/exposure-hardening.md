# Workflow: MCP Listener Exposure Hardening

## Trigger
A network MCP transport is introduced or its effective reachability/authentication changes.

## Goal
Ensure the effective listener trust boundary matches caller authentication and tool authority.

## Inputs
Bind configuration, deployment networking, inbound auth, downstream credentials, tool inventory, and Host/Origin policy.

## Baseline
Record configured bind host, actual listening socket, externally reachable path, whether an unauthenticated caller can establish a session, and which tools/downstream credentials are reachable.

## Context
Local MCP assumptions do not automatically survive HTTP, Docker, Kubernetes, reverse proxies, or port publishing.

## Stages
1. **Observe** — inventory transports, listeners, proxies, published ports, credentials, and tool authority.
2. **Measure baseline** — test current startup policy and one isolated unauthorized request path.
3. **Diagnose** — identify whether exposure, missing auth, credential-role confusion, or Host/Origin behavior creates the gap.
4. **Form hypothesis** — define the smallest secure change: loopback default, mandatory inbound auth, proxy restriction, Host/Origin/rebinding validation, or authority reduction.
5. **Implement** — apply secure defaults and startup checks before tool registration/use.
6. **Measure again** — repeat listener/socket and unauthorized-request evidence.
7. **Re-evaluate if not improved** — maximum 2 retries; each retry must update the hypothesis based on new evidence.
8. **Independent verify** — `subagents/network-security-verifier.md` verifies deployment-equivalent behavior.
9. **Complete** — approve only after all blocking invariants pass.

## Responsible agent
Implementation engineer for stages 1-7; independent Network Security Verifier for stage 8.

## Tools
`listener_policy_check.py`, socket/container/proxy inspection, integration tests, and non-secret auth telemetry.

## Outputs
Baseline, policy decision, before/after exposure record, auth evidence, tool-impact assessment, and verification status.

## Checkpoints
- Effective listener recorded.
- Inbound and downstream credentials inventoried separately.
- Non-loopback auth invariant enforced.
- Host/Origin/rebinding controls checked where applicable.
- Unauthorized request test passes.
- Independent verification complete.

## Metrics
Rejected exposed-unauthenticated starts, unauthorized tool invocation count, listener attestation coverage, credential-role violations, and security regression pass rate.

## Retry policy
Maximum 2 implementation retries after the initial attempt.

## Stop conditions
Stop and escalate if an exposed deployment cannot enforce inbound auth, if effective socket exposure cannot be determined, or if a required proxy/browser topology prevents reliable Host/rebinding validation.

## Failure path
Disable the network transport, bind to loopback, remove privileged downstream credentials, or isolate the service until security review. Never keep an exposed unauthenticated listener for convenience.

## Verification
Independent verifier confirms effective exposure, startup gate, unauthorized denial, credential separation, and applicable browser/rebinding defenses.

## Definition of Done
Evidence documented; baseline captured; secure bind/auth policy implemented; actual listener measured; unauthorized access blocked; downstream authority preserved behind caller auth; tests pass; risks documented; independent verification complete; no blocking issue remains.
