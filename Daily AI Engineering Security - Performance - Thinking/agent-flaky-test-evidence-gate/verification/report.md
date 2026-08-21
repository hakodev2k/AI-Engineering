# Verification Report

## Verification status model
This package separates three states:
- **Implemented**: required package artifacts and deterministic enforcement logic exist.
- **Measured**: a repository/task has produced baseline and post-change run records.
- **Verified**: the evidence gate has classified those records and an independent verification step confirms the completion decision.

Package generation can verify implementation completeness and internal consistency. Repository-specific outcome improvement is measured only when integrated into a real project.

## Package-level verification

### Evidence quality
- Current problem is supported by multiple independent 2026 signals.
- OpenAI Codex Security issue #252 demonstrates an actual fail-once/pass-on-rerun test sequence.
- Two 2026 empirical studies establish that flaky CI/test outcomes are common and cannot always be inferred from source code alone.
- ReproFlake demonstrates the importance of execution/reproduction evidence.
- Existing agent-reliability work supports bounded retries and error classification rather than open-ended loops.

Status: **Verified from cited public sources**.

### Structural completeness
Required logical artifacts are present:
- README
- integration guide
- evidence research
- core skills
- engineering rules
- subagents
- workflows
- hooks
- repeated-command runner
- deterministic classifier
- classifier tests
- policy
- verification report

Status: **Implemented**; final GitHub tree verification is required after all writes.

### Reasoning-safety checks
The package explicitly prevents:
- single-pass-after-failure being treated as proof of a fix;
- failure-driven edits before baseline classification when reproduction is feasible;
- infinite rerun loops;
- hiding prior failed reruns;
- confusing infrastructure markers with proven product defects;
- implementer-only verification in ambiguous/high-impact cases.

Status: **Implemented by rules/workflows/hooks**.

### Deterministic automation checks
`run_repeated_command.py`:
- avoids shell invocation;
- bounds run count and timeout;
- records each observation independently;
- uses a conservative environment allowlist;
- returns meaningful runner exit codes.

`classify_test_signal.py`:
- preserves mixed pass/fail as nondeterministic;
- fingerprints normalized failed output;
- detects recurring infrastructure markers;
- returns `UNKNOWN` instead of inventing unsupported certainty;
- bounds pathological log material used for fingerprinting while raw logs remain in source JSONL.

Status: **Static-reviewed**.

### Test coverage supplied
`tests/test_classifier.py` covers:
- all-pass classification;
- mixed pass/fail classification;
- stable repeated failure fingerprint;
- changing failure fingerprints;
- infrastructure marker classification;
- volatile timestamp normalization.

Status: **Implemented**. Runtime execution should be performed in the integration environment with Python 3.10+ using `python -m unittest tests/test_classifier.py`.

## Topic-specific Definition of Done
A real agent task using this package is complete only when all applicable items hold:
1. Initial failure evidence is preserved.
2. Revision/diff baseline is captured.
3. Unchanged-code reproduction is attempted or an explicit exception is recorded.
4. Classification is produced from saved run records.
5. Failure-driven implementation is justified by evidence rather than a single observation.
6. Retry/run budgets are respected.
7. Post-change targeted verification is measured.
8. Baseline failure fingerprint is compared against post-change evidence.
9. Relevant broader tests/checks run according to repository policy.
10. Independent verifier reviews ambiguous/high-impact changes.
11. No unresolved target `UNKNOWN`, mixed outcome, or infrastructure failure is hidden by a later pass.
12. Final status explicitly records Implemented / Measured / Verified.

## Failure handling
- **Classifier cannot parse records:** stop with invalid evidence; do not repair product code from that classification.
- **Repeated runner fails internally:** preserve error and stop automated failure-driven repair.
- **Run budget exhausted with mixed evidence:** classify nondeterministic/unknown and escalate.
- **Infrastructure marker dominates:** route to infrastructure handling with bounded retries.
- **Target fingerprint persists after one implementation retry:** stop and return to root-cause analysis/human review.
- **New failure fingerprint appears post-change:** treat as a new observation and classify independently.

## Success metrics for deployment
Compare a representative before/after task set:
- speculative edits triggered by failures later proven flaky;
- average failure-driven fix loops per task;
- test reruns per decision;
- percentage of completion claims backed by baseline + post-change evidence;
- mixed-outcome cases incorrectly treated as green;
- rework caused by test-signal misclassification.

An improvement claim is **Measured** only with collected task data and **Verified** only when quality/completion accuracy does not regress while misclassification/rework decreases.
