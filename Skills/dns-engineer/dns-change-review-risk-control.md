# DNS Change Review and Risk Control

## Purpose
Review DNS changes for correctness, blast radius, cache behavior, security, and rollback before production deployment.

## When to use
Critical-zone changes, delegation/DNSSEC updates, bulk edits, migrations, or peer review.

## Inputs
Proposed diff, business intent, zone context, TTLs, dependencies, owner, deployment and rollback plan.

## Context to inspect
Existing records, aliases, wildcard behavior, split views, DNSSEC, mail/security TXT, provider semantics, automation source, and recent changes.

## Core knowledge
Small textual DNS diffs can have global impact. Review semantic effects, not just syntax. Rollback depends on previously cached answers.

## Procedure
1. Restate intended user-visible outcome.
2. Validate owner and affected namespace.
3. Inspect exact current authoritative state.
4. Check record-type syntax and exclusivity constraints.
5. Trace CNAME/alias/delegation dependencies.
6. Evaluate TTL and cache transition timing.
7. Review DNSSEC, MX, SPF, DKIM, DMARC, and verification impact where relevant.
8. Check automation plan for destructive changes.
9. Define authoritative and recursive postchecks.
10. Confirm rollback is feasible from likely failure states.
11. Approve only bounded, observable change.

## Decision points
Require staged rollout for bulk/provider changes; direct changes may be acceptable for isolated low-risk records with strong automation and verification.

## Common failure patterns
Approving based on diff size, missing split-view copy, deleting records with unknown consumers, no pre-change TTL reduction, and rollback that recreates data but ignores caches.

## Verification
Peer-reviewed plan, clean validation, expected authoritative/recursive answers, application check, and stable telemetry after deployment.

## Expected output
Review decision, identified risks, required corrections, validation checklist, and rollback criteria.

## Stop conditions
Reject/stop on unknown ownership, unexplained deletions, critical-zone bulk changes without plan, or unverifiable DNSSEC/delegation effects.