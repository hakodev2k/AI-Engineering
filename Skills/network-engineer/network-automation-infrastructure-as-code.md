# Network Automation and Infrastructure as Code

## Purpose
Automate repeatable network changes and state validation while preserving reviewability, idempotency, safety, and rollback.

## When to use
Use for configuration generation, fleet changes, cloud networking, compliance enforcement, provisioning, backups, or drift detection.

## Inputs
Source-of-truth data, device/provider APIs, desired state, templates/modules, credentials mechanism, validation rules, and change scope.

## Context to inspect
Inspect existing automation, configuration ownership, API limits, device capabilities, out-of-band access, secrets handling, CI/CD controls, and manual drift.

## Core knowledge
Automation amplifies both correctness and mistakes. Separate intent/data from rendering, validate before deployment, constrain blast radius, and design idempotent operations where possible.

## Procedure
1. Define authoritative source of truth.
2. Model desired state and invariants.
3. Use version-controlled templates/modules or APIs.
4. Keep secrets outside code and logs.
5. Validate syntax, schema, policy, and semantic diffs.
6. Test against lab/sandbox or representative targets.
7. Roll out in small batches/canaries.
8. Verify post-change state and reachability.
9. Halt automatically on defined failure signals.
10. Record drift and reconcile ownership.

## Decision points
Use declarative tooling for stable desired state and imperative workflows for operational sequences. Prefer vendor APIs/models over screen/CLI scraping when mature, but account for feature gaps.

## Common failure patterns
Generating invalid config at scale, non-idempotent scripts, stale inventory, plaintext secrets, no semantic diff, simultaneous fleet-wide rollout, and automation fighting manual changes.

## Verification
Run lint/schema/policy checks, dry-run or diff, canary deployment, post-change assertions, and rollback test for critical workflows.

## Expected output
A repeatable automation workflow with source of truth, validations, controlled rollout, evidence, and recovery behavior.

## Stop conditions
Stop if source-of-truth authority is unclear, automation lacks safe targeting, or rollback/out-of-band recovery is unavailable for high-risk changes.