# Compaction Budget Rules

1. Compression retry budgets MUST bound failed or no-progress attempts.
2. Successful maintenance compactions MUST NOT permanently consume the same failure budget once measurable progress is verified.
3. A re-arm MUST require `after_tokens < before_tokens`, threshold clearance, and a subsequent successful model request below the configured threshold.
4. A runtime MUST NOT re-arm merely because a compression function returned successfully.
5. Context-engine plugins MUST expose progress through a public result contract; core logic MUST NOT depend on private implementation fields for budget semantics.
6. Missing before/after token telemetry MUST be treated as unverifiable, not successful progress.
7. No-progress compactions MUST consume the failure budget.
8. Failed compression attempts MUST consume the failure budget.
9. The maximum consecutive failed/no-progress attempts MUST remain bounded by configuration.
10. Context required for correctness MUST NOT be discarded merely to avoid a max-attempt failure.
11. Fallback routing SHOULD preserve the same attempt/progress semantics across engines.
12. Baseline and post-change traces MUST be captured before claiming improvement.
13. Implementers MUST NOT be the sole verifier of the new re-arm behavior.
