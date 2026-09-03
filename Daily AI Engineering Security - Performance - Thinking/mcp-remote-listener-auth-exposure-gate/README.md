# MCP Remote Listener Authentication Exposure Gate

## Topic
Prevent unauthenticated or under-authorized remote access to privileged MCP HTTP/SSE tool surfaces.

## Category
Security

## Problem
MCP services can bind to non-loopback interfaces while accepting sessions without reliable caller authentication/authorization. When tools use server-side credentials, reachable network clients may act with the server's authority.

## Evidence
See `evidence/research.md`. Current 2026 advisories include the Critical CVE-2026-82456 for `argocd-mcp`, plus independently reviewed exposures in `mcp-pinot`, Network-AI, MCP Atlassian, and PraisonAI.

## Existing approach
Upgrade affected servers, bind to loopback, add OAuth/auth middleware, use authenticated reverse proxies, and restrict network reachability.

## Existing limitations
These controls are often configured independently. A proxy can be bypassed by a directly reachable backend; network adjacency is not caller identity; authorization may remain too broad; container publishing can change effective reachability; browser-reachable transports need Origin protections.

## Proposed improvement
Treat remote listener scope as a deployment invariant. Deterministically block non-loopback exposure unless caller identity and authorization are enforced, proxy bypass is impossible, and browser-reachable transports have Origin protection.

## Architecture
```text
config/policy.example.json
        |
        v
scripts/listener_policy_check.py ---> PASS / FAIL
        ^                              |
        |                              v
skills/exposure-assessment.md   independent verification
        |                              |
        +--> workflow -----------------+
```

## Actual package tree
```text
README.md
evidence/research.md
config/policy.example.json
scripts/listener_policy_check.py
tests/test_listener_policy_check.py
skills/exposure-assessment.md
rules/remote-listener-security.md
subagents/security-verifier.md
workflows/harden-and-verify.md
hooks/predeploy-exposure-gate.md
```

## Installation
Requires Python 3.9+ and only the standard library. Copy the package directory into the engineering repository or policy toolkit.

## Configuration
Create a policy JSON using `config/policy.example.json` as the schema-by-example. Populate it from effective runtime/deployment state, not intended defaults.

## Usage
```bash
python scripts/listener_policy_check.py config/policy.example.json --json
python -m unittest tests/test_listener_policy_check.py
```

A loopback-only development listener may pass without remote authentication. A non-loopback listener must meet the remote security invariants.

## Workflow
Follow `workflows/harden-and-verify.md`: Observe -> measure baseline -> diagnose -> form hypothesis -> implement -> measure again -> independent verification. Retries are bounded to two remediation attempts.

## Metrics
- Unauthenticated remote tool dispatches: 0.
- Remote listeners lacking explicit authorization: 0.
- Authenticated-proxy bypass paths: 0.
- Browser-reachable HTTP/SSE endpoints without Origin protection: 0.
- Security regression tests: 100% pass.

## Verification
The final verifier must independently reproduce the policy result and prove that an unauthorized request is rejected before tool execution. Successful implementation is not equivalent to verification.

### Implemented
The package provides a fail-closed checker, enforceable rules, workflow, hook, unit tests, and independent verifier contract.

### Measured
A deployment is measured only after effective listener/network/auth state is encoded and the checker plus negative probe are run.

### Verified
A deployment is verified only after an independent reviewer confirms the attack path is blocked and legitimate authorized operation remains functional.

## Safety
Do not use destructive tools during negative testing. Do not log tokens, cookies, API keys, upstream credentials, or full sensitive requests. Never weaken network or identity controls to obtain a passing result.

## Failure handling
Detection: non-zero checker/test result or unauthorized request reaching dispatch. Evidence: policy output, topology/listener snapshot, redacted probe result. Retry policy: maximum two remediation attempts. Fallback: keep loopback-only or disable remote transport. Escalation: platform/security owner. Stop condition: verified PASS or blocked deployment with documented unresolved exposure.

## Definition of Done
Evidence documented; existing approaches and gaps recorded; effective listener state measured; all deterministic tests pass; unauthorized remote dispatch is blocked; authorization and Origin requirements are satisfied where applicable; proxy bypass is absent; no secrets are exposed; independent verification is complete; no blocking issue remains.

## Customization
Extend the JSON/checker with organization-specific transport types, mTLS requirements, identity-provider claims, tool risk tiers, ingress identities, or explicit approved exceptions. Preserve fail-closed behavior for missing required evidence.
