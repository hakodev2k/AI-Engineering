# Flaky Workflow Investigation

## Purpose
Diagnose and remove nondeterminism in tests, builds, CI jobs, and developer tooling that erodes trust in feedback.

## When to use
Use when identical inputs produce intermittent outcomes or developers routinely rerun failed checks.

## Inputs
Failure history, logs, timestamps, environment metadata, test/build code, resource metrics, and dependency status.

## Context to inspect
Inspect concurrency, ordering, clocks, random data, shared state, network dependencies, resource pressure, retries, and environment drift.

## Core knowledge
Retries can reduce immediate disruption but hide defects. Preserve failure evidence and classify whether the source is product code, test code, infrastructure, or external dependency.

## Procedure
1. Quantify failure frequency and affected workflows.
2. Preserve raw evidence before retries.
3. Compare successful and failed environments/inputs.
4. Reproduce under controlled repetition.
5. Isolate shared state, timing, ordering, and dependency variables.
6. Form and test one causal hypothesis at a time.
7. Fix root cause or quarantine with owner and expiry.
8. Remove compensating retries when safe.
9. Monitor recurrence.

## Decision points
Quarantine only when preserving pipeline trust outweighs temporary coverage loss and ownership/expiry are explicit.

## Common failure patterns
Blind retry loops, deleting flaky tests, changing timeouts without evidence, ignoring infrastructure saturation, and losing failed-run artifacts.

## Verification
Run repeated targeted and suite-level executions under stress and confirm the failure rate remains below the defined threshold.

## Expected output
A root-cause record, fix or bounded quarantine, regression evidence, and recurrence monitoring.

## Stop conditions
Escalate when reproduction requires unsafe production actions or the external dependency owner must provide evidence.