# Workflow: Preflight → Refresh → Dispatch

## Trigger
Before spawning a subagent.

## Goal
Send the smallest correct and current context payload allowed by the child contract.

## Inputs
Child definition, model/window, source manifest, budget, and current source metadata.

## Baseline
Measure input tokens, optional-context share, dispatch latency, task quality, compaction rate, and missing-context failures.

## Stages
1. **Observe** — enumerate all inherited and explicitly requested sources.
2. **Measure baseline** — count tokens per source using child-local accounting.
3. **Diagnose** — identify undeclared optional sources, stale required snapshots, and parent-derived budget errors.
4. **Form hypothesis** — define proposed exclusions/refreshes and expected token delta.
5. **Implement** — run pre-dispatch audit; refresh changed required sources once.
6. **Measure again** — record final manifest and actual request usage.
7. **Verify** — independent reviewer checks token savings and task/regression evidence.

## Checkpoints
Before exclusion; after refresh; before dispatch; after task acceptance.

## Metrics
Tokens/subagent, stale-source count, optional-memory share, dispatch latency, and quality/regression rate.

## Retry policy
One refresh/re-audit cycle. No infinite refresh loop.

## Failure path
Unknown provenance, required-over-budget, or repeatedly changing source → block and escalate/model-route.

## Verification
All fixtures pass and production canary retains acceptance quality while reducing unnecessary input tokens.

## Definition of Done
Final child-local manifest is current, within budget or explicitly escalated, and quality verification passes.