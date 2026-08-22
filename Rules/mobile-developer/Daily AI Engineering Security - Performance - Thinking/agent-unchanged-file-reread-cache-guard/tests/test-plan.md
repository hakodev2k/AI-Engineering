# Test Plan

## Deterministic fixtures

1. **First read misses** — create a file; `check` must exit 2; `record`; second identical `check` must exit 0.
2. **Changed content misses** — record a file, modify one byte/line, then `check`; it must exit 2.
3. **Same size changed content misses** — replace content with equal byte length; hash must prevent a false hit.
4. **Covered range hits** — record lines 1–100; checking 20–40 may hit when `allow_superset_hits=true`.
5. **Uncovered range misses** — record 1–100; checking 90–120 must miss.
6. **Compaction semantic check can identify unchanged** — after `compact`, `check` without `--require-context` may return unchanged receipt.
7. **Compaction exact-text check rehydrates** — after `compact`, `check --require-context` must exit 2.
8. **Post-rehydration exact-text hits** — after test 7 performs real read and `record`, `check --require-context` must hit.
9. **Mutation invalidation** — after `invalidate`, next check must miss even if content happens to be unchanged until re-recorded.
10. **Missing ledger** — guard creates state safely and never modifies target file.
11. **Corrupt ledger** — guard exits 4; host falls back to real read.
12. **Symlink canonicalization** — aliases to the same target must map to one canonical path; do not allow a path alias to bypass fingerprint checks.
13. **Multi-agent reuse** — two trusted agents sharing the same worktree ledger can reuse a proven unchanged range.
14. **Cross-worktree isolation** — integration must not share a ledger between distinct worktrees unless repository object identity and policy explicitly support it.

## Replay benchmark
Use at least 20 representative long-running tasks or a trace corpus with >=100 file reads. Replay once without suppression and once with the guard. Capture read calls, bytes, estimated input tokens, read-tool wall time, compaction count, forced rehydrations, and task verification result.

## Acceptance gates
- Duplicate unchanged read bytes reduced by >=80% on the chosen corpus, or a documented lower threshold justified by a high rate of legitimate rehydrations.
- False cache hits: exactly 0.
- Changed-content fixtures: 100% miss.
- Exact-text post-compaction fixture: 100% rehydrate until re-recorded.
- No increase in failed task verification.
- Guard errors always fall back to real reads rather than suppressing content.

## Status semantics
**Implemented:** lifecycle hooks and script are wired.
**Measured:** before/after metrics were collected on the same corpus.
**Verified:** all acceptance gates pass and an independent reviewer confirms no stale substitution.
