# MCP Resource Audience Enforcement Gate

**Category:** Security

## Problem
A bearer token can be cryptographically valid yet still be unauthorized for a particular MCP server, resource, audience, or operation. In gateway and multi-server agent architectures, accepting such tokens enables replay/confused-deputy failures and excessive authority.

## Evidence
Current evidence is in `evidence/research.md`, grounded in the MCP 2026-07-28 Authorization specification, RFC 8707/9728/9207, and current agent IAM guidance.

## Existing approach
Generic OAuth/JWT middleware usually validates signature, expiry, and issuer; gateways may add audience checks; handlers often perform ad-hoc scope checks.

## Existing limitations
Generic signature validation does not prove that a token was issued for this MCP resource. Resource/audience configuration can drift, scope checks get duplicated, and gateways may forward upstream tokens to downstream resources without an explicit delegation contract.

## Proposed improvement
Use trusted authentication middleware for cryptographic verification, then apply a separate fail-closed gate that checks canonical resource, issuer, audience, and per-operation scopes before tool dispatch. Verify with negative fixtures that use valid-shaped but wrong-boundary claims.

## Architecture
```text
mcp-resource-audience-enforcement-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-dispatch-authorization-gate.md
├── rules/
│   └── mcp-authorization-boundary-rules.md
├── scripts/
│   └── audience_gate.py
├── skills/
│   └── resource-audience-validation.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_audience_gate.py
└── workflows/
    └── authorize-and-verify.md
```

## Installation
Requires Python 3.10+ and trusted OAuth/JWT verification middleware. The script has no third-party Python dependency.

## Configuration
Replace all example values in `config/policy.json` with deployment-specific trusted values. Configure one canonical MCP resource URI, explicit issuer and audience allowlists, and required scopes per protected operation.

## Usage
Pass a JSON claims envelope produced only after cryptographic token verification:

```bash
python3 scripts/audience_gate.py verified-claims.json --policy config/policy.json
python3 -m unittest tests/test_audience_gate.py
```

Exit code 0 allows dispatch; exit 5 denies; exit 2 indicates invalid input/configuration.

## Workflow
Follow `workflows/authorize-and-verify.md`: map trust boundaries → baseline negative cases → diagnose the authorization gap → integrate the gate → replay positive/negative fixtures → independent security verification.

## Metrics
- wrong-resource denial rate
- wrong-audience denial rate
- wrong-issuer denial rate
- missing-scope denial rate
- unverified-claims denial rate
- intended-positive success rate
- security regression pass rate

## Verification
**Implemented** means the pre-dispatch gate is integrated. **Measured** means positive and negative fixture outcomes are captured. **Verified** requires all required negative cases to deny, intended positive cases to allow, secrets to remain protected, and an independent reviewer to approve the trust boundary.

## Safety
This package deliberately does not decode or verify JWT signatures. It consumes only claims from trusted authentication middleware. Never log raw tokens. Never weaken resource/audience validation to regain compatibility. High-impact tool actions should still have an additional policy or human-approval layer.

## Failure handling
Invalid or ambiguous configuration fails closed. Wrong resource/audience/issuer or missing scopes deny execution. Retries are bounded to two integration attempts per diagnosis; unresolved identity/delegation ambiguity escalates to a human security owner.

## Definition of Done
- current evidence documented
- trust boundaries mapped
- canonical resource configured
- issuer/audience allowlists configured
- per-operation scopes configured
- gate integrated after crypto verification
- positive fixtures pass
- wrong-resource/audience/issuer/missing-scope/unverified fixtures deny
- test suite passes
- independent verifier approves
- no secrets exposed
- no blocking ambiguity remains

## Customization
Integrate the deterministic decision function directly into the host language/runtime, generate policy from deployment configuration, add gateway-specific delegated-token tests, and map deny reasons to standards-compliant 401/403 or step-up authorization responses without disclosing sensitive token content.
