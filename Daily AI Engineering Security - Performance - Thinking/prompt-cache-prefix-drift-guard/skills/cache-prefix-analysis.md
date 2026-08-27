# Skill: Cache Prefix Analysis

## Purpose
Diagnose prompt-cache loss as a measurable prefix-stability problem.

## Trigger
Unexpected cache creation, costly resume, client update, tool-schema change, or dynamic repository-state change.

## Inputs
Last cache-hitting ordered prompt blocks, rebuilt candidate blocks, input-token estimate, cache telemetry.

## Preconditions
Secret-bearing content is redacted from human-readable diagnostics.

## Required context
Block kind/order and usage metrics; hidden model reasoning is not required.

## Allowed tools
Read-only session logs, SHA-256 hashing, token counters, this package's deterministic guard.

## Constraints
- MUST NOT expose raw secrets.
- MUST NOT remove correctness-critical or security-critical context merely to improve cache reuse.
- MUST establish a baseline before optimization.

## Procedure
1. Capture cache-read, cache-create, total input, latency, and task outcome.
2. Fingerprint ordered prefix blocks.
3. Find the first divergent block.
4. Classify the source as versioned static text, tool schema, repo state, session state, or unavoidable task context.
5. Form one testable hypothesis about the drift source.
6. Move only safe dynamic state after stable cache boundaries or pin versioned blocks for the session.
7. Re-run the same workload and compare metrics.

## Decision points
Block resume when unexplained drift exceeds the guard threshold. Permit deliberate drift only with explicit approval and recorded exposure.

## Expected output
Facts, divergence index, estimated exposure, hypothesis, before/after metrics, and verification status.

## Metrics
Cache-read ratio, cache-creation tokens, tokens/task, latency, cost/task, task-quality regression.

## Verification
The same workload MUST preserve required task quality while reducing avoidable cache creation.

## Failure handling
Restore the baseline layout if correctness or security context degrades.

## Stop conditions
Maximum 2 optimization attempts; stop immediately on secret leakage, unexplained drift, or degraded correctness.
