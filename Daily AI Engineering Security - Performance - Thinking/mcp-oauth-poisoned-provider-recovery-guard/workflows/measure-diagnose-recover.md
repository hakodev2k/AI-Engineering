# Workflow — Measure, Diagnose, Recover

## Trigger
OAuth-backed MCP server repeatedly times out, throws auth-flow/lock errors, or remains parked.

## Goal
Restore service with the smallest recovery scope and measurable improvement.

## Inputs
Redacted trace, policy, client/SDK version, server/provider identifiers.

## Baseline
Measure connect latency, retries, warnings/hour, parked duration, process restarts, and unaffected-server availability.

## Context
Distinguish transport/session objects from OAuth provider/token-store objects and process-global state.

## Stages
1. **Observe** — capture failures and last successful generation.
2. **Measure baseline** — record retry and latency metrics.
3. **Diagnose** — classify transport vs provider-poison vs remote/unknown.
4. **Form hypothesis** — compare cached-provider path with fresh-provider evidence where safe.
5. **Implement improvement** — integrate provider generation/recreation and bounded circuit logic.
6. **Measure again** — replay equivalent traces or safe benchmark.
7. **Improved?** If no, re-evaluate for at most two iterations. If yes, independent verification.

## Responsible agent
Implementation owner; independent MCP Recovery Investigator.

## Tools
`scripts/oauth_recovery_guard.py`, logs, tests, safe benchmark harness.

## Outputs
State-machine report, before/after metrics, recovery decision, verification status.

## Checkpoints
Before provider recreation; before whole-process restart; after circuit open; after metrics comparison.

## Metrics
Time-to-recovery, attempts, recreations, p95 connect latency, warnings/hour, unrelated-server disruption.

## Retry policy
Bounded by config; maximum two diagnosis/implementation loops.

## Stop conditions
Healthy success; circuit open; budgets exhausted; evidence indicates remote/credential problem instead.

## Failure path
Open circuit, preserve redacted evidence, escalate. Never increase retries indefinitely.

## Verification
Run unit tests and confirm provider generation changes on poison recovery while healthy servers remain isolated.

## Definition of Done
Baseline captured; root-cause hypothesis supported; recovery implemented; metrics improve; tests pass; independent verification complete; no blocking issue remains.
