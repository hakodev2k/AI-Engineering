# MCP Network Listener Authentication Boundary

**Category:** Security

## Problem
Network MCP transports can expose a local-tool trust model to remote callers. Recent critical advisories show MCP servers and aggregators binding beyond loopback while requiring no inbound caller credential, allowing any reachable client to use the server's privileged downstream credentials and tool surface.

## Evidence
See [`evidence/research.md`](evidence/research.md). The package is grounded in `argocd-mcp` GHSA-rp45-5x3v-48mr / CVE-2026-82456 and `mcp-router` CVE-2026-81094, plus current `mcp-for-argocd` operator guidance.

## Existing approach
Many projects document “local use,” expose optional bearer-token flags, bind broadly for container convenience, or rely on surrounding network controls.

## Existing limitations
Documentation and network placement do not prove caller identity. Container publishing and proxies can expand reachability, while downstream API tokens authenticate the MCP server to another service rather than authenticating the inbound MCP caller.

## Proposed improvement
Couple bind reachability and authentication as a startup invariant: loopback by default; any effective non-loopback listener requires inbound auth. Keep inbound and downstream credentials separate, validate Host for exposed HTTP transports, add Origin/DNS-rebinding defenses when browser reachable, and verify the effective listening socket after deployment indirection.

## Architecture
The package combines policy, listener-exposure assessment, enforceable rules, independent network-security verification, a bounded hardening workflow, a deterministic preflight hook, and a dependency-free reference startup policy checker.

## Package tree
```text
mcp-network-listener-auth-boundary/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── preflight-listener-gate.md
├── rules/
│   └── listener-auth-rules.md
├── scripts/
│   └── listener_policy_check.py
├── skills/
│   └── listener-exposure-assessment.md
├── subagents/
│   └── network-security-verifier.md
├── tests/
│   └── test_listener_policy_check.py
└── workflows/
    └── exposure-hardening.md
```

## Installation
Python 3.10+ is sufficient for the reference checker/tests. Production integration must additionally inspect the deployment-equivalent socket, container/Kubernetes exposure, and proxy behavior.

## Configuration
`config/policy.json` encodes secure defaults. Wider network exposure is allowed only when required inbound authentication and related HTTP/browser controls are present.

## Usage
From the package root:

```bash
python -m unittest tests/test_listener_policy_check.py
python scripts/listener_policy_check.py \
  --policy config/policy.json \
  --bind-host 127.0.0.1 \
  --transport http \
  --inbound-auth false \
  --downstream-credential false
```

An exposed example should include inbound authentication and Host validation:

```bash
python scripts/listener_policy_check.py \
  --policy config/policy.json \
  --bind-host 0.0.0.0 \
  --transport http \
  --inbound-auth true \
  --host-validation true \
  --downstream-credential true
```

## Workflow
Follow [`workflows/exposure-hardening.md`](workflows/exposure-hardening.md): Observe → baseline → diagnose → hypothesis → implement → measure again → bounded retry → independent verification.

## Metrics
- 100% rejection of non-loopback unauthenticated startup configurations.
- Zero inbound/downstream credential-role confusion.
- Zero unauthorized tool invocations in tests.
- 100% effective-listener attestation for network MCP deployments.
- 100% Host/Origin/rebinding regression-test pass rate where applicable.

## Verification
Run [`hooks/preflight-listener-gate.md`](hooks/preflight-listener-gate.md), then independently verify actual deployment reachability with [`subagents/network-security-verifier.md`](subagents/network-security-verifier.md). The reference checker validates policy inputs; it does not replace real socket/proxy attestation.

## Safety
Use dummy credentials and isolated test deployments. Never expose a test listener with production downstream tokens. Do not log bearer tokens or service credentials.

## Failure handling
Detection: an exposed listener starts without auth, an unauthorized caller establishes a session, effective reachability exceeds intent, or Host/rebinding controls are missing. Evidence: preserve non-secret startup and socket/proxy evidence. Retry: maximum 2 implementation retries after the initial attempt, each with a revised hypothesis. Fallback: disable the network transport, bind to loopback, or remove privileged downstream credentials. Escalation: human security owner. Stop condition: inability to enforce inbound auth or determine effective exposure.

## Definition of Done
**Implemented:** secure bind/auth startup policy and required HTTP/browser protections are in the production path. **Measured:** configured and actual listener exposure plus unauthorized-request baseline/post-change evidence are captured. **Verified:** all deterministic tests pass, effective deployment exposure matches policy, unauthorized calls are blocked, credentials remain separated, no secrets are exposed, and an independent verifier approves the result.

## Customization
Add platform-specific socket attestation, Kubernetes/Ingress checks, reverse-proxy policy, per-caller authorization, or human approval for high-impact tools without weakening the invariants in [`rules/listener-auth-rules.md`](rules/listener-auth-rules.md).
