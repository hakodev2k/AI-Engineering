# Build Failure Diagnosis

## Purpose
Systematically isolate build failures across source, dependency, toolchain, environment, cache, and infrastructure layers.

## When to use
Use for local-only, CI-only, intermittent, platform-specific, or post-upgrade build failures.

## Inputs
Exact command, revision, logs, environment/tool versions, build graph, cache state, recent changes, and failing artifacts.

## Context to inspect
Inspect first causal error, action command line, inputs, environment, worker health, dependency resolution, cache provenance, generated files, and concurrent changes.

## Core knowledge
Later compiler/linker errors often cascade from an earlier failure. Reproduction requires controlling revision, configuration, toolchain, inputs, and environment. Flakiness demands repeated evidence rather than speculative fixes.

## Procedure
1. Capture exact failing revision and invocation.
2. Find the earliest causal error, not the final summary.
3. Classify failure domain: source, dependency, toolchain, graph, cache, environment, or infrastructure.
4. Reproduce with the smallest faithful target.
5. Compare passing and failing environments.
6. Disable caches only as a diagnostic experiment.
7. Inspect action inputs/command and generated prerequisites.
8. Bisect configuration/revision when evidence supports it.
9. Fix root cause and remove temporary diagnostic workarounds.
10. Add regression coverage or diagnostics for recurrence.

## Decision points
Use clean builds to test stale-state hypotheses, not as permanent remediation. Retry only failures proven transient; deterministic failures should fail fast.

## Common failure patterns
Deleting caches without learning why, fixing downstream errors, changing several variables at once, masking failures with retries, and assuming developer environment equals CI.

## Verification
Reproduce failure before fix; demonstrate it no longer occurs under original conditions; run clean and incremental builds; repeat flaky scenarios enough to establish confidence.

## Expected output
A root-cause statement, minimal fix, evidence, and regression protection.

## Stop conditions
Stop when reproduction requires unavailable privileged infrastructure, evidence indicates compromise, or the failure belongs to an external service with no actionable local mitigation.