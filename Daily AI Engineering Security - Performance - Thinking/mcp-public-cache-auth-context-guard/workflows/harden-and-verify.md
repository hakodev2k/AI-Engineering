# Workflow: Harden and Verify MCP Cache Boundaries

## Trigger
A new MCP cache, gateway, server revision, authentication model, cache-scope change, or cache-related security incident.

## Goal
Prevent cross-authorization cache reuse while preserving safe caching opportunities.

## Inputs
Server/method inventory, cache configuration, assessment JSON, synthetic authorization contexts, and cache telemetry.

## Baseline
Record current cache scopes, cache-key fields, hit/miss counts, and whether cross-context reuse is currently possible. No improvement claim is allowed without this baseline.

## Context
Use `evidence/research.md` for current threat evidence and `rules/cache-boundary.md` as the enforceable policy.

## Stages
1. **Observe** — collect declared cache metadata and effective cache-key configuration. Responsible: implementer.
2. **Measure baseline** — replay two synthetic contexts and record hits/misses without changing policy. Responsible: implementer.
3. **Diagnose** — classify each response as invariant or authorization-dependent; identify model-visible untrusted metadata. Responsible: implementer.
4. **Form hypothesis** — state the exact unsafe key/scope condition expected to cause cross-context reuse.
5. **Implement improvement** — default unsafe candidates to private/no-cache, add authorization-context digest to private keys, and add invalidation on trust/version changes. Dangerous production changes require human approval.
6. **Measure again** — repeat the same requests and collect the same metrics.
7. **Independent verification** — Security Verifier runs the package script/tests and cross-context replay without changing implementation.
8. **Complete** — store evidence and approved decision.

## Checkpoints
- Baseline captured before modification.
- No raw credentials in evidence.
- Public candidates have explicit invariance evidence.
- Private keys contain non-secret authorization binding.
- Independent verifier is not the implementer.

## Metrics
Cross-context private hits (target 0), unsafe public candidates (target 0), malformed metadata safely rejected (target 100%), test pass rate (100%), and public candidates with explicit approval (100%).

## Retry policy
Maximum two implementation/retest cycles for the same failure signature.

## Stop conditions
Stop on success after independent verification. Stop and escalate after two failed remediation cycles, any secret exposure, or any production-impacting ambiguity requiring broader access.

## Failure path
Force affected methods to private/no-cache, invalidate suspect shared entries, preserve non-secret evidence, and escalate. Never broaden cache scope to recover availability.

## Verification
`python scripts/verify_cache_scope.py assessment.json` must exit 0 and unit tests must pass. Runtime cross-context replay must show zero private cross-context hits.

## Definition of Done
Implemented: policy and key isolation deployed or configured. Measured: before/after cache behavior recorded. Verified: independent replay and deterministic tests pass with no blocking security issue.
