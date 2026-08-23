# CI Developer Workflows

## Purpose
Design CI workflows that provide fast, understandable, reliable gates for everyday development.

## When to use
Use when pipelines are confusing, duplicated, slow, flaky, or provide poor failure diagnostics.

## Inputs
CI definitions, branch policy, test strategy, deployment model, security checks, and workflow telemetry.

## Context to inspect
Inspect triggers, required checks, dependencies, permissions, artifacts, retries, cancellation, logs, and ownership.

## Core knowledge
CI should fail for actionable reasons, minimize wasted work, use least privilege, and separate mandatory correctness gates from informational checks.

## Procedure
1. Map change-to-merge workflow.
2. Classify checks by purpose and risk.
3. Remove duplicate execution.
4. Order fast high-signal checks early.
5. Cancel superseded work safely.
6. Improve failure messages and artifact retention.
7. Apply least-privilege credentials.
8. Define retry rules only for transient infrastructure failures.
9. Track duration, failure causes, and flakiness.

## Decision points
Require checks that protect material risks; keep advisory checks non-blocking until signal quality is proven.

## Common failure patterns
Blind retries, broad secrets, required flaky tests, opaque reusable workflows, and expensive jobs on irrelevant changes.

## Verification
Test success, deterministic failure, cancellation, retry, permission boundaries, and representative pull-request workflows.

## Expected output
A streamlined CI workflow with explicit gates, diagnostics, security boundaries, and measurable reliability.

## Stop conditions
Escalate when policy ownership is unclear or changes could weaken compliance/security gates.