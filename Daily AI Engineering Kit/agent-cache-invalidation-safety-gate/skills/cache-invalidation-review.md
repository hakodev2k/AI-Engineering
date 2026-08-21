# Skill: Cache Invalidation Review

## Purpose
Review code changes that mutate data participating in a cache and prove that stale or incorrectly shared entries cannot survive beyond the intended consistency window.

## When to use
Use for changes involving application caches, Redis, distributed caches, memoization, cache-aside logic, write-through/write-behind patterns, background refresh jobs, cache key changes, or mutations to data that is cached elsewhere.

## Inputs
- Repository root and changed-file scope.
- Relevant mutation entry points.
- Cache key/namespace design.
- Expected consistency model and acceptable stale window.
- Relevant tests and cache configuration.

## Preconditions
- Work from a clean or understood diff.
- Identify whether production cache operations would be required; if so, stop before executing them.
- Do not assume a cache key is local to one caller without evidence.

## Allowed tools
Repository search/read, local build/test commands, read-only cache configuration inspection, `scripts/scan-cache-risk.py`, and `scripts/validate-assessment.py`.

## Constraints
- Do not flush or mutate production cache.
- Do not change shared cache namespaces, TTL policy, or production configuration without approval.
- Treat scanner output as evidence hints, not proof.

## Procedure
1. Locate every changed mutation path and identify the business entity or aggregate it changes.
2. Trace reads of the same entity to determine whether cached values are returned directly or used to build derived cache entries.
3. Record each cache key format, namespace, partition dimension, tenant/user dimension, and TTL.
4. Determine the expected consistency model: immediate invalidation, bounded staleness, refresh-on-read, event-driven refresh, or explicit eventual consistency.
5. Run `python3 scripts/scan-cache-risk.py <repo-root> --json` and inspect medium/high findings within the relevant scope.
6. For each mutation, prove one of the following: the affected key is invalidated; the cached value is updated atomically enough for the contract; a versioned key makes stale entries unreachable; or the documented stale window is acceptable and tested.
7. Check race cases: mutation succeeds but invalidation fails; invalidation occurs before transaction commit; concurrent readers repopulate stale data; multiple writers update the same key; tenant/user identifiers are missing from keys.
8. Check fan-out: one mutation may invalidate summary, list, detail, permission, search, or aggregate caches.
9. Design the smallest safe change. Prefer narrow key invalidation or versioning over broad flushes.
10. Add or update tests that exercise post-mutation reads and at least one relevant failure/race path.
11. Run build/test checks applicable to the repository.
12. Produce an assessment matching `schemas/cache-assessment.schema.json` and validate it with `python3 scripts/validate-assessment.py <assessment.json>`.
13. Hand the result to the independent verifier when risk is high or the change alters cache architecture.

## Expected output
A structured assessment containing cache key, mutation source, invalidation path, consistency expectation, risk, evidence, verification checks, and remaining risks.

## Verification
A result may be `pass` only when the assessment validator succeeds, relevant tests pass, and no high-risk broad flush or unresolved stale-data path remains.

## Failure handling
- Scanner/tool transient failure: retry once, then preserve stderr and continue manually if repository inspection is possible.
- Test failure: fix/retest at most two times, preserving each failure result.
- Permission/environment failure: stop the blocked check and report it; never elevate permissions silently.
- Inconclusive cache ownership or consistency contract: status `inconclusive` or `blocked`, not `pass`.

## Stop conditions
Stop before production cache mutation, shared namespace changes, production configuration changes, destructive resets, or any other approval-required action defined in `config/cache-gate.yaml`.
