# Workflow — Regression Verification
## Trigger
Changes to ephemeral generation helpers, session creation, MCP inheritance, unsubscribe/removal or shutdown.
## Goal
Prevent reintroduction of unnecessary MCP startup or retained one-shot runtimes.
## Inputs
Policy, guard tests, benchmark workload and quality fixtures.
## Baseline
Record current stable tool-free summary output and runtime baseline.
## Stages
1. Run `python -m unittest tests/test_runtime_intent_guard.py`.
2. Execute N tool-free summaries; assert effective MCP count is zero for each.
3. Assert owned ephemeral session/process count returns to baseline after each bounded cleanup window.
4. Record RSS and p50/p95 summary latency before/after.
5. Run fixed summary-quality fixtures; compare required facts/constraints, not stylistic wording.
6. Run one tool-enabled ephemeral fixture and confirm required MCP remains available until pending calls reach zero, then shuts down.
## Metrics
Zero MCP starts for tool-free summaries; zero retained one-shot sessions; lower or equal RSS/process growth; non-regressed quality; latency reported.
## Retry policy
One fix and one complete rerun.
## Stop conditions
Any required-tool failure, output-quality regression or retained-session leak blocks release.
## Failure path
Revert optimization and reopen lifecycle investigation with collected ownership telemetry.
## Verification
Performance Verifier separate from implementer signs off.
## Definition of Done
All deterministic tests pass and measured runtime stays bounded with equivalent output quality.
