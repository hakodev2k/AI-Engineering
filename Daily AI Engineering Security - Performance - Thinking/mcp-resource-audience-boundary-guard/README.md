# MCP Resource Audience Boundary Guard

**Category:** Security

## Problem
MCP servers are OAuth resource servers, but integrations can accidentally accept bearer tokens issued for another resource or pass inbound client tokens directly to an upstream API. The 2026-07-28 MCP authorization specification explicitly forbids this because it breaks resource boundaries and enables token replay/confused-deputy failures.

## Evidence
See `evidence/research.md`. The package separates observed public evidence from interpretation and the proposed implementation.

## Existing approach and limitation
JWT signature/issuer validation alone is insufficient when audience/resource binding is skipped. Generic bearer middleware may verify authenticity while still accepting a token for the wrong resource. Token passthrough further collapses the trust boundary between MCP server and upstream API.

## Proposed improvement
Enforce a deterministic authorization boundary before tool execution: canonicalize the MCP resource URI, validate issuer/audience/resource/scopes, reject passthrough configurations, and require a separate downstream credential or token-exchange flow for upstream calls.

## Architecture
```text
client token -> pre-auth hook -> audience_guard.py -> allow/deny
                                      |
                                      +-> policy.json
allow -> MCP tool handler -> separate downstream credential/token exchange
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/resource-audience-validation.md
rules/oauth-boundaries.md
subagents/security-verifier.md
workflows/integrate-and-verify.md
hooks/pre-tool-auth.md
scripts/audience_guard.py
tests/test_audience_guard.py
```

## Installation
Requires Python 3.11+; the validator itself uses only the standard library. JWT cryptographic verification remains the responsibility of the production OAuth/JWT library; this guard consumes verified claims and adds resource-boundary policy checks.

## Configuration
Edit `config/policy.json` with the canonical MCP resource URI, trusted issuers, required scopes, and downstream policy. Never place secrets in this file.

## Usage
```bash
python scripts/audience_guard.py request.json --policy config/policy.json
python -m unittest tests/test_audience_guard.py
```
`request.json` contains already-verified token claims plus request metadata. Exit `0` means boundary checks passed; `3` means deny; `2` means invalid input/configuration.

## Workflow
Follow `workflows/integrate-and-verify.md`: inventory trust boundaries, capture failing baseline fixtures, integrate the guard, run negative/positive tests, then independently verify.

## Metrics
- Wrong-audience acceptance rate: 0%.
- Token-passthrough configurations reaching tool execution: 0.
- Positive fixture pass rate: 100%.
- Negative fixture rejection rate: 100%.
- Secrets written to logs: 0.

## Verification states
- **Implemented:** guard, policy, hook, rules and tests are present.
- **Measured:** fixture counts and outcomes are recorded by the integrating project/CI.
- **Verified:** independent verifier confirms every wrong-resource/passthrough fixture is blocked and valid resource-bound requests still work.

## Safety
The guard MUST NOT log bearer tokens. Audience checks do not replace signature, expiry, issuer, nonce/PKCE or TLS checks. Dangerous permission expansion requires human approval.

## Failure handling
Fail closed on missing/ambiguous resource identity. Retry only transient metadata/JWKS retrieval outside this script, maximum 2 attempts. Do not retry deterministic claim-policy mismatch. Escalate configuration ambiguity to a human.

## Definition of Done
Evidence documented; canonical resource configured; wrong-audience and passthrough tests fail closed; valid fixtures pass; production cryptographic verification remains enabled; no secrets logged; independent verification complete; no blocking issue remains.

## Customization
Extend policy with project-specific scope rules and token-exchange metadata, but preserve resource/audience validation and separate downstream credentials.