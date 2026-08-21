# Workflow: Measure → Dedupe → Verify

## Trigger
Run when a session grows unexpectedly, repeated compaction occurs, token cost rises, first-token latency degrades, or session-history reconstruction changes.

## Goal
Reduce redundant replayed session metadata while preserving correctness-critical state, recovery information, safety decisions, and task quality.

## Inputs
Original session JSONL, `config/budget.json`, optional provider usage telemetry, quality fixtures, and event-type semantics.

## Baseline
Run:

```bash
python scripts/session_bloat_profiler.py session.jsonl --policy config/budget.json --json-out baseline.json
```

Record total records/bytes, metadata bytes, estimated tokens, exact duplicate ratio, per-type distribution, and provider prompt tokens/latency when available.

## Context
Persistence schema, replay/inclusion behavior, compaction behavior, protected-state semantics, event lifetimes, and representative tasks.

## Stages
1. **Observe** — Capture the immutable session snapshot and current symptoms.
2. **Measure baseline** — Profile record classes, bytes, estimated tokens, duplicates, and budget pressure.
3. **Diagnose** — Identify whether growth comes from exact duplicates, transient event replay, superseding state, stable bootstrap repetition, or accounting mismatch.
4. **Form hypothesis** — Define a bounded inclusion-policy change and the expected byte/token reduction.
5. **Implement candidate** — Build a candidate replay working set; do not rewrite the source log during evaluation.
6. **Measure again** — Profile the candidate and compare equivalent provider telemetry where possible.
7. **Verify quality/state** — Run representative tasks and confirm protected-state retention.
8. **Accept or reject** — Accept only when configured retention/quality thresholds pass and measurable replay cost improves.
9. **Complete** — Preserve before/after reports, policy version, risks, and verification result.

## Responsible agent
The runtime maintainer implements the inclusion change. `subagents/context-analyst.md` independently verifies protected-state retention and quality.

## Tools
`session_bloat_profiler.py`, JSONL/session inspection, provider token telemetry, task regression harness, and ordinary diff tools.

## Outputs
Baseline report, candidate report, accepted/rejected hypothesis, protected-state comparison, quality evidence, and residual risks.

## Checkpoints
- C1: immutable baseline captured before optimization.
- C2: every affected event type classified or conservatively protected.
- C3: candidate working set measured independently from persisted file size.
- C4: protected retention rate meets policy.
- C5: quality pass rate meets policy.
- C6: accepted change shows a measurable reduction in replay bytes/tokens or latency/cost.

## Metrics
Metadata bytes, duplicate candidate bytes, duplicate ratio, estimated tokens, provider input tokens/task, cache creation/read where available, latency/task, quality pass rate, and protected retention rate.

## Retry policy
Maximum two optimization iterations. Each retry must use new evidence or a materially different hypothesis.

## Stop conditions
Stop if protected/transient semantics cannot be determined, required state is lost, quality regresses, or two optimization attempts fail.

## Failure path
Restore the prior inclusion policy, preserve evidence, classify uncertain event types as protected, and escalate to the runtime owner. Do not reduce thresholds to manufacture success.

## Verification
Success requires both measurable cost/context improvement and equivalent-or-better representative task outcomes with all protected state retained.

## Definition of Done
Evidence documented; baseline captured; event lifecycle classified; candidate policy implemented; before/after metrics collected; protected retention and quality thresholds pass; independent verification complete; no required context is lost; no blocking issue remains.
