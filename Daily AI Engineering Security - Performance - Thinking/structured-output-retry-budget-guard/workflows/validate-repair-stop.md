# Workflow: Validate, Repair, Stop

## Trigger
A model or subagent has returned a substantive result and the declared structured-output parse/schema validation fails.

## Goal
Recover terminal formatting/schema failures without rerunning completed task work and without allowing an unbounded retry loop.

## Inputs
Raw output, declared schema/version, exact validation error, terminal attempt event log, retry policy.

## Baseline
Measure invalid attempts per task, terminal-output duration, token usage after the final substantive task action, repair success rate, and stuck-child incidence.

## Context
The raw output is the repair source of truth. The workflow distinguishes terminal formatting failure from incomplete or incorrect underlying task work.

## Stages
1. **Observe** — capture raw output unchanged and record the first local validation result.
2. **Measure baseline** — append the terminal event and run `scripts/structured_output_guard.py`.
3. **Diagnose** — classify extraction, parse, or schema failure and determine whether substantive task work is already complete.
4. **Form hypothesis** — identify the smallest formatting/schema correction supported by the raw artifact.
5. **Implement improvement** — when the guard permits it, perform one narrow repair with no task tools or side effects.
6. **Measure again** — locally validate the repaired candidate, append a new event, and rerun the guard.
7. **Improved?** — if invalid and policy still permits, one additional repair may occur only when the failure fingerprint or repair hypothesis materially changes.
8. **Verify** — Structured-Output Verifier independently checks schema validity, evidence fidelity, and retry-budget compliance.
9. **Complete** — publish only verified valid output; otherwise publish an explicit structured-output failure record.

## Responsible agent
The workflow owner performs capture/classification; a narrow repair agent may perform repair; the Structured-Output Verifier performs final verification.

## Tools
Local schema validator, deterministic guard script, JSON/diff utilities, optional narrowly scoped repair model.

## Outputs
Validated structured result or explicit failure with raw-artifact reference, validation error class, attempt counters, fingerprints, and stop reason.

## Checkpoints
After raw capture, after each validation attempt, before each repair, and before completion publication.

## Metrics
Invalid attempts/task, repeated-invalid count, repair attempts, repair success rate, terminal latency, post-work token burn, blocked-child incidence, full-task reruns avoided.

## Retry policy
Maximum repair attempts: 2. Maximum identical invalid attempts: 2. Maximum total terminal attempts: 4. Terminal deadline: 120 seconds by default. Every retry MUST have new evidence or a changed repair hypothesis.

## Stop conditions
Local validation passes and verifier approves; any retry/deadline limit is reached; unsupported facts are introduced; or underlying task completeness is disproven.

## Failure path
Preserve raw output, stop terminal retries, return explicit structured-output failure evidence, and let the parent/human decide separately whether underlying task work requires rerun.

## Verification
Independent verifier must reproduce local validation and guard decision from artifacts.

## Definition of Done
Raw evidence preserved; local validation performed; retries bounded; no repeated-loop path remains; accepted output independently verified or explicit failure recorded.