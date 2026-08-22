# Skill: CI Failure Triage

## Purpose
Convert a CI failure into an evidence-backed classification and ranked hypotheses before any repair.

## When to use
Immediately after a build/test/lint/package/integration job fails.

## Inputs
- failed pipeline/job/step and command;
- normalized log and available artifacts;
- commit/ref and recent diff;
- known baseline status;
- repository structure and relevant CI configuration.

## Preconditions
Logs must correspond to the failed run. Secrets must be redacted. Repository state must identify the code revision under investigation.

## Process
1. Locate the earliest actionable error, not merely the final non-zero exit message.
2. Separate primary errors from cascaded failures.
3. Map the failing command to repository files, configuration, dependencies, tests, and runtime services.
4. Compare relevant changed files with the failing surface.
5. Search for existing tests/configuration and known failure handling.
6. Classify the failure as `code-regression`, `test-regression`, `configuration`, `dependency`, `environment`, `external-service`, `flaky`, `pre-existing`, or `unknown`.
7. Record evidence supporting and contradicting the classification.
8. Create at most three ranked hypotheses. Each hypothesis must name a falsifiable check.
9. Execute/read-only checks for the highest-ranked hypothesis first.
10. Update confidence only from observed evidence.
11. Decide one action: minimal repair, controlled rerun, external wait/escalation, or stop for insufficient evidence.
12. Write `failure-manifest.json`.

## Tools
Repository search/read, Git diff/history, local non-destructive shell commands, CI logs/artifacts, test/build commands when permitted.

## Constraints
Do not edit code during classification. Do not call a failure flaky solely because rerunning may fix it. Do not infer root cause from the last log line when earlier causal evidence exists.

## Expected output
A schema-valid failure manifest containing classification, evidence, ranked hypotheses, selected action, affected surface, verification plan, retry counters, and approvals.

## Verification
Run `scripts/verify-failure-manifest.py`. Every selected repair must reference at least one evidence item and one verification check.

## Failure handling
Retry log/search collection once with a narrower scope and once with an alternate source/artifact. If causal evidence remains unavailable, stop as `insufficient-evidence`.

## Stop conditions
Stop when a dangerous action needs approval, evidence cannot distinguish plausible hypotheses, or the allowed investigation/retry budget is exhausted.
