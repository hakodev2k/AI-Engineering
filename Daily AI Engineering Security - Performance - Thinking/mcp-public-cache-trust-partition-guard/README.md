# MCP Public Cache Trust Partition Guard

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
MCP discovery and other cacheable results can cross authorization or user boundaries when shared intermediaries accept `cacheScope: public` for server-controlled metadata. The risk becomes materially worse when cached metadata includes natural-language `instructions` that clients may place into model context: a malicious or compromised MCP server can poison a shared cache and influence later users who never contacted that server instance directly.

## Evidence
Current public evidence, existing approaches, limitations, and root causes are documented in `evidence/research.md`.

## Existing approach and limitation
The 2026-07-28 MCP TypeScript SDK migration notes that malformed or absent cache hints default to private/zero TTL and that caching metadata is consumed by the client response-cache layer. Current issue reports recommend keeping server instructions untrusted and avoiding public caching across authorization contexts. Those controls are useful, but a gateway or client can still mis-partition a cache if cache keys omit tenant/principal/authz identity, or if server-controlled instructions are considered safe merely because a response is syntactically valid.

## Proposed improvement
Apply a deterministic cache-admission policy before storing MCP results. Public caching is rejected for authenticated, tenant-scoped, user-scoped, permission-sensitive, or instruction-bearing content unless an explicit organization policy states that the content is globally invariant and non-sensitive. Private caches must include the required partition dimensions. Natural-language server instructions remain untrusted model input regardless of cache scope.

## Architecture
- `evidence/research.md` — current evidence and analysis.
- `skills/cache-trust-assessment.md` — evidence-driven assessment procedure.
- `rules/cache-boundary-rules.md` — enforceable cache and trust rules.
- `subagents/security-verifier.md` — independent review role.
- `workflows/assess-and-remediate.md` — observe, diagnose, harden, verify.
- `hooks/pre-cache-admission.md` — deterministic blocking hook.
- `scripts/check_cache_policy.py` — executable policy validator.
- `config/policy.example.json` — example cache records.
- `tests/test_check_cache_policy.py` — regression tests.

## Installation
Python 3.10+; standard library only.

## Configuration
Model each cacheable response with `scope`, `contains_instructions`, `authenticated`, `tenant_scoped`, `user_scoped`, `permission_sensitive`, `cache_key_fields`, and `ttl_ms`. Never include credentials, bearer tokens, or raw sensitive values in this file; list only partition field names.

## Usage
`python scripts/check_cache_policy.py config/policy.example.json`

Exit 0 = policy passes; exit 2 = blocking security finding; exit 1 = invalid input/runtime error.

## Workflow
Observe effective cache behavior -> establish tenant/auth trust boundaries -> baseline cache keys/scopes -> identify cross-boundary candidates -> remediate scope/keying/instruction handling -> run tests -> independent verification.

## Metrics
Public entries containing untrusted instructions; authorization-sensitive public entries; private entries missing required partition fields; cross-user cache-hit tests; poisoned-entry isolation tests; exception count and expiry.

## Verification
**Implemented:** executable guard, rules, workflow, tests.  
**Measured:** each cacheable MCP result is classified and checked against explicit partition dimensions.  
**Verified:** negative cross-user/tenant tests do not return another principal's cached metadata; instruction-bearing public entries are blocked; required private partition keys are present; no secret is logged or stored.

## Safety
Do not solve cache leakage by disabling authorization or by globally sharing user-specific data. Treat server-controlled instructions as untrusted input even when delivered from a trusted transport. Dangerous exceptions require explicit human security approval.

## Failure handling
A missing trust classification or partition dimension is a blocking failure. Retry evidence collection once for transient inspection failures. If still ambiguous, bypass the shared cache for that result and escalate. Never convert unknown authorization sensitivity into `public`.

## Definition of Done
Evidence documented; every relevant result classified; cache admission guard passes; cross-boundary negative tests pass; instruction isolation is verified; exceptions are explicit and time-bounded; independent reviewer signs off; no blocking issue remains.

## Customization
Extend required partition fields for organization-specific tenancy models, but preserve fail-closed behavior for unknown sensitivity.