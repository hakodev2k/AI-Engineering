# Workflow: Measure, Reduce Amplification, Verify

## Trigger
A full-history fork or multimodal session exceeds a budget, grows unexpectedly, or repeatedly fails transport.

## Goal
Reduce duplicated persisted/request context while preserving required model-visible information.

## Inputs
Rollout JSONL, budget config, required-context fixtures, intended fork mode.

## Baseline
Run `python scripts/history_payload_audit.py <rollout> --config config/budget.json` and retain JSON output.

## Stages
1. **Observe** — Context Auditor captures size/compaction/blob metrics.
2. **Diagnose** — identify duplicated inline blobs and historical compaction amplification.
3. **Hypothesize** — select one change: narrower fork window, superseded-compaction exclusion, or blob externalization.
4. **Implement** — runtime owner applies one reversible change outside this package; source rollout remains untouched.
5. **Measure again** — audit candidate payload/history.
6. **Verify** — Verification Agent checks required-context fixtures and metric deltas.
7. **Complete or re-evaluate** — one additional hypothesis is allowed if the first fails.

## Checkpoints
Baseline saved; hypothesis documented; candidate audit saved; independent coverage verification completed.

## Metrics
Total bytes, compacted bytes/share, largest record, inline/duplicate blob bytes, amplification ratio, estimated fork bytes, tokens/task if available, transport retries, task-quality regression rate.

## Retry policy
Maximum two optimization attempts. Unchanged over-budget transport payload may be retried once only.

## Stop conditions
Required-context loss, unknown semantics, malformed source, two failed attempts, or unresolved hard-budget violation.

## Failure path
Restore prior fork strategy, preserve evidence, block automatic full-history fork, escalate for human/runtime-owner review.

## Definition of Done
Before/after measurements exist; at least one target metric improves; required-context coverage passes; no hard budget violation; independent verifier signs off.