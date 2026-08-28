# Skill: Context Reuse Analysis
## Purpose
Identify repeated tool-result context that can be safely referenced.
## Trigger
High input-token usage, frequent compaction, or repeated read-only calls.
## Inputs
Tool traces, payload sizes, dependency/version metadata, token metrics, policy.
## Preconditions
Baseline exists and tool semantics are known.
## Required context
Freshness requirements and mutation sources.
## Allowed tools
Trace readers, token counters, hashing, deterministic tests.
## Constraints
MUST preserve correctness-critical context. MUST NOT infer read-only safety from name alone.
## Procedure
1. Measure baseline tokens, bytes, compactions, latency.
2. Group canonical tool+argument calls.
3. Compare result and dependency hashes.
4. Exclude secret, mutating, approval-gated, time-sensitive, or dependency-unknown tools.
5. Run guard on representative traces.
6. Re-run workload and compare metrics.
7. Independently review invalidation.
## Decision points
Reuse only on policy eligibility plus matching result/dependency fingerprint within TTL.
## Expected output
Facts, evidence, exclusions, before/after metrics, verification status.
## Metrics
Tokens/task, repeated bytes, hit rate, compactions, latency, regression.
## Verification
Mutation/invalidation scenario per enabled tool.
## Failure handling
Disable reuse and send full content.
## Stop conditions
Two configuration revisions maximum; stop on correctness regression or secret exposure.
