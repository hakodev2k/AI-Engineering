# Workflow: Profile → Trim → Summarize → Verify

## Trigger
Summarization threshold reached or a context-overflow signal occurs.

## Goal
Fit the full summarization envelope while retaining all required context.

## Inputs
Messages, required IDs, context policy, target model context limit, quality fixtures.

## Baseline
Record original serialized size/token estimate, metadata contribution, required IDs, tool pairs, and current overflow status.

## Stages
1. **Observe** — capture exact envelope and required-state manifest.
2. **Measure baseline** — estimate full input + reserved output + safety margin.
3. **Diagnose** — identify metadata and non-required history consuming budget.
4. **Form hypothesis** — choose metadata stripping first, then oldest complete non-required units.
5. **Implement improvement** — run deterministic guard and create reduced envelope.
6. **Measure again** — recalculate projected utilization.
7. **Summarize** — only if the reduced envelope fits.
8. **Verify** — independent agent checks required IDs, tool pairs, regression fixtures, and summary quality.

## Checkpoints
Complete envelope measured; required set explicit; removal report available; projected budget fits; verification independent.

## Metrics
Input tokens, utilization, removed metadata, compression ratio, overflow rate, required-context retention, quality regression, latency/cost.

## Retry policy
At most `max_trim_attempts`. Never repeat an unchanged oversized envelope.

## Stop conditions
Stop when envelope fits and verification passes; block when required state cannot fit or retry budget is exhausted.

## Failure path
Keep original state externally, do not claim completion, and escalate to an approved larger-context model or external-memory strategy.

## Verification
100% required IDs retained, tool pairs structurally valid, projected total under usable limit, and regression fixture threshold met.

## Definition of Done
Implemented: guard integrated. Measured: before/after budget captured. Verified: overflow removed with no critical context loss.
