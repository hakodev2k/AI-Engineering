# DNS Automation and Infrastructure as Code

## Purpose
Automate DNS provisioning with reviewable intent, validation, idempotency, and drift control.

## When to use
Large zone estates, cloud DNS, frequent record changes, provider migration, or compliance automation.

## Inputs
Zones/records, provider APIs, source-of-truth model, credentials mechanism, CI/CD controls, current state.

## Context to inspect
Manual changes, generated records, provider-specific aliases, rate limits, DNSSEC ownership, split views, and deletion semantics.

## Core knowledge
DNS automation can delete globally critical records quickly. Separate desired state, provider translation, validation, deployment, and post-change verification.

## Procedure
1. Define authoritative source of truth.
2. Import/reconcile current state before enforcing it.
3. Model records with owner, TTL, environment, and lifecycle metadata.
4. Validate names, types, values, conflicts, and policy.
5. Generate a human-reviewable plan/diff.
6. Protect critical zones and destructive operations with approvals.
7. Apply bounded changes using provider APIs.
8. Retry only idempotent transient failures.
9. Query authoritative servers after apply.
10. Detect and report drift.
11. Test rollback and provider API failure.

## Decision points
Use declarative IaC for stable managed zones; event-driven APIs may suit ephemeral service discovery but still need ownership and reconciliation. Auto-delete only when lifecycle certainty is high.

## Common failure patterns
Importing incomplete state, accidental mass deletion, secrets in repositories, provider alias mismatch, no authoritative verification, and automation fighting manual emergency changes.

## Verification
CI validation passes, plan matches intent, authoritative answers match desired state, repeat apply is idempotent, and drift detection works.

## Expected output
Reusable DNS automation, schemas/policy checks, safe deployment workflow, and verification evidence.

## Stop conditions
Stop on unexpected destructive diff, provider API inconsistency, unresolved drift ownership, or missing rollback for critical zones.