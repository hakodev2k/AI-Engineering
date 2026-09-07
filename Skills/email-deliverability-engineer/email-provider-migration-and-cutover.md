# Email Provider Migration and Cutover

## Purpose
Move email traffic between providers without losing authentication, suppression, event continuity, warm reputation, or operational rollback capability.

## When to use
Use for ESP/MTA migration, provider consolidation, regional routing changes, or major account restructuring.

## Inputs
Current/new provider capabilities, traffic classes and volumes, domains/IPs, DNS, suppression data, templates, event schemas, credentials, warm-up needs, and rollback constraints.

## Preconditions
The target path must be tested at low volume and able to enforce recipient eligibility before any production cutover.

## Context to inspect
Inspect DKIM/return-path/tracking domains, SPF, IP/HELO/PTR, webhooks, idempotency, provider suppression lists, rate limits, template differences, dedicated IP state, and analytics dependencies.

## Core knowledge
Migration changes more than an API endpoint. New domains/IPs may need warming; event semantics differ; provider-local suppression can be lost. Parallel sending can create duplicates if routing is not deterministic.

## Procedure
1. Inventory every sending stream and dependency.
2. Map old provider features/events to target equivalents.
3. Export and reconcile suppression/preferences into authoritative state.
4. Configure authentication and technical identities on the target.
5. Validate templates, headers, unsubscribe, and tracking behavior.
6. Test event ingestion and terminal-state normalization.
7. Warm new IP/domain identities with representative high-quality traffic when required.
8. Cut over one bounded traffic class/cohort at a time.
9. Compare provider-specific delivery and reputation against baseline.
10. Maintain deterministic rollback without double-sending.
11. Retain old event access long enough for delayed bounces/complaints.
12. Decommission only after reconciliation and stable observation.

## Decision points
Prefer gradual percentage/class cutover over big-bang migration. Reuse established domains where appropriate, but do not move reputation-sensitive traffic to cold IPs at full volume.

## Common failure patterns
Forgetting provider-local suppressions, duplicate sends, stale SPF/DKIM, event-schema gaps, premature shutdown of old webhooks, and migration during peak campaigns.

## Verification
Reconcile send/event counts, test suppression and unsubscribe, verify authentication, compare latency/bounce/complaint/placement, and execute a rollback rehearsal.

## Expected output
A staged migration runbook with mappings, gates, rollback, and post-cutover evidence.

## Stop conditions
Stop cutover if suppression, event completeness, authentication, or target reputation cannot be verified.