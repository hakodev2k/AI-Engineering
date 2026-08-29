# Workflow: Detect, Recover, Verify

## Trigger
A reasoning-capable agent can terminate without a visible/user-consumable result, or continuation/retry behavior is suspected of looping on empty/truncated outputs.

## Goal
Convert silent terminal empties into either a valid typed outcome or an explicit bounded failure.

## Inputs
Sanitized response traces, provider/adapter schema, completion policy, expected outcome types, baseline token/latency metrics.

## Baseline
Measure counts of terminal turns by class: text, tool, structured, explicit no-reply, empty-stop, truncation, unknown. Record retry count, elapsed time, and output/input tokens where available.

## Context
Use `skills/completion-contract-analysis.md` and enforce `rules/visible-completion-rules.md`.

## Stages
1. **Observe** — collect representative terminal traces without hidden chain-of-thought.
2. **Measure baseline** — classify outcomes and quantify silent-empty/truncation/retry rates.
3. **Diagnose** — test whether failure comes from channel mapping, output-budget exhaustion, placeholder rewriting, or wrong termination semantics.
4. **Form hypothesis** — define which observable predicate should distinguish completion from transport termination.
5. **Implement** — insert completion validation before persistence/delivery/task closure.
6. **Recover** — for an invalid empty terminal, issue a concise external-answer continuation; for truncation, use incomplete/continuation semantics. Cap retries.
7. **Measure again** — compare valid-completion, explicit-failure, retry, latency, and token metrics.
8. **Regression verification** — exercise valid text, tool, structured, no-reply, empty-stop, truncation, and unknown-schema fixtures.
9. **Independent review** — verifier attempts to identify valid outcomes incorrectly rejected or invalid outcomes incorrectly accepted.

## Responsible agent
Runtime implementer handles stages 3–7. `subagents/verification-agent.md` handles stage 9 and must be independent for final approval.

## Tools
Trace validator, unit tests, local mock responses, provider docs, observability metrics.

## Outputs
Baseline classification report, implementation diff, post-change metrics, validator output, regression results, verification status.

## Checkpoints
C1 baseline captured; C2 hypothesis linked to evidence; C3 completion predicate installed; C4 bounded recovery tested; C5 before/after measured; C6 independent verification pass.

## Metrics
Silent-empty-success rate; truncation-as-success rate; valid outcome pass rate; recovery success rate; retries/turn; recovery token/time overhead; explicit failure coverage.

## Retry policy
Maximum empty-response retries come from policy and MUST NOT exceed 2 in the example configuration. An identical failure signature repeated at the cap stops immediately.

## Stop conditions
Success requires C1–C6. Stop unsuccessfully when retry budget is exhausted, protocol schema is unknown, or valid-output regressions cannot be resolved within 2 implementation cycles.

## Failure path
Return explicit typed failure, preserve sanitized metadata, do not fabricate placeholder success, and escalate adapter/provider incompatibility.

## Verification
The same trace corpus must show fewer silent successes and no loss of legitimate outcomes. Completion is evidence-based, not inferred from model confidence or hidden reasoning.

## Definition of Done
Implemented, Measured, and Verified are all true and no blocking regression remains.
