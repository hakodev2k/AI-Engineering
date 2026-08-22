# Skill — Tool Prefix Stability Analysis

## Purpose
Determine whether equivalent logical tool sets produce identical cache-intended request prefixes.

## Trigger
Tool registry change, MCP discovery change, cache-hit regression, or prompt-builder refactor.

## Inputs
Tool schema snapshots, registry source, serialization rules, provider cached-token metrics when available.

## Preconditions
Capture a baseline with at least 3 repeated builds from equivalent logical inputs.

## Required context
Tool identity rules, namespace behavior, required tool availability, prompt request ordering.

## Allowed tools
Repository read, JSON snapshots, `scripts/canonicalize_tools.py`, benchmark logs.

## Constraints
MUST NOT remove correctness-critical tools only to improve cache metrics. MUST NOT rewrite tool semantics. SHOULD keep volatile metadata out of cache-intended descriptions when it is not functionally required.

## Procedure
1. Capture repeated raw tool arrays from equivalent runs.
2. Compare tool identities and detect set equality separately from order equality.
3. Canonicalize nested JSON keys.
4. Sort by stable identity: namespace, name, version/variant when applicable.
5. Generate before/after SHA-256 fingerprints.
6. Locate volatile fields that still change fingerprints.
7. Remove/move only non-semantic volatility.
8. Re-run 3+ repeated builds.
9. Compare provider cache-read ratio and latency on representative workloads.

## Decision points
- Different logical tool sets: do not force identical fingerprints.
- Same set, different order: canonicalize order.
- Same tool semantics, unstable nested key order: canonicalize JSON serialization.
- Volatile field is required for correctness: preserve it and document expected cache boundary loss.

## Expected output
Baseline fingerprints, divergence cause, canonicalized fingerprint, before/after cache metrics, quality regression status.

## Metrics
Fingerprint stability, cached-input ratio, uncached tokens/task, p50/p95 latency, tool-selection quality.

## Verification
Independent fixture run must reproduce stable output bytes and full tool availability.

## Failure handling
If cache improves but tool correctness regresses, revert the optimization and classify the volatile field as required context.

## Stop conditions
Stable equivalent fixtures + no critical quality regression, or 2 failed hypotheses, or unresolved semantic ordering requirement.
