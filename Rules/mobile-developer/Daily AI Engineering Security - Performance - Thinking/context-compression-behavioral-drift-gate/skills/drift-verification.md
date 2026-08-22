# Skill: Post-Compression Drift Verification

## Purpose
Verify that token reduction did not remove correctness-critical context or change required observable behavior.

## Trigger
After a candidate compacted context is produced and before it replaces the active context.

## Inputs
Baseline preservation contract, original token measurement, candidate compacted context, candidate token measurement, policy, and optional probes.

## Preconditions
The baseline is immutable for the current attempt.

## Allowed tools
Tokenizer/provider usage, deterministic search/parsing, task-specific read-only probes, test runners, and the package drift-gate script.

## Constraints
- MUST preserve every critical constraint, identifier, decision, pending item, and safety boundary.
- MUST NOT approve compaction based only on token reduction.
- MUST NOT weaken required context to make the gate pass.
- SHOULD compare task-facing probes when deterministic validation exists.

## Procedure
1. Measure candidate context tokens with the same method used for baseline when possible.
2. Compute reduction ratio.
3. Match every preservation-contract entry against the candidate using exact matching for strict values and explicit evidence checks for semantic entries.
4. Run configured probes and capture pass/fail evidence.
5. Apply policy thresholds.
6. Return allow, retry, or reject with missing entries and metrics.
7. If retrying, provide only failure evidence needed by the compressor; do not silently change the contract.

## Decision points
Reject immediately on loss of any safety boundary or strict identifier. Retry at most the configured number of attempts for non-safety omissions. Reject if compression does not meet minimum useful token savings.

## Expected output
Decision, before/after tokens, reduction ratio, retention rates, probe rate, missing contract IDs, and evidence references.

## Metrics
Token reduction, invariant retention, identifier retention, probe pass rate, regression rate.

## Verification
A separate context verifier checks the gate output and confirms that no critical entries were downgraded.

## Failure handling
At most two candidate regenerations by default. Fallback to original context, selective offloading, or provider prompt caching.

## Stop conditions
Candidate passes all required thresholds, or the retry budget is exhausted and original context remains active.