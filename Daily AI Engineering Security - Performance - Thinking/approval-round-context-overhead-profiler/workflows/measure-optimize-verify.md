# Workflow: Measure → Optimize → Verify

## Trigger
Approval-enabled agent turn shows excessive latency, provider work, or timeout rate.

## Goal
Reduce repeated context-provider overhead while preserving approval and result semantics.

## Inputs
Representative traces, provider metadata, approval policy, benchmark fixtures.

## Baseline
Collect logical-turn latency, provider invocations, provider time, approval rounds, tool rounds, timeout rate, and output/side-effect fingerprints.

## Stages
1. **Observe** — capture traces without changing runtime behavior.
2. **Measure** — run `scripts/analyze_overhead.py` and store baseline JSON.
3. **Diagnose** — identify repeated `(turn, provider, input)` groups and intervening mutations.
4. **Hypothesize** — choose exactly one safe change.
5. **Implement** — apply logical-turn reuse or lifecycle correction only where provider contract allows it.
6. **Measure again** — run identical fixtures.
7. **Verify** — compare outputs, side effects, approvals, and performance thresholds.

## Responsible roles
Performance investigator owns measurement; implementation owner applies the change; an independent reviewer verifies approval and regression evidence.

## Checkpoints
- Baseline captured before change.
- Reuse eligibility documented before caching.
- Required approvals demonstrated after change.
- Before/after fixture set identical.

## Retry policy
Maximum two optimization hypotheses. Benchmark collection may be retried once when infrastructure noise invalidates a run.

## Failure path
If output, side effects, authorization, or approval behavior changes, revert the optimization and record the regression. If savings are below policy threshold, keep baseline behavior.

## Stop conditions
Two failed hypotheses; security/approval regression; insufficient evidence; or target improvement reached.

## Definition of Done
Evidence exists; baseline and candidate metrics exist; approval behavior is unchanged; fixtures pass; performance improves by configured threshold; no blocking regression remains.
