# Workflow: Admit → Cache → Verify

## Trigger
MCP `tools/list`, `prompts/list`, `resources/list`, or `resources/read` result is cacheable, or a cached result is about to be reused.

## Goal
Retain caching benefits without allowing untrusted cross-authorization capability/data reuse.

## Inputs
Response metadata, server identity, trust policy, cache state, negotiated protocol version.

## Baseline
Measure current cache hit rate, cross-context hits, cache keys, invalidation events, and known capability manifests.

## Stages
1. Observe response/hit and capture redacted identity metadata.
2. Validate schema/protocol and calculate payload hash.
3. Diagnose trust scope and capability drift.
4. Hypothesize an admission class (`private`, `shared`, `no-store`, `quarantine`).
5. Apply cache decision using deterministic keying.
6. Measure cache behavior and security counters.
7. Run poisoning/isolation tests.
8. Independent reviewer verifies before completion.

## Responsible agent
Host implementation performs cache changes; `cache-security-reviewer` independently verifies.

## Tools
`scripts/cache_key_guard.py`, schema validator, integration tests, cache backend.

## Outputs
Admission decision, cache metadata, test evidence, before/after metrics.

## Checkpoints
Before shared write: trusted origin required. Before cache hit exposure: current policy/identity must match. Before completion: negative cross-tenant test passes.

## Metrics
Hit rate, cross-context blocked count, quarantine count, invalidations, added latency, security-test pass rate.

## Retry policy
Maximum two remediation iterations; each must address a specific failed invariant.

## Stop conditions
Identity ambiguity, repeated schema failure, unexplained capability drift, or failed isolation after two iterations.

## Failure path
Purge only scoped suspect entries, fall back to fresh origin fetch/private cache, record evidence, and escalate if isolation cannot be proven.

## Verification
Poisoned public entry from untrusted origin must not be consumed by another authorization context; trusted public entry may be shared only under explicit policy; private entry never crosses context.

## Definition of Done
Evidence captured, policy implemented, cache metrics measured, isolation tests pass, reviewer returns PASS, and no security boundary was weakened.