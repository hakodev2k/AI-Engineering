# Skill: Memory Admission Analysis

## Purpose
Prevent deterministic context overflow in background memory jobs while preserving recoverable source history.

## Trigger
Before memory extraction, summarization, consolidation input construction, or retry of a context-length failure.

## Inputs
Rollout/transcript, target context size, reserved system/output tokens, estimator or provider token count.

## Preconditions
Source is immutable for this procedure; target model/context configuration is known.

## Allowed tools
Read-only file access, token counter/estimator, `scripts/memory_admission.py`.

## Constraints
Do not delete history; do not classify deterministic overflow as transient; do not reduce safety/user constraints to make input fit.

## Procedure
1. Capture source bytes and baseline attempted-job outcome.
2. Compute effective input capacity after reserves.
3. Prefer provider tokenizer counts; otherwise use a conservative documented estimator.
4. If within capacity, admit.
5. If oversized, create ordered bounded chunks with overlap from policy.
6. Mark the original job `needs_rechunk`, not normal retry.
7. Process chunks with max two strategy retries.
8. Verify every source range is covered and memory artifacts are produced or explicitly failed.

## Expected output
Admission evidence, token estimate/count, chunk plan, retry classification, coverage status.

## Metrics
Context utilization, overflow rate, retries avoided, chunk count, coverage ratio, quota/useful-artifact.

## Verification
An independent reviewer checks capacity math, source-range coverage, and that no chunk exceeds budget.

## Stop conditions
Admit; or produce verified chunk plan; or stop after two strategy failures and surface incomplete coverage.
