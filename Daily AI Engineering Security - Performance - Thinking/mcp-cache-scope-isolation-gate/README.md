# MCP Cache Scope Isolation Gate

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
The MCP 2026-07-28 caching model introduced `cacheScope: public|private`. Current protocol-security reports show that trusting a server-declared `public` scope can let shared intermediaries reuse server-controlled tool, prompt, resource, or instruction metadata across authorization contexts. When cached content can influence an agent's available tools or prompt context, cache poisoning can become cross-user capability or prompt manipulation.

## Evidence
See `evidence/research.md`. Current signals include MCP issues #3207 and #3213 plus HTTP caching rules that explicitly allow `public` responses to be shared across authorization contexts.

## Existing approach and limitation
Standard HTTP caching directives correctly describe cacheability but do not establish whether MCP content is trustworthy for cross-user reuse. Default-private behavior helps only when a server does not explicitly assert public scope. Pinning servers, sanitizing instructions, and gateway allowlists are useful but remain separate controls unless enforced at the cache boundary.

## Proposed improvement
Treat MCP `public` as an untrusted claim. A gateway/client should default to private isolation, allow public caching only for explicitly approved endpoint/content classes, reject prompt-bearing or capability-bearing public entries unless a stronger trust policy exists, include server identity and schema/version in cache keys, and invalidate on trust/config changes.

## Package tree
- `README.md`
- `evidence/research.md`
- `skills/cache-trust-assessment.md`
- `rules/mcp-cache-security.md`
- `subagents/cache-security-reviewer.md`
- `workflows/audit-harden-verify.md`
- `hooks/pre-cache-store.md`
- `scripts/check_cache_entry.py`
- `config/policy.example.json`
- `tests/test_check_cache_entry.py`

## Installation
Python 3.10+, standard library only.

## Configuration
Define approved `public_endpoints`, forbidden content fields, trusted server IDs, and whether authenticated content may ever enter shared cache. Safe default is no public MCP caching.

## Usage
`python scripts/check_cache_entry.py config/policy.example.json <entry.json>`

Exit 0 permits the declared cache operation. Exit 5 blocks it. Exit 1 means the entry or policy is invalid.

## Workflow
Observe cache topology -> capture baseline keys/scopes -> classify trust and content -> run gate -> harden keying/scope policy -> replay poisoning fixtures -> independently verify isolation.

## Metrics
Cross-user cache hits for MCP content; blocked public-scope attempts; cache-key collisions across identities/servers; poisoned-fixture acceptance rate; prompt-bearing public entries; cache hit rate; latency impact; false-block rate.

## Verification
**Implemented:** deterministic cache-entry gate, rules, workflow, tests.  
**Measured:** baseline and hardened gateway behavior use identical fixtures and cache topology.  
**Verified:** malicious/public cross-user fixtures are blocked; private per-principal entries remain isolated; approved cacheable content preserves intended performance without trust-boundary regression.

## Safety
Do not weaken identity isolation merely to increase cache hit rate. Treat server-provided instructions, tool definitions, prompt templates, and resources as untrusted input. Never store secrets in cache-test fixtures.

## Failure handling
A policy ambiguity or unknown server identity blocks shared caching and falls back to private/no-store behavior. Retry configuration resolution once. If still ambiguous, preserve isolation and escalate; never silently broaden cache scope.

## Definition of Done
Evidence documented; baseline cache behavior measured; trust boundaries mapped; shared-cache policy explicit; poisoning and cross-principal tests pass; no forbidden prompt/capability content reaches shared cache; independent security verification complete.

## Customization
Organizations may permit specific immutable public metadata after review. Add narrowly scoped endpoint/server allowlists rather than making `public` the default.