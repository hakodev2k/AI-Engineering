# Workflow: Measure → Fix → Regress

## Trigger
Tasks client integration, conformance gap, cancellation leak, or excess polling.

## Goal
Make MCP Tasks polling bounded, cancellation-aware, server-cadence-aware, and measurably efficient.

## Inputs
Representative task workload, canonical traces, SLOs, SDK/version.

## Baseline
Capture completed/failed/cancelled cases before changing behavior: polls/task, requests/task, cancellation-to-stop, terminal detection latency, wall-clock polling lifetime.

## Context
Use lifecycle telemetry and protocol-visible state only.

## Stages
1. **Measure** baseline.
2. **Diagnose** with `scripts/task_poll_audit.py`.
3. **Hypothesize** one root cause.
4. **Optimize** cancellation/cadence/termination/budget handling.
5. **Measure again** on equivalent workload.
6. If not improved, re-evaluate once; maximum 2 cycles total.
7. **Verify** independently with unit and negative integration cases.

## Responsible agent
SDK/runtime owner implements; Task Poll Verifier independently verifies.

## Tools
Auditor, unit tests, representative integration harness, metrics backend.

## Outputs
Baseline report, candidate report, audit result, accepted/rejected decision.

## Checkpoints
Before code change and after each candidate measurement.

## Metrics
Polls/task, requests/task, interval violations, post-cancel/terminal polls, cancellation-to-stop, terminal detection latency.

## Retry policy
Maximum 2 implementation cycles. No infinite retry or unbounded polling.

## Stop conditions
Verified measurable improvement; no benefit after 2 cycles; correctness regression; or inability to observe required lifecycle state.

## Failure path
Restore prior bounded implementation, retain evidence, escalate SDK/protocol ambiguity.

## Verification
Unit tests plus equivalent before/after workload; independent verifier checks cancellation and terminal negative cases.

## Definition of Done
Baseline captured, root cause documented, lifecycle fix implemented, candidate measured, all deterministic checks pass, no accepted-SLO regression, independent verifier approves.