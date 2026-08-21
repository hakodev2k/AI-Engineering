# Workflow — Admit, Lookup, Verify

## Trigger
MCP result admission, cache lookup, security regression, server trust change, or protocol-version change.

## Goal
Preserve useful caching while preventing unauthorized cross-context reuse.

## Inputs
Current policy, server identity, protocol version, request/result pair, authorization fingerprint, existing cache entry if any, and audit sink.

## Baseline
Before changing caching behavior, capture: cache hit rate, cross-authorization hit count, average request latency, stale/integrity failure count, and number of entries currently keyed without authorization identity.

## Stages
1. **Observe** — Inventory cached MCP result types and effective keys.
2. **Measure baseline** — Record hit/miss/latency metrics and classify entries by private/shared behavior.
3. **Diagnose** — Identify keys that omit origin, protocol, authorization identity, or resource identity.
4. **Form hypothesis** — Define the minimal key/scope change expected to block tenant crossover without disabling all caching.
5. **Implement** — Add admission evaluation from `skills/cache-admission-analysis.md` and enforce `rules/cache-isolation-rules.md`.
6. **Measure again** — Re-run benign and adversarial traffic.
7. **Verify** — `subagents/cache-security-reviewer.md` independently checks invariants and audit evidence.
8. **Complete** — Publish measured security and performance results.

## Responsible agent
Implementation owner for stages 1–6; independent Cache Security Reviewer for stage 7.

## Tools
Repository inspection, `scripts/cache_scope_guard.py`, test fixtures, cache metrics, and redacted logs.

## Outputs
Baseline report, admission decisions, before/after metrics, security review, and final verification record.

## Checkpoints
- Baseline exists before optimization.
- No raw token is used in a key.
- Public entries from untrusted servers never become shared entries.
- Private entries cannot hit across authorization fingerprints.
- Integrity mismatch is a miss/block, never a successful hit.

## Metrics
Cross-context violations (target 0), adversarial block rate (target 100%), benign private hit-rate regression, p50/p95 lookup latency, downgrade count, and integrity mismatch count.

## Retry policy
A failed implementation may be changed and retested at most 2 times per hypothesis. Each retry must materially change code/policy or be supported by new evidence.

## Stop conditions
Stop immediately on credential exposure, unexplained cross-authorization hit, or integrity bypass. Stop after 2 failed hypotheses and escalate rather than weakening isolation.

## Failure path
Preserve/restore private-only caching, flush affected shared entries, record the failing evidence, and escalate for security review.

## Verification
All adversarial fixtures blocked, benign private reuse works, metrics are captured, reviewer is independent, and audit records prove scope provenance.

## Definition of Done
Implemented: guard is integrated. Measured: before/after cache and latency metrics exist. Verified: independent tests show zero unauthorized cross-context hits and no secrets in keys/logs.
