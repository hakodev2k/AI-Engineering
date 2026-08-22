# MCP OAuth Audience & Token Passthrough Guard

## Category
Security

## Problem
MCP servers can be authenticated yet still unsafe when they accept tokens issued for another resource or forward an inbound client bearer token to a downstream API.

## Evidence
See `evidence/research.md` for current 2026 evidence, existing approaches, limitations, and sources.

## Existing approach and limitation
JWT/OAuth middleware often validates signature, issuer, and expiry, but resource audience, per-tool scopes, and outbound credential provenance may be enforced elsewhere or not at all. Proxy middleware can also propagate `Authorization` accidentally.

## Proposed improvement
Treat inbound MCP authorization and downstream API authorization as two separate trust boundaries. Enforce canonical audience/scopes before tool execution and require independently sourced outbound credentials. Detect direct passthrough deterministically without logging raw tokens.

## Architecture
- `evidence/research.md` — public evidence and root cause.
- `config/policy.json` — canonical resource, issuers, scopes, provenance policy.
- `skills/oauth-boundary-audit.md` — reusable audit procedure.
- `rules/oauth-boundary-rules.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verifier role.
- `workflows/secure-auth-boundary.md` — bounded implementation/verification flow.
- `hooks/pre-downstream-auth-check.md` — deterministic blocking hook.
- `scripts/oauth_boundary_guard.py` — executable boundary checker.
- `tests/security-cases.md` — required positive and negative fixtures.

## Installation
Requires Python 3.10+; no third-party packages. Copy this package into the engineering repository or CI workspace.

## Configuration
Replace placeholder `canonical_resource`, issuer and tool scopes in `config/policy.json`. Do not commit real tokens or client secrets.

## Usage
Prepare a JSON request containing decoded synthetic/verified claims, tool name, dummy/redacted inbound/outbound bearer values, and outbound provenance. Run:

`python3 scripts/oauth_boundary_guard.py request.json --policy config/policy.json`

Exit `0` means allow; `2` invalid evidence/config; `5` deny. The script is a policy/fixture verifier, not a JWT signature library: production code must still cryptographically validate tokens using a maintained OAuth/JWT library.

## Workflow
Observe → baseline auth behavior → diagnose missing boundary controls → state hypothesis → implement → rerun cases → independent verification. Maximum two remediation cycles.

## Metrics
Wrong-audience rejection 100%; direct-passthrough detection 100%; protected side effects after auth failure 0; raw-token leakage 0; positive fixture success 100%.

## Verification
Run every case in `tests/security-cases.md`; confirm deny happens before side effects; confirm independent verifier status; inspect logs for fingerprints only.

## Safety
Fail closed. Never log raw bearer tokens. Never use the inbound bearer as an availability fallback. Require explicit human approval for high-impact scope/policy changes.

## Failure handling
Detection: guard/test failure. Evidence: reason codes + redacted fingerprints. Retry: max 2 implementation/retest cycles. Fallback: deny protected action. Escalation: security owner. Stop: unresolved bypass, secret exposure, or unknown credential provenance.

## Definition of Done
**Implemented:** audience/scope/provenance controls integrated. **Measured:** all fixture outcomes and side-effect counters captured. **Verified:** independent verifier confirms every mandatory case, no raw secrets, and no blocking issue remains.

## Customization
Add tenant/resource claims, DPoP/mTLS proof checks, policy-engine integration, or organization-specific credential provenance without weakening the base invariants.
