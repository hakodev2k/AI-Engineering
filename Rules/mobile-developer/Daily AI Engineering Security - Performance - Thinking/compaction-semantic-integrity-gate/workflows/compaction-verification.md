# Workflow: Compaction Verification and Recovery

## Trigger
Any operation that replaces or compresses prior conversational/task context.

## Goal
Reduce context while preserving verified task state.

## Inputs
Authoritative state sources, compaction mechanism, `config/integrity-policy.json`, and event/provenance records.

## Baseline
Record pre-compaction context size plus the structured invariant ledger. The baseline is the last verified state, not a previous summary alone.

## Context
Use the minimum transcript needed to resolve disputed state. Static instructions should be fetched from authoritative files/configuration.

## Stages
1. **Observe — Orchestrator:** detect impending compaction and identify the session/task ID.
2. **Measure baseline — Orchestrator:** persist the critical pre-state and context-size measurement.
3. **Compact — Platform/implementation agent:** run the normal compaction mechanism without modifying the baseline.
4. **Extract — Implementation agent:** materialize candidate post-state in the same schema.
5. **Deterministic check — Hook:** run `scripts/compaction_integrity_gate.py`.
6. **Independent review — Context Integrity Verifier:** inspect failures against authoritative evidence.
7. **Decision:**
   - pass → activate compacted context;
   - fail with recoverable summary defect → regenerate from original baseline;
   - fail with missing/ambiguous authoritative evidence → stop and escalate.
8. **Measure again:** capture final context size and invariant preservation result.

## Responsible agent
Orchestrator owns lifecycle; implementation agent creates candidate state; Context Integrity Verifier owns acceptance.

## Tools
Session/event store, provider compaction API, JSON serializer, integrity script, read-only evidence retrieval.

## Outputs
Verified compacted state, before/after context size, gate report, evidence references, retry count, and final status.

## Checkpoints
- Baseline snapshot persisted before destructive context replacement.
- Candidate state exists before activation.
- Deterministic gate passes.
- Independent verifier signs off on any previously disputed critical field.

## Metrics
Context reduction ratio, preservation rate, unsupported additions, illegal transitions, retries, and post-compaction regression rate.

## Retry policy
Maximum retries are read from policy (default 2). Every retry starts from the original verified baseline and records the previous failure reason.

## Stop conditions
Stop on retry exhaustion, missing task identity, unresolved approval mismatch, missing authoritative baseline, or repeated fabrication/drop of a critical field.

## Failure path
Keep the pre-compaction state active or create a safe handoff containing only verified state. Do not continue autonomously with a failed candidate.

## Verification
Run regression tests and verify all blocking invariants are preserved. For high-risk tasks, verifier must be independent of the agent that generated the candidate summary.

## Definition of Done
Compaction is implemented, measured, and verified: context is reduced; all required invariants pass; no unsupported state transition remains; retry count is within budget; evidence is recorded; no blocking issue remains.