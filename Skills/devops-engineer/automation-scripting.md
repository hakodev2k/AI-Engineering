# Automation and Scripting

## Purpose
Build safe operational automation that replaces repetitive manual work without creating opaque failure modes.

## When to use
Use for provisioning helpers, deployment tooling, maintenance jobs, cleanup, reporting, or operational workflows.

## Inputs
Manual procedure, APIs/CLI tools, permissions, expected scale, failure/retry semantics.

## Context to inspect
Existing scripts, credentials, scheduling, logs, idempotency, historical incidents, platform-native alternatives.

## Core knowledge
Operational automation should be idempotent where possible, explicit about destructive actions, bounded, observable, testable, and safe on partial failure.

## Procedure
1. Document current manual workflow.
2. Identify invariants and destructive steps.
3. Prefer stable APIs over screen/CLI parsing.
4. Add dry-run for risky changes.
5. Make operations idempotent or resumable.
6. Add timeout, bounded retry, and concurrency controls.
7. Log structured results without secrets.
8. Return meaningful exit codes.
9. Test partial failures and reruns.
10. Document ownership and rollback.

## Decision points
Use a script for bounded tooling; promote to a service/job when scheduling, state, scaling, or multi-user reliability demands it.

## Common failure patterns
Infinite retries, no dry-run, unbounded parallelism, swallowing errors, hardcoded credentials, depending on unstable text output.

## Verification
Repeated execution is safe, failures are visible, dry-run matches real behavior, and destructive cases are tested.

## Expected output
Maintainable automation with clear inputs, outputs, safety, and observability.

## Stop conditions
Stop automation for ambiguous destructive targets or insufficient permission boundaries.