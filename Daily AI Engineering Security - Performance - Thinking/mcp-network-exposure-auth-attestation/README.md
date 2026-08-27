# MCP Network Exposure & Authentication Attestation

**Category:** Security

## Problem
MCP services can be effectively reachable and more powerful than intended when runtime bind scope, authentication, TLS, and enabled tools diverge from reviewed configuration.

## Evidence
Current public evidence is summarized in `evidence/research.md`, including August 2026 MCP exposure measurements and CVE disclosures.

## Existing approach
Teams commonly rely on OAuth/API keys, reverse proxies, network ACLs, container isolation, tool allowlists, config review, and vulnerability scanning.

## Existing limitations
Those controls do not automatically prove that authentication is enforced on every active listener or that risky capability combinations are not exposed.

## Proposed improvement
Attest **effective runtime state** and gate deployment with deterministic policy. Treat listener scope, TLS, authentication, tool capability, outbound networking, and credential access as one authorization surface.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gaps, root causes.
- `config/policy.json` — machine-readable secure defaults.
- `scripts/exposure_attestor.py` — dependency-free deterministic evaluator.
- `tests/test_exposure_attestor.py` — regression fixtures.
- `skills/effective-state-attestation.md` — reusable investigation procedure.
- `rules/exposure-policy.md` — observable enforceable rules.
- `subagents/security-verifier.md` — independent review contract.
- `workflows/attest-and-remediate.md` — bounded remediation flow.
- `workflows/regression-verification.md` — change regression flow.
- `hooks/pre-deploy.md` — blocking integration point.

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Edit `config/policy.json` only through security review. Runtime state uses this shape:

```json
{
  "listeners": [{"host":"10.0.0.5","port":443,"tls":true,"auth_mode":"oauth2","auth_enforced":true}],
  "capabilities": ["file_read"]
}
```

Do not include credentials or tokens in state files.

## Usage
```bash
python scripts/exposure_attestor.py --state effective-state.json --policy config/policy.json
```

Exit `0` allows; exit `3` is a policy block; exit `2` means invalid/unreadable evidence.

## Workflow
Use `workflows/attest-and-remediate.md` for deployment changes and `workflows/regression-verification.md` after upgrades or network/auth/tool changes.

## Metrics
Track unauthenticated public listeners, high-risk non-loopback listeners, violation count, attestation coverage, and regression count.

## Verification
```bash
python -m unittest tests/test_exposure_attestor.py
```
An independent reviewer must reproduce effective-state evidence for public/high-risk services.

## Safety
Fail closed on missing evidence. Never weaken TLS/authentication to pass. Never log secrets. Public high-risk exceptions require explicit human approval, ownership, expiry, and compensating controls.

## Failure handling
Detection is based on deterministic exit codes and reason codes. Maximum remediation attempts: 2. Fallback is loopback binding or service disablement. Escalate unresolved public exposure.

## Definition of Done
- **Implemented:** runtime capture and deploy gate are integrated.
- **Measured:** before/after effective state and violation metrics are captured.
- **Verified:** tests pass; independent review confirms listener/auth/capability boundaries; no secrets are exposed; no blocking issue remains.

## Customization
Extend capability and approved-auth lists conservatively. Add environment-specific trust zones as explicit policy inputs rather than weakening base rules.
