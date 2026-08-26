# Workflow: Regression Verification
## Trigger
Compaction algorithm, memory/retrieval behavior, prompt assembly, or budget policy changes.
## Goal
Detect token savings that cause instruction, memory, or completed-work regressions.
## Inputs
Long-session fixtures, critical inventories, token telemetry, compacted summaries.
## Baseline
Capture uncompacted task outputs and provider counts for same fixtures.
## Stages
1. Run recent-instruction, persistent-rule, completed-subagent-result, and working-state fixtures.
2. Run deterministic guard.
3. Compare before/after counts.
4. Verify each critical item inline or via verified retrieval.
5. Check representative decisions honor user/security/approval constraints.
6. Compare redundant tool/subagent calls where available.
7. Independent verifier signs off.
## Metrics
Required-item retention 100%; duplicate ratio within budget; configured reduction; no critical regression; fewer/equal redundant calls.
## Retry policy
One implementation correction plus one rerun.
## Stop conditions
Critical loss, invalid telemetry, or exhausted retry budget.
## Failure path
Reject change and keep prior known-good behavior.
## Verification
Tests plus independent retention review.
## Definition of Done
Measured savings and semantic-retention checks both pass.