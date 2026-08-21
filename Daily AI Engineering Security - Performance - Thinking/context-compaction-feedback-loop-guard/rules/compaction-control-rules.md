# Rules: Context Compaction Control

1. Every compaction attempt MUST be associated with a stable source-context fingerprint.
2. The runtime MUST cap attempts for the same fingerprint at `max_attempts_per_fingerprint`.
3. The runtime MUST cap total automatic compactions in a rolling 10-minute window.
4. A compaction MUST NOT be considered successful solely because a summary request returned successfully.
5. Success MUST be measured against the next effective model-request size or the closest reliable equivalent.
6. Post-compaction progress below `minimum_progress_ratio` MUST open a cooldown and MUST NOT trigger an immediate same-state retry.
7. Retry/error artifacts SHOULD be excluded from future compaction source material when `exclude_retry_debris` is enabled, while preserving diagnostic hashes/counts separately.
8. Protected-tail selection MUST NOT consume the entire compressible range without producing an explicit `manual_recovery` decision.
9. The runtime MUST account for provider-specific reasoning, tool-call envelopes, images/attachments, tool schemas, and serialization overhead when they materially affect request size.
10. Actual provider token usage MUST be preferred over estimates when available and configured as required.
11. Automatic recovery MUST NOT delete correctness-critical active-task state merely to meet a token target.
12. Increasing the compaction threshold or context limit MUST NOT be used as the only fix for a repeated insufficient-progress loop.
13. The runtime MUST expose tokens spent on failed or insufficient compactions separately from productive task tokens.
14. All automatic loops MUST be bounded; reaching a bound MUST produce `cooldown` or `manual_recovery`, never a silent retry.
15. A controller change MUST be verified against fixtures that preserve required context and fixtures that reproduce repeated-compaction behavior.
16. The implementation agent MUST NOT be the sole verifier of a change that can discard or rewrite conversation state.
