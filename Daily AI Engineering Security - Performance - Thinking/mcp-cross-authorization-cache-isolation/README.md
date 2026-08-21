# MCP Cross-Authorization Cache Isolation

## Category
Security

## Problem
MCP 2026-07-28 introduced cache metadata that can mark results `public`, allowing reuse across authorization contexts. Because this cache scope is server-authored, a malicious or compromised server can attempt to make poisoned tool, prompt, or resource metadata globally reusable through a shared gateway or cache.

## Evidence
Current research and source links are documented in `evidence/research.md`. Key evidence includes MCP issue #3207 (2026-08-06), the 2026-07-28 schema definition of `CacheableResult`, and issue #3213 showing how shared cache behavior can amplify server-controlled prompt injection.

## Existing approach
Common approaches are trusting the server-declared scope, disabling caching, relying on short TTLs, or using server allowlists.

## Existing limitations
Trusting scope alone crosses a trust boundary. Disabling caching loses performance. TTLs limit duration rather than preventing poisoning. Allowlists do not bind individual cache entries to authorization identity, origin, protocol version, request identity, or payload integrity.

## Proposed improvement
Use a deterministic client/gateway admission gate. Default to private authorization-bound caching. Cross-authorization sharing is allowed only when locally enabled and the server is explicitly share-trusted. Every admitted entry is bound to stable identity fields and a locally computed payload SHA-256.

## Architecture
1. `skills/cache-admission-analysis.md` defines the evidence-driven admission procedure.
2. `rules/cache-isolation-rules.md` defines enforceable security invariants.
3. `scripts/cache_scope_guard.py` makes deterministic admission decisions.
4. `hooks/pre-cache-admission.md` blocks unsafe insertion.
5. `workflows/admit-lookup-verify.md` defines measurement, implementation, retry limits, rollback, and verification.
6. `subagents/cache-security-reviewer.md` performs independent verification.
7. `config/policy.json` contains safe defaults.

## Package tree
```text
README.md
config/policy.json
evidence/research.md
hooks/pre-cache-admission.md
rules/cache-isolation-rules.md
scripts/cache_scope_guard.py
skills/cache-admission-analysis.md
subagents/cache-security-reviewer.md
workflows/admit-lookup-verify.md
```

## Installation
Requires Python 3.10+ for the deterministic guard. No third-party Python dependency is required.

## Configuration
Edit `config/policy.json`. The default keeps shared caching disabled and downgrades untrusted `public` entries to authorization-bound private entries. Add a server to `share_trusted_servers` only after an explicit security review and only if `allow_shared_cache` is intentionally enabled.

Never place raw tokens, cookies, API keys, or reversible credentials in `authorization_fingerprint`. Use a stable non-secret authorization-context identifier or a one-way digest produced outside this package.

## Usage
Prepare `admission.json` with server origin, protocol version, method, canonical request, resource identity, declared scope/TTL, JSON payload, and a non-secret authorization fingerprint. Run:
```bash
python scripts/cache_scope_guard.py admission.json --policy config/policy.json --strict
```
Exit codes: `0` admitted, `2` invalid input/configuration, `3` rejected by security policy.

## Workflow
Observe current cache behavior → measure baseline → diagnose weak keying/scope assumptions → form hypothesis → integrate guard → measure again → run independent security review → complete only when verification passes.

Retries are bounded to two materially different implementation attempts per hypothesis. Failure never authorizes weakening isolation.

## Metrics
Track unauthorized cross-context hits (target 0), adversarial block rate (target 100%), public-to-private downgrade count, integrity mismatches, private/shared cache hit rate, and p50/p95 lookup latency.

## Verification
Security verification must prove tenant A poison cannot be served to tenant B without explicit sharing policy; private entries never hit with a different authorization fingerprint; integrity mismatch is not returned as valid; no raw credential appears in keys/logs; and benign private caching remains functional.

## Safety
Fail closed for cache admission, but a cache failure does not need to block a safe fresh MCP request. Never broaden tool permissions based on cached metadata. Human review is required before enabling shared cross-authorization reuse for a new server.

## Failure handling
Detection: guard exit code, poisoning test, integrity mismatch, or reviewer finding. Evidence: retain non-secret input identity, decision, hashes, and metrics. Retry: at most two materially different fixes. Fallback: private-only caching or no caching. Escalation: security owner. Stop condition: any unexplained cross-authorization hit, secret exposure, or integrity bypass.

## Definition of Done
**Implemented:** admission guard and hook are integrated at every MCP cache insertion/lookup boundary.

**Measured:** baseline and post-change cache/latency/security metrics exist.

**Verified:** independent reviewer confirms adversarial fixtures are blocked, no secret is exposed, provenance is auditable, and no blocking issue remains.

## Customization
Adapt canonical request/resource identity to the client implementation, add stronger origin attestation when available, and tune TTLs only after security invariants remain green. Do not remove authorization isolation merely to raise cache hit rate.
