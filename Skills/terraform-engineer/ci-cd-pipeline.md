# Terraform CI/CD Pipeline

## Purpose
Design safe automated Terraform delivery with reproducible plans, approvals, locking, and auditable applies.

## When to use
Creating or reviewing infrastructure pipelines and deployment controls.

## Inputs
Repository workflow, environments, identities, backends, approval policy, test suite.

## Context to inspect
Branch protections, plan artifacts, concurrency, credentials, environment promotion, policy gates, apply permissions.

## Core knowledge
Plan and apply must operate on the same reviewed change and environment. Separate read/plan privileges from apply authority where practical; serialize writes per state.

## Procedure
1. Run fmt, validate, lint, tests, and policy checks.
2. Authenticate with short-lived workload identity.
3. Initialize the intended backend and workspace.
4. Generate a saved plan and publish a readable summary.
5. Require approval for protected environments.
6. Prevent concurrent applies to the same state.
7. Apply the reviewed saved plan.
8. Capture logs, outputs, and post-apply convergence.
9. Define failure and rollback/runbook paths.

## Decision points
Auto-apply low-risk ephemeral stacks; retain human gates for production or high-blast-radius changes.

## Common failure patterns
Replanning after approval, static cloud keys, parallel state writers, apply from developer laptops, and untrusted PRs receiving privileged credentials.

## Verification
A test change demonstrates correct gates, identity scope, concurrency control, artifact integrity, and audit trail.

## Expected output
A deterministic least-privilege pipeline from change to verified apply.

## Stop conditions
Stop when plan/apply provenance cannot be guaranteed, credentials are overprivileged, or state writes cannot be serialized.