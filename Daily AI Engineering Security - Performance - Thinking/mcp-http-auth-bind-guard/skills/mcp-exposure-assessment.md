# Skill: MCP Exposure Assessment

## Purpose
Determine whether an MCP deployment preserves network, identity, permission, and approval boundaries before sensitive tools become reachable.

## Trigger
New MCP server; transport change; added dangerous tool; reverse-proxy change; security advisory; deployment to a new network.

## Inputs
Listener addresses/ports; transport type; authentication path; tool catalog; permission policy; proxy/firewall topology; build/commit provenance; exception approvals.

## Preconditions
Read-only access to configuration and deployment metadata. Do not execute dangerous tools during discovery.

## Required context
Actual effective listener and middleware chain, not only intended configuration.

## Allowed tools
Configuration readers, socket/listener inspection, dependency/advisory lookup, safe HTTP clients for negative-auth tests, this package's checker.

## Constraints
No credential disclosure. No destructive tool invocation. Production-impacting tests require approval.

## Procedure
1. Inventory each MCP endpoint and classify bind scope: loopback, private, wildcard, public.
2. Trace authentication end to end, including direct backend reachability that might bypass a proxy.
3. Classify tools by capability; mark command execution, arbitrary write/delete, credential access, deployment, browser action, and repository write as dangerous.
4. Record identity-to-capability authorization and human-approval requirements.
5. Run `scripts/check_mcp_exposure.py` against the modeled deployment.
6. For every finding, collect evidence and identify whether root cause is bind scope, missing auth, capability policy, or bypass route.
7. After remediation, rerun the checker and execute safe negative-auth probes.
8. Hand results to an independent Security Reviewer.

## Decision points
- Wildcard/public + no auth: block.
- Dangerous capability + no auth: block.
- Proxy-authenticated but backend directly reachable: block.
- Local-only unauthenticated benign tools: require explicit, time-bounded exception if organizational policy allows.

## Expected output
Listener inventory, trust-boundary map, violations, remediation evidence, verification status.

## Metrics
Zero unauthenticated externally reachable endpoints; zero dangerous unauthenticated capabilities; zero proxy-bypass paths; 100% blocking findings remediated or formally approved.

## Verification
Checker passes and negative-auth requests cannot invoke protected tools.

## Failure handling
Retry evidence collection once for transient inspection errors. Do not infer safety from missing data.

## Stop conditions
Stop and escalate if effective auth cannot be determined, a dangerous tool is reachable without auth, or testing would require unsafe production actions.