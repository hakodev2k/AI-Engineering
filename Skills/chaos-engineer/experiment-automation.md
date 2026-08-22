# Experiment Automation

## Purpose
Automate repeatable resilience experiments so they can become reliable regression checks rather than one-off demonstrations.

## When to use
Use after an experiment is proven safe and valuable manually, or when resilience properties must be checked repeatedly.

## Inputs
Validated experiment, infrastructure APIs, CI/CD constraints, observability queries, and safety controls.

## Context to inspect
Inspect environment lifecycle, authentication, concurrency, deployment pipelines, target discovery, cleanup, and evidence retention.

## Core knowledge
Automation should encode safety as well as fault injection. It must validate preconditions, select targets dynamically, enforce bounds, collect evidence, and clean up even after failure.

## Procedure
1. Convert manual steps into deterministic stages.
2. Encode environment and health prechecks.
3. Discover targets from current state rather than stale IDs.
4. Configure bounded injection and automatic expiration.
5. Continuously evaluate abort criteria.
6. Collect experiment-tagged telemetry.
7. Guarantee cleanup in success, failure, and cancellation paths.
8. Produce machine-readable results.
9. Gate scheduling or pipeline use on proven stability.

## Decision points
Automate stable experiments; keep exploratory or high-risk scenarios supervised. Use pipeline gates only when false positives and environmental variance are controlled.

## Common failure patterns
Automating unsafe assumptions, stale targets, cleanup only on success, overlapping experiments, hidden credentials, and pass/fail without evidence.

## Verification
Run repeated executions and prove deterministic targeting, cleanup, abort behavior, and result capture.

## Expected output
A repeatable, auditable, safety-bounded experiment workflow.

## Stop conditions
Stop automation rollout when target selection, cleanup, or health gating is nondeterministic.