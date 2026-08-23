# Workflow: Measure → Guard → Verify Hook Liveness

## Trigger
Hook-associated stall, unexplained session freeze, or adoption of blocking hooks in a headless workflow.

## Goal
Bound hook critical-path latency without weakening security policy.

## Inputs
Hook command/configuration, host logs, SLO, workspace.

## Baseline
Measure normal and deliberately hanging hook duration, lifecycle terminal-event coverage, and orphan count.

## Stages
1. **Observe** — correlate started/terminal hook events.
2. **Measure** — capture elapsed time and batch width.
3. **Diagnose** — classify child hang, host join, or cleanup failure.
4. **Hypothesis** — parent deadline plus process-tree termination will bound the stall.
5. **Implement** — route the hook through `hook_watchdog.py` or equivalent host-native mechanism.
6. **Measure again** — run success/failure/timeout fixtures.
7. **Verify** — independent verifier checks lifecycle and process cleanup.

## Responsible agent
Investigator for stages 1–4; runtime implementer for stage 5; `subagents/liveness-verifier.md` for stages 6–7.

## Tools
Package script/tests, process inspection, host logs.

## Outputs
Baseline, guarded measurements, terminal JSON records, verifier disposition.

## Checkpoints
Do not implement before baseline. Do not claim completion before timeout fixture and orphan check.

## Metrics
p95 duration, timeout enforcement error, unresolved lifecycle ids, orphan descendants, session recovery rate.

## Retry policy
At most 2 diagnostic retries. A timeout fixture is run once per implementation revision. A failed verification returns to diagnosis once.

## Stop conditions
Stop on verified bounded behavior or after the retry budget is exhausted with evidence.

## Failure path
Restore the prior known-good execution path only if doing so preserves the configured security policy; otherwise fail closed and escalate.

## Definition of Done
Baseline captured; parent deadline implemented; tests pass; timeout is bounded; terminal record exists; no owned descendants survive; security disposition preserved; independent verification recorded.