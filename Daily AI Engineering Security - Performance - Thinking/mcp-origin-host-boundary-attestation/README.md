# MCP Origin/Host Boundary Attestation

**Category:** Security

## Problem
MCP Streamable HTTP servers can expose local/private tools to browser-driven DNS rebinding or cross-origin requests when Host/Origin validation is absent, disabled, overridden by middleware, or only assumed from SDK version.

## Evidence
See `evidence/research.md`. Multiple official MCP SDKs have independently shipped this failure class, including a Ruby SDK advisory published July 8, 2026. The MCP transport specification requires Origin validation.

## Existing approach
Patched SDK versions, built-in DNS-rebinding guards, reverse-proxy checks, loopback binding, CORS middleware, and authentication.

## Existing limitations
Those controls are distributed across layers and can drift. A patched library does not prove the effective deployed HTTP boundary rejects malicious Host/Origin combinations.

## Proposed improvement
Treat Host/Origin behavior as an explicit security invariant. Define policy once, use a deterministic oracle for expected decisions, then require owned-endpoint negative integration tests and independent verification.

## Architecture
```text
mcp-origin-host-boundary-attestation/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/preflight-http-boundary.md
├── rules/http-origin-host-boundary.md
├── scripts/mcp_boundary_probe.py
├── skills/transport-boundary-assessment.md
├── subagents/security-verifier.md
├── tests/cases.json
├── tests/test_mcp_boundary_probe.py
└── workflows/research-diagnose-remediate.md
```

## Installation
Requires Python 3.10+ for the reference oracle and tests; no third-party Python packages are required. Copy the directory intact into the engineering repository or policy toolkit.

## Configuration
Edit `config/policy.json` to match intentionally trusted hosts/origins and deployment modes. Keep origins exact. Do not add `*`. Keep authentication required unless the deployment has a documented, reviewed equivalent boundary.

## Usage
From this package directory:

```bash
python scripts/mcp_boundary_probe.py --policy config/policy.json --cases tests/cases.json
python -m unittest tests/test_mcp_boundary_probe.py
```

The oracle is deliberately offline. Integrate the same cases into the owned MCP endpoint's HTTP test harness to prove the effective server/proxy stack rejects them before tool dispatch.

## Workflow
Follow `workflows/research-diagnose-remediate.md`: Observe -> Measure baseline -> Diagnose -> Form hypothesis -> Implement -> Measure again -> independent Verify. Retries are bounded to two remediation attempts per failure class.

## Metrics
- malicious Host rejection rate
- malicious Origin rejection rate
- valid-case pass rate
- wildcard-origin count
- unknown effective-boundary count
- regression pass rate

## Verification
`tests/test_mcp_boundary_probe.py` verifies the reference decision logic. Deployment verification additionally requires evidence from the actual owned endpoint or an upstream boundary that demonstrably intercepts requests before MCP dispatch.

Statuses are distinct:
- **Implemented:** controls/configuration exist.
- **Measured:** positive/negative cases were executed and recorded.
- **Verified:** an independent reviewer confirmed effective enforcement and no blocking unknown remains.

## Safety
Do not probe third-party systems without authorization. Do not disable authentication, broaden origins, bind to broader interfaces, or weaken Host checks to obtain a green result. Logs must not capture bearer tokens, cookies, or secrets.

## Failure handling
Detection: failed negative case, wildcard policy, unknown layer behavior, or authentication/bind mismatch. Evidence: retain case, expected/actual decision and responsible layer. Retry: maximum two remediation cycles. Fallback: preserve current restrictive controls and mark Not Verified. Escalation: endpoint/release owner. Stop: verified pass, two failed remediation cycles, or inability to establish effective state safely.

## Definition of Done
Evidence documented; baseline captured; limitations identified; required controls implemented; oracle and unit tests pass; actual boundary negative tests pass; metrics recorded; risks documented; independent verification complete; no blocking issue or unknown remains.

## Customization
Add environment-specific trusted origins and bind modes conservatively. Extend fixtures for reverse proxies, TLS termination, non-default ports and authentication middleware while preserving exact allowlists and deny-by-default behavior.
