# Skill: Reproduce and Classify a Flaky Test

## Purpose
Turn an intermittent test failure into evidence: a reproducible command, failure frequency, environmental facts, and a bounded set of hypotheses.

## When to use
Use when a test passes and fails across runs, fails only in CI, depends on ordering/time/concurrency, or has an unclear intermittent symptom.

## Inputs
- Test command or failing test identifier.
- Failure log/stack trace when available.
- Repository root.
- Relevant CI/environment facts.

## Preconditions
- Working tree is inspectable.
- Test command can be executed safely.
- No production mutation is required.

## Allowed tools
Repository search/read, local test runner, build tools, git diff/status, deterministic scripts in this package.

## Constraints
Follow `rules/test-flake-safety.md`. Redact secrets. Do not edit during the initial evidence phase.

## Procedure
1. Capture the exact command, current commit, branch, runtime/tool versions, and relevant environment facts.
2. Run the target using `scripts/run-flake-loop.sh` for the configured reproduction budget.
3. Store each run output and the summary under `.ai/flake-triage/evidence`.
4. Confirm whether at least one pass and one fail occurred. If all runs fail, classify as likely deterministic and stop flake-specific automation.
5. Inspect the failing stack, nearest test setup/teardown, fixtures, shared resources, clocks, random data, network calls, filesystem access, and parallel execution.
6. Compare passing and failing runs. Separate facts from hypotheses.
7. Classify the leading cause as timing, concurrency, shared-state, ordering, external-dependency, resource-exhaustion, nondeterministic-data, environment, or unknown.
8. Rank at most three hypotheses by evidence strength.
9. Produce an investigation handoff containing failure frequency, affected files/components, evidence paths, hypotheses, confidence, and recommended next experiment.

## Expected output
A structured investigation handoff for the implementation stage, plus preserved run evidence.

## Verification
The handoff is valid only if the original command, attempt count, pass/fail counts, evidence locations, and hypothesis status are recorded.

## Failure handling
- Tool/transient failure: retry at most twice, preserving output.
- Permission/environment failure: stop and report the blocked prerequisite.
- No intermittent reproduction within budget: report `not-reproduced` and avoid speculative edits.

## Stop conditions
Stop when the failure is deterministic, reproduction budget is exhausted, required access is unavailable, or a dangerous action would be required.