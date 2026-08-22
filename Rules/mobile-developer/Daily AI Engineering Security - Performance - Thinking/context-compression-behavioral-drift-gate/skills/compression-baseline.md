# Skill: Compression Baseline

## Purpose
Capture measurable context state and a preservation contract before compression.

## Trigger
Immediately before summarization, truncation, offloading, or memory compaction.

## Inputs
Current prompt/context, provider token usage when available, task goal, active constraints, decisions, identifiers, pending work, and safety boundaries.

## Preconditions
The original context is still available and no destructive compaction has started.

## Required context
Only task-relevant material; do not require hidden reasoning.

## Allowed tools
Token counters, provider usage metadata, repository/file inspection, deterministic text extraction, and task-state APIs.

## Constraints
- MUST distinguish current prompt tokens from cumulative session usage.
- MUST NOT infer that old content is irrelevant solely from age.
- MUST preserve exact values for critical identifiers and negative constraints.
- SHOULD use deterministic extraction for IDs, paths, commands, versions, and acceptance criteria.

## Procedure
1. Measure current-context tokens using provider usage or the closest tokenizer available.
2. Record measurement source and confidence.
3. Build a preservation contract with typed entries: fact, constraint, decision, identifier, pending-work, safety-boundary.
4. Mark critical entries that must survive exactly or semantically.
5. Record unresolved hypotheses separately from established facts.
6. Define deterministic task probes when feasible.
7. Serialize baseline metrics and contract before compression begins.

## Decision points
If current token usage cannot be measured reliably, record it as unknown and prohibit claims of token improvement. If a critical entry cannot be represented safely, block automatic compaction and require a less destructive strategy.

## Expected output
A baseline JSON-compatible record containing token count, measurement method, preservation contract, critical identifiers, and probes.

## Metrics
Baseline tokens, contract entry count, critical entry count, and measurement confidence.

## Verification
A separate verifier confirms that all known acceptance criteria and safety boundaries appear in the contract.

## Failure handling
Retry extraction once with a deterministic parser or narrower context. If still incomplete, stop automatic compaction.

## Stop conditions
Baseline captured and independently checked, or compaction blocked due to incomplete preservation evidence.